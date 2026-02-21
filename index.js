import express from "express";
const app = express();
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();
connectDB();
app.use("/api/v1/auth", authRouter);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running at port : ${port}`);
});
