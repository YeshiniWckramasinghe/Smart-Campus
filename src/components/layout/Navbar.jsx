import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaBars, FaTimes, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (paths) => paths.some(p => location.pathname.startsWith(p));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const navLinkClass = (path) =>
    `text-sm font-medium transition duration-200 px-1 py-1 border-b-2 ${
      isActive(path)
        ? 'text-white border-blue-400'
        : 'text-gray-300 border-transparent hover:text-white hover:border-blue-400'
    }`;

  const dropdownBtnClass = (paths) =>
    `flex items-center space-x-1 text-sm font-medium transition duration-200 
     px-1 py-1 border-b-2 ${
      isGroupActive(paths)
        ? 'text-white border-blue-400'
        : 'text-gray-300 border-transparent hover:text-white hover:border-blue-400'
    }`;

  return (
    <nav className="bg-gray-900 text-white shadow-xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 group-hover:bg-blue-500 transition duration-200 
                            rounded-lg p-2">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-wide">
                Smart Campus
              </span>
              <p className="text-xs text-gray-400 leading-none">SLIIT</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">

            <Link to="/" className={navLinkClass('/')}>Home</Link>

            {/* Facilities Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleDropdown('facilities')}
                className={dropdownBtnClass(['/facilities'])}>
                <span>Facilities</span>
                <FaChevronDown size={10} className={`transition-transform duration-200 
                  ${activeDropdown === 'facilities' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'facilities' && (
                <div className="absolute top-10 left-0 bg-gray-800 border border-gray-700 
                                shadow-2xl rounded-xl w-52 z-50 overflow-hidden">
                  <div className="p-1">
                    <Link to="/facilities"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                 text-gray-300 hover:bg-blue-600 hover:text-white 
                                 rounded-lg transition duration-150"
                      onClick={() => setActiveDropdown(null)}>
                      <span>🏛️</span><span>Browse Facilities</span>
                    </Link>
                    <Link to="/facilities/search"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                 text-gray-300 hover:bg-blue-600 hover:text-white 
                                 rounded-lg transition duration-150"
                      onClick={() => setActiveDropdown(null)}>
                      <span>🔍</span><span>Search & Filter</span>
                    </Link>
                    <Link to="/facilities/equipment"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                 text-gray-300 hover:bg-blue-600 hover:text-white 
                                 rounded-lg transition duration-150"
                      onClick={() => setActiveDropdown(null)}>
                      <span>📦</span><span>Equipment</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bookings Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleDropdown('bookings')}
                className={dropdownBtnClass(['/bookings'])}>
                <span>Bookings</span>
                <FaChevronDown size={10} className={`transition-transform duration-200 
                  ${activeDropdown === 'bookings' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'bookings' && (
                <div className="absolute top-10 left-0 bg-gray-800 border border-gray-700 
                                shadow-2xl rounded-xl w-52 z-50 overflow-hidden">
                  <div className="p-1">
                    <Link to="/bookings/new"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                 text-gray-300 hover:bg-blue-600 hover:text-white 
                                 rounded-lg transition duration-150"
                      onClick={() => setActiveDropdown(null)}>
                      <span>➕</span><span>New Booking</span>
                    </Link>
                    <Link to="/bookings/my"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                 text-gray-300 hover:bg-blue-600 hover:text-white 
                                 rounded-lg transition duration-150"
                      onClick={() => setActiveDropdown(null)}>
                      <span>📋</span><span>My Bookings</span>
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link to="/bookings/all"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                   text-gray-300 hover:bg-blue-600 hover:text-white 
                                   rounded-lg transition duration-150"
                        onClick={() => setActiveDropdown(null)}>
                        <span>📊</span><span>All Bookings</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Maintenance Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleDropdown('maintenance')}
                className={dropdownBtnClass(['/tickets'])}>
                <span>Maintenance</span>
                <FaChevronDown size={10} className={`transition-transform duration-200 
                  ${activeDropdown === 'maintenance' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'maintenance' && (
                <div className="absolute top-10 left-0 bg-gray-800 border border-gray-700 
                                shadow-2xl rounded-xl w-52 z-50 overflow-hidden">
                  <div className="p-1">
                    <Link to="/tickets/new"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                 text-gray-300 hover:bg-blue-600 hover:text-white 
                                 rounded-lg transition duration-150"
                      onClick={() => setActiveDropdown(null)}>
                      <span>🚨</span><span>Report Incident</span>
                    </Link>
                    <Link to="/tickets/my"
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                 text-gray-300 hover:bg-blue-600 hover:text-white 
                                 rounded-lg transition duration-150"
                      onClick={() => setActiveDropdown(null)}>
                      <span>🎫</span><span>My Tickets</span>
                    </Link>
                    {(user.role === 'ADMIN' || user.role === 'TECHNICIAN') && (
                      <Link to="/tickets/all"
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm 
                                   text-gray-300 hover:bg-blue-600 hover:text-white 
                                   rounded-lg transition duration-150"
                        onClick={() => setActiveDropdown(null)}>
                        <span>🔧</span><span>All Tickets</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin */}
            {user.role === 'ADMIN' && (
              <Link to="/admin" className={navLinkClass('/admin')}>
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-3">
            {token ? (
              <>
                {/* Notification Bell */}
                <Link to="/notifications"
                  className={`relative p-2 rounded-lg transition duration-200 ${
                    isActive('/notifications')
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}>
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                                     text-xs rounded-full h-5 w-5 flex items-center 
                                     justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Info */}
                <div className="flex items-center space-x-2 bg-gray-800 
                                border border-gray-600 px-3 py-1.5 rounded-xl">
                  <FaUserCircle size={22} className="text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-white leading-none">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-blue-400 leading-none mt-0.5">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Logout */}
                <button onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 
                             rounded-lg text-sm font-medium transition duration-200 
                             shadow-md hover:shadow-red-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-gray-300 hover:text-white text-sm font-medium 
                             transition duration-200">
                  Login
                </Link>
                <Link to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
                             rounded-lg text-sm font-medium transition duration-200 
                             shadow-md">
                  Register
                </Link>
                <a href="http://localhost:8082/oauth2/authorization/google"
                  className="flex items-center space-x-2 bg-white hover:bg-gray-100 
                             text-gray-800 px-4 py-2 rounded-lg text-sm font-medium 
                             transition duration-200 shadow-md">
                  <img src="https://www.google.com/favicon.ico" 
                       alt="Google" className="w-4 h-4" />
                  <span>Google</span>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-1">
          <Link to="/" className="block text-gray-300 hover:text-white hover:bg-gray-700 
                                   px-3 py-2 rounded-lg text-sm"
            onClick={() => setIsOpen(false)}>🏠 Home</Link>

          <p className="text-xs text-gray-500 uppercase px-3 pt-2">Facilities</p>
          <Link to="/facilities" className="block text-gray-300 hover:text-white 
                                             hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            onClick={() => setIsOpen(false)}>🏛️ Browse Facilities</Link>
          <Link to="/facilities/search" className="block text-gray-300 hover:text-white 
                                                    hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            onClick={() => setIsOpen(false)}>🔍 Search & Filter</Link>

          <p className="text-xs text-gray-500 uppercase px-3 pt-2">Bookings</p>
          <Link to="/bookings/new" className="block text-gray-300 hover:text-white 
                                               hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            onClick={() => setIsOpen(false)}>➕ New Booking</Link>
          <Link to="/bookings/my" className="block text-gray-300 hover:text-white 
                                              hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            onClick={() => setIsOpen(false)}>📋 My Bookings</Link>

          <p className="text-xs text-gray-500 uppercase px-3 pt-2">Maintenance</p>
          <Link to="/tickets/new" className="block text-gray-300 hover:text-white 
                                              hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            onClick={() => setIsOpen(false)}>🚨 Report Incident</Link>
          <Link to="/tickets/my" className="block text-gray-300 hover:text-white 
                                             hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
            onClick={() => setIsOpen(false)}>🎫 My Tickets</Link>

          <p className="text-xs text-gray-500 uppercase px-3 pt-2">Account</p>
          {token ? (
            <>
              <Link to="/notifications" className="block text-gray-300 hover:text-white 
                                                    hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
                onClick={() => setIsOpen(false)}>
                🔔 Notifications {unreadCount > 0 && `(${unreadCount})`}
              </Link>
              <button onClick={handleLogout}
                className="w-full text-left bg-red-600 hover:bg-red-700 text-white 
                           px-3 py-2 rounded-lg text-sm mt-1">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-300 hover:text-white 
                                            hover:bg-gray-700 px-3 py-2 rounded-lg text-sm"
                onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block bg-blue-600 hover:bg-blue-700 
                                               text-white px-3 py-2 rounded-lg text-sm"
                onClick={() => setIsOpen(false)}>Register</Link>
              <a href="http://localhost:8082/oauth2/authorization/google"
                className="flex items-center space-x-2 bg-white text-gray-800 
                           px-3 py-2 rounded-lg text-sm mt-1">
                <img src="https://www.google.com/favicon.ico" 
                     alt="Google" className="w-4 h-4" />
                <span>Sign in with Google</span>
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;