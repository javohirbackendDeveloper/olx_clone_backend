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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and generates access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               location:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *       400:
 *         description: Username already exists
 *       500:
 *         description: Server error
 */
authRouter.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and generates access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 foundedUser:
 *                   type: object
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the user
 *     description: Logs the user out by clearing the cookies.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Server error
 */
authRouter.post("/logout", logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Fetches the authenticated user's profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 location:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
authRouter.get("/profile", getProfile);

/**
 * @swagger
 * /api/auth/refreshToken:
 *   get:
 *     summary: Refresh JWT token
 *     description: Refreshes the access token using the refresh token stored in cookies.
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Server error
 */
authRouter.get("/refreshToken", refreshToken);

/**
 * @swagger
 * /api/auth/getOneUser/{user_id}:
 *   get:
 *     summary: Get a specific user's data
 *     description: Retrieves a user's information based on the user_id.
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     location:
 *                       type: string
 *       500:
 *         description: Server error
 */
authRouter.get("/getOneUser/:user_id", getOneUser);

/**
 * @swagger
 * /api/auth/updateProfile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the user's profile with new data (image, location, phone number).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_image:
 *                 type: string
 *                 format: uri
 *               location:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedUser:
 *                   type: object
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
authRouter.put("/updateProfile", protectRoute, updateProfile);

/**
 * @swagger
 * /api/auth/checkAuth:
 *   get:
 *     summary: Check authentication status
 *     description: Checks if the user is authenticated.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully checked authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 location:
 *                   type: string
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
authRouter.get("/checkAuth", protectRoute, checkAuth);

module.exports = authRouter;
