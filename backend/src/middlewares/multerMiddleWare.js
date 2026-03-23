require("dotenv").config(); // Loads your .env secrets
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Authenticate with Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure the Cloud Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "ecosight_wildlife", // The folder name inside your Cloudinary account
        allowedFormats: ["jpg", "png", "jpeg"],
        transformation: [{ width: 800, crop: "limit" }] // Automatically resizes massive 4K images to save bandwidth!
    }
});

// 3. Export the upgraded Multer instance
const upload = multer({ storage: storage });

module.exports = upload;