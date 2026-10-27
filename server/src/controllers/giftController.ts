import { Request, Response, NextFunction } from "express";
import { Gift } from "../models/Gift.js";

// GET /api/gifts
export async function getGifts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug, status, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (slug) {
      filter.$or = [{ slug }, { slug: { $exists: false } }, { slug: "" }];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search && typeof search === "string" && search.trim()) {
      const q = search.trim();
      filter.$and = [
        ...(filter.$or ? [{ $or: filter.$or }] : []),
        {
          $or: [
            { senderName: { $regex: q, $options: "i" } },
            { bankTarget: { $regex: q, $options: "i" } },
            { bankSender: { $regex: q, $options: "i" } },
            { message: { $regex: q, $options: "i" } },
          ],
        },
      ];
      delete filter.$or;
    }

    const gifts = await Gift.find(filter).sort({ createdAt: -1 });

    // Aggregate summary
    const allGifts = await Gift.find(slug ? { $or: [{ slug }, { slug: { $exists: false } }, { slug: "" }] } : {});
    const totalAmount = allGifts.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const confirmedAmount = allGifts
      .filter((g) => g.status === "confirmed")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const pendingCount = allGifts.filter((g) => g.status === "pending").length;

    res.json({
      success: true,
      count: gifts.length,
      summary: {
        totalAmount,
        confirmedAmount,
        pendingCount,
        totalCount: allGifts.length,
      },
      data: gifts,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/gifts
export async function createGift(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      slug,
      senderName,
      bankTarget,
      bankSender,
      accountNumber,
      amount,
      message,
      proofUrl,
      status,
    } = req.body;

    if (!senderName || !amount) {
      res.status(400).json({
        success: false,
        message: "Nama pengirim dan nominal amplop wajib diisi.",
      });
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 1000) {
      res.status(400).json({
        success: false,
        message: "Nominal amplop tidak valid (minimal Rp 1.000).",
      });
      return;
    }

    const newGift = await Gift.create({
      slug: slug || "dimas-sarah",
      senderName: senderName.trim(),
      bankTarget: bankTarget || "BCA",
      bankSender: bankSender ? bankSender.trim() : "",
      accountNumber: accountNumber ? accountNumber.trim() : "",
      amount: numAmount,
      message: message ? message.trim() : "",
      proofUrl: proofUrl ? proofUrl.trim() : "",
      status: status === "pending" ? "pending" : "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "Amplop digital berhasil dicatat!",
      data: newGift,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/gifts/:id/status
export async function updateGiftStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["confirmed", "pending"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Status harus bernilai 'confirmed' atau 'pending'.",
      });
      return;
    }

    const gift = await Gift.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!gift) {
      res.status(404).json({
        success: false,
        message: "Data amplop tidak ditemukan.",
      });
      return;
    }

    res.json({
      success: true,
      message: `Status amplop diperbarui menjadi ${status === "confirmed" ? "Terkonfirmasi" : "Menunggu Verifikasi"}.`,
      data: gift,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/gifts/:id
export async function deleteGift(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await Gift.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Data amplop tidak ditemukan.",
      });
      return;
    }

    res.json({
      success: true,
      message: "Data amplop berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
}

