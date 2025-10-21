import multer from "multer";
import path from "path";
import fs from "fs";

//  Ensure uploads directory exists safely
const uploadDir = path.join(process.cwd(), "uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(" 'uploads' folder created successfully");
  }
} catch (err) {
  console.error(" Failed to create uploads folder:", err.message);
  throw new Error("Cannot initialize upload directory");
}

//  Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    } catch (err) {
      cb(new Error("Error generating file name"), null);
    }
  },
});

//  File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();

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

//  Multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

//  Centralized error handler for upload errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    let message = "Upload failed";
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large. Max size is 5MB.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = err.message || "Unexpected file type.";
        break;
      default:
        message = `Multer error: ${err.message}`;
    }
    return res.status(400).json({ success: false, message });
  }

  if (err) {
    // Other errors
    console.error("Upload error:", err.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during file upload",
    });
  }

  // Continue to next middleware if no errors
  next();
};

export default upload;
