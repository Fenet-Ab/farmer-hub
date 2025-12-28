import express from "express";
import axios from "axios";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/payments/chapa/init
 * @desc Initialize Chapa payment for cart checkout
 */
router.post("/chapa/init", verifyToken, async (req, res) => {
  const { orderId, shippingAddress } = req.body;

  if (!orderId) {
    return res.status(400).json({ 
      success: false,
      message: "Order ID is required" 
    });
  }

  // Check if Chapa secret key is configured
  if (!process.env.CHAPA_SECRET_KEY) {
    console.error("CHAPA_SECRET_KEY is not configured in environment variables");
    return res.status(500).json({ 
      success: false,
      message: "Payment service is not configured. Please contact support." 
    });
  }

  try {
    console.log('Payment init request:', { orderId, userId: req.user.id, email: req.user.email });
    
    // Find the order
    let order;
    try {
      order = await Order.findById(orderId)
        .populate('items.product', 'name')
        .populate({
          path: 'user',
          select: 'name email',
          // Ensure email is included even if it's not in the select
        });
    } catch (dbError) {
      console.error('Database error finding order:', dbError);
      return res.status(500).json({ 
        success: false,
        message: "Error retrieving order",
        error: dbError.message 
      });
    }

    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    console.log('Order found:', {
      orderId: order._id,
      userId: order.user?._id,
      itemsCount: order.items?.length,
      totalAmount: order.totalAmount
    });

    // Verify order belongs to user
    if (!order.user || order.user._id.toString() !== req.user.id) {
      console.error('Unauthorized order access:', {
        orderUserId: order.user?._id,
        requestUserId: req.user.id
      });
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access to this order" 
      });
    }

    // Check if order has items
    if (!order.items || order.items.length === 0) {
      console.error('Order has no items:', orderId);
      return res.status(400).json({ 
        success: false,
        message: "Order has no items" 
      });
    }

    // Update shipping address if provided
    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
      await order.save();
    }

    const tx_ref = `TX-${Date.now()}-${order._id}`;
    
    // Update order with payment reference
    order.paymentReference = tx_ref;
    await order.save();

    // Create description from order items (handle cases where product might be null)
    // Chapa only allows: letters, numbers, hyphens, underscores, spaces, and dots
    const itemNames = order.items
      .map(item => {
        // Handle both populated and non-populated product references
        if (item.product && typeof item.product === 'object') {
          return item.product.name || 'Product';
        }
        return 'Product';
      })
      .filter(Boolean)
      .join(', ');
    
    // Sanitize description to only contain allowed characters
    // Remove any special characters except letters, numbers, hyphens, underscores, spaces, and dots
    let description = itemNames ? `Order ${itemNames.substring(0, 200)}` : 'Order Payment';
    // Replace any invalid characters with spaces, then clean up multiple spaces
    description = description.replace(/[^a-zA-Z0-9\s\-_\.]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Ensure description is not empty and has reasonable length
    if (!description || description.length === 0) {
      description = 'Order Payment';
    }
    // Limit to 255 characters (Chapa limit)
    description = description.substring(0, 255);

    // Ensure we have required user information
    // Get email from populated order user first, then from req.user
    let userEmail = null;
    
    if (order.user) {
      if (typeof order.user === 'object' && order.user.email) {
        userEmail = order.user.email;
      } else if (typeof order.user === 'string') {
        // If user is not populated, we need to fetch it
        const User = (await import("../models/userModel.js")).default;
        const userDoc = await User.findById(order.user);
        userEmail = userDoc?.email;
      }
    }
    
    // Fallback to req.user email
    if (!userEmail && req.user.email) {
      userEmail = req.user.email;
    }
    
    // If still no email, try to get it from the database
    if (!userEmail) {
      const User = (await import("../models/userModel.js")).default;
      const userDoc = await User.findById(req.user.id).select('email');
      if (userDoc && userDoc.email) {
        userEmail = userDoc.email;
        console.log('Retrieved email from database:', userEmail);
      }
    }
    
    // Validate and clean email format (Chapa requires valid email)
    if (!userEmail) {
      console.error('No email found for user:', {
        orderUserId: order.user?._id || order.user,
        reqUserId: req.user.id,
        orderUserEmail: order.user?.email,
        reqUserEmail: req.user.email
      });
      return res.status(400).json({ 
        success: false,
        message: "Email address is required for payment. Please update your profile with a valid email address." 
      });
    }
    
    // Log the email we're about to validate
    console.log('Email before validation:', {
      raw: userEmail,
      type: typeof userEmail,
      length: userEmail?.length
    });
    
    // Clean email - remove whitespace, convert to lowercase
    userEmail = String(userEmail).trim().toLowerCase();
    
    // Remove any whitespace
    userEmail = userEmail.replace(/\s+/g, '');
    
    // Chapa requires a very strict email format
    // Pattern: localpart@domain.tld
    // Local part: letters, numbers, dots, hyphens, underscores, plus signs
    // Domain: letters, numbers, dots, hyphens
    // TLD: at least 2 letters
    const chapaEmailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    
    // Additional checks for Chapa's strict requirements
    const emailParts = userEmail.split('@');
    if (emailParts.length !== 2) {
      console.error('Invalid email format - no @ symbol:', userEmail);
      return res.status(400).json({ 
        success: false,
        message: `Invalid email format. Please use a valid email address.` 
      });
    }
    
    const [localPart, domain] = emailParts;
    
    // Validate local part (before @)
    if (!localPart || localPart.length === 0 || localPart.length > 64) {
      console.error('Invalid email local part:', localPart);
      return res.status(400).json({ 
        success: false,
        message: `Invalid email format. Email address is too long or invalid.` 
      });
    }
    
    // Validate domain (after @)
    if (!domain || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) {
      console.error('Invalid email domain:', domain);
      return res.status(400).json({ 
        success: false,
        message: `Invalid email format. Please use a valid email address.` 
      });
    }
    
    // Final regex validation
    if (!chapaEmailRegex.test(userEmail)) {
      console.error('Email failed Chapa regex validation:', userEmail);
      return res.status(400).json({ 
        success: false,
        message: `Invalid email format: ${userEmail}. Please use a valid email address (e.g., user@example.com).` 
      });
    }
    
    // Additional validation: ensure email doesn't have consecutive dots
    if (userEmail.includes('..') || localPart.startsWith('.') || localPart.endsWith('.')) {
      console.error('Email has invalid format (consecutive dots or leading/trailing dots):', userEmail);
      return res.status(400).json({ 
        success: false,
        message: `Invalid email format. Email cannot have consecutive dots or start/end with a dot.` 
      });
    }
    
    console.log('Email validated for Chapa:', {
      email: userEmail,
      localPart: localPart,
      domain: domain,
      original: order.user?.email || req.user.email
    });
    
    const userName = order.user?.name || req.user.name || 'Customer';
    const firstName = (userName.split(' ')[0] || 'Customer').substring(0, 50); // Chapa has name length limits
    const lastName = (userName.split(' ').slice(1).join(' ') || '').substring(0, 50);

    // Ensure amount is valid
    if (!order.totalAmount || order.totalAmount <= 0) {
      console.error('Invalid order amount:', order.totalAmount);
      return res.status(400).json({ 
        success: false,
        message: "Invalid order amount" 
      });
    }

    // Chapa requires amount as a number (not string)
    const chapaAmount = Number(order.totalAmount);
    
    if (isNaN(chapaAmount) || chapaAmount <= 0) {
      console.error('Invalid amount format:', order.totalAmount, 'converted to:', chapaAmount);
      return res.status(400).json({ 
        success: false,
        message: "Invalid order amount format" 
      });
    }

    // Prepare payment payload
    // Chapa API requires specific format - amount as number, valid email, etc.
    const paymentPayload = {
      amount: chapaAmount, // Use the validated number
      currency: "ETB",
      email: userEmail,
      first_name: firstName,
      last_name: lastName,
      tx_ref,
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?tx_ref=${tx_ref}`,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?tx_ref=${tx_ref}`,
      customization: {
        title: "Order Payment",
        description: description,
      },
    };
    
    // Final email validation before sending to Chapa
    const finalEmailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!finalEmailRegex.test(userEmail)) {
      console.error('Email failed final validation before sending to Chapa:', userEmail);
      return res.status(400).json({ 
        success: false,
        message: `Email validation failed: ${userEmail}. Please ensure your email is in a valid format (e.g., user@example.com).` 
      });
    }
    
    console.log('Payment payload prepared:', {
      amount: paymentPayload.amount,
      currency: paymentPayload.currency,
      email: paymentPayload.email,
      first_name: paymentPayload.first_name,
      last_name: paymentPayload.last_name,
      tx_ref: paymentPayload.tx_ref,
      callback_url: paymentPayload.callback_url.substring(0, 60) + '...',
      description: description.substring(0, 50) + '...',
      emailLength: paymentPayload.email.length,
      emailValid: finalEmailRegex.test(paymentPayload.email)
    });

    console.log('Initializing Chapa payment:', {
      amount: order.totalAmount,
      currency: 'ETB',
      email: userEmail,
      tx_ref,
      payload: { ...paymentPayload, callback_url: paymentPayload.callback_url.substring(0, 50) + '...' }
    });

    let response;
    try {
      response = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        paymentPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log('Chapa API Response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        fullResponse: JSON.stringify(response.data, null, 2)
      });
    } catch (apiError) {
      console.error('Chapa API call failed:', {
        message: apiError.message,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        config: {
          url: apiError.config?.url,
          method: apiError.config?.method,
          headers: apiError.config?.headers ? Object.keys(apiError.config.headers) : []
        }
      });
      
      // Extract validation errors from Chapa API response
      if (apiError.response?.data) {
        const chapaError = apiError.response.data;
        let validationErrors = [];
        
        // Chapa returns validation errors in message object
        if (chapaError.message && typeof chapaError.message === 'object') {
          const errorMessages = chapaError.message;
          
          // Handle field-specific errors
          if (errorMessages.email) {
            const emailErrors = Array.isArray(errorMessages.email) ? errorMessages.email : [errorMessages.email];
            if (emailErrors.includes('validation.email')) {
              validationErrors.push('Email: Invalid email format. Please use a valid email address.');
            } else {
              validationErrors.push(`Email: ${emailErrors.join(', ')}`);
            }
          }
          if (errorMessages.amount) {
            const amountErrors = Array.isArray(errorMessages.amount) ? errorMessages.amount : [errorMessages.amount];
            validationErrors.push(`Amount: ${amountErrors.join(', ')}`);
          }
          if (errorMessages['customization.description']) {
            const descErrors = Array.isArray(errorMessages['customization.description']) 
              ? errorMessages['customization.description'] 
              : [errorMessages['customization.description']];
            validationErrors.push(`Description: ${descErrors.join(', ')}`);
          }
          if (errorMessages.first_name) {
            const nameErrors = Array.isArray(errorMessages.first_name) ? errorMessages.first_name : [errorMessages.first_name];
            validationErrors.push(`First Name: ${nameErrors.join(', ')}`);
          }
        } else if (typeof chapaError.message === 'string') {
          validationErrors.push(chapaError.message);
        }
        
        // If we have validation errors, throw a more user-friendly error
        if (validationErrors.length > 0) {
          const friendlyError = new Error(validationErrors.join('; '));
          friendlyError.response = apiError.response;
          throw friendlyError;
        }
      }
      
      throw apiError;
    }

    // Check if response has the expected structure
    // Chapa API can return data in different formats
    let checkoutUrl = null;
    
    if (response.data?.data?.checkout_url) {
      checkoutUrl = response.data.data.checkout_url;
    } else if (response.data?.checkout_url) {
      checkoutUrl = response.data.checkout_url;
    } else if (response.data?.data?.checkoutUrl) {
      checkoutUrl = response.data.data.checkoutUrl;
    } else if (response.data?.checkoutUrl) {
      checkoutUrl = response.data.checkoutUrl;
    }

    if (!checkoutUrl) {
      console.error("Invalid response from Chapa API - no checkout URL found:", {
        responseData: response.data,
        responseStatus: response.status
      });
      return res.status(500).json({ 
        success: false,
        message: "Invalid response from payment gateway",
        error: "Missing checkout URL in response",
        debug: {
          responseStructure: response.data ? Object.keys(response.data) : [],
          fullResponse: response.data
        }
      });
    }

    res.status(200).json({
      success: true,
      checkout_url: checkoutUrl,
      reference: tx_ref,
      orderId: order._id,
    });
  } catch (error) {
    // Log the full error for debugging
    console.error("========== CHAPA INIT ERROR ==========");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("Response Status:", error.response?.status);
    console.error("Response Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Full Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error("======================================");
    
    // Provide more specific error messages
    let errorMessage = "Payment initialization failed";
    let errorDetails = null;
    
    if (error.response?.status === 401) {
      errorMessage = "Invalid payment gateway credentials. Please check CHAPA_SECRET_KEY.";
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.message || "Invalid payment request";
      errorDetails = error.response?.data;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "Cannot connect to payment gateway. Please check your internet connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // If we have validation errors from Chapa, include them
    if (error.response?.data && typeof error.response.data === 'object') {
      const chapaError = error.response.data;
      const validationMessages = [];
      
      Object.keys(chapaError).forEach(key => {
        const value = chapaError[key];
        if (Array.isArray(value)) {
          validationMessages.push(`${key}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          validationMessages.push(`${key}: ${value}`);
        }
      });
      
      if (validationMessages.length > 0) {
        errorMessage = `Validation errors: ${validationMessages.join('; ')}`;
      }
    }

    res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: errorDetails || error.response?.data || error.message,
      debug: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        code: error.code
      } : undefined
    });
  }
});

/**
 * @route GET /api/payments/chapa/verify/:tx_ref
 * @desc Verify Chapa payment and update order status
 */
router.get("/chapa/verify/:tx_ref", verifyToken, async (req, res) => {
  const { tx_ref } = req.params;
  
  // Prevent caching of verification responses
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  
  try {
    console.log('Verifying payment with tx_ref:', tx_ref);
    
    // Find order by payment reference first
    const order = await Order.findOne({ paymentReference: tx_ref })
      .populate('user', 'name email');

    if (!order) {
      console.error('Order not found for payment reference:', tx_ref);
      return res.status(404).json({ 
        success: false,
        message: "Order not found for this payment reference" 
      });
    }

    // Verify order belongs to user
    if (order.user._id.toString() !== req.user.id) {
      console.error('Unauthorized payment verification attempt:', {
        orderUserId: order.user._id,
        requestUserId: req.user.id
      });
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access to this order" 
      });
    }

    // Verify payment with Chapa
    let chapaResponse;
    try {
      chapaResponse = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        }
      );
      
      console.log('Chapa verification response:', {
        status: chapaResponse.data?.data?.status,
        message: chapaResponse.data?.message,
        hasData: !!chapaResponse.data?.data
      });
    } catch (chapaError) {
      console.error('Chapa API verification error:', {
        status: chapaError.response?.status,
        data: chapaError.response?.data,
        message: chapaError.message
      });
      
      // In test mode, sometimes Chapa might return errors even for successful payments
      // Check if order was already marked as paid
      if (order.paymentStatus === 'paid') {
        console.log('Order already marked as paid, returning success');
        return res.status(200).json({
          success: true,
          message: "Payment already verified",
          paymentStatus: "paid",
          order: order,
        });
      }
      
      // If Chapa returns 404, the transaction might not exist yet (still processing)
      // Return pending status instead of error
      if (chapaError.response?.status === 404) {
        console.log('Chapa transaction not found (404), payment may still be processing');
        return res.status(200).json({
          success: false,
          message: "Payment is still being processed. Please wait a moment and try again.",
          paymentStatus: "pending",
          order: order,
        });
      }
      
      // For other Chapa errors, still return the order status
      // Don't throw - return a response so frontend can handle it
      return res.status(200).json({
        success: false,
        message: "Unable to verify payment with Chapa. Please check your order status.",
        paymentStatus: order.paymentStatus || "pending",
        order: order,
        error: chapaError.response?.data || chapaError.message
      });
    }

    // Check payment status - Chapa returns status in different possible locations
    const paymentStatus = chapaResponse.data?.data?.status || 
                         chapaResponse.data?.status || 
                         chapaResponse.data?.message?.status;

    console.log('Payment status from Chapa:', paymentStatus);

    // Update order status based on payment status
    if (paymentStatus === "success" || paymentStatus === "successful") {
      order.paymentStatus = "paid";
      order.status = "processing"; // Move from pending to processing after payment
      await order.save();

      console.log('Payment verified successfully, order updated:', {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status
      });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentStatus: "paid",
        order: order,
        paymentData: chapaResponse.data?.data || chapaResponse.data,
      });
    } else {
      // Payment failed or pending
      order.paymentStatus = paymentStatus === "failed" ? "failed" : "pending";
      await order.save();

      console.log('Payment verification failed or pending:', paymentStatus);

      res.status(200).json({
        success: false,
        message: paymentStatus === "failed" ? "Payment verification failed" : "Payment is still pending",
        paymentStatus: paymentStatus === "failed" ? "failed" : "pending",
        paymentData: chapaResponse.data?.data || chapaResponse.data,
      });
    }
  } catch (error) {
    console.error("========== CHAPA VERIFY ERROR ==========");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("Response Status:", error.response?.status);
    console.error("Response Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("======================================");
    
    // Try to return order status even on error
    try {
      const order = await Order.findOne({ paymentReference: tx_ref })
        .populate('user', 'name email');
      
      if (order) {
        return res.status(200).json({
          success: false,
          message: "Payment verification encountered an error. Please check your order status.",
          paymentStatus: order.paymentStatus || "pending",
          order: order,
        });
      }
    } catch (orderError) {
      console.error("Error fetching order in error handler:", orderError);
    }
    
    res.status(500).json({ 
      success: false,
      message: "Payment verification failed",
      error: error.response?.data || error.message 
    });
  }
});

/**
 * @route POST /api/payments/chapa/webhook
 * @desc Chapa webhook callback (no auth required - Chapa calls this)
 */
router.post("/chapa/webhook", async (req, res) => {
  try {
    const { tx_ref, status } = req.body;
    
    console.log('Chapa webhook received:', { tx_ref, status, body: req.body });
    
    if (!tx_ref) {
      return res.status(400).json({ message: "Transaction reference is required" });
    }

    // Find order by payment reference
    const order = await Order.findOne({ paymentReference: tx_ref })
      .populate('user', 'name email');

    if (!order) {
      console.error('Order not found for webhook tx_ref:', tx_ref);
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order based on webhook status
    if (status === "success" || status === "successful") {
      order.paymentStatus = "paid";
      order.status = "processing";
      await order.save();
      console.log('Order updated via webhook:', order._id);
    } else if (status === "failed") {
      order.paymentStatus = "failed";
      await order.save();
    }

    // Always return 200 to Chapa to acknowledge receipt
    res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.error("Webhook error:", error);
    // Still return 200 to Chapa to prevent retries
    res.status(200).json({ message: "Webhook received but processing failed" });
  }
});

export default router;
