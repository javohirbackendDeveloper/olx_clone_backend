const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteOldImage = async (imageUrl) => {
  const imageId = imageUrl.split("/").pop().split(".")[0];
  try {
    await cloudinary.uploader.destroy(imageId);
  } catch (err) {
    console.log("Image delete error:", err);
  }
};

const uploadNewImage = async (imageUrl) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
      folder: "groups",
    });
    return uploadedImage.secure_url;
  } catch (err) {
    console.log("Image upload error:", err);
    throw new Error("Failed to upload image");
  }
};

module.exports = { cloudinary, deleteOldImage, uploadNewImage };

// VERCEL CONFIGURATION

// {
//   "version": 2,
//   "builds": [{ "src": "index.js", "use": "@vercel/node" }],
//   "routes": [{ "src": "/api/(.*)", "dest": "/api/$1.js" }]
// }
