import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { FaShoppingCart, FaSearch, FaFilter, FaTimes, FaCheckCircle, FaBox, FaUser, FaTag } from 'react-icons/fa'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [addingToCart, setAddingToCart] = useState(null)
  const [showSuccess, setShowSuccess] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get('http://localhost:5000/api/products')
      // Handle both singular and plural response formats
      const list = res?.data?.product || res?.data?.products || []
      setProducts(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err?.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart')
      return
    }

    try {
      setAddingToCart(productId)
      setError(null)
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowSuccess(productId)
      setTimeout(() => setShowSuccess(null), 2000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add to cart')
      setTimeout(() => setError(null), 3000)
    } finally {
      setAddingToCart(null)
    }
  }

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex flex-col">
  
      <div className="container mx-auto px-4 py-12 mt-20 flex-1 pb-28">
  
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-emerald-700 drop-shadow-sm">
            Explore Our Products
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            High-quality items sourced from trusted local farmers
          </p>
        </div>
  
        {/* Search & Filter Row */}
        <div className="mb-10 flex flex-col md:flex-row gap-5 max-w-4xl mx-auto">
  
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, description or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 
                rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            )}
          </div>
  
          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-10 py-4 bg-white/80 backdrop-blur-sm border border-gray-300 
                rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 appearance-none min-w-[180px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100/80 border border-green-300 
            text-green-900 rounded-xl flex items-center gap-3 max-w-3xl mx-auto shadow">
            <FaCheckCircle className="text-green-700" />
            Product added to cart successfully!
          </div>
        )}
  
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100/80 border border-red-300 
            text-red-900 rounded-xl max-w-3xl mx-auto shadow">
            {error}
          </div>
        )}
  
        {/* Loading */}
        {loading && (
          <div className="text-center py-24">
            <div className="animate-spin h-16 w-16 rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
          </div>
        )}
  
        {/* No Products */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <FaBox className="mx-auto text-gray-300 text-7xl mb-4" />
            <p className="text-gray-600 text-lg mb-2">No products found.</p>
  
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="mt-4 text-emerald-600 hover:underline font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
  
        {/* Product Count */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mb-8 text-center text-gray-600">
            <span className="font-semibold text-emerald-700">{filteredProducts.length}</span>
            &nbsp;of {products.length} products
          </div>
        )}
  
        {/* Product Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md 
                  hover:shadow-2xl transition-all duration-300 overflow-hidden 
                  border border-emerald-100 group"
              >
  
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={
                      product.image?.startsWith('http')
                        ? product.image
                        : `http://localhost:5000${product.image}`
                    }
                    className="w-full h-full object-cover group-hover:scale-110 
                      transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image' }}
                  />
  
                  <span className="absolute top-3 right-3 px-3 py-1.5 bg-emerald-700 text-white 
                    text-xs font-bold rounded-full shadow">
                    <FaTag className="inline-block mr-1" /> {product.category}
                  </span>
  
                  {product.quantity === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center">
                      <span className="bg-red-600 text-white py-2 px-4 rounded-lg font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
  
                {/* Product Content */}
                <div className="p-6">
  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-700 transition">
                    {product.name}
                  </h3>
  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {product.description}
                  </p>
  
                  {/* Supplier */}
                  {product.supplier && (
                    <div className="flex items-center gap-2 mb-4 bg-emerald-50 p-2 rounded-lg">
                      <FaUser className="text-emerald-700" />
                      <span className="text-sm font-semibold text-emerald-800">
                        {product.supplier.name}
                      </span>
                    </div>
                  )}
  
                  {/* Price and Stock */}
                  <div className="border-b border-emerald-100 pb-4 mb-4">
                    <p className="text-3xl font-extrabold text-emerald-600">
                      ${Number(product.price).toFixed(2)}
                    </p>
  
                    <div className="flex items-center gap-2 mt-2">
                      <FaBox className={product.quantity > 0 ? "text-green-600" : "text-red-600"} />
                      <span className={`text-sm font-semibold ${product.quantity > 0 ? "text-green-700" : "text-red-600"}`}>
                        {product.quantity > 0 ? `In Stock (${product.quantity})` : "Out of Stock"}
                      </span>
                    </div>
                  </div>
  
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.quantity === 0 || !isLoggedIn}
                    className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 
                      transition-all duration-200 shadow-md
                      ${
                        !isLoggedIn
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : product.quantity === 0
                          ? "bg-gray-300 cursor-not-allowed text-gray-600"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-xl"
                      }
                    `}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
  
                </div>
              </div>
            ))}
          </div>
        )}
  
      </div>
    </div>
  )
  
}

export default Products
