import express from "express";
import {
  check,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/protect.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.patch("/update-profile", protect, updateProfile);
router.get("/check", protect, check);
export default router;
