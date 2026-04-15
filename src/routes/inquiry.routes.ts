import express from "express";
import { deleteInquiry, getInquiries, submitInquiry, updateInquiryStatus } from "../controllers/inquiry.controller";
import { authorizeRoles, protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/submit", submitInquiry);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "super_admin"),
  getInquiries
);




router.delete("/:id", protect, deleteInquiry);

router.patch("/:id/status", protect, updateInquiryStatus);

export default router;