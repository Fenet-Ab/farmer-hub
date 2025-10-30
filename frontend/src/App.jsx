import React from 'react'
import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/footer/Footer.jsx'
import About from './pages/About.jsx'
import Products from './pages/Products.jsx'
import Login from './pages/Login.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import User from './pages/User/User.jsx'
import SupplierDashboard from './pages/supplier/SupplierDashboard.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<User />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
