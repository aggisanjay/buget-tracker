import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  date: { type: Date, required: true, index: true },
  amount: { type: Number, required: true }, // negative for expense, positive for income
  category: { type: String, required: true, trim: true },
  merchant: { type: String, trim: true },
  note: { type: String, trim: true },
  source: { type: String, enum: ["manual", "aggregator", "csv"], default: "manual" },
  externalId: { type: String } // id from aggregator (optional)
}, { timestamps: true });

txSchema.index({ user: 1, date: -1 });

export default mongoose.model("Transaction", txSchema);
