// server/src/routes/adminRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';

const router = express.Router();


// Admin creates a new admin or supplier
router.post("/create-user", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const { name, email, password, role } = req.body; // role is only set by admin

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate role
  const authorizeRoles = ["admin", "supplier"];
  if (!authorizeRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role, // safe, backend sets role
  });

  res.status(201).json({
    message: `New ${role} created successfully`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
  
});
// Admin updates own profile
router.put("/update-profile", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const adminId = req.user.id; // from JWT token
  const { name, email, currentPassword, newPassword } = req.body;

  const admin = await User.findById(adminId);

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // Verify current password before allowing changes
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Update fields if provided
  if (name) admin.name = name;
  if (email) admin.email = email;
  if (newPassword) {
    admin.password = await bcrypt.hash(newPassword, 10);
  }

  await admin.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});



export default router;
