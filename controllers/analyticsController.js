import Strategy from "../database/modals/Strategy.js";
import Trade from "../database/modals/Trade.js";

export const getTradeAnalytics = async (req, res) => {
  try {
    const { strategyId } = req.params;

    // 1️⃣ Verify strategy belongs to user
    const strategy = await Strategy.findOne({
      _id: strategyId,
      user: req.user._id,
    });

    if (!strategy) {
      return res.status(404).json({ error: "Strategy not found" });
    }

    // 2️⃣ Fetch trades sorted by date
    const trades = await Trade.find({
      strategy: strategyId,
      user: req.user._id,
    }).sort({ date: 1 });

    if (trades.length === 0) {
      return res.json({
        strategy: {
          _id: strategy._id,
          name: strategy.name,
        },
        analytics: null,
      });
    }

    // ----------------------------
    // 🔢 BASIC CALCULATIONS
    // ----------------------------

    const totalTrades = trades.length;

    const winningTrades = trades.filter((t) => t.pnl > 0);
    const losingTrades = trades.filter((t) => t.pnl < 0);

    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = losingTrades.reduce((sum, t) => sum + t.pnl, 0);

    const totalPnL = grossProfit + grossLoss;

    const winRate = (winningTrades.length / totalTrades) * 100;

    const avgWin =
      winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;

    const avgLoss =
      losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;

    const profitFactor =
      Math.abs(grossLoss) > 0 ? grossProfit / Math.abs(grossLoss) : 0;

    const expectancy = totalTrades > 0 ? totalPnL / totalTrades : 0;

    const largestWin =
      winningTrades.length > 0
        ? Math.max(...winningTrades.map((t) => t.pnl))
        : 0;

    const largestLoss =
      losingTrades.length > 0 ? Math.min(...losingTrades.map((t) => t.pnl)) : 0;

    // ----------------------------
    // 📈 EQUITY CURVE + DRAWDOWN
    // ----------------------------

    let equity = 0;
    let peak = 0;
    let maxDrawdown = 0;

    const equityCurve = trades.map((trade) => {
      equity += trade.pnl;

      if (equity > peak) peak = equity;

      const drawdown = peak - equity;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;

      return {
        date: trade.date,
        equity,
      };
    });

    // ----------------------------
    // 📦 RESPONSE
    // ----------------------------

    res.json({
      strategy: {
        _id: strategy._id,
        name: strategy.name,
      },
      analytics: {
        totalTrades,
        winRate: Number(winRate.toFixed(2)),
        totalPnL,
        grossProfit,
        grossLoss,
        avgWin: Number(avgWin.toFixed(2)),
        avgLoss: Number(avgLoss.toFixed(2)),
        profitFactor: Number(profitFactor.toFixed(2)),
        expectancy: Number(expectancy.toFixed(2)),
        largestWin,
        largestLoss,
        maxDrawdown,
        equityCurve,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate analytics" });
  }
};
