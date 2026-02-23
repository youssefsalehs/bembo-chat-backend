import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
export const getUsers = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedUserId } }).sort({
      fullName: 1,
      createdAt: -1,
    });
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
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
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
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrls = [];

    const cloudinaryUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "messages" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(buffer);
      });

    if (req.files && req.files.length > 0) {
      const uploads = req.files.map((file) => cloudinaryUpload(file.buffer));

      const results = await Promise.all(uploads);
      imageUrls = results.map((r) => r.secure_url);
    }

    const newMsg = await Message.create({
      senderId,
      receiverId,
      text,
      images: imageUrls,
    });
    const receiverIdSocket = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);
    io.to(receiverIdSocket).emit("newMessage", newMsg);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMsg);
    }

    return res.status(201).json({ data: newMsg });
  } catch (error) {
    console.log("Error in sending message:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
