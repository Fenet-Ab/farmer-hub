import React from 'react'
import { Link } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <nav className='fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <span className='text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>Admin</span>
          <span className='text-sm text-gray-500'>Dashboard</span>
        </div>
        <div className='flex items-center gap-4 text-sm'>
          <Link to='/admin-dashboard' className='text-gray-700 hover:text-emerald-600'>Overview</Link>
          <Link to='/products' className='text-gray-700 hover:text-emerald-600'>Products</Link>
          <Link to='/user' className='text-gray-700 hover:text-emerald-600'>Users</Link>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
