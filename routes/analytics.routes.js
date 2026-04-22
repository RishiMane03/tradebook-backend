import express from "express";
import { getTradeAnalytics } from "../controllers/analyticsController.js"
import checkAuth from "../firebase/firebaseAdmin.js";

const router = express.Router();

router.get("/:strategyId", checkAuth, getTradeAnalytics);

export default router;
