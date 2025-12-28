import express from 'express'
import verifyToken from '../middlewares/authMiddleware.js'
import Order from '../models/orderModel.js'
import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'

const router = express.Router()

// Get user's orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price image category')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    res.status(500).json({ success: false, message: 'Server error while fetching orders' })
  }
})

// Create order from cart
router.post('/create', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { shippingAddress } = req.body

    const cart = await Cart.findOne({ user: userId }).populate('items.product')
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      status: 'pending',
      shippingAddress: shippingAddress || '',
    })

    await order.save()

    // Clear cart after creating order
    cart.items = []
    await cart.save()

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'name price image category')

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ success: false, message: 'Server error while creating order' })
  }
})

// Get supplier's orders (orders containing supplier's products)
router.get('/supplier/my-orders', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Access denied only for suppliers' })
    }

    // First get all products by this supplier
    const supplierProducts = await Product.find({ supplier: req.user.id }).select('_id')
    const productIds = supplierProducts.map(p => p._id)

    // Find orders that contain any of these products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
      .populate('user', 'name email')
      .populate('items.product', 'name price image category supplier')
      .sort({ createdAt: -1 })

    // Filter to only include items from this supplier and calculate supplier revenue
    const filteredOrders = orders.map(order => {
      const supplierItems = order.items.filter(item =>
        item.product && item.product.supplier && item.product.supplier.toString() === req.user.id
      )
      const supplierTotal = supplierItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...order.toObject(),
        supplierItems,
        supplierTotal
      }
    }).filter(order => order.supplierItems.length > 0)

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders,
    })
  } catch (error) {
    console.error('Error fetching supplier orders:', error)
    res.status(500).json({ success: false, message: 'Server error while fetching orders' })
  }
})

// Update delivery status (admin or supplier)
router.patch('/update-delivery/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isDelivered } = req.body; // true/false

    if (req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.findById(orderId).populate('items.product', 'supplier');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If supplier, ensure they have at least one product in the order
    if (req.user.role === 'supplier') {
      const supplierItems = order.items.filter(
        item => item.product.supplier.toString() === req.user.id
      );
      if (supplierItems.length === 0) {
        return res.status(403).json({ message: 'You cannot update this order' });
      }
    }

    order.isDelivered = isDelivered;
    order.status = isDelivered ? 'delivered' : order.status;
    order.deliveredAt = isDelivered ? new Date() : null;

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order marked as ${isDelivered ? 'delivered' : 'not delivered'}`,
      order,
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// Update order payment status (after Chapa payment)
router.put('/:orderId/status', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    // Only the user who owns the order or admin can update payment status
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    const populatedOrder = await Order.findById(orderId)
      .populate('items.product', 'name price image category');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error while updating order status' });
  }
});


export default router



