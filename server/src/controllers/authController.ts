import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Wedding } from "../models/Wedding.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || "janjisuci_super_secret_jwt_key_2026_wedding";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
}

// POST /api/auth/register
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, phone, weddingSlug } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi.",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter.",
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email ini sudah terdaftar. Silakan login atau gunakan email lain.",
      });
      return;
    }

    // Determine slug: format as namapria&namawanita
    const rawSlug: string = (weddingSlug || name).toLowerCase().trim();
    let cleanSlug = "dimas&sarah";
    if (rawSlug.includes("&")) {
      const parts = rawSlug.split("&").map((p: string) => p.trim().replace(/[^a-z0-9]/g, "")).filter(Boolean);
      cleanSlug = parts.length >= 2 ? `${parts[0]}&${parts[1]}` : (parts[0] || "dimas&sarah");
    } else if (rawSlug.includes("-")) {
      const parts = rawSlug.split("-").map((p: string) => p.trim().replace(/[^a-z0-9]/g, "")).filter(Boolean);
      cleanSlug = parts.length >= 2 ? `${parts[0]}&${parts[1]}` : (parts[0] || "dimas&sarah");
    } else {
      const words = rawSlug.split(/\s+/).map((p: string) => p.replace(/[^a-z0-9]/g, "")).filter(Boolean);
      cleanSlug = words.length >= 2 ? `${words[0]}&${words[1]}` : (words[0] || "dimas&sarah");
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || "",
      weddingSlug: cleanSlug,
      role: "client",
    });

    // Create initial Wedding data if not already existing
    const existingWedding = await Wedding.findOne({ slug: cleanSlug });
    if (!existingWedding) {
      await Wedding.create({
        slug: cleanSlug,
        title: `Pernikahan ${name}`,
        groom: { fullName: name.split("&")[0]?.trim() || "Mempelai Pria", nickName: "" },
        bride: { fullName: name.split("&")[1]?.trim() || "Mempelai Wanita", nickName: "" },
      });
    }

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil! Selamat datang di JanjiSuci.",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email atau password yang Anda masukkan salah.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Email atau password yang Anda masukkan salah.",
      });
      return;
    }

    const token = generateToken(user._id.toString());

    // Fetch user without password
    const safeUser = await User.findById(user._id);

    res.json({
      success: true,
      message: `Selamat datang kembali, ${user.name}!`,
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/admin-login (Admin & Workers only)
export async function adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Kredensial salah atau akun pekerja tidak ditemukan.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Email atau password yang Anda masukkan salah.",
      });
      return;
    }

    // Strict role check: Worker / Administrator only
    if (user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Akses ditolak! Akun ini terdaftar sebagai Klien, bukan Akun Staf/Administrator.",
      });
      return;
    }

    const token = generateToken(user._id.toString());
    const safeUser = await User.findById(user._id);

    res.json({
      success: true,
      message: `Selamat datang di Panel Administrasi, ${user.name}!`,
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}
