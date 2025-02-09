const { Router } = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  refreshToken,
  getOneUser,
} = require("../controller/auth.controller");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", getProfile);
authRouter.get("/refreshToken", refreshToken);
authRouter.get("/getOneUser/:user_id", getOneUser);
module.exports = authRouter;
