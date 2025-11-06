import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FaClipboardList,
  FaBox,
  FaUsers,
  FaUserShield,
  FaShoppingCart,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaUser,
  FaPlaceOfWorship,
  FaPlusCircle
} from 'react-icons/fa'

const AdminSidebar = ({ isOpen = true }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`bg-white border-r border-gray-200 h-full`}> 
      <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} h-full overflow-hidden`}> 
        {/* Header */}
        <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
          {!collapsed && (
            <h1 className='text-base font-extrabold text-gray-800'>Admin Menu</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className='p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors'
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <FaChevronRight className='w-4 h-4' />
            ) : (
              <FaChevronLeft className='w-4 h-4' />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className='p-3'>
          <ul className='space-y-2'>
            <li>
              <Link
                to='/admin-dashboard'
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                  isActive('/admin-dashboard')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <FaClipboardList className='w-4 h-4' />
                {!collapsed && (
                  <div className='flex-1'>
                    <span>Overview</span>
                    {isActive('/admin-dashboard') && (
                      <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                    )}
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to='/products'
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                  isActive('/products')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <FaBox className='w-4 h-4' />
                {!collapsed && (
                  <div className='flex-1'>
                    <span>Products</span>
                    {isActive('/products') && (
                      <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                    )}
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to='/user-dashboard'
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                  isActive('/user-dashboard')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <FaUsers className='w-4 h-4' />
                {!collapsed && (
                  <div className='flex-1'>
                    <span>Users</span>
                    {isActive('/user-dashboard') && (
                      <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                    )}
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to='/supplier-dashboard'
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                  isActive('/supplier-dashboard')
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <FaUserShield className='w-4 h-4' />
                {!collapsed && (
                  <div className='flex-1'>
                    <span>Suppliers</span>
                    {isActive('/supplier-dashboard') && (
                      <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                    )}
                  </div>
                )}
              </Link>
            </li>
            <li>
              <Link
                to='/admin-dashboard'
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                  false
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <FaShoppingCart className='w-4 h-4' />
                {!collapsed && (
                  <div className='flex-1'>
                    <span>Orders</span>
                  </div>
                )}
              </Link>
              <Link
                to='/profile'
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                  false
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <FaUser className='w-4 h-4' />
                {!collapsed && (
                  <div className='flex-1'>
                    <span>Profile</span>
                  </div>
                )}
              </Link>
              <Link
                to='/create-user'
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                  false
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                <FaPlusCircle className='w-4 h-4' />
                {!collapsed && (
                  <div className='flex-1'>
                    <span>Create User</span>
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA */}
        <div className='px-3'>
          <Link to='/products' className='inline-flex items-center gap-2 w-full px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white justify-center'>
            <FaPlus /> {!collapsed && <span>New Product</span>}
          </Link>
        </div>

        {/* Spacer to allow bottom content visibility */}
        <div className='flex-1'></div>

        {/* Logout */}
        <div className='mt-4 border-t border-gray-200 p-3'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
          >
            <FaSignOutAlt className='w-4 h-4' />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
