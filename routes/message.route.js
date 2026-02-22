import express from "express";
import { protect } from "../middleware/protect.js";
import {
  getMsgs,
  getUsers,
  sendMsg,
} from "../controllers/message.controller.js";
const router = express.Router();
router.get("/users", protect, getUsers);
router.get("/:id", protect, getMsgs);
router.post("/send/:id", protect, sendMsg);
export default router;
