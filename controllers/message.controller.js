import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedUserId } });
    return res.status(200).json({ data: users });
  } catch (error) {
    console.log("Error in getting users: " + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getMsgs = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const msgs = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    });
    return res.status(200).json({ data: msgs });
  } catch (error) {
    console.log("Error in getting msgs" + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const sendMsg = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMsg = await Message.create({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });
    return res.status(201).json({ data: newMsg });
  } catch (error) {
    console.log("Error in sending message " + error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
