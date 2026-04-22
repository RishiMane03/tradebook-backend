export const testController = (req, res) => {
  res.json({ success: true, message: "Test route is working!" });
};

export const testPostController = (req, res) => {
  const data = req.body;
  const userId = req.user ? req.user.uid : null; // from checkAuth middleware

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ success: false, message: "No data provided" });
  }

  res.json({ success: true, message: "Received POST data!", data, userId });
};
