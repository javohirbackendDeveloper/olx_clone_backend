const authSchema = require("../schema/auth.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../lib/redis");
const cloudinary = require("../utils/cloudinary");

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 * 1000
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = async (req, res) => {
  const { password, username, location } = req.body;

  try {
    const userExists = await authSchema.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        message: "Bu username allaqachon mavjud iltimos boshqa nom tanlang",
      });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await authSchema.create({
      username,
      password: hash,
      location,
    });

    // authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      username: user.username,
    });
  } catch (error) {
    console.log("Error in register controller", error.message);
    res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundedUser = await authSchema.findOne({ email });

    if (!foundedUser) {
      return res.json({ error: "This user not found" });
    }

    const checkerPassword = bcrypt.compare(password, foundedUser.password);

    if (!checkerPassword) {
      return res.json({ error: "Your password is wrong" });
    }

    const { accessToken, refreshToken } = generateTokens(foundedUser._id);

    await storeRefreshToken(foundedUser._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({ foundedUser });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOneUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await authSchema.findOne({ _id: user_id });
    return res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// //////////// PROFILE

module.exports = {
  register,
  login,
  logout,
  getProfile,
  refreshToken,
  getOneUser,
};
