import Strategy from "../database/modals/Strategy.js";
import Trade from "../database/modals/Trade.js";

export const createTrade = async (req, res) => {
  try {
    const { strategyId } = req.params;

    // Check strategy belongs to user
    const strategy = await Strategy.findOne({
      _id: strategyId,
      user: req.user._id,
    });

    if (!strategy) {
      return res.status(404).json({ error: "Strategy not found" });
    }

    const trade = await Trade.create({
      strategy: strategyId,
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ error: "Failed to create trade" });
  }
};

export const getTrades = async (req, res) => {
  try {
    const { strategyId } = req.params;

    // 1️⃣ First verify strategy belongs to user
    const strategy = await Strategy.findOne({
      _id: strategyId,
      user: req.user._id,
    });

    if (!strategy) {
      return res.status(404).json({ error: "Strategy not found" });
    }

    // 2️⃣ Get trades for that strategy
    const trades = await Trade.find({
      strategy: strategyId,
      user: req.user._id,
    }).sort({ date: 1 });

    // 3️⃣ Send structured response
    res.json({
      strategy: {
        _id: strategy._id,
        name: strategy.name,
        description: strategy.description,
        createdAt: strategy.createdAt,
      },
      trades,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trades" });
  }
};

export const updateTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;

    // Find trade owned by user
    const trade = await Trade.findOne({
      _id: tradeId,
      user: req.user._id,
    });

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    const updates = {};
    const allowedFields = [
      "date",
      "direction",
      "instrument",
      "quantity",
      "pnl",
      "notes",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Payloads may send `note`, but the DB field is `notes`.
    if (req.body.note !== undefined && req.body.notes === undefined) {
      updates.notes = req.body.note;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    // Update trade
    const updatedTrade = await Trade.findOneAndUpdate(
      { _id: tradeId, user: req.user._id },
      {
        $set: updates,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedTrade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    res.json(updatedTrade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update trade" });
  }
};

export const deleteTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;

    const trade = await Trade.findOneAndDelete({
      _id: tradeId,
      user: req.user._id,
    });

    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }

    res.json({ message: "Trade deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete trade" });
  }
};
