const { Router } = require("express");
const protectRoute = require("../middleware/auth.middleware");
const {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteUser,
} = require("../controller/message.controller");

const messageRouter = Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/getMessages/:id", protectRoute, getMessages);
messageRouter.post("/:id", protectRoute, sendMessage);
messageRouter.delete("/:receiver_id", protectRoute, deleteUser);

module.exports = messageRouter;
