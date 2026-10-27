import { Router } from "express";
import {
  getWishes,
  createWish,
  toggleLikeWish,
  deleteWish,
} from "../controllers/wishController.js";

const router = Router();

router.get("/", getWishes);
router.post("/", createWish);
router.patch("/:id/like", toggleLikeWish);
router.delete("/:id", deleteWish);

export default router;
