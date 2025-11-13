import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaEdit, FaCheckCircle, FaTimesCircle, FaTruck, FaClock, FaBox } from 'react-icons/fa'

const OrderTable = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingStatus, setEditingStatus] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const list = res?.data?.orders || []
      setOrders(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId) => {
    if (!selectedStatus) return
    try {
      setUpdating(true)
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchOrders()
      setEditingStatus(null)
      setSelectedStatus('')
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update order status')
    } finally {
      setUpdating(false)
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

  return (
    <div className='p-6 mt-10'>
      <h1 className='text-2xl font-semibold mb-4 text-green-700'>All Orders</h1>

      {loading && <div className='text-gray-600'>Loading orders...</div>}
      {error && !loading && <div className='text-red-600 mb-4'>{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className='text-gray-600'>No orders found.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className='overflow-x-auto border border-gray-200 rounded-xl bg-white'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Order ID</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Buyer</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Items</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Total Amount</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Status</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Date</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {orders.map((order) => (
                <tr key={order._id} className='hover:bg-emerald-50/40'>
                  <td className='px-4 py-3 text-gray-900 font-medium text-sm'>
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className='px-4 py-3'>
                    <div>
                      <p className='font-medium text-gray-900'>{order.user?.name || 'N/A'}</p>
                      <p className='text-xs text-gray-500'>{order.user?.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='space-y-1'>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className='text-sm'>
                          <span className='font-medium text-gray-900'>
                            {item.product?.name || 'Unknown Product'}
                          </span>
                          <span className='text-gray-500'> × {item.quantity}</span>
                          <span className='text-gray-500 text-xs block'>
                            ${item.price?.toFixed(2) || '0.00'} each
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <span className='font-semibold text-gray-900'>
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    {editingStatus === order._id ? (
                      <div className='flex items-center gap-2'>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className='text-xs border border-gray-300 rounded px-2 py-1'
                          disabled={updating}
                        >
                          <option value=''>Select status</option>
                          <option value='pending'>Pending</option>
                          <option value='processing'>Processing</option>
                          <option value='shipped'>Shipped</option>
                          <option value='delivered'>Delivered</option>
                          <option value='cancelled'>Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleStatusUpdate(order._id)}
                          disabled={updating || !selectedStatus}
                          className='px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50'
                        >
                          {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingStatus(null)
                            setSelectedStatus('')
                          }}
                          disabled={updating}
                          className='px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50'
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        {getStatusBadge(order.status)}
                        <button
                          onClick={() => {
                            setEditingStatus(order._id)
                            setSelectedStatus(order.status)
                          }}
                          className='p-1 text-gray-600 hover:text-emerald-600 transition-colors'
                          title='Update status'
                        >
                          <FaEdit className='w-3 h-3' />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className='px-4 py-3 text-gray-700 text-sm'>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className='px-4 py-3'>
                    <button
                      onClick={() => {
                        setEditingStatus(order._id)
                        setSelectedStatus(order.status)
                      }}
                      className='px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors'
                      disabled={editingStatus === order._id}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OrderTable
