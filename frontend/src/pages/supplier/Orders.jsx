import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTruck, 
  FaClock, 
  FaBox,
  FaEdit,
  FaSpinner,
  FaDollarSign,
  FaUser
} from 'react-icons/fa'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/supplier/my-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setOrders(res.data?.orders || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleDeliveryStatusUpdate = async (orderId, isDelivered) => {
    try {
      setUpdating(orderId)
      const token = localStorage.getItem('token')
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/update-delivery/${orderId}`,
        { isDelivered },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      await fetchOrders()
      setSelectedDeliveryStatus('')
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update delivery status')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: FaClock },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: FaBox },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: FaTruck },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: FaTimesCircle },
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentConfig = {
      paid: { bg: 'bg-green-100', text: 'text-green-700', icon: FaCheckCircle, label: 'Paid' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: FaClock, label: 'Pending' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', icon: FaTimesCircle, label: 'Failed' },
    }
    const config = paymentConfig[paymentStatus] || paymentConfig.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="text-6xl text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Orders containing your products</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600">Orders containing your products will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-emerald-50 to-lime-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        {getStatusBadge(order.status)}
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaUser className="w-4 h-4" />
                          <span className="font-medium">{order.user?.name || 'Customer'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaDollarSign className="w-4 h-4" />
                          <span className="font-bold text-emerald-600">
                            Your Revenue: ${order.supplierTotal?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Status Update */}
                    <div className="flex items-center gap-3">
                      {updating === order._id ? (
                        <div className="flex items-center gap-2">
                          <FaSpinner className="animate-spin text-emerald-600" />
                          <span className="text-sm text-gray-600">Updating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Delivery:</label>
                          <select
                            value={order.isDelivered ? 'delivered' : 'pending'}
                            onChange={(e) => {
                              const isDelivered = e.target.value === 'delivered'
                              handleDeliveryStatusUpdate(order._id, isDelivered)
                            }}
                            className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            disabled={updating === order._id}
                          >
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    Your Products ({order.supplierItems?.length || 0} item{order.supplierItems?.length !== 1 ? 's' : ''})
                  </h4>
                  <div className="space-y-3">
                    {order.supplierItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64'
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.product?.name || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-600">
                            Category: {item.product?.category || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Quantity: {item.quantity} × ${item.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-lg font-bold text-emerald-600">
                            ${((item.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total Order Amount</p>
                        <p className="text-xs text-gray-500">(All items in order)</p>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-sm font-semibold text-emerald-700">Your Revenue</p>
                        <p className="text-xs text-gray-500">(From your products only)</p>
                      </div>
                      <p className="text-2xl font-extrabold text-emerald-600">
                        ${order.supplierTotal?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Shipping Address
                      </p>
                      <p className="text-sm text-gray-700">{order.shippingAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
