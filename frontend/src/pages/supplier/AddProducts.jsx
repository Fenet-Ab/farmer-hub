import React, { useState } from 'react'
import axios from 'axios'
import {
  FaBars,
  FaBox,
  FaClipboardCheck,
  FaLeaf,
  FaSpinner,
  FaUpload
} from 'react-icons/fa'
import SupplierSidebar from '../../components/Sidebar/SupplierSidebar'

const initialFormState = {
  name: '',
  description: '',
  price: '',
  quantity: '',
  category: '',
  image: null
}

const categoryOptions = [
  { label: 'Fertilizers', value: 'Fertilizers' },
  { label: 'Pesticides', value: 'Pesticides' },
  { label: 'Seeds', value: 'Seeds' },
  { label: 'Farm Equipment', value: 'Farm Equipment' },
  { label: 'Fresh Produce', value: 'Fresh Produce' },
  { label: 'Coffee', value: 'Coffee' },
  { label: 'Other', value: 'Other' }
]

const AddProducts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [formData, setFormData] = useState(initialFormState)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file
      }))
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.image) {
      setError('Please upload a product image.')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('description', formData.description)
      payload.append('price', formData.price)
      payload.append('quantity', formData.quantity)
      payload.append('category', formData.category)
      payload.append('image', formData.image)

      await axios.post('http://localhost:5000/api/products/create', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess('Product added successfully!')
      setFormData(initialFormState)
      setPreviewUrl(null)
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to add product. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50'>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-[40px] h-[calc(100vh-40px)] z-40 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <SupplierSidebar />
      </div>

      {/* Main Content */}
      <div className='flex-1 transition-all duration-300 w-full md:ml-64 p-4 md:p-8'>
        {/* Top Bar */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800'>Add New Product</h1>
            <p className='text-gray-600 mt-1'>Fill in the details below to add a product to your catalog.</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='p-2 md:hidden rounded-lg bg-gray-600 text-white'
          >
            <FaBars />
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className='mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700'>{error}</div>
        )}
        {success && (
          <div className='mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700'>
            {success}
          </div>
        )}

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          {/* Form */}
          <div className='xl:col-span-2'>
            <form
              onSubmit={handleSubmit}
              className='bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 space-y-6'
            >
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Product Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='e.g. Organic Coffee Beans'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Description</label>
                <textarea
                  name='description'
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Describe the product, key features, and usage...'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none'
                  required
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Price (USD)</label>
                  <input
                    type='number'
                    name='price'
                    value={formData.price}
                    onChange={handleInputChange}
                    min='0'
                    step='0.01'
                    placeholder='e.g. 45.50'
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Quantity</label>
                  <input
                    type='number'
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min='1'
                    placeholder='e.g. 100'
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                <select
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  required
                >
                  <option value='' disabled>
                    Select a category
                  </option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Product Image</label>
                <div className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors bg-gray-50'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                    id='product-image'
                  />
                  <label
                    htmlFor='product-image'
                    className='flex flex-col items-center justify-center cursor-pointer text-gray-600 gap-3'
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt='Preview'
                        className='h-32 w-32 object-cover rounded-lg shadow-sm border border-gray-200'
                      />
                    ) : (
                      <FaUpload className='w-10 h-10 text-emerald-500' />
                    )}
                    <div>
                      <p className='font-medium'>{previewUrl ? 'Change image' : 'Upload product image'}</p>
                      <p className='text-xs text-gray-400'>JPG or PNG, up to 5MB</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className='flex justify-end gap-3'>
                <button
                  type='button'
                  onClick={() => {
                    setFormData(initialFormState)
                    setPreviewUrl(null)
                    setError(null)
                    setSuccess(null)
                  }}
                  className='px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors'
                  disabled={loading}
                >
                  Reset
                </button>
                <button
                  type='submit'
                  className='px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className='animate-spin' /> Saving...
                    </>
                  ) : (
                    <>
                      <FaClipboardCheck /> Save Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Helpful Tips */}
          <div className='space-y-6'>
            <div className='bg-white border border-gray-200 rounded-2xl shadow-sm p-6'>
              <h2 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                <FaBox className='text-emerald-500' /> Product Guidelines
              </h2>
              <ul className='mt-4 space-y-3 text-sm text-gray-600'>
                <li>• Use a clear, high-quality image showcasing the product.</li>
                <li>• Include complete details such as usage instructions and key benefits.</li>
                <li>• Set accurate pricing and available stock to avoid cancellations.</li>
                <li>• Ensure the category accurately represents the product type.</li>
              </ul>
            </div>

            <div className='bg-emerald-50 border border-emerald-200 rounded-2xl p-6'>
              <h3 className='text-sm font-semibold text-emerald-800 flex items-center gap-2'>
                <FaLeaf /> Need help?
              </h3>
              <p className='text-xs text-emerald-700 mt-2'>
                Reach out to our support team at <span className='font-medium'>support@farmerhub.com</span> if you need
                assistance with product listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProducts