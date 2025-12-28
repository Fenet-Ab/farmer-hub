import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const tx_ref = searchParams.get('tx_ref');

  useEffect(() => {
    if (tx_ref) {
      verifyPayment();
    } else {
      setError('Payment reference not found');
      setVerifying(false);
    }
  }, [tx_ref]);

  const verifyPayment = async (retryCount = 0) => {
    if (retryCount > 5) {
      setError('Payment verification timed out. Please check your order status manually.');
      setPaymentStatus('failed');
      setVerifying(false);
      return;
    }

    try {
      setVerifying(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const timestamp = Date.now();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/chapa/verify/${tx_ref}?t=${timestamp}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        }
      );

      if (!response.data) {
        if (retryCount < 2) {
          setTimeout(() => verifyPayment(retryCount + 1), 2000);
          return;
        }
        setError('Invalid response from server');
        setPaymentStatus('failed');
        setVerifying(false);
        return;
      }

      if (response.data.success) {
        setPaymentStatus('success');
        setOrder(response.data.order);
        setVerifying(false);

        // Refresh cart count and notify other components
        refreshCartCount();
        window.dispatchEvent(new Event('cartUpdated'));
        // Dispatch event to refresh orders list
        window.dispatchEvent(new Event('ordersUpdated'));

        setTimeout(() => {
          const role = localStorage.getItem('role');
          if (role === 'admin') navigate('/admin-dashboard');
          else if (role === 'supplier') navigate('/supplier-dashboard');
          else navigate('/user-dashboard');
        }, 3000);
      } else {
        if (response.data.paymentStatus === 'pending' && retryCount < 3) {
          setTimeout(() => verifyPayment(retryCount + 1), 2000);
          return;
        }
        setPaymentStatus('failed');
        setError(response.data.message || 'Payment verification failed');
        setVerifying(false);
      }
    } catch (err) {
      if (retryCount < 3 && (err.code === 'ECONNABORTED' || err.response?.status === 500)) {
        setTimeout(() => verifyPayment(retryCount + 1), 2000);
        return;
      }
      setError(err?.response?.data?.message || err?.response?.data?.error || 'Failed to verify payment');
      setPaymentStatus('failed');
      setVerifying(false);
    }
  };

  if (verifying) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center p-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
        <FaSpinner className="text-6xl text-emerald-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
        <p className="text-gray-600">Please wait while we verify your payment...</p>
      </div>
    </div>
  );

  if (error && paymentStatus !== 'success') return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center p-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Verification Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/orders')} className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">View Orders</button>
          <button onClick={() => navigate('/products')} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-5xl text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Your order has been confirmed and payment has been received.</p>
          </div>
          {order && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FaShoppingBag className="text-emerald-600" /> Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Order ID:</span><span className="font-semibold text-gray-800">{order._id}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Payment Reference:</span><span className="font-semibold text-gray-800">{order.paymentReference}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Total Amount:</span><span className="font-bold text-emerald-600">${order.totalAmount?.toFixed(2) || '0.00'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold uppercase">{order.status}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Payment Status:</span><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase">{order.paymentStatus}</span></div>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => {
              const role = localStorage.getItem('role');
              if (role === 'admin') navigate('/admin-dashboard');
              else if (role === 'supplier') navigate('/supplier-dashboard');
              else navigate('/user-dashboard');
            }} className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">Go to Dashboard <FaArrowRight /></button>
            <button onClick={() => navigate('/orders')} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">View My Orders</button>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">Redirecting to dashboard in 3 seconds...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
