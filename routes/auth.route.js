import express from "express";
import { login, logut, signup } from "../controllers/auth.controller.js";
const router = express.Router();
router.get("/signup", signup);
router.get("/login", login);
router.get("/logout", logut);
export default router;
