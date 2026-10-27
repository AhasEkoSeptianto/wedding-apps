import { Router } from "express";
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templateController.js";
import { protect, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes for clients to browse and choose templates
router.get("/", getTemplates);
router.get("/:idOrSlug", getTemplateById);

// Admin-only management routes
router.post("/", protect, requireAdmin, createTemplate);
router.put("/:id", protect, requireAdmin, updateTemplate);
router.delete("/:id", protect, requireAdmin, deleteTemplate);

export default router;

