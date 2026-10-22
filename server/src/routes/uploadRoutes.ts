import { Router } from "express";
import { uploadImage, deleteImage, uploadMiddleware } from "../controllers/uploadController.js";

const router = Router();

// Accept 'image' field for single file upload
router.post("/", uploadMiddleware.single("image"), uploadImage);
router.delete("/", deleteImage);

export default router;

