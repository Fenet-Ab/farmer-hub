import express from "express";
import Product from "../models/productModel.js";
import verifyToken from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();


// ================= CREATE PRODUCT =================
router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.user.role !== "supplier") {
        return res.status(403).json({ message: "Access denied only for suppliers" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const { name, description, price, quantity, category } = req.body;
      if (!name || !description || !price || !quantity || !category) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const product = new Product({
        name,
        description,
        price,
        quantity,
        category,
        image: req.file.path,              // ✅ Cloudinary URL
        imagePublicId: req.file.filename,  // ✅ Cloudinary public_id
        supplier: req.user.id,
      });

      await product.save();

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= GET ALL PRODUCTS =================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("supplier", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ================= SUPPLIER PRODUCTS =================
router.get("/supplier/my-products", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ message: "Access denied" });
    }

    const products = await Product.find({ supplier: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching supplier products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET PRODUCT BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "supplier",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE PRODUCT =================
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.supplier.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { name, description, price, quantity, category } = req.body;

      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = price;
      if (quantity) product.quantity = quantity;
      if (category) product.category = category;

      // ✅ Replace image safely
      if (req.file) {
        // delete old image
        await cloudinary.uploader.destroy(product.imagePublicId);

        product.image = req.file.path;
        product.imagePublicId = req.file.filename;
      }

      await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating product:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= DELETE PRODUCT =================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.supplier.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ delete image from Cloudinary
    await cloudinary.uploader.destroy(product.imagePublicId);

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
