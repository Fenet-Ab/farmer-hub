// Import env loader first to ensure environment variables are loaded
import '../config/env.js';

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Validate environment variables
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error(
    "Missing Cloudinary environment variables. Please check your .env file"
  );
}

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// File filter (extra safety)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = file.mimetype.split("/")[1];

  if (!allowedTypes.test(ext)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only image files (jpeg, jpg, png, webp) are allowed"
      ),
      false
    );
  }
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
});

// Centralized upload error handler
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = "Upload failed";
    switch (err.code) {
      case "LIMIT_UNEXPECTED_FILE":
        message = err.message || "Unexpected file type.";
        break;
      default:
        message = `Multer error: ${err.message}`;
    }
    return res.status(400).json({ success: false, message });
  }

  if (err) {
    console.error("Upload error:", err.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during file upload",
    });
  }

  next();
};

export default upload;
