import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const socketUsersMap = {};
export const getReceiverSocketId = (userId) => {
  return socketUsersMap[userId];
};
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    socketUsersMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(socketUsersMap));

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping", {
        senderId: userId,
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete socketUsersMap[userId];
    io.emit("getOnlineUsers", Object.keys(socketUsersMap));
  });
});

export { io, app, server };
