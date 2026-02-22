import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least of length 8",
      });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      return res.status(201).json({ data: newUser });
    } else {
      return res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup " + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Account doesn't exist",
      });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    generateToken(user._id, res);
    return res.status(200).json({ data: user });
  } catch (error) {
    console.log("Error in login " + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      message: "user logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout " + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;
    const userId = req.user._id;

    let uploadRes = {};

    const cloudinaryUpload = (buffer, folder) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(buffer);
      });

    if (req.files?.profilePic) {
      const result = await cloudinaryUpload(
        req.files.profilePic[0].buffer,
        "profile",
      );
      uploadRes.profilePic = result.secure_url;
    }

    if (req.files?.coverPic) {
      const result = await cloudinaryUpload(
        req.files.coverPic[0].buffer,
        "cover",
      );
      uploadRes.coverPic = result.secure_url;
    }

    if (fullName) uploadRes.fullName = fullName;
    if (bio) uploadRes.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(userId, uploadRes, {
      returnDocument: "after",
    });

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check" + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
