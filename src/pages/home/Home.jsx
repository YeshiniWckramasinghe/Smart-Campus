import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const features = [
    {
      icon: '🏛️',
      title: 'Facility Booking',
      description: 'Book lecture halls, labs, meeting rooms and equipment with ease.',
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      icon: '🔧',
      title: 'Maintenance & Incidents',
      description: 'Report and track maintenance issues and incidents on campus.',
      color: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
    },
    {
      icon: '🔔',
      title: 'Real-time Notifications',
      description: 'Stay updated with booking approvals, ticket updates and comments.',
      color: 'bg-yellow-50 border-yellow-200',
      iconBg: 'bg-yellow-100',
    },
    {
      icon: '🔐',
      title: 'Secure Access',
      description: 'Role-based access control with Google OAuth2 authentication.',
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
    },
    {
      icon: '👥',
      title: 'Role Management',
      description: 'Separate dashboards for Admin, Lecturers and Technicians.',
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100',
    },
    {
      icon: '📊',
      title: 'Dashboard Analytics',
      description: 'View booking stats, ticket status and campus activity at a glance.',
      color: 'bg-indigo-50 border-indigo-200',
      iconBg: 'bg-indigo-100',
    },
  ];

  const stats = [
    { icon: '🏛️', value: '50+', label: 'Facilities' },
    { icon: '👥', value: '200+', label: 'Users' },
    { icon: '📋', value: '1000+', label: 'Bookings' },
    { icon: '🎫', value: '500+', label: 'Tickets Resolved' },
  ];

  const roles = [
    {
      icon: '⚙️',
      title: 'Admin',
      description: 'Manage all bookings, tickets, facilities and users from one place.',
      color: 'from-blue-600 to-blue-800',
    },
    {
      icon: '👨‍🏫',
      title: 'Lecturer',
      description: 'Book facilities, report incidents and track your requests easily.',
      color: 'from-green-600 to-green-800',
    },
    {
      icon: '🔧',
      title: 'Technician',
      description: 'Handle assigned maintenance tickets and update resolution status.',
      color: 'from-orange-600 to-orange-800',
    },
  ];

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 
                      text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 
                          rounded-full blur-3xl"/>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-700 
                          rounded-full blur-3xl"/>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-600/30 
                          border border-blue-500/50 rounded-full px-4 py-2 mb-6">
            <span className="text-blue-300 text-sm font-medium">
              🎓 SLIIT Smart Campus Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Manage Your Campus
            <span className="block text-blue-400 mt-2">
              Resources Efficiently
            </span>
          </h1>

          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern platform to streamline facility bookings, maintenance tracking,
            and campus operations — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center 
                          space-y-3 sm:space-y-0 sm:space-x-4">
            {token ? (
              <>
                <Link to="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                             px-8 py-4 rounded-xl transition duration-200 shadow-lg 
                             hover:shadow-xl text-lg">
                  Go to Dashboard →
                </Link>
                <Link to="/notifications"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 
                             text-white font-semibold px-8 py-4 rounded-xl 
                             transition duration-200 text-lg">
                  🔔 Notifications
                </Link>
              </>
            ) : (
              <>
                <Link to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                             px-8 py-4 rounded-xl transition duration-200 shadow-lg 
                             hover:shadow-xl text-lg">
                  Get Started →
                </Link>
                <Link to="/login"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 
                             text-white font-semibold px-8 py-4 rounded-xl 
                             transition duration-200 text-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 border-t border-white/10 bg-white/5">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="text-3xl">{stat.icon}</span>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Powerful features to manage your campus efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i}
                className={`${feature.color} border rounded-2xl p-6 
                           hover:shadow-md transition duration-200`}>
                <div className={`${feature.iconBg} w-14 h-14 rounded-xl 
                               flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Built for Everyone
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Different roles, tailored experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, i) => (
              <div key={i}
                className={`bg-gradient-to-br ${role.color} text-white 
                           rounded-2xl p-8 shadow-lg hover:shadow-xl 
                           transition duration-200`}>
                <span className="text-5xl">{role.icon}</span>
                <h3 className="text-2xl font-bold mt-4 mb-3">{role.title}</h3>
                <p className="text-white/80 leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!token && (
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 
                        py-20 px-6 text-center text-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join Smart Campus today and streamline your campus operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center 
                            justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                           px-8 py-4 rounded-xl transition duration-200 shadow-lg">
                Create Account →
              </Link>
              <a href="http://localhost:8082/oauth2/authorization/google"
                className="flex items-center space-x-2 bg-white/10 
                           hover:bg-white/20 border border-white/20 
                           text-white font-semibold px-8 py-4 rounded-xl 
                           transition duration-200">
                <img src="https://www.google.com/favicon.ico"
                  alt="Google" className="w-5 h-5"/>
                <span>Sign in with Google</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
