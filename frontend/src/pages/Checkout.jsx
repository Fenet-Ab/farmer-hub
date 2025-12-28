import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaSpinner, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.cart && response.data.cart.items && response.data.cart.items.length > 0) {
        setCart(response.data);
      } else {
        navigate('/cart');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      setError('Please enter your shipping address');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      const token = localStorage.getItem('token');

      // Step 1: Create order from cart
      console.log('Creating order from cart...');
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/create`,
        { shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data?.order?._id) {
        throw new Error('Order creation failed: Invalid response from server');
      }

      const orderId = orderResponse.data.order._id;
      console.log('Order created successfully:', orderId);

      // Step 2: Initialize payment
      console.log('Initializing payment for order:', orderId);
      const paymentResponse = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/chapa/init`,
        { orderId, shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Payment initialization response:', paymentResponse.data);

      // Step 3: Redirect to payment gateway
      if (paymentResponse.data.checkout_url) {
        // Refresh cart count after order creation
        refreshCartCount();
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Redirect to Chapa payment page
        window.location.href = paymentResponse.data.checkout_url;
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      
      // Handle error message - convert objects to strings
      let errorMessage = 'Checkout failed. Please try again.';
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        // If error is an object, stringify it properly
        if (typeof err.response.data.error === 'object') {
          // Extract meaningful error messages from Chapa API validation errors
          const errorObj = err.response.data.error;
          if (errorObj.message) {
            errorMessage = errorObj.message;
          } else if (errorObj.email) {
            errorMessage = `Email error: ${Array.isArray(errorObj.email) ? errorObj.email.join(', ') : errorObj.email}`;
          } else if (errorObj.amount) {
            errorMessage = `Amount error: ${Array.isArray(errorObj.amount) ? errorObj.amount.join(', ') : errorObj.amount}`;
          } else {
            // Convert object to readable string
            errorMessage = Object.entries(errorObj)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        } else {
          errorMessage = err.response.data.error;
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setProcessing(false);
      
      // Log detailed error for debugging
      if (err?.response?.status === 500 && err?.response?.data?.error) {
        console.error('Payment initialization error details:', JSON.stringify(err.response.data.error, null, 2));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.cart || !cart.cart.items || cart.cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FaArrowLeft /> Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <FaArrowLeft /> Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="text-red-800 text-sm font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-600" />
                Shipping Address
              </h2>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your complete shipping address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                rows={4}
                required
              />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-4">
                {cart.cart.items.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <img
                      src={item.product.image || 'https://via.placeholder.com/150'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      ${((item.product.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-emerald-600" />
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.cart.items.length})</span>
                  <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-emerald-600">${cart.totalPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={processing || !shippingAddress.trim()}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard /> Proceed to Payment
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-4 text-center">
                You will be redirected to Chapa payment gateway
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

