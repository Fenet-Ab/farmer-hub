import express from "express"
import verifyToken from "../middlewares/authMiddleware.js"
import Cart from "../models/cartModel.js"
import Product from '../models/productModel.js'


const router = express.Router();

//add product to cart
router.post("/add", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] })
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        res.status(200).json({ message: "product added to cart", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error"
        })
    }
})

//get user's cart
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId }).populate('items.product', "name price image");

        if (!cart) {
            return res.status(200).json({
                message: "Cart is empty",

            })
        }
        // Calculate total price
        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        res.status(200).json({ cart, totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error"
        })
    }
})

//update cart item quantity
router.put("/update", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 0) {
            return res.status(400).json({
                message: "Invalid productId or quantity"
            })
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            })
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            })
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error"
        })
    }
})

//remove item from cart
router.delete("/remove", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            })
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart"
            })
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).json({ message: "Product removed from cart", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error"
        })
    }
})

//clear entire cart
router.delete("/clear", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            })
        }

        cart.items = [];
        await cart.save();
        res.status(200).json({ message: "Cart cleared", cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "server error"
        })
    }
})

export default router;