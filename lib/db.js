import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.error("mongodb connection error:", error.message);
    process.exit(1);
  }
};
