import React, { useState, useEffect } from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
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
      
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-1 pb-24">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Products</h1>
          <p className="text-gray-600">Browse all products from our trusted suppliers</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white min-w-[150px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 max-w-4xl mx-auto">
            <FaCheckCircle /> Product added to cart successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <FaBox className="mx-auto text-gray-300 text-6xl mb-4" />
            <p className="text-gray-600 text-lg mb-2">No products found.</p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="mt-4 text-emerald-600 hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="mb-6 text-center text-gray-600">
              <span className="font-medium">Showing {filteredProducts.length}</span> of {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-emerald-100 group backdrop-blur-sm"
                >
                  {/* Product Image */}
                  <div className="relative h-56 bg-gradient-to-br from-emerald-100 to-lime-100 overflow-hidden">
                    <img
                      src={
                        product.image?.startsWith('http')
                          ? product.image
                          : `http://localhost:5000${product.image}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm bg-opacity-90">
                        <FaTag className="w-2.5 h-2.5" />
                        {product.category}
                      </span>
                    </div>
                    {product.quantity === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                        <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-xl">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3 min-h-[4rem] leading-relaxed">
                      {product.description}
                    </p>

                    {/* Supplier Info */}
                    {product.supplier && (
                      <div className="flex items-center gap-2 mb-4 p-2 bg-emerald-50 rounded-lg">
                        <FaUser className="w-4 h-4 text-emerald-700" />
                        <span className="text-sm font-semibold text-emerald-800">{product.supplier.name || 'Unknown Supplier'}</span>
                      </div>
                    )}

                    {/* Price and Stock */}
                    <div className="mb-5 pb-5 border-b-2 border-emerald-100">
                      <div className="flex items-baseline gap-2 mb-2">
                        <p className="text-3xl font-extrabold text-emerald-600">
                          ${Number(product.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.quantity > 0 ? (
                          <>
                            <FaBox className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-700 font-semibold">
                              In Stock ({product.quantity} available)
                            </p>
                          </>
                        ) : (
                          <>
                            <FaBox className="w-4 h-4 text-red-500" />
                            <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={addingToCart === product._id || product.quantity === 0 || !isLoggedIn}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                        !isLoggedIn
                          ? 'bg-gray-400 text-white cursor-not-allowed shadow-sm'
                          : product.quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
                          : addingToCart === product._id
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : showSuccess === product._id
                          ? 'bg-green-600 text-white shadow-xl'
                          : 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0'
                      }`}
                    >
                      {!isLoggedIn ? (
                        <>Login to Add</>
                      ) : addingToCart === product._id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Adding...
                        </>
                      ) : showSuccess === product._id ? (
                        <>
                          <FaCheckCircle className="w-5 h-5" /> Added!
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="w-5 h-5" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

     
    </div>
  )
}

export default Products
