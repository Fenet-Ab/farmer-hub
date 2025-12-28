import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GiWheat } from 'react-icons/gi'
import { FaBars, FaTimes, FaGlobe, FaShoppingCart, FaUser } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()


  const navigate = useNavigate()
  const languageRef = useRef(null)
  const profileRef = useRef(null)
  const { t, i18n } = useTranslation()
  const { cartCount } = useCart()

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setIsLoggedIn(false)
    setIsProfileMenuOpen(false)
    navigate('/login')
  }

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen)

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang)
    setIsLanguageMenuOpen(false)
    if (lang === 'Afan Oromo') i18n.changeLanguage('om')
    else if (lang === 'Amharic') i18n.changeLanguage('am')
    else i18n.changeLanguage('en')
  }

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path) => location.pathname === path
  // Fetch profile picture
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setProfilePictureUrl(null)
      return
    }

    const fetchProfilePic = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile-picture', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.profilePic) {
          setProfilePictureUrl(res.data.profilePic); // Cloudinary URL
        } else {
          setProfilePictureUrl(null);
        }

      } catch (err) {
        console.error('Failed to load profile picture:', err);
        setProfilePictureUrl(null);
      }
    };

    fetchProfilePic();

    // Listen for profile updates
    const handleProfileUpdate = () => fetchProfilePic();
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };

  }, [isLoggedIn]);

  return (
    <nav className='fixed top-0 left-0 w-full border-b border-gray-200 font-poppins bg-white z-50'>
      {/* Desktop Navbar */}
      <div className='hidden md:flex w-full items-center justify-between px-6 py-4 text-[17px] font-medium relative'>
        {/* Logo */}
        <Link
          to='/'
          aria-label='Farmer Hub Home'
          className='group inline-flex items-center gap-2 text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform duration-200'
        >
          <GiWheat className='h-7 w-7 text-emerald-600 group-hover:text-lime-500 transition-colors duration-200' />
          <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>LIMAT</span>
        </Link>

        {/* Center Links */}
        <ul className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 list-none  '>
          {[{ name: t('home'), path: '/' }, { name: t('products'), path: '/products' }, { name: t('about'), path: '/about' }, { name: t('Dashboard'), path: '/user-dashboard' }].map(
            (item) => (
              <li key={item.path} className='relative group'>
                <Link
                  to={item.path}
                  className={`px-3 py-2 transition-colors ${isActive(item.path) ? 'text-emerald-600 font-semibold' : 'text-gray-700 hover:text-emerald-600'
                    }`}
                >
                  {item.name}
                </Link>
                <span
                  className={`absolute left-0 bottom-0 w-0 h-[2px] bg-emerald-600 rounded-full transition-all duration-300 group-hover:w-full ${isActive(item.path) ? 'w-full' : ''
                    }`}
                ></span>
              </li>
            )
          )}
        </ul>

        {/* Right side */}
        <div className='mr-8 flex gap-4 items-center relative z-[100]'>
          {/* Language Selector */}
          <div className='relative' ref={languageRef}>
            <button
              onClick={toggleLanguageMenu}
              className='flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors'
            >
              <FaGlobe size={20} />
              <span className='text-[15px]'>{selectedLanguage}</span>
            </button>

            {isLanguageMenuOpen && (
              <div className='absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-md py-2 z-[1100] pointer-events-auto'>
                {['Afan Oromo', 'English', 'Amharic'].map((lang) => (
                  <button
                    key={lang}
                    onClick={(e) => {
                      e.stopPropagation() // Prevent closing before selection
                      handleLanguageSelect(lang)
                    }}
                    className={`block  text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 ${selectedLanguage === lang ? 'font-semibold text-emerald-600' : ''
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <>
              <Link to="/cart" className="relative">
                <FaShoppingCart size={24} className='text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors' />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className='relative' ref={profileRef}>
                <button
                  onClick={toggleProfileMenu}
                  className='p-2 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors'
                >
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt='Profile'
                      className='h-6 w-6 rounded-full object-cover'
                    />
                  ) : (
                    <FaUser className='text-gray-600' />
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className='absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-md  py-2 z-[1100] pointer-events-auto'>
                    <Link
                      to='/profile'
                      className='block text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors'
                      onClick={() => setTimeout(() => setIsProfileMenuOpen(false), 100)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to='/login'>
              <button className='border text-gray-700 text-lg bg-green-200 border-green-500 px-6 py-1 rounded-2xl hover:bg-green-300 hover:text-white hover:shadow-2xl hover:scale-105 transition-transform duration-200'>
                {t('login')}
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className='flex md:hidden items-center justify-between px-4 py-3 relative'>
        <Link
          to='/'
          aria-label='Farmer Hub Home'
          className='group inline-flex items-center gap-2 text-xl font-extrabold tracking-wide'
        >
          <GiWheat className='h-6 w-6 text-emerald-600' />
          <span className='bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>LIMAT</span>
        </Link>

        <div className='flex items-center gap-4'>
          {/* Language */}
          <div className='relative' ref={languageRef}>
            <FaGlobe
              size={20}
              className='text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors'
              onClick={toggleLanguageMenu}
            />
            {isLanguageMenuOpen && (
              <div className='absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-md py-2 z-50'>
                {['Afan Oromo', 'English', 'Amharic'].map((lang) => (
                  <button
                    key={lang}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLanguageSelect(lang)
                    }}
                    className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 ${selectedLanguage === lang ? 'font-semibold text-emerald-600' : ''
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoggedIn && (
            <>
              <Link to="/cart" className="relative">
                <FaShoppingCart size={24} className='text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors' />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <div className='relative' ref={profileRef}>
                <button onClick={toggleProfileMenu} className='p-2 rounded-full bg-gray-100'>
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt='Profile'
                      className='h-6 w-6 rounded-full object-cover'
                    />
                  ) : (
                    <FaUser className='text-gray-600' />
                  )}
                </button>
                {isProfileMenuOpen && (
                  <div className='absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-md py-2 z-50'>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-gray-700 hover:bg-emerald-50'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            onClick={toggleMobileMenu}
            className='p-2 text-gray-600 hover:text-emerald-600 transition-colors'
            aria-label='Toggle mobile menu'
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200 animate-slideDown'>
          <ul className='flex flex-col px-4 py-4 gap-2 text-[17px]'>
            {[{ name: t('home'), path: '/' }, { name: t('products'), path: '/products' }, { name: t('about'), path: '/about' }].map(
              (item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg transition-colors ${isActive(item.path) ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            )}
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to='/profile'
                    className='block px-4 py-3 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors'
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout()
                      toggleMobileMenu()
                    }}
                    className='w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors'
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className='pt-2'>
                <Link to='/login'>
                  <button className='w-full border text-gray-700 bg-green-200 border-green-500 px-6 py-2 rounded-2xl hover:bg-green-300 hover:text-white hover:shadow-2xl transition-colors'>
                    {t('login')}
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
