import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  month: { type: String, required: true }, // "2025-11"
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true } // planned amount
}, { timestamps: true });

budgetSchema.index({ user: 1, month: 1, category: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);
