import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaClipboardList
} from 'react-icons/fa'

const UserSidebar = () => {
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
    <aside className={`bg-white   h-full mt-4 border-r border-gray-200`}>
      <div className={`transition-all duration-300  ${collapsed ? 'w-16' : 'w-64'} h-full overflow-hidden`}>
        {/* Header */}
        <div className='p-4 flex items-center justify-between'>
          {!collapsed && (
            <h1 className='text-base font-extrabold text-green-800 underline'>User Menu</h1>
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

        {/* Navigation Links */}
        <nav className='p-2 space-y-2'>
          <Link
            to='/'
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
              isActive('/')
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <FaHome className='w-4 h-4 flex-shrink-0' />
            {!collapsed && (
              <div className='flex-1'>
                <span>Home</span>
                {isActive('/') && (
                  <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                )}
              </div>
            )}
          </Link>

          <Link
            to='/products'
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
              isActive('/products')
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <FaBox className='w-4 h-4 flex-shrink-0' />
            {!collapsed && (
              <div className='flex-1'>
                <span>Products</span>
                {isActive('/products') && (
                  <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                )}
              </div>
            )}
          </Link>

          <Link
            to='/cart'
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
              isActive('/cart')
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <FaShoppingCart className='w-4 h-4 flex-shrink-0' />
            {!collapsed && (
              <div className='flex-1'>
                <span>Cart</span>
                {isActive('/cart') && (
                  <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                )}
              </div>
            )}
          </Link>

          <Link
            to='/orders'
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
              isActive('/orders')
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <FaClipboardList className='w-4 h-4 flex-shrink-0' />
            {!collapsed && (
              <div className='flex-1'>
                <span>My Orders</span>
                {isActive('/orders') && (
                  <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                )}
              </div>
            )}
          </Link>

          <Link
            to='/profile'
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
              isActive('/profile')
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-gray-700 hover:bg-emerald-50'
            }`}
          >
            <FaUser className='w-4 h-4 flex-shrink-0' />
            {!collapsed && (
              <div className='flex-1'>
                <span>Profile</span>
                {isActive('/profile') && (
                  <div className='absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-500 rounded-full'></div>
                )}
              </div>
            )}
          </Link>
        </nav>

        {/* Logout Button */}
        <div className='absolute bottom-4 left-4 right-4'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors'
          >
            <FaSignOutAlt className='w-4 h-4 flex-shrink-0' />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default UserSidebar
