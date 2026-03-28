
import { Request, Response, NextFunction} from "express";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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