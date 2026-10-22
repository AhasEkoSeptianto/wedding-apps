import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

// Multer in-memory storage (up to 10MB)
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diperbolehkan (JPG, PNG, WebP, GIF)"));
    }
  },
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
}

// POST /api/upload
export async function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Tidak ada file gambar yang diunggah.",
      });
      return;
    }

    const subFolder = req.body.folder ? String(req.body.folder).replace(/[^a-zA-Z0-9_-]/g, "") : "general";
    const folder = `janjisuci/${subFolder}`;

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            return reject(error || new Error("Gagal mengunggah file ke Cloudinary."));
          }
          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
          });
        }
      );

      stream.end(req.file!.buffer);
    });

    res.status(200).json({
      success: true,
      message: "Gambar berhasil diunggah ke Cloudinary!",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/upload
export async function deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res.status(400).json({
        success: false,
        message: "publicId wajib disertakan.",
      });
      return;
    }

    const destroyResult = await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: "Gambar berhasil dihapus dari Cloudinary.",
      result: destroyResult,
    });
  } catch (error) {
    next(error);
  }
}

