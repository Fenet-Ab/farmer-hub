import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserSidebar from '../../components/Sidebar/UserSidebar'
import axios from 'axios'
import {
  FaShoppingCart,
  FaBox,
  FaDollarSign,
  FaClipboardList,
  FaBars,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaTimes
} from 'react-icons/fa'

const User = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Default closed on mobile
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState(null)
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

      const ordersRes = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(ordersRes.data?.orders || [])

      try {
        const cartRes = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (cartRes.data?.cart) setCart(cartRes.data)
      } catch (cartErr) { setCart(null) }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard data')
    } finally { setLoading(false) }
  }

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    cartItems: cart?.cart?.items?.length || 0,
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
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${config.bg} ${config.text}`}>
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

      {/* 2. Responsive Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full z-[110] bg-white shadow-2xl transition-transform duration-300 w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:z-30 md:top-20 md:h-[calc(100vh-80px)] md:bg-transparent md:shadow-none
      `}>
        <div className="p-4 md:hidden flex justify-between items-center border-b">
          <span className="font-bold text-emerald-600">Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400"><FaTimes /></button>
        </div>
        <UserSidebar />
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 w-full md:ml-64 px-4 py-6 md:px-10 md:py-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
              Hello, <span className="text-emerald-600">{userInfo?.name?.split(' ')[0] || 'User'}</span>!
            </h1>
            <p className="text-sm text-slate-500 font-medium">Here's your farm activity summary.</p>
          </div>
          
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 shadow-sm active:scale-90 transition-transform"
          >
            <FaBars />
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" /></div>
        ) : (
          <div className="space-y-8">
            
            {/* KPI Grid - Horizontal Scroll on Small Screens */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[
                { label: 'Total Orders', val: stats.totalOrders, icon: <FaClipboardList />, color: 'emerald' },
                { label: 'Total Spent', val: `$${stats.totalSpent.toFixed(2)}`, icon: <FaDollarSign />, color: 'lime' },
                { label: 'In Cart', val: stats.cartItems, icon: <FaShoppingCart />, color: 'blue' },
                { label: 'Pending', val: stats.pendingOrders, icon: <FaClock />, color: 'orange' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-lg md:text-2xl font-black text-slate-900 leading-tight mt-1">{item.val}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Content Split: Orders & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Orders List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Recent Activity</h2>
                    <Link to="/orders" className="text-xs font-bold text-emerald-600 hover:underline">See All</Link>
                  </div>
                  
                  <div className="divide-y divide-slate-50">
                    {orders.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 text-sm">No orders yet.</div>
                    ) : (
                      orders.slice(0, 4).map((order) => (
                        <div key={order._id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-mono mb-1">#{order._id.slice(-6).toUpperCase()}</span>
                              <span className="font-bold text-slate-800 text-sm line-clamp-1">
                                {order.items?.[0]?.product?.name || 'Order Harvest'}
                              </span>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="font-black text-slate-900">${order.totalAmount?.toFixed(2)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 px-2">Quick Links</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { to: '/products', label: 'Marketplace', sub: 'Buy supplies', icon: <FaBox /> },
                    { to: '/cart', label: 'My Cart', sub: `${stats.cartItems} Items`, icon: <FaShoppingCart /> },
                    { to: '/profile', label: 'Settings', sub: 'Account info', icon: <FaCheckCircle /> }
                  ].map((link, idx) => (
                    <Link 
                      key={idx} 
                      to={link.to} 
                      className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-300 transition-all group shadow-sm active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                        {link.icon}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{link.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{link.sub}</p>
                      </div>
                      <FaArrowRight className="ml-auto text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default User