import { Request, Response, NextFunction } from "express";
import { Wish } from "../models/Wish.js";

// GET /api/wishes
export async function getWishes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.query;
    const filter: Record<string, unknown> = {};

    if (slug) {
      const s = decodeURIComponent(String(slug)).trim();
      const alt = s.includes("&") ? s.replace(/&/g, "-") : s.replace(/-/g, "&");
      filter.$or = [{ slug: s }, { slug: alt }, { slug: { $exists: false } }, { slug: "" }];
    }

    const wishes = await Wish.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: wishes.length,
      data: wishes,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/wishes
export async function createWish(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug, name, attendance, guests, message, amount, bank, proofUrl } = req.body;

    if (!name || !message) {
      res.status(400).json({
        success: false,
        message: "Nama dan pesan ucapan wajib diisi.",
      });
      return;
    }

    const guestCount =
      typeof guests !== "undefined"
        ? Math.max(0, Number(guests))
        : attendance === "not-attending" || attendance === "Tidak Hadir"
        ? 0
        : 1;

    let mappedAttendance: "attending" | "not-attending" = "attending";
    if (
      attendance === "not-attending" ||
      attendance === "Tidak Hadir" ||
      attendance === "tidak_hadir" ||
      attendance === "absent"
    ) {
      mappedAttendance = "not-attending";
    }

    const s = slug ? decodeURIComponent(String(slug)).trim() : "dimas&sarah";
    const newWish = await Wish.create({
      slug: s,
      name: name.trim(),
      attendance: mappedAttendance,
      guests: guestCount,
      message: message.trim(),
      amount: amount ? Number(amount) : 0,
      bank: bank || "",
      proofUrl: proofUrl || "",
    });

    res.status(201).json({
      success: true,
      message: "Doa dan ucapan berhasil dikirim!",
      data: newWish,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/wishes/:id/like
export async function toggleLikeWish(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const wish = await Wish.findById(id);

    if (!wish) {
      res.status(404).json({
        success: false,
        message: "Ucapan tidak ditemukan.",
      });
      return;
    }

    wish.isLiked = !wish.isLiked;
    wish.likesCount = wish.isLiked ? (wish.likesCount || 0) + 1 : Math.max(0, (wish.likesCount || 1) - 1);
    await wish.save();

    res.json({
      success: true,
      message: wish.isLiked ? "Ucapan disukai" : "Batal menyukai ucapan",
      data: wish,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/wishes/:id
export async function deleteWish(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await Wish.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Ucapan tidak ditemukan.",
      });
      return;
    }

    res.json({
      success: true,
      message: "Ucapan berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}
