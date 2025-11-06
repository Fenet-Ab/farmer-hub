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
import AdminNavbar from './components/navbar/AdminNavbar.jsx'
import SupplierNavbar from './components/navbar/SupplierNavbar.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import UserController from './pages/Admin/UserController.jsx'
import CreateUser from './pages/Admin/CreateUser.jsx'

const App = () => {
  const location = useLocation()

  const isAdmin = location.pathname.startsWith('/admin') || location.pathname === '/admin-dashboard'
  const isSupplier = location.pathname.startsWith('/supplier') || location.pathname === '/supplier-dashboard'

  const CurrentNavbar = isAdmin ? AdminNavbar : isSupplier ? SupplierNavbar : Navbar

  return (
    <>
      <CurrentNavbar />
      <div style={{ paddingTop: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user-dashboard" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/supplier-dashboard" element={<ProtectedRoute><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><UserController/></ProtectedRoute>} />
          <Route path="/create-user" element={<ProtectedRoute><CreateUser/></ProtectedRoute>} />
        </Routes>
        {!isAdmin && !isSupplier && <Footer />}
      </div>
    </>
  )
}

export default App
