import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import txRoutes from "./routes/transactions.routes.js";
import budgetRoutes from "./routes/budgets.routes.js";
import insightsRoutes from "./routes/insights.routes.js";
import { errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

// ✅ Render requires PORT must come from env
const PORT = process.env.PORT || 4000;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.set("trust proxy", 1);
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/", (req, res) => res.send("✅ Budget Tracker API is running"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/insights", insightsRoutes);

app.use(errorHandler);

// ✅ Proper Render startup (NOT Vercel-style)
connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on PORT: ${PORT}`)
    );
  })
  .catch(err => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });
