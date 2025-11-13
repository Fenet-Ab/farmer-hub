// server/src/routes/adminRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';

const router = express.Router();


// List all users (admin only)
router.get("/users", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ success: false, message: "Server error while fetching users" });
  }
});

// Delete a user by id (admin only)
router.delete("/users/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
});

// Update a user by id (admin only)
router.put("/users/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ message: "Email is already in use by another account." });
      }
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    await user.save();

    const safe = user.toObject();
    delete safe.password;

    res.status(200).json({ message: "User updated successfully", user: safe });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error while updating user" });
  }
});

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

// Get all orders (admin only)
router.get("/orders", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price image category")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error while fetching orders" });
  }
});

// Update order status (admin only)
router.put("/orders/:id/status", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be one of: " + validStatuses.join(", ") });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name price image category");

    res.status(200).json({
      message: "Order status updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error while updating order status" });
  }
});

export default router;
