import { Router } from "express";
import { getWishes, createWish, deleteWish } from "../controllers/wishController.js";

const router = Router();

router.get("/", getWishes);
router.post("/", createWish);
router.delete("/:id", deleteWish);

export default router;

