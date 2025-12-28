import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaShieldAlt, FaCamera, FaLock } from "react-icons/fa";


const Profile = () => {
  const [user, setUser] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("token");

  // Auto-hide messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Fetch user profile
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch profile picture
  useEffect(() => {
    if (!token) return;
    const fetchProfilePic = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile-picture", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.profilePic) {
          setProfilePictureUrl(res.data.profilePic);
        } else {
          setProfilePictureUrl(null);
        }
      } catch (err) {
        console.error("Failed to load profile picture:", err);
        setProfilePictureUrl(null);
      }
    };
    fetchProfilePic();
  }, [token]);

  // Upload profile picture
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first!' });
      return;
    }
    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      setUploading(true);
      const method = profilePictureUrl ? 'put' : 'post';
      const res = await axios[method](
        "http://localhost:5000/api/users/profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage({ type: 'success', text: res.data.message || 'Profile picture updated!' });
      setUser({ ...user, profilePic: res.data.profilePic });
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (res.data.profilePic) {
        setProfilePictureUrl(res.data.profilePic);
        // Dispatch event for Navbar to update
        window.dispatchEvent(new Event('profileUpdated'));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-sm text-gray-600 mb-6">Manage your account settings and preferences</p>

        {message.text && (
          <div className={`mb-6 border rounded-xl px-4 py-3 ${message.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-4">
              <img
                src={
                  previewUrl ||
                  profilePictureUrl ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-emerald-200 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white">
                <FaCamera className="w-4 h-4" />
              </div>
            </div>
            <label className="mb-2 text-sm font-medium text-gray-700 cursor-pointer">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                <FaCamera /> Choose Photo
              </span>
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
            {selectedFile && <p className="text-xs text-gray-500 mb-2">{selectedFile.name}</p>}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Update Picture'}
            </button>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <FaUser className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-gray-800">{user.name || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <FaEnvelope className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{user.email || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <FaShieldAlt className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">{user.role || 'Not set'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-emerald-600 text-emerald-600 px-4 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              <FaLock /> Update Password
            </button>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordForm && (
          // <ChangePassword/>
          <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
            <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setShowPasswordForm(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 border border-gray-200">
              <h2 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
                Update Password
              </h2>
              <p className="text-sm text-gray-600 mb-6">Enter your current password and choose a new one</p>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting} className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-lime-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Updating...' : 'Update Password'}
                  </button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
