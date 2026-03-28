import {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  getPropertyById,
} from "../controllers/property.controller";

import { protect, authorizeRoles } from "../middleware/auth.middleware";
import exppress from "express";

const router = exppress.Router();
// ➕ Create
router.post(
  "/create",
  protect,
  authorizeRoles("admin", "super_admin"),
  createProperty,
);

// 📥 Get all
router.get("/", getProperties);


// get single property

router.get("/:id", getPropertyById)

// 🔄 Update
router.put(
  "/update/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  updateProperty,
);

// 🗑 Delete
router.delete(
  "/delete/:id",
  protect,
  authorizeRoles("admin", "super_admin"),
  deleteProperty,
);

export default router