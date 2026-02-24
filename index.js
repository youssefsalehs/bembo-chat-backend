import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import msgRouter from "./routes/message.route.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./controllers/error.controller.js";
dotenv.config();
connectDB();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bembo-chat-backend-production.up.railway.app",
    ],
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", msgRouter);
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`server is running at port : ${port}`);
});
