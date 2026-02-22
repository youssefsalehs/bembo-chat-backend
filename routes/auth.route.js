import express from "express";
import {
  check,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/protect.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.patch(
  "/update-profile",
  protect,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  updateProfile,
);
router.get("/check", protect, check);
export default router;
