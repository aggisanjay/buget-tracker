import { Router } from "express";
import multer from "multer";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";
import { parseCSV } from "../utils/csv.js";

const upload = multer();
const router = Router();

router.use(requireAuth);

// Create
router.post("/", async (req, res, next) => {
  try {
    const doc = await Transaction.create({ ...req.body, user: req.user._id, source: "manual" });
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

// List with filters & pagination
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "", category, from, to, type } = req.query;
    const filter = { user: req.user._id };
    if (q) filter.$or = [
      { merchant: new RegExp(q, "i") },
      { note: new RegExp(q, "i") },
      { category: new RegExp(q, "i") }
    ];
    if (category) filter.category = category;
    if (from || to) filter.date = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(to) } : {})
    };
    if (type === "expense") filter.amount = { $lt: 0 };
    if (type === "income") filter.amount = { $gt: 0 };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
});

// Update
router.put("/:id", async (req, res, next) => {
  try {
    const doc = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    res.json(doc);
  } catch (e) { next(e); }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// Bulk CSV import
router.post("/import/csv", upload.single("file"), async (req, res, next) => {
  try {
    const rows = parseCSV(req.file.buffer);
    const docs = rows.map(r => ({ ...r, user: req.user._id, source: "csv" }));
    await Transaction.insertMany(docs, { ordered: false });
    res.json({ inserted: docs.length });
  } catch (e) { next(e); }
});

export default router;
