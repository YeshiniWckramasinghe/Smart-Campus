import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = ({ user }) => {
  const myBookings = [
    { id: 1, facility: 'Lab A-101', date: '2026-04-06', time: '9:00 - 11:00', status: 'APPROVED' },
    { id: 2, facility: 'Hall B-201', date: '2026-04-07', time: '14:00 - 16:00', status: 'PENDING' },
  ];

  const myTickets = [
    { id: 1, title: 'Projector not working', date: '2026-04-05', status: 'IN_PROGRESS' },
    { id: 2, title: 'AC not cooling', date: '2026-04-04', status: 'OPEN' },
  ];

  const notifications = [
    { id: 1, message: 'Your booking for Lab A-101 has been approved', time: '2h ago', read: false },
    { id: 2, message: 'Ticket #2 status updated to IN_PROGRESS', time: '5h ago', read: false },
    { id: 3, message: 'Your booking for Hall B-201 is pending review', time: '1d ago', read: true },
  ];

  const statusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      OPEN: 'bg-red-100 text-red-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      RESOLVED: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const roleLabel = user.role === 'LECTURER' ? 'Lecturer' : 'User';
  const roleIcon = user.role === 'LECTURER' ? '👨‍🏫' : '👤';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 
                      text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-sm font-medium">{roleLabel} Dashboard</p>
            <h1 className="text-3xl font-bold mt-1">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your bookings and tickets
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3 
                          bg-white/10 rounded-2xl px-5 py-3">
            <span className="text-3xl">{roleIcon}</span>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-blue-300 text-xs">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📋', label: 'My Bookings', value: '2', color: 'border-blue-500' },
            { icon: '✅', label: 'Approved', value: '1', color: 'border-green-500' },
            { icon: '⏳', label: 'Pending', value: '1', color: 'border-yellow-500' },
            { icon: '🎫', label: 'My Tickets', value: '2', color: 'border-red-500' },
          ].map((stat, i) => (
            <div key={i}
              className={`bg-white rounded-2xl p-5 shadow-md border-l-4 ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '➕', label: 'New Booking', link: '/bookings/new', color: 'bg-blue-600' },
              { icon: '📋', label: 'My Bookings', link: '/bookings/my', color: 'bg-indigo-600' },
              { icon: '🚨', label: 'Report Incident', link: '/tickets/new', color: 'bg-red-600' },
              { icon: '🔍', label: 'Browse Facilities', link: '/facilities', color: 'bg-green-600' },
            ].map((action, i) => (
              <Link key={i} to={action.link}
                className={`${action.color} hover:opacity-90 text-white rounded-xl 
                            p-4 flex flex-col items-center space-y-2 shadow-md 
                            transition duration-200`}>
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-semibold">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* My Bookings */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Bookings</h2>
              <Link to="/bookings/my"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {myBookings.map((booking) => (
                <div key={booking.id}
                  className="flex items-center justify-between p-3 
                             bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {booking.facility}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {booking.date} • {booking.time}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 
                                   rounded-full ${statusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">🔔 Notifications</h2>
              <Link to="/notifications"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                All →
              </Link>
            </div>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id}
                  className={`p-3 rounded-xl text-sm ${
                    notif.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
                  }`}>
                  <p className={`${notif.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Tickets */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">My Tickets</h2>
            <Link to="/tickets/my"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myTickets.map((ticket) => (
              <div key={ticket.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎫</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{ticket.title}</p>
                    <p className="text-gray-500 text-xs">{ticket.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 
                                 rounded-full ${statusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;