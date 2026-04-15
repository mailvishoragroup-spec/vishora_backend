import express from "express";

// Controllers
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminProfile,
  getDashboardStats,
} from "../controllers/admin.controller";
import { authorizeRoles, protect } from "../middleware/auth.middleware";

// Middleware

const router = express.Router();

// GET CURRENT ADMIN
router.get("/me", protect, getAdminProfile);

// 🔓 PUBLIC ROUTES
router.post("/login", loginAdmin);

// 🔐 PROTECTED ROUTES

// Logout
router.post("/logout", protect, logoutAdmin);

// Get Profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
});

// Register (only super_admin)
router.post("/register", registerAdmin);

// Update (self or super_admin)
router.put("/update/:id", protect, updateAdmin);

// Delete (only super_admin)
router.delete("/delete/:id", deleteAdmin, protect);

router.get("/stats", protect, getDashboardStats);

export default router;
