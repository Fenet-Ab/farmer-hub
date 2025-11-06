import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaBars,
  FaPlus
} from 'react-icons/fa'
import AdminSidebar from '../../components/Sidebar/AdminSidebar'

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const stats = useMemo(
    () => ({
      totalUsers: 1024,
      totalProducts: 348,
      totalOrders: 1290,
      revenue: 78450
    }),
    []
  )

  const recentUsers = useMemo(
    () => [
      { id: 'u1', name: 'Alemu Bekele', email: 'alemu@example.com' },
      { id: 'u2', name: 'Saron Tadesse', email: 'saron@example.com' },
      { id: 'u3', name: 'Musa Abdi', email: 'musa@example.com' },
      { id: 'u4', name: 'Hanna Desta', email: 'hanna@example.com' }
    ],
    []
  )

  const recentProducts = useMemo(
    () => [
      { id: 'p1', name: 'Organic Fertilizer', category: 'Fertilizers' },
      { id: 'p2', name: 'Diazinon 60% EC', category: 'Pesticides' },
      { id: 'p3', name: 'Fresh Tomatoes (10kg)', category: 'Farm Products' },
      { id: 'p4', name: 'Premium Coffee Beans', category: 'Coffee' }
    ],
    []
  )

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50">
      {/* Sidebar (fixed left) */}
      <div
        className={`fixed left-0 top-[40px] h-[calc(100vh-40px)] w-64 z-40 overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <AdminSidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 w-full md:ml-64 p-4 md:p-8`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 md:hidden rounded-lg bg-gray-600 text-white"
          >
            <FaBars />
          </button>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Users</p>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <FaUsers />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-800">
              {stats.totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Products</p>
              <span className="p-2 rounded-lg bg-lime-50 text-lime-600">
                <FaBox />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-800">
              {stats.totalProducts.toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Orders</p>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <FaShoppingCart />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-800">
              {stats.totalOrders.toLocaleString()}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Revenue</p>
              <span className="p-2 rounded-lg bg-lime-50 text-lime-600">
                <FaDollarSign />
              </span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-gray-800">
              ${stats.revenue.toLocaleString()}
            </p>
          </div>
        </section>

        {/* Two Columns: Recent + Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Latest Users</h2>
                <Link
                  to="/user-dashboard"
                  className="text-emerald-700 hover:underline text-sm"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{u.name}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">
                      User
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Latest Products</h2>
                <Link
                  to="/products"
                  className="text-emerald-700 hover:underline text-sm"
                >
                  Manage
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentProducts.map((p) => (
                  <div
                    key={p.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.category}</p>
                    </div>
                    <Link
                      to="/products"
                      className="text-sm text-emerald-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/products"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span className="p-2 rounded-lg bg-emerald-600 text-white">
                    <FaPlus />
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">Create Product</p>
                    <p className="text-xs text-gray-500">
                      Add fertilizers, pesticides, or farm products
                    </p>
                  </div>
                </Link>
                <Link
                  to="/user-dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span className="p-2 rounded-lg bg-emerald-600 text-white">
                    <FaUsers />
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">Manage Users</p>
                    <p className="text-xs text-gray-500">
                      View, verify, or disable accounts
                    </p>
                  </div>
                </Link>
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span className="p-2 rounded-lg bg-emerald-600 text-white">
                    <FaShoppingCart />
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">View Orders</p>
                    <p className="text-xs text-gray-500">
                      Track fulfillment and statuses
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold mb-2">Notes</h2>
              <p className="text-sm text-gray-600">
                This dashboard uses placeholder data. Wire it to your APIs for
                live metrics.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
