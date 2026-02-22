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
      default:
        "https://res.cloudinary.com/dlnhmifmn/image/upload/v1771801077/default_hjbe68.jpg",
    },
    coverPic: {
      type: String,
      default:
        "https://res.cloudinary.com/dlnhmifmn/image/upload/v1771801386/pexels-joyston-judah-331625-933054_zhhyk7.jpg",
    },
    bio: { type: String, default: "" },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
