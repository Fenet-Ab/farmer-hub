import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa'

const MyProduct = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  // Fetch supplier's products
  useEffect(() => {
    fetchProducts()
  }, [])

  // Auto-hide success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/products/supplier/my-products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const list = res?.data?.products || []
      setProducts(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product._id)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      quantity: product.quantity || '',
      category: product.category || ''
    })
    setImagePreview(product.image?.startsWith('http') ? product.image : `http://localhost:5000${product.image}`)
    setImageFile(null)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: ''
    })
    setImagePreview(null)
    setImageFile(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async (productId) => {
    try {
      setError(null)
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('quantity', formData.quantity)
      formDataToSend.append('category', formData.category)
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      await axios.put(`http://localhost:5000/api/products/${productId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess('Product updated successfully!')
      setEditingProduct(null)
      await fetchProducts()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update product')
    }
  }

  const handleDelete = async (productId) => {
    try {
      setDeletingId(productId)
      setError(null)
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Product deleted successfully!')
      setShowDeleteDialog(null)
      await fetchProducts()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  const categories = ['Fertilizers', 'Pesticides', 'Farm Products', 'Coffee', 'Seeds', 'Tools', 'Other']

  return (
    <div className='p-6 mt-10'>
      <h1 className='text-2xl font-semibold mb-4 text-green-700'>My Products</h1>

      {success && (
        <div className='mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg'>
          {success}
        </div>
      )}

      {error && (
        <div className='mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
          {error}
        </div>
      )}

      {loading && (
        <div className='text-gray-600'>Loading products...</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className='text-gray-600'>No products found.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className='overflow-x-auto border border-gray-200 rounded-xl bg-white'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Image</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Name</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Category</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Price</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Quantity</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Created</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {products.map((p) => (
                <tr key={p._id} className='hover:bg-emerald-50/40'>
                  <td className='px-4 py-3'>
                    <div className='h-12 w-12 rounded-md overflow-hidden bg-gray-100'>
                      <img
                        src={p.image?.startsWith('http') ? p.image : `http://localhost:5000${p.image}`}
                        alt={p.name}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Img'
                        }}
                      />
                    </div>
                  </td>
                  {editingProduct === p._id ? (
                    <>
                      <td className='px-4 py-3' colSpan="6">
                        <div className='space-y-4 p-4 bg-gray-50 rounded-lg'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                              <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                              <select
                                name='category'
                                value={formData.category}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                              >
                                <option value=''>Select category</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                              <input
                                type='number'
                                name='price'
                                value={formData.price}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                step='0.01'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-700 mb-1'>Quantity</label>
                              <input
                                type='number'
                                name='quantity'
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                              />
                            </div>
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                            <textarea
                              name='description'
                              value={formData.description}
                              onChange={handleInputChange}
                              rows='3'
                              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
                            <input
                              type='file'
                              accept='image/*'
                              onChange={handleImageChange}
                              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
                            />
                            {imagePreview && (
                              <img
                                src={imagePreview}
                                alt='Preview'
                                className='mt-2 h-24 w-24 object-cover rounded-md'
                              />
                            )}
                          </div>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => handleUpdate(p._id)}
                              className='px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2'
                            >
                              <FaCheck /> Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2'
                            >
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className='px-4 py-3'></td>
                    </>
                  ) : (
                    <>
                      <td className='px-4 py-3'>
                        <div className='font-medium text-gray-900'>{p.name}</div>
                        <div className='text-xs text-gray-500 max-w-[28rem] truncate'>{p.description}</div>
                      </td>
                      <td className='px-4 py-3 text-gray-700'>{p.category}</td>
                      <td className='px-4 py-3 text-gray-700'>${Number(p.price).toFixed(2)}</td>
                      <td className='px-4 py-3 text-gray-700'>{p.quantity}</td>
                      <td className='px-4 py-3 text-gray-700'>
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => handleEdit(p)}
                            className='p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
                            title='Edit product'
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setShowDeleteDialog(p._id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors'
                            title='Delete product'
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Delete Product</h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setShowDeleteDialog(null)}
                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
                disabled={deletingId === showDeleteDialog}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteDialog)}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2'
                disabled={deletingId === showDeleteDialog}
              >
                {deletingId === showDeleteDialog ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProduct
