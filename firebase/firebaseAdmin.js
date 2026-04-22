import dotenv from "dotenv";
dotenv.config();
import admin from "firebase-admin";
// import serviceAccount from "../config/serviceAccountKey.json" with { type: "json" };
import User from "../database/modals/User.js";

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// only initialise once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * express middleware that rejects requests without a valid
 * Firebase ID token.
 */
const checkAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = header.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Create or Get User From DB
    const user = await User.findOneAndUpdate(
      { firebaseUid: decodedToken.uid },
      {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || "",
      },
      { upsert: true, returnDocument: "after" },
    );

    req.user = user;
    next();
  } catch (err) {
    console.error("token verification failed", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default checkAuth;
