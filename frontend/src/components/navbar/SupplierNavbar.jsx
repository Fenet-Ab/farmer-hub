import React from 'react'
import { Link } from 'react-router-dom'

const SupplierNavbar = () => {
  return (
    <nav className='fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50'>
      <div className='w-full h-14 flex items-center justify-between'>
        <div className='flex items-center gap-3 pl-4 sm:pl-6 lg:pl-8'>
          <span className='text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>Supplier</span>
          {/* <span className='text-sm text-gray-500'>Dashboard</span> */}
        </div>
        <div className='flex items-center gap-4 text-sm pr-4 sm:pr-6 lg:pr-8'>
          <Link to='/supplier-dashboard' className='text-gray-700 hover:text-emerald-600'>Overview</Link>
          <Link to='/products' className='text-gray-700 hover:text-emerald-600'>Products</Link>
        </div>
      </div>
    </nav>
  )
}

export default SupplierNavbar
