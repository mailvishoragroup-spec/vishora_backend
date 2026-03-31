import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import Admin from "../models/Admin.model";
import { Request, Response, NextFunction } from "express";
import { generateToken } from "../utils/generateToken";



// 🔥 GET CURRENT ADMIN
export const getAdminProfile = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      admin: req.admin,
    });
  }
);

//REGISTER ROUTE

export const registerAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      throw new ApiError(400, "Admin already exists");
    }

    const admin = await Admin.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      admin,
    });
  },
);

//LOGIN ROUTE

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = generateToken(admin._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 🔥 key fix
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// UPDATE ROUTE

export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, isActive } = req.body;

  const loggedInAdmin = req.admin;

  console.log("LoggedInAdmin ID:", loggedInAdmin?._id.toString());
  console.log("Params ID:", id);
  console.log("Role:", loggedInAdmin?.role);

  const adminToUpdate = await Admin.findById(id);
  if (!adminToUpdate) {
    throw new ApiError(404, "Admin not found");
  }

  const isSelfUpdate = loggedInAdmin?._id.toString() === id;
  const isSuperAdmin = loggedInAdmin?.role === "super_admin";

  if (!isSelfUpdate && !isSuperAdmin) {
    throw new ApiError(403, "You are not allowed to update this admin");
  }

  // 🚫 Only super_admin can change role
  if (role && !isSuperAdmin) {
    throw new ApiError(403, "Only super_admin can change role");
  }

  // 📝 Update fields
  if (name) adminToUpdate.name = name;
  if (email) adminToUpdate.email = email;
  if (role && isSuperAdmin) adminToUpdate.role = role;
  if (typeof isActive !== "undefined" && isSuperAdmin) {
    adminToUpdate.isActive = isActive;
  }

  await adminToUpdate.save();

  res.status(200).json({
    success: true,
    message: "Admin updated successfully",
    admin: {
      id: adminToUpdate._id,
      name: adminToUpdate.name,
      email: adminToUpdate.email,
      role: adminToUpdate.role,
      isActive: adminToUpdate.isActive,
    },
  });
});

// DELETE ROUTE

export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const loggedInAdmin = req.admin;
  console.log("LoggedInAdmin ID:", loggedInAdmin?._id.toString());
  console.log("Params ID:", id);
  console.log("Role:", loggedInAdmin?.role);
  if (loggedInAdmin?.role !== "super_admin") {
    throw new ApiError(403, "Only super_admin can delete admins");
  }

  if (loggedInAdmin._id.toString() === id) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const admin = await Admin.findById(id);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  admin.isActive = false;
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Admin deactivated successfully",
  });
});

export const logoutAdmin = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // ⚠️ true in production (HTTPS)
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
