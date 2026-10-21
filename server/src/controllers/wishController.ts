import { Request, Response, NextFunction } from "express";
import { Wish } from "../models/Wish.js";

// GET /api/wishes
export async function getWishes(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const wishes = await Wish.find().sort({ createdAt: -1 });
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
    const { name, attendance, guests, message } = req.body;

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
        : attendance === "not-attending"
        ? 0
        : 1;

    const newWish = await Wish.create({
      name,
      attendance: attendance || "attending",
      guests: guestCount,
      message,
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

