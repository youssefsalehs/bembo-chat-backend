import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
export const signup = catchAsync(async (req, res, next) => {
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    return next(new AppError("All fields are required", 400));
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError("Email already exists", 400));
  }
  if (password.length < 8) {
    return next(new AppError("Password must be at least of length 8", 400));
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
    return next(new AppError("Invalid user data", 400));
  }
});
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Account doesn't exist", 400));
  }
  const isCorrect = await bcrypt.compare(password, user.password);
  if (!isCorrect) {
    return next(new AppError("Invalid credentials", 400));
  }
  generateToken(user._id, res);
  return res.status(200).json({ data: user });
});
export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
export const updateProfile = catchAsync(async (req, res, next) => {
  const { fullName, bio, theme } = req.body;
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
  if (theme) uploadRes.theme = theme;
  const updatedUser = await User.findByIdAndUpdate(userId, uploadRes, {
    returnDocument: "after",
  });

  res.status(200).json({ data: updatedUser });
});

export const check = catchAsync(async (req, res, next) => {
  res.status(200).json(req.user);
});
