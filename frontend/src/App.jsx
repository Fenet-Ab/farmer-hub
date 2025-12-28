import React from 'react'
import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
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
import ChangePassword from './components/Popup/ChangePassword.jsx'
import ProductDetail from './pages/Admin/ProductDetail.jsx'
import OrderTable from './pages/Admin/OrderTable.jsx'
import AddProducts from './pages/supplier/AddProducts.jsx'
import MyProduct from './pages/supplier/MyProduct.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import OrdersWrapper from './components/OrdersWrapper/OrdersWrapper.jsx'
import Contact from './pages/Contact.jsx'
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx'

const App = () => {
  const location = useLocation()
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('role')
  
  // Check pathname patterns
  const isAdminPath = location.pathname.startsWith('/admin') || 
                      location.pathname === '/admin-dashboard' ||
                      location.pathname === '/user-controller' ||
                      location.pathname === '/create-user' ||
                      location.pathname === '/product-detail' ||
                      location.pathname === '/order-detail'
  
  const isSupplierPath = location.pathname.startsWith('/supplier') || 
                         location.pathname === '/supplier-dashboard' ||
                         location.pathname === '/add-products' ||
                         location.pathname === '/my-product'
  
  const isUserPath = location.pathname.startsWith('/user') || 
                     location.pathname === '/user-dashboard'
  
  // Determine navbar based on role (priority) or pathname (fallback)
  const isAdmin = userRole === 'admin' || isAdminPath
  const isSupplier = userRole === 'supplier' || isSupplierPath
  const isUser = userRole === 'user' || isUserPath
  const isAddProducts = location.pathname.startsWith('/add-products') || location.pathname === '/add-products'

  // Select navbar: role-based takes priority
  let CurrentNavbar = Navbar
  if (userRole === 'admin' || isAdminPath) {
    CurrentNavbar = AdminNavbar
  } else if (userRole === 'supplier' || isSupplierPath) {
    CurrentNavbar = SupplierNavbar
  }

  return (
    <>
      <ScrollToTop />
      <CurrentNavbar />
      <div style={{ paddingTop: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user-dashboard" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/supplier-dashboard" element={<ProtectedRoute><SupplierDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/user-controller" element={<ProtectedRoute><UserController /></ProtectedRoute>} />
          <Route path="/create-user" element={<ProtectedRoute><CreateUser /></ProtectedRoute>} />
          <Route path="/profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/product-detail" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/order-detail" element={<ProtectedRoute><OrderTable /></ProtectedRoute>} />
          <Route path="/add-products" element={<ProtectedRoute><AddProducts /></ProtectedRoute>} />
          <Route path="/my-product" element={<ProtectedRoute><MyProduct /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersWrapper /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        </Routes>
        {!isAdmin && !isSupplier && !isUser && !isAddProducts && <Footer />}
      </div>
    </>
  )
}

export default App
