import express from "express";
import { protect } from "../middleware/protect.js";
import {
  getMsgs,
  getUsers,
  sendMsg,
} from "../controllers/message.controller.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
router.get("/users", protect, getUsers);
router.get("/:id", protect, getMsgs);
router.post("/send/:id", protect, upload.array("images", 5), sendMsg);
export default router;
