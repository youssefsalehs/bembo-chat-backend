import express from "express";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import msgRouter from "./routes/message.route.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";
dotenv.config();
connectDB();
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", msgRouter);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running at port : ${port}`);
});
