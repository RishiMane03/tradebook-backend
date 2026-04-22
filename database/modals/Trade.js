import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    strategy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Strategy",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    instrument: {
      type: String, // Nifty / BankNifty etc
    },

    direction: {
      type: String,
      enum: ["LONG", "SHORT"],
    },

    quantity: Number,

    pnl: {
      type: Number,
      required: true,
    },

    // Stored in Mongo as `notes`, but accept `note` in payloads as well.
    notes: {
      type: String,
      alias: "note",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Trade", tradeSchema);
