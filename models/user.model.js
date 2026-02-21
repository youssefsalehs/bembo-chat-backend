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
      minLength: 8,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    bio: String,
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
