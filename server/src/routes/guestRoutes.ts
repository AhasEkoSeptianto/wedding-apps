import { Router } from "express";
import {
  getGuests,
  createGuest,
  bulkCreateGuests,
  updateGuest,
  deleteGuest,
  checkInGuest,
  getGuestStats,
} from "../controllers/guestController.js";

const router = Router();

router.get("/", getGuests);
router.get("/stats", getGuestStats);
router.post("/", createGuest);
router.post("/bulk", bulkCreateGuests);
router.post("/check-in", checkInGuest);
router.put("/:id", updateGuest);
router.delete("/:id", deleteGuest);

export default router;

