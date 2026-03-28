import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.model";

// ✅ PROTECT
export const protect = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token;

    console.log("TOKEN:", token); // debug

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("DECODED:", decoded); // debug

    const admin = await Admin.findById(decoded.id).select("-password");

    console.log("ADMIN FROM DB:", admin); // debug

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin; // 🔥 IMPORTANT

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