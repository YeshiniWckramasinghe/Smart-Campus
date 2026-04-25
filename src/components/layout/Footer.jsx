import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Smart Campus</h3>
                <p className="text-xs text-gray-400">SLIIT</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A modern platform to manage university facility bookings,
              maintenance, and campus operations efficiently.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 mt-5">
              <button type="button"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg 
                           transition duration-200 border border-gray-700">
                <FaFacebook size={16} />
              </button>
              <button type="button"
                className="bg-gray-800 hover:bg-blue-400 p-2 rounded-lg 
                           transition duration-200 border border-gray-700">
                <FaTwitter size={16} />
              </button>
              <button type="button"
                className="bg-gray-800 hover:bg-blue-700 p-2 rounded-lg 
                           transition duration-200 border border-gray-700">
                <FaLinkedin size={16} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase 
                           tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: '🏠 Home' },
                { to: '/dashboard', label: '📊 Dashboard' },
                { to: '/facilities', label: '🏛️ Facilities' },
                { to: '/bookings/my', label: '📋 My Bookings' },
                { to: '/tickets/my', label: '🎫 My Tickets' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-gray-400 hover:text-white text-sm 
                               transition duration-200 hover:translate-x-1 
                               inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase 
                           tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/facilities/search', label: '🔍 Search Facilities' },
                { to: '/bookings/new', label: '➕ New Booking' },
                { to: '/tickets/new', label: '🚨 Report Incident' },
                { to: '/notifications', label: '🔔 Notifications' },
                { to: '/login', label: '🔐 Login' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-gray-400 hover:text-white text-sm 
                               transition duration-200 hover:translate-x-1 
                               inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase 
                           tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  SLIIT, Malabe, Colombo, Sri Lanka
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+94 11 754 4801</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  support@smartcampus.lk
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col 
                        md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © 2026 Smart Campus — SLIIT. All rights reserved.
          </p>
          <div className="flex space-x-4 text-gray-500 text-sm">
            <button type="button" className="hover:text-gray-300 transition duration-200">
              Privacy Policy
            </button>
            <span>•</span>
            <button type="button" className="hover:text-gray-300 transition duration-200">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;