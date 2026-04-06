import express from "express";
import { getInquiries, submitInquiry } from "../controllers/inquiry.controller";
import { authorizeRoles, protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/submit", submitInquiry);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  getInquiries
);

export default router;