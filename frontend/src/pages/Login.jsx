import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './css/login.css';
import Navbar from '../components/navbar/Navbar';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit (Signup or Login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // ---- LOGIN ----
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const { token, role } = res.data;

        if (!token || !role) {
          toast.error("Invalid response from server");
          return;
        }

        // ✅ Save user info & token
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        toast.success("Login successful!");

        // ✅ Redirect based on role
        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "supplier") {
            navigate("/supplier-dashboard");
          } else {
            navigate("/user-dashboard");
          }
        }, 1500);
      } else {
        // ---- SIGNUP ----
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        toast.success("Signup successful! Redirecting to login...");

        // Clear form data and switch to login
        setFormData({ name: "", email: "", password: "" });

        // ⏳ Wait and switch to login view
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login/signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div
      className='full'
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      
      <ToastContainer />
      <div className='container'>
        {/* Login / Signup Form */}
        <div
          className={`form-box ${isLogin ? 'login' : ''}`}
          style={{ left: isLogin ? '0' : '50%' }}
        >
          <form onSubmit={handleSubmit}>
            <h2
              style={{
                color: '#fff',
                marginBottom: '30px',
                fontSize: '28px',
                textAlign: 'center',
              }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </h2>

            {!isLogin && (
              <div className='input-box'>
                <span className='icon'><FaUser /></span>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label>Name</label>
              </div>
            )}

            <div className='input-box'>
              <span className='icon'><FaEnvelope /></span>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>

            <div className='input-box'>
              <span className='icon'><FaLock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className='toggle-password'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              <label>Password</label>
            </div>

            {isLogin && (
              <div className='remember-password'>
                <label><input type='checkbox' /> Remember me</label>
                <Link to='#'>Forgot Password?</Link>
              </div>
            )}

            <button type='submit' className='btn' disabled={loading}>
              {loading ? "Please wait..." : isLogin ? 'Login' : 'Sign Up'}
            </button>

            <div className='create-account'>
              <p>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span
                  onClick={toggleForm}
                  style={{
                    cursor: 'pointer',
                    color: '#6ee849',
                    fontWeight: 'bold',
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </span>
              </p>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div
          className='info-box'
          style={{
            position: 'absolute',
            top: 0,
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px',
            left: isLogin ? '50%' : '0',
            transition: 'left 0.5s ease',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              marginBottom: '20px',
              color: '#fff',
            }}
          >
            {isLogin ? 'Welcome Back!' : 'New Here?'}
          </h2>
          <p
            style={{
              fontSize: '16px',
              marginBottom: '20px',
              color: '#fff',
              opacity: '0.9',
            }}
          >
            {isLogin
              ? 'Login to continue shopping and managing your farm products.'
              : 'Sign up now to get started with our agricultural marketplace.'}
          </p>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#6ee849', marginRight: '10px', fontSize: '20px' }}>✓</span>
              Premium Products
            </li>
            <li style={{ marginBottom: '15px', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#6ee849', marginRight: '10px', fontSize: '20px' }}>✓</span>
              Fast Delivery
            </li>
            <li style={{ marginBottom: '15px', color: '#fff', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#6ee849', marginRight: '10px', fontSize: '20px' }}>✓</span>
              Expert Support
            </li>
          </ul>

          <button
            type='button'
            onClick={toggleForm}
            style={{
              background: 'transparent',
              border: '2px solid #fff',
              color: '#fff',
              padding: '12px 30px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '20px',
              marginTop: '20px',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#16a34a';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#fff';
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
