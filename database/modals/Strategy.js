import mongoose from "mongoose";

const strategySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,

    lastOpenedAt: {
      type: Date,
    },
  },

  { timestamps: true },
);

export default mongoose.model("Strategy", strategySchema);
