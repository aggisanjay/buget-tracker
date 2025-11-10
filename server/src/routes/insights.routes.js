import { Router } from "express";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";
import Budget from "../models/Budget.js";

const router = Router();
router.use(requireAuth);

// Summary for dashboard
router.get("/summary", async (req, res, next) => {
  try {
    const { month } = req.query; // "YYYY-MM" optional
    const match = { user: req.user._id };
    if (month) {
      const [y, m] = month.split("-").map(Number);
      const from = new Date(y, m - 1, 1);
      const to = new Date(y, m, 0, 23, 59, 59, 999);
      match.date = { $gte: from, $lte: to };
    }

    const agg = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            type: { $cond: [{ $gt: ["$amount", 0] }, "income", "expense"] },
            category: "$category"
          },
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalIncome = agg.filter(a => a._id.type === "income").reduce((s, a) => s + a.total, 0);
    const totalExpense = agg.filter(a => a._id.type === "expense").reduce((s, a) => s + a.total, 0);
    const byCategory = agg
      .filter(a => a._id.type === "expense")
      .map(a => ({ category: a._id.category, spent: Math.abs(a.total) }))
      .sort((a, b) => b.spent - a.spent);

    // budgets comparison (if month provided)
    let budgets = [];
    if (month) {
      const docs = await Budget.find({ user: req.user._id, month });
      budgets = docs.map(b => {
        const spent = byCategory.find(x => x.category === b.category)?.spent || 0;
        return {
          category: b.category,
          budget: b.amount,
          spent,
          remaining: Math.max(0, b.amount - spent),
          status: spent > b.amount ? "over" : "ok"
        };
      });
    }

    res.json({
      totalIncome,
      totalExpense: Math.abs(totalExpense),
      net: totalIncome - Math.abs(totalExpense),
      topCategories: byCategory.slice(0, 5),
      budgets
    });
  } catch (e) { next(e); }
});

// Trend vs last month
router.get("/trend", async (req, res, next) => {
  try {
    const now = new Date();
    const monthsBack = Number(req.query.months || 6);
    const from = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);

    const data = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: from } } },
      {
        $group: {
          _id: { y: { $year: "$date" }, m: { $month: "$date" } },
          income: {
            $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] }
          },
          expense: {
            $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] }
          }
        }
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } }
    ]);

    const series = data.map(d => ({
      month: `${d._id.y}-${String(d._id.m).padStart(2, "0")}`,
      income: d.income,
      expense: Math.abs(d.expense),
      net: d.income + d.expense
    }));

    res.json(series);
  } catch (e) { next(e); }
});

export default router;
