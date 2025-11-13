import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SupplierSidebar from '../../components/Sidebar/SupplierSidebar'
import axios from 'axios'
import {
  FaBars,
  FaBox,
  FaDollarSign,
  FaShoppingCart,
 
  FaPlus,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle
} from 'react-icons/fa'

const SupplierDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')

      // Fetch user profile
      const profileRes = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserInfo(profileRes.data)

      // Fetch supplier's products
      const productsRes = await axios.get('http://localhost:5000/api/products/supplier/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(productsRes.data?.products || [])

      // Fetch supplier's orders
      const ordersRes = await axios.get('http://localhost:5000/api/orders/supplier/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(ordersRes.data?.orders || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.supplierTotal || 0), 0),
    pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'processing').length
  }

  const recentProducts = products.slice(0, 5)
  const recentOrders = orders.slice(0, 5)

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
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-[40px] h-[calc(100vh-40px)] z-40 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <SupplierSidebar />
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 w-full md:ml-64 p-4 md:p-8`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back{userInfo?.name ? `, ${userInfo.name}` : ''}!</h1>
            <p className="text-gray-600 mt-1">Manage your products and track your sales</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 md:hidden rounded-lg bg-gray-600 text-white"
          >
            <FaBars />
          </button>
        </div>

        {loading && (
          <div className="text-gray-600">Loading dashboard...</div>
        )}

        {error && !loading && (
          <div className="text-red-600 mb-4 bg-red-50 p-4 rounded-lg">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total Products</p>
                  <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <FaBox />
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-gray-800">
                  {stats.totalProducts}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <span className="p-2 rounded-lg bg-lime-50 text-lime-600">
                    <FaShoppingCart />
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-gray-800">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <FaDollarSign />
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-gray-800">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <span className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                    <FaClock />
                  </span>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-gray-800">
                  {stats.pendingOrders}
                </p>
              </div>
            </section>

            {/* Two Columns: Recent Products + Recent Orders */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Products */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Recent Products</h2>
                    <Link
                      to="/products"
                      className="text-emerald-700 hover:underline text-sm flex items-center gap-1"
                    >
                      View all <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {recentProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaBox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No products yet</p>
                      <Link
                        to="/add-products"
                        className="text-emerald-700 hover:underline text-sm mt-2 inline-block"
                      >
                        Add your first product →
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentProducts.map((product) => (
                        <div
                          key={product._id}
                          className="py-3 flex items-center justify-between hover:bg-emerald-50/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {product.image && (
                              <img
                                src={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50'
                                }}
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                ${product.price?.toFixed(2)} • Qty: {product.quantity || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Recent Orders</h2>
                    <Link
                      to="/orders"
                      className="text-emerald-700 hover:underline text-sm flex items-center gap-1"
                    >
                      View all <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No orders yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {recentOrders.map((order) => (
                        <div
                          key={order._id}
                          className="py-3 flex items-center justify-between hover:bg-emerald-50/30 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-medium text-gray-800">
                                Order #{order._id.slice(-6).toUpperCase()}
                              </p>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-gray-500">
                              {order.user?.name || 'Customer'} • {order.supplierItems?.length || 0} item(s)
                            </p>
                            <p className="text-sm font-semibold text-emerald-700 mt-1">
                              Revenue: ${order.supplierTotal?.toFixed(2) || '0.00'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      to="/add-products"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="p-2 rounded-lg bg-emerald-600 text-white">
                        <FaPlus />
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">Add Product</p>
                        <p className="text-xs text-gray-500">List a new product</p>
                      </div>
                    </Link>
                    <Link
                      to="/products"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="p-2 rounded-lg bg-emerald-600 text-white">
                        <FaBox />
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">My Products</p>
                        <p className="text-xs text-gray-500">Manage your listings</p>
                      </div>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="p-2 rounded-lg bg-emerald-600 text-white">
                        <FaShoppingCart />
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">View Orders</p>
                        <p className="text-xs text-gray-500">Track your sales</p>
                      </div>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <span className="p-2 rounded-lg bg-emerald-600 text-white">
                        <FaCheckCircle />
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">My Profile</p>
                        <p className="text-xs text-gray-500">Manage account</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {stats.totalProducts === 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-emerald-800 mb-2">Get Started</h3>
                    <p className="text-xs text-emerald-700 mb-3">
                      Start selling by adding your first product
                    </p>
                    <Link
                      to="/add-products"
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                    >
                      Add Product <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default SupplierDashboard
