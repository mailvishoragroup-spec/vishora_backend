import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error.middleware";
import adminRoutes from "./routes/admin.routes";
import propertyRoutes from "./routes/property.routes";
import inquiryRoutes from "./routes/inquiry.routes";

const app = express();

// 🔥 CORS CONFIG (IMPORTANT for cookies)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // 🔥 allow cookies
  })
);

// 🔥 Middlewares
app.use(express.json());
app.use(cookieParser());

// 🔍 Logger (debugging)
app.use((req, res, next) => {
  console.log(`HIT: ${req.method} ${req.url}`);
  next();
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).send("API Running 🚀");
});

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/inquiry", inquiryRoutes);

// ❌ 404 handler (optional but recommended)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Error handler (ALWAYS LAST)
app.use(errorHandler);

export default app;