import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ProductDetail = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await axios.get('http://localhost:5000/api/products')
        const list = res?.data?.product || []
        setProducts(Array.isArray(list) ? list : [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className='p-6 mt-10'>
      <h1 className='text-2xl font-semibold mb-4 text-green-700'>All Products</h1>

      {loading && (
        <div className='text-gray-600'>Loading products...</div>
      )}

      {error && !loading && (
        <div className='text-red-600 mb-4'>{error}</div>
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
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Supplier</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Created</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {products.map((p) => (
                <tr key={p._id} className='hover:bg-emerald-50/40'>
                  <td className='px-4 py-3'>
                    <div className='h-12 w-12 rounded-md overflow-hidden bg-gray-100'>
                      {/* Images are stored as relative paths like /uploads/.. */}
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
                  <td className='px-4 py-3'>
                    <div className='font-medium text-gray-900'>{p.name}</div>
                    <div className='text-xs text-gray-500 max-w-[28rem] truncate'>{p.description}</div>
                  </td>
                  <td className='px-4 py-3 text-gray-700'>{p.category}</td>
                  <td className='px-4 py-3 text-gray-700'>${Number(p.price).toFixed(2)}</td>
                  <td className='px-4 py-3 text-gray-700'>{p.quantity}</td>
                  <td className='px-4 py-3 text-gray-700'>
                    <div className='flex flex-col'>
                      <span>{p?.supplier?.name || 'Unknown'}</span>
                      <span className='text-xs text-gray-500'>{p?.supplier?.email || ''}</span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-gray-700'>
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductDetail