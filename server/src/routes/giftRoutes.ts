import { Router } from "express";
import {
  getGifts,
  createGift,
  updateGiftStatus,
  deleteGift,
} from "../controllers/giftController.js";

const router = Router();

router.get("/", getGifts);
router.post("/", createGift);
router.patch("/:id/status", updateGiftStatus);
router.delete("/:id", deleteGift);

export default router;

