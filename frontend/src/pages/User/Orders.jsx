import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/my-orders`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setOrders(res.data.orders);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(); // Initial fetch

        // Listen for custom event dispatched from PaymentSuccess
        const handleOrdersUpdated = () => fetchOrders();
        window.addEventListener('ordersUpdated', handleOrdersUpdated);

        // Cleanup listener on unmount
        return () => window.removeEventListener('ordersUpdated', handleOrdersUpdated);
    }, []);

    if (loading) return <p className="text-center mt-10">Loading orders...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 mt-10">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 && <p className="text-center text-gray-300">You have no orders yet.</p>}

            {orders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4 mb-5 bg-white shadow">

                    {/* Header */}
                    <div className="flex justify-between mb-3">
                        <div>
                            {/* <p className="text-sm text-gray-500">Order ID: {order._id}</p> */}
                            <p className="text-sm">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="text-right">
                            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                                {order.status}
                            </span>
                            <p className="text-xs mt-1">
                                Payment: {order.paymentStatus === 'paid' ? 'Paid ✅' : order.paymentStatus === 'failed' ? 'Failed ❌' : 'Pending ⏳'}
                            </p>
                            <p className="text-xs">
                                Delivery: {order.isDelivered ? 'Delivered 📦' : 'Pending 🚚'}
                            </p>
                        </div>
                    </div>

                    {/* Items */}
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 mb-3">
                            <img
                                src={item.product.image || 'https://via.placeholder.com/150'}
                                alt={item.product.name}
                                className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">${item.price * item.quantity}</p>
                        </div>
                    ))}

                    {/* Total */}
                    <div className="text-right font-bold border-t border-gray-200 pt-2">
                        Total: ${order.totalAmount?.toFixed(2) || '0.00'}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;
