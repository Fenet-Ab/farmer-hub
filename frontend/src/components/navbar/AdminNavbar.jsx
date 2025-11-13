import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const AdminNavbar = () => {
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch profile picture
  useEffect(() => {
    if (!token) return;

    const fetchProfilePic = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile-picture', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.profilePic) {
          setProfilePictureUrl(`http://localhost:5000${res.data.profilePic}`);
        } else {
          setProfilePictureUrl(null);
        }
      } catch (err) {
        console.error('Failed to load profile picture:', err);
        setProfilePictureUrl(null);
      }
    };

    fetchProfilePic();
  }, [token]);

  return (
    <nav className="fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div className='flex items-center gap-3 pl-4 sm:pl-6 lg:pl-8'>
          <span className='text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent'>Admin</span>
          {/* <span className='text-sm text-gray-500'>Dashboard</span> */}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/admin-dashboard" className="text-gray-700 hover:text-emerald-600">Overview</Link>
          <Link to="/product-detail" className="text-gray-700 hover:text-emerald-600">Products</Link>
          <Link to="/user" className="text-gray-700 hover:text-emerald-600">Users</Link>

          {/* Profile Picture / Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="ml-8 left-0 w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  setProfilePictureUrl(null);
                }}
              />
            ) : (
              <FaUserCircle className="text-gray-400 w-8 h-8" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
