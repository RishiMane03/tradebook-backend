import express from "express";
import checkAuth from "../firebase/firebaseAdmin.js";
import { createTrade, deleteTrade, getTrades, updateTrade } from "../controllers/tradeController.js";

const router = express.Router();

/**
 * Create a trade for a strategy
 * POST /api/trades/:strategyId
 */
router.post("/:strategyId", checkAuth, createTrade);

/**
 * Get all trades for a strategy
 * GET /api/trades/:strategyId
 */
router.get("/:strategyId", checkAuth, getTrades);

/**
 * Update a trade
 * PUT /api/trades/:tradeId
 */
router.put("/update/:tradeId", checkAuth, updateTrade);

/**
 * Delete a trade
 * DELETE /api/trades/:tradeId
 */
router.delete("/delete/:tradeId", checkAuth, deleteTrade);

export default router;
