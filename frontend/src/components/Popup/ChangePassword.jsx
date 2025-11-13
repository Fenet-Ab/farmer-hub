import React, { useEffect, useState } from 'react'


const ChangePassword = () => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
      });
    
      const token = localStorage.getItem("token");
      useEffect(() => {
        if (message.text) {
          const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
          return () => clearTimeout(timer);
        }
      }, [message.text]);
    
  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await axios.put(
        "http://localhost:5000/api/users/update-profile",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: res.data.message });
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password update failed' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
    {/* Backdrop */}
    <div 
      className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
      onClick={() => setShowPasswordForm(false)}
    ></div>
  
    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 border border-gray-200 z-10">
      <h2 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
        Update Password
      </h2>
      <p className="text-sm text-gray-600 mb-6">Enter your current password and choose a new one</p>
  
      <form onSubmit={handlePasswordUpdate} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            placeholder="Enter current password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
  
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
  
        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Updating...' : 'Update Password'}
          </button>
          <button
            type="button"
            onClick={() => setShowPasswordForm(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  
  )
}

export default ChangePassword