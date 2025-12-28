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
  FaTimesCircle,
  FaTimes
} from 'react-icons/fa'

const SupplierDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Default closed on mobile
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

      const profileRes = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserInfo(profileRes.data)

      const productsRes = await axios.get('http://localhost:5000/api/products/supplier/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(productsRes.data?.products || [])

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
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
        <Icon className="w-2.5 h-2.5" />
        {status}
      </span>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-poppins pt-16">
      
      {/* 1. Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Responsive Sidebar Drawer */}
      <aside className={`
        fixed left-0 top-0 h-full z-[110] bg-white shadow-2xl transition-transform duration-300 w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:z-30 md:top-20 md:h-[calc(100vh-80px)] md:bg-transparent md:shadow-none
      `}>
        <div className="p-4 md:hidden flex justify-between items-center border-b">
          <span className="font-bold text-emerald-600 tracking-tighter text-xl">LIMAT Supplier</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400"><FaTimes /></button>
        </div>
        <SupplierSidebar />
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 w-full md:ml-64 px-4 py-6 md:px-10 md:py-8">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
              Supplier <span className="text-emerald-600">Dashboard</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">Welcome back, {userInfo?.name || 'Partner'}</p>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 shadow-sm active:scale-90"
          >
            <FaBars />
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>
        ) : (
          <div className="space-y-8">
            
            {/* KPI Grid - Responsive columns */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[
                { label: 'Products', val: stats.totalProducts, icon: <FaBox />, color: 'emerald' },
                { label: 'Orders', val: stats.totalOrders, icon: <FaShoppingCart />, color: 'blue' },
                { label: 'Revenue', val: `$${stats.totalRevenue.toFixed(2)}`, icon: <FaDollarSign />, color: 'lime' },
                { label: 'Pending', val: stats.pendingOrders, icon: <FaClock />, color: 'orange' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-lg md:text-2xl font-black text-slate-900 leading-tight mt-1">{item.val}</p>
                </div>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Activity Lists */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Recent Products */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Recent Products</h2>
                    <Link to="/products" className="text-xs font-bold text-emerald-600 hover:underline">Manage All</Link>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {products.length === 0 ? (
                      <p className="p-10 text-center text-slate-400 text-sm">No products listed yet.</p>
                    ) : (
                      products.slice(0, 3).map((product) => (
                        <div key={product._id} className="p-4 md:p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                          <img 
                            src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/50'} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                            alt={product.name}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate">{product.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900 text-sm">${product.price?.toFixed(2)}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase">Stock: {product.quantity}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Sales Activity</h2>
                    <Link to="/orders" className="text-xs font-bold text-emerald-600 hover:underline">View Sales</Link>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {orders.length === 0 ? (
                      <p className="p-10 text-center text-slate-400 text-sm">No sales yet.</p>
                    ) : (
                      orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-xs font-mono text-slate-400">ID: ...{order._id.slice(-6).toUpperCase()}</p>
                              <p className="font-bold text-slate-800 text-sm">{order.user?.name || 'Customer'}</p>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="text-sm font-black text-emerald-600">+${order.supplierTotal?.toFixed(2)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Actions */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 px-2">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { to: '/add-products', label: 'Add Product', sub: 'Post new listing', icon: <FaPlus /> },
                    { to: '/products', label: 'Inventory', sub: 'Manage stock', icon: <FaBox /> },
                    { to: '/orders', label: 'Orders', sub: 'Check shipments', icon: <FaShoppingCart /> },
                    { to: '/profile', label: 'Store Profile', sub: 'Update details', icon: <FaCheckCircle /> }
                  ].map((link, idx) => (
                    <Link 
                      key={idx} 
                      to={link.to} 
                      className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-300 transition-all group shadow-sm active:scale-95"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200">
                        {link.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{link.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{link.sub}</p>
                      </div>
                      <FaArrowRight className="ml-auto text-slate-200 group-hover:text-emerald-500 transition-colors" />
                    </Link>
                  ))}
                </div>

                {stats.totalProducts === 0 && (
                  <div className="mt-6 p-6 bg-emerald-600 rounded-[2rem] text-white shadow-xl shadow-emerald-200">
                    <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Getting Started</p>
                    <h4 className="text-lg font-bold leading-tight mb-4">You haven't listed any products yet.</h4>
                    <Link to="/add-products" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight hover:scale-105 transition-transform">
                      Post Product <FaArrowRight />
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SupplierDashboard