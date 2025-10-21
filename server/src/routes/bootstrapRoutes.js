// server/src/routes/bootstrapRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const router = express.Router();

// Route to register the first admin
router.post("/register-first-admin", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if any admin exists
  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    return res.status(403).json({
      message:
        "Admin already exists. Use admin panel to create new admins or suppliers.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin", // ✅ first admin
  });

  res.status(201).json({
    message: "First admin created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export default router;
