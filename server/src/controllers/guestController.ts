import { Request, Response, NextFunction } from "express";
import { Guest } from "../models/Guest.js";

// GET /api/guests
export async function getGuests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search, status } = req.query;

    const query: Record<string, unknown> = {};

    if (category && category !== "all") {
      query.category = new RegExp(`^${category}$`, "i");
    }

    if (status) {
      query.status = status;
    }

    if (search && typeof search === "string") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { table: regex }, { phone: regex }, { qrCode: regex }];
    }

    const guests = await Guest.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: guests.length,
      data: guests,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/guests
export async function createGuest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, phone, category, status, pax, table } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Nama tamu wajib diisi.",
      });
      return;
    }

    const guest = await Guest.create({
      name,
      phone: phone || "",
      category: category || "Reguler",
      status: status || "Belum Respon",
      pax: Number(pax) || 1,
      table: table || "Meja Reguler",
    });

    res.status(201).json({
      success: true,
      message: "Tamu berhasil ditambahkan.",
      data: guest,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/guests/bulk
export async function bulkCreateGuests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { guests } = req.body;

    if (!Array.isArray(guests) || guests.length === 0) {
      res.status(400).json({
        success: false,
        message: "Array tamu tidak boleh kosong.",
      });
      return;
    }

    const created = await Guest.insertMany(guests);

    res.status(201).json({
      success: true,
      message: `${created.length} tamu berhasil diimpor.`,
      count: created.length,
      data: created,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/guests/:id
export async function updateGuest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updated = await Guest.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({
        success: false,
        message: "Tamu tidak ditemukan.",
      });
      return;
    }

    res.json({
      success: true,
      message: "Data tamu berhasil diperbarui.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/guests/:id
export async function deleteGuest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await Guest.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Tamu tidak ditemukan.",
      });
      return;
    }

    res.json({
      success: true,
      message: "Tamu berhasil dihapus dari daftar.",
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/guests/check-in
export async function checkInGuest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { qrCode, id } = req.body;

    if (!qrCode && !id) {
      res.status(400).json({
        success: false,
        message: "QR Code atau ID tamu wajib disertakan untuk check-in.",
      });
      return;
    }

    const filter = qrCode ? { qrCode } : { _id: id };
    const guest = await Guest.findOne(filter);

    if (!guest) {
      res.status(404).json({
        success: false,
        message: "Tamu dengan QR Code tersebut tidak terdaftar.",
      });
      return;
    }

    if (guest.checkedIn) {
      res.status(200).json({
        success: true,
        alreadyCheckedIn: true,
        message: `Tamu ${guest.name} SUDAH check-in sebelumnya pada ${guest.checkedInAt?.toLocaleTimeString("id-ID")}.`,
        data: guest,
      });
      return;
    }

    guest.checkedIn = true;
    guest.checkedInAt = new Date();
    guest.status = "Hadir";
    await guest.save();

    res.json({
      success: true,
      alreadyCheckedIn: false,
      message: `Check-in berhasil! Selamat datang, ${guest.name} (${guest.table}).`,
      data: guest,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/guests/stats
export async function getGuestStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const total = await Guest.countDocuments();
    const hadir = await Guest.countDocuments({ status: "Hadir" });
    const ragu = await Guest.countDocuments({ status: "Ragu" });
    const belumRespon = await Guest.countDocuments({ status: "Belum Respon" });
    const tidakHadir = await Guest.countDocuments({ status: "Tidak Hadir" });
    const checkedIn = await Guest.countDocuments({ checkedIn: true });

    const paxAgg = await Guest.aggregate([
      { $match: { status: "Hadir" } },
      { $group: { _id: null, totalPax: { $sum: "$pax" } } },
    ]);
    const totalHadirPax = paxAgg[0]?.totalPax || 0;

    const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        hadir,
        totalHadirPax,
        ragu,
        belumRespon,
        tidakHadir,
        checkedIn,
        attendanceRatePercent: rate,
      },
    });
  } catch (error) {
    next(error);
  }
}

