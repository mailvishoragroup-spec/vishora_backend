import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model";

// ✅ PROTECT
interface AuthRequest extends Request {
  admin?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;

    // 🔍 Debug (remove in production)
    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    // console.log("DECODED:", decoded);

    const admin = await Admin.findById(decoded.id).select("-password");

    console.log("ADMIN FROM DB:", admin);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin;

    next();

  } catch (error) {
    console.log("PROTECT ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ AUTHORIZE ROLES
export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        message: `Access denied. Role ${req.admin.role} not allowed`,
      });
    }

    next();
  };
};