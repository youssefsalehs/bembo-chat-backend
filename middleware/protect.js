import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protect = async (req, res, next) => {
  try {
    console.log("cookies:", req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "unauthorized - No token is provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "unauthorized - No token is provided",
      });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "user not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protection" + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
