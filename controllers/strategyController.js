import Strategy from "../database/modals/Strategy.js";

// Create strategy
export const createStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.create({
      user: req.user._id,
      name: req.body.name,
      description: req.body.description || "",
    });

    res.status(201).json(strategy);
  } catch (error) {
    res.status(500).json({ error: "Failed to create strategy" });
  }
};

// Get all strategies of logged user
export const getStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.find({
      user: req.user._id,
    });

    res.json(strategies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch strategies" });
  }
};

// Update strategy
export const updateStrategy = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedStrategy = await Strategy.findOneAndUpdate(
      { _id: id, user: req.user._id }, // ensure ownership
      {
        name: req.body.name,
        description: req.body.description,
      },
      { returnDocument: "after" }, // ✅ new mongoose syntax
    );

    if (!updatedStrategy) {
      return res.status(404).json({ error: "Strategy not found" });
    }

    res.json(updatedStrategy);
  } catch (error) {
    res.status(500).json({ error: "Failed to update strategy" });
  }
};

// Delete strategy
export const deleteStrategy = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStrategy = await Strategy.findOneAndDelete({
      _id: id,
      user: req.user._id, // ensure ownership
    });

    if (!deletedStrategy) {
      return res.status(404).json({ error: "Strategy not found" });
    }

    res.json({ message: "Strategy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete strategy" });
  }
};

// Update last opened time
export const updateLastOpened = async (req, res) => {
  try {
    const strategy = await Strategy.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { lastOpenedAt: new Date() },
      { new: true },
    );

    if (!strategy) {
      return res.status(404).json({ message: "Strategy not found" });
    }

    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get last opened strategy
export const getLastOpenedStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({ user: req.user.id })
      .sort({ lastOpenedAt: -1 })
      .limit(1);

    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
