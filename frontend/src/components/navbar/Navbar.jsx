import React from 'react'
import { Link } from 'react-router-dom'
import { GiWheat } from 'react-icons/gi'
import { FaShoppingBasket } from "react-icons/fa";

const Navbar = () => {
  return (
    <div>
        <nav className='w-full border-b border-gray-200'>
          <div className='w-full mx-0 flex items-center justify-between px-2 py-3 relative'>
            <Link to='/' aria-label='Farmer Hub Home' className='group inline-flex items-center gap-2 text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-200'>
              <GiWheat className='h-7 w-7 text-emerald-600 group-hover:text-lime-500 transition-colors duration-200' />
              <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>LIMAT</span>
            </Link>
            <ul className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-6 list-none'>
                <li><Link className='px-3 py-2 hover:text-emerald-600' to='/'>Home</Link></li>
                <li><Link className='px-3 py-2 hover:text-emerald-600' to='/'>Products</Link></li>
                <li><Link className='px-3 py-2 hover:text-emerald-600' to='/'>About</Link></li>
            </ul>
           
            <div className='mr-40 flex gap-4'>
            <FaShoppingBasket size={28} className='text-gray-600' />
            <div>
              <button className='border border-green-500 px-4 py-2  '>
                Login
              </button>
            </div>
         
          </div>
          </div>
          
        </nav>
        
    </div>
  )
}

export default Navbar