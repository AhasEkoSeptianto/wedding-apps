import { Router } from "express";
import { getWedding, upsertWedding } from "../controllers/weddingController.js";

const router = Router();

router.get("/:slug?", getWedding);
router.put("/:slug?", upsertWedding);

export default router;

