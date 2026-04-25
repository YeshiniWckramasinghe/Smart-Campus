import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8082/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: response.data.name,
        role: response.data.role,
        email: formData.email
      }));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 
                      to-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full 
                          blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-700 rounded-full 
                          blur-3xl"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-xl p-3 shadow-lg">
              <span className="text-3xl">🎓</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Smart Campus</h1>
              <p className="text-blue-300 text-sm">SLIIT University</p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Manage Your Campus <br />
            <span className="text-blue-400">Resources Efficiently</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Book facilities, manage maintenance tickets, and stay updated 
            with real-time notifications — all in one platform.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: '🏛️', text: 'Book lecture halls, labs & equipment' },
              { icon: '🔧', text: 'Report & track maintenance issues' },
              { icon: '🔔', text: 'Real-time notifications' },
              { icon: '🔐', text: 'Secure role-based access' },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-gray-500 text-sm">
            © 2026 Smart Campus — SLIIT. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center 
                      bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div>
            <div className="lg:hidden flex items-center space-x-3 mb-8">
              <div className="bg-blue-600 rounded-xl p-2.5">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Campus</h1>
                <p className="text-gray-500 text-xs">SLIIT University</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-500">
              Sign in to access your Smart Campus account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center space-x-3 bg-red-50 border border-red-200 
                            text-red-700 px-4 py-3 rounded-xl text-sm">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  📧
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@sliit.lk"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent bg-white shadow-sm text-sm
                             transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent bg-white shadow-sm text-sm
                             transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                             hover:text-gray-600 text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                         text-white font-semibold py-3.5 rounded-xl transition 
                         duration-200 shadow-md hover:shadow-lg text-sm
                         flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In →</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gray-50 text-gray-400 uppercase tracking-wider">
                or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <a href="http://localhost:8082/oauth2/authorization/google"
            className="w-full flex items-center justify-center space-x-3 
                       border border-gray-200 hover:border-gray-300 
                       bg-white hover:bg-gray-50 text-gray-700 font-medium 
                       py-3.5 rounded-xl transition duration-200 shadow-sm text-sm">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5"/>
            <span>Continue with Google</span>
          </a>

          {/* Register */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;