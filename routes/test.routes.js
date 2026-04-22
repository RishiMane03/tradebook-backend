import express from "express";
import {
  testController,
  testPostController,
} from "../controllers/testController.js";
import checkAuth from "../firebase/firebaseAdmin.js";

const router = express.Router();

router.get("/test", checkAuth, testController);
router.post("/test-post", checkAuth, testPostController);

export default router;
