import express from "express";
import {
  createStrategy,
  deleteStrategy,
  getLastOpenedStrategy,
  getStrategies,
  updateLastOpened,
  updateStrategy,
} from "../controllers/strategyController.js";
import checkAuth from "../firebase/firebaseAdmin.js";

const router = express.Router();

router.post("/create-strategy", checkAuth, createStrategy);
router.get("/get-strategies", checkAuth, getStrategies);
router.put("/:id", checkAuth, updateStrategy);
router.delete("/:id", checkAuth, deleteStrategy);
router.put("/:id/open", checkAuth, updateLastOpened); // Update last opened time
router.get("/last-opened", checkAuth, getLastOpenedStrategy); // Get last opened strategy

export default router;
