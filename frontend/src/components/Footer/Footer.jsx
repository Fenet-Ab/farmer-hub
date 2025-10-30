import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GiWheat } from 'react-icons/gi'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className='w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-6 py-12 md:py-16'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8'>
          {/* About Section */}
          <div className='space-y-4'>
            <Link to='/' className='inline-flex items-center gap-2 text-2xl font-extrabold tracking-wide'>
              <GiWheat className='h-7 w-7 text-emerald-400' />
              <span className='bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent'>
                LIMAT
              </span>
            </Link>
            <p className='text-gray-400 leading-relaxed'>
              Your trusted partner in farming. Connecting farmers with quality products for sustainable agriculture and prosperous harvests.
            </p>
            {/* Social Media Links */}
            <div className='flex gap-4 pt-4'>
              <a href='#' className='p-2 bg-emerald-600 rounded-lg hover:bg-lime-500 transition-colors duration-200'>
                <FaFacebook />
              </a>
              <a href='#' className='p-2 bg-emerald-600 rounded-lg hover:bg-lime-500 transition-colors duration-200'>
                <FaTwitter />
              </a>
              <a href='#' className='p-2 bg-emerald-600 rounded-lg hover:bg-lime-500 transition-colors duration-200'>
                <FaInstagram />
              </a>
              <a href='#' className='p-2 bg-emerald-600 rounded-lg hover:bg-lime-500 transition-colors duration-200'>
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-bold text-emerald-400 mb-4'>Quick Links</h3>
            <ul className='space-y-3'>
              <li>
                <Link to='/' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/products' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Products
                </Link>
              </li>
              <li>
                <Link to='/about' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  About Us
                </Link>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Blog
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Products Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-bold text-emerald-400 mb-4'>Our Products</h3>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Fertilizers
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Pesticides
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Fresh Vegetables
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Premium Coffee
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
                  Farm Products
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className='space-y-4'>
            <h3 className='text-lg font-bold text-emerald-400 mb-4'>Contact Us</h3>
            <ul className='space-y-3 mb-6'>
              <li className='flex items-center gap-3 text-gray-400'>
                <FaMapMarkerAlt className='text-lime-400' />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className='flex items-center gap-3 text-gray-400'>
                <FaPhone className='text-lime-400' />
                <span>+251 911 234 567</span>
              </li>
              <li className='flex items-center gap-3 text-gray-400'>
                <FaEnvelope className='text-lime-400' />
                <span>info@limat.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className='font-semibold mb-3 text-gray-200'>Newsletter</h4>
              <p className='text-sm text-gray-400 mb-3'>Subscribe for farming tips and offers</p>
              <form onSubmit={handleNewsletterSubmit} className='space-y-2'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Your email'
                  className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  required
                />
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200'
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-700 my-8'></div>

        {/* Bottom Bar */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-gray-400 text-sm text-center md:text-left'>
            © {new Date().getFullYear()} LIMAT. All rights reserved.
          </p>
          <div className='flex gap-6 text-sm'>
            <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
              Privacy Policy
            </a>
            <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
              Terms & Conditions
            </a>
            <a href='#' className='text-gray-400 hover:text-lime-400 transition-colors duration-200'>
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer