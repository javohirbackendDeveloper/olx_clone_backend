const { Router } = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  refreshToken,
  getOneUser,
  updateProfile,
  checkAuth,
} = require("../controller/auth.controller");
const protectRoute = require("../middleware/auth.middleware");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/profile", getProfile);
authRouter.get("/refreshToken", refreshToken);
authRouter.get("/getOneUser/:user_id", getOneUser);
authRouter.put("/updateProfile", protectRoute, updateProfile);
authRouter.get("/checkAuth", protectRoute, checkAuth);

module.exports = authRouter;
