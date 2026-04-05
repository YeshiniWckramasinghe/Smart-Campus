import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'LECTURER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8082/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'LECTURER', label: 'Lecturer', icon: '👨‍🏫', desc: 'Book facilities & report incidents' },
    { value: 'TECHNICIAN', label: 'Technician', icon: '🔧', desc: 'Handle maintenance tickets' },
    { value: 'ADMIN', label: 'Admin', icon: '⚙️', desc: 'Manage all campus operations' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 
                      to-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"/>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-700 rounded-full blur-3xl"/>
        </div>

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

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Join Smart Campus <br />
            <span className="text-blue-400">Today</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Create your account and start managing campus resources efficiently.
          </p>

          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.value}
                className="flex items-center space-x-4 bg-white/5 border border-white/10 
                           rounded-xl p-4">
                <span className="text-2xl">{role.icon}</span>
                <div>
                  <p className="text-white font-semibold">{role.label}</p>
                  <p className="text-gray-400 text-sm">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-500 text-sm">© 2026 Smart Campus — SLIIT.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center 
                      bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md space-y-6">

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
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="mt-2 text-gray-500">Fill in your details to get started</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center space-x-3 bg-red-50 border border-red-200 
                            text-red-700 px-4 py-3 rounded-xl text-sm">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center space-x-3 bg-green-50 border border-green-200 
                            text-green-700 px-4 py-3 rounded-xl text-sm">
              <span>✅</span><span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  👤
                </span>
                <input type="text" name="name" value={formData.name}
                  onChange={handleChange} required placeholder="Dr. John Doe"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent bg-white shadow-sm text-sm"/>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  📧
                </span>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} required placeholder="you@sliit.lk"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent bg-white shadow-sm text-sm"/>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button key={role.value} type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 
                               transition duration-200 text-center ${
                      formData.role === role.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}>
                    <span className="text-xl mb-1">{role.icon}</span>
                    <span className="text-xs font-semibold">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
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
                  name="password" value={formData.password}
                  onChange={handleChange} required placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent bg-white shadow-sm text-sm"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                             hover:text-gray-600 text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input type="password" name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange} required placeholder="Re-enter password"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent bg-white shadow-sm text-sm"/>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                         text-white font-semibold py-3.5 rounded-xl transition 
                         duration-200 shadow-md text-sm flex items-center 
                         justify-center space-x-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : <span>Create Account →</span>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;