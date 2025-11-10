import { Router } from "express";
import Budget from "../models/Budget.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// Upsert a budget for month+category
router.post("/", async (req, res, next) => {
  try {
    const { month, category, amount } = req.body; // month = "YYYY-MM"
    const doc = await Budget.findOneAndUpdate(
      { user: req.user._id, month, category },
      { amount },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    const items = await Budget.find({ user: req.user._id }).sort({ month: -1, category: 1 });
    res.json(items);
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Budget.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
