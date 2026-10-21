import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Akses ditolak. Silakan login terlebih dahulu.",
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "janjisuci_super_secret_jwt_key_2026_wedding";
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Pengguna dengan token ini tidak lagi terdaftar.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Token tidak valid atau telah kadaluarsa. Silakan login ulang.",
    });
  }
}

