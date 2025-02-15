const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

function getReceiverSocketId(user_id) {
  return userSocketMap[user_id];
}

let userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const user_id = socket.handshake.query.user_id;
  if (user_id) {
    userSocketMap[user_id] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[user_id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, app, server, getReceiverSocketId };
