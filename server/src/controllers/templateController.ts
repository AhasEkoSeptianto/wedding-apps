import { Request, Response, NextFunction } from "express";
import { Template } from "../models/Template.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

// GET /api/templates
export async function getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search, all } = req.query;
    const filter: Record<string, unknown> = {};

    // Only return published templates for clients unless all=true is passed by admin
    if (all !== "true") {
      filter.isActive = true;
    }

    if (category && category !== "Semua") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const templates = await Template.find(filter).sort({ isPreset: -1, createdAt: -1 });

    res.json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/templates/:idOrSlug
export async function getTemplateById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { idOrSlug } = req.params;

    let template = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      template = await Template.findById(idOrSlug);
    }
    if (!template) {
      template = await Template.findOne({ slug: idOrSlug });
    }

    if (!template) {
      res.status(404).json({
        success: false,
        message: "Template desain tidak ditemukan.",
      });
      return;
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/templates (Admin Only)
export async function createTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      slug,
      name,
      category,
      description,
      previewColor,
      thumbnailUrl,
      coverPhotoUrl,
      bannerPhotoUrl,
      previewAlbum,
      price,
      designer,
      tier,
      tierBadge,
      html,
      isPreset,
      isActive,
    } = req.body;

    if (!name || !html) {
      res.status(400).json({
        success: false,
        message: "Nama template dan kode HTML wajib diisi.",
      });
      return;
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await Template.findOne({ slug: cleanSlug });
    if (existing) {
      res.status(400).json({
        success: false,
        message: `Slug template "${cleanSlug}" sudah digunakan. Gunakan slug atau nama lain.`,
      });
      return;
    }

    const template = await Template.create({
      slug: cleanSlug,
      name: name.trim(),
      category: category || "Umum",
      description: description || "",
      previewColor: previewColor || "#b38742",
      thumbnailUrl: thumbnailUrl || "",
      coverPhotoUrl: coverPhotoUrl || "",
      bannerPhotoUrl: bannerPhotoUrl || "",
      previewAlbum: Array.isArray(previewAlbum) ? previewAlbum : [],
      price: price || "Rp 149.000",
      designer: designer || "Atelier JanjiSuci",
      tier: tier || "gold",
      tierBadge: tierBadge || "Desain Pilihan",
      html,
      isPreset: Boolean(isPreset),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: `Template "${template.name}" berhasil dibuat dan dipublish oleh staf administrasi.`,
      data: template,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/templates/:id (Admin Only)
export async function updateTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const {
      slug,
      name,
      category,
      description,
      previewColor,
      thumbnailUrl,
      coverPhotoUrl,
      bannerPhotoUrl,
      previewAlbum,
      price,
      designer,
      tier,
      tierBadge,
      html,
      isPreset,
      isActive,
    } = req.body;

    const template = await Template.findById(id);
    if (!template) {
      res.status(404).json({
        success: false,
        message: "Template tidak ditemukan.",
      });
      return;
    }

    if (name) template.name = name.trim();
    if (slug) {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      
      if (cleanSlug !== template.slug) {
        const existing = await Template.findOne({ slug: cleanSlug, _id: { $ne: id } });
        if (existing) {
          res.status(400).json({
            success: false,
            message: `Slug template "${cleanSlug}" sudah digunakan oleh template lain.`,
          });
          return;
        }
        template.slug = cleanSlug;
      }
    }

    if (category !== undefined) template.category = category;
    if (description !== undefined) template.description = description;
    if (previewColor !== undefined) template.previewColor = previewColor;
    if (thumbnailUrl !== undefined) template.thumbnailUrl = thumbnailUrl;
    if (coverPhotoUrl !== undefined) template.coverPhotoUrl = coverPhotoUrl;
    if (bannerPhotoUrl !== undefined) template.bannerPhotoUrl = bannerPhotoUrl;
    if (previewAlbum !== undefined) template.previewAlbum = Array.isArray(previewAlbum) ? previewAlbum : [];
    if (price !== undefined) template.price = price;
    if (designer !== undefined) template.designer = designer;
    if (tier !== undefined) template.tier = tier;
    if (tierBadge !== undefined) template.tierBadge = tierBadge;
    if (html !== undefined) template.html = html;
    if (isPreset !== undefined) template.isPreset = isPreset;
    if (isActive !== undefined) template.isActive = isActive;

    await template.save();

    res.json({
      success: true,
      message: `Template "${template.name}" berhasil diperbarui.`,
      data: template,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/templates/:id (Admin Only)
export async function deleteTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);
    if (!template) {
      res.status(404).json({
        success: false,
        message: "Template tidak ditemukan.",
      });
      return;
    }

    await Template.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Template "${template.name}" berhasil dihapus dari sistem.`,
    });
  } catch (error) {
    next(error);
  }
}
