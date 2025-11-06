import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CreateUser = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'supplier',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message.text])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.role) return 'All fields are required'
    const emailOk = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(form.email)
    if (!emailOk) return 'Please enter a valid email'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (!['admin', 'supplier'].includes(form.role)) return 'Role must be admin or supplier'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    const err = validate()
    if (err) {
      setMessage({ type: 'error', text: err })
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem('token') || ''
      const res = await axios.post('http://localhost:5000/api/admin/create-user', form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage({ type: 'success', text: res.data?.message || 'User created successfully' })
      setForm({ name: '', email: '', password: '', role: 'supplier' })
    } catch (error) {
      const text = error.response?.data?.message || 'Failed to create user'
      setMessage({ type: 'error', text })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center p-4 md:p-8'>
      <div className='w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8'>
        <h1 className='text-2xl font-extrabold text-gray-800 mb-2'>Create User</h1>
        <p className='text-sm text-gray-600 mb-6'>Add a new admin or supplier to the platform.</p>

        {message.text && (
          <div
            className={`${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            } border rounded-xl px-4 py-3 mb-4`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              className='w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              placeholder='e.g. Mrs Supplier'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              className='w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              placeholder='supplier@example.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              className='w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              placeholder='At least 6 characters'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              className='w-full rounded-xl border border-gray-300 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
            >
              <option value='supplier'>Supplier</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <button
            type='submit'
            disabled={submitting}
            className='w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateUser
