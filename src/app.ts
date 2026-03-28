import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error.middleware";
import adminRoutes from "./routes/admin.routes";
import propertyRoutes from "./routes/property.routes"
import inquiryRoutes from "./routes/inquiry.routes";
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ✅ Public route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use("/api/property", propertyRoutes)
app.use("/api/inquiry", inquiryRoutes);
// ✅ Error handler (ALWAYS LAST)
app.use(errorHandler);

export default app;