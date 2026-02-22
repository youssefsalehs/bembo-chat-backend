import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: [true, "user must have an email"] },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: { type: String, default: "" },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
