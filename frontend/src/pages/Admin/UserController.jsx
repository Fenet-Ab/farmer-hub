import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaTrash, FaEdit } from 'react-icons/fa'

const UserController = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const list = res?.data?.users || []
      setUsers(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openDeleteDialog = (user) => {
    setToDelete(user)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!toDelete?._id) return
    try {
      setDeletingId(toDelete._id)
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/admin/users/${toDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers((prev) => prev.filter((u) => u._id !== toDelete._id))
      setConfirmOpen(false)
      setToDelete(null)
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  const openEditDialog = (user) => {
    setEditUser({
      _id: user._id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
    })
    setEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editUser?._id) return
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      const payload = { name: editUser.name, email: editUser.email, role: editUser.role }
      const res = await axios.put(`http://localhost:5000/api/admin/users/${editUser._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated = res?.data?.user
      if (updated) {
        setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)))
      }
      setEditOpen(false)
      setEditUser(null)
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='p-6 mt-10'>
      <h1 className='text-2xl font-semibold mb-4 text-green-700'>Users</h1>

      {loading && <div className='text-gray-600'>Loading users...</div>}
      {error && !loading && <div className='text-red-600 mb-4'>{error}</div>}

      {!loading && !error && users.length === 0 && (
        <div className='text-gray-600'>No users found.</div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className='overflow-x-auto border border-gray-200 rounded-xl bg-white'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Name</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Email</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Role</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Created</th>
                <th className='px-4 py-3 text-left text-sm font-medium text-gray-600'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {users.map((u) => (
                <tr key={u._id} className='hover:bg-emerald-50/40'>
                  <td className='px-4 py-3 text-gray-900 font-medium'>{u.name}</td>
                  <td className='px-4 py-3 text-gray-700'>{u.email}</td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700'>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-gray-700'>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-2'>
                      <button
                        className='p-2 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        onClick={() => openEditDialog(u)}
                        title='Edit user'
                      >
                        <FaEdit />
                      </button>
                      <button
                        className='p-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => openDeleteDialog(u)}
                        disabled={deletingId === u._id}
                        title='Delete user'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {confirmOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40' onClick={() => setConfirmOpen(false)}></div>
          <div className='relative bg-white w-full max-w-md mx-4 rounded-xl shadow-lg p-6'>
            <h2 className='text-lg font-semibold text-gray-800 mb-2'>Delete user</h2>
            <p className='text-gray-600 mb-4'>
              Are you sure you want to delete{' '}
              <span className='font-medium'>{toDelete?.name || 'this user'}</span>? This action cannot be undone.
            </p>
            <div className='flex justify-end gap-2'>
              <button
                className='px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50'
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 rounded-lg border border-red-200 text-white bg-red-600 hover:bg-red-700 disabled:opacity-50'
                onClick={handleDelete}
                disabled={!!deletingId}
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/40' onClick={() => setEditOpen(false)}></div>
          <div className='relative bg-white w-full max-w-lg mx-4 rounded-xl shadow-lg p-6'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>Edit user</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>Name</label>
                <input
                  type='text'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  value={editUser?.name || ''}
                  onChange={(e) => setEditUser((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>Email</label>
                <input
                  type='email'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  value={editUser?.email || ''}
                  onChange={(e) => setEditUser((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>Role</label>
                <select
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  value={editUser?.role || 'user'}
                  onChange={(e) => setEditUser((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <option value='user'>User</option>
                  <option value='supplier'>Supplier</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
            </div>
            <div className='flex justify-end gap-2 mt-6'>
              <button
                className='px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50'
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'
                onClick={handleSaveEdit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserController