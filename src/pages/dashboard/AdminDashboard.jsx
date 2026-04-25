import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, color, link }) => (
  <Link to={link || '#'}
    className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-lg 
               transition duration-200 border-l-4 ${color} group`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <span className="text-4xl group-hover:scale-110 transition duration-200">
        {icon}
      </span>
    </div>
  </Link>
);

const AdminDashboard = ({ user }) => {
  const stats = [
    { icon: '🏛️', label: 'Total Facilities', value: '24', 
      color: 'border-blue-500', link: '/facilities' },
    { icon: '📋', label: 'Pending Bookings', value: '8', 
      color: 'border-yellow-500', link: '/bookings/all' },
    { icon: '🎫', label: 'Open Tickets', value: '12', 
      color: 'border-red-500', link: '/tickets/all' },
    { icon: '👥', label: 'Total Users', value: '45', 
      color: 'border-green-500', link: '/admin/users' },
  ];

  const recentBookings = [
    { id: 1, user: 'Dr. Smith', facility: 'Lab A-101', date: '2026-04-06', status: 'PENDING' },
    { id: 2, user: 'Dr. Jane', facility: 'Hall B-201', date: '2026-04-07', status: 'APPROVED' },
    { id: 3, user: 'Dr. Kumar', facility: 'Meeting Room', date: '2026-04-08', status: 'PENDING' },
  ];

  const recentTickets = [
    { id: 1, title: 'Projector not working', location: 'Lab A-101', priority: 'HIGH', status: 'OPEN' },
    { id: 2, title: 'AC malfunction', location: 'Hall B-201', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { id: 3, title: 'Broken chair', location: 'Room C-301', priority: 'LOW', status: 'OPEN' },
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

  const priorityColor = (priority) => {
    const colors = {
      HIGH: 'bg-red-100 text-red-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-green-100 text-green-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 
                      text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Admin Dashboard</p>
              <h1 className="text-3xl font-bold mt-1">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Here's what's happening on campus today
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3 
                            bg-white/10 rounded-2xl px-5 py-3">
              <span className="text-3xl">⚙️</span>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-blue-300 text-xs">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '✅', label: 'Approve Bookings', link: '/bookings/all', color: 'bg-blue-600' },
              { icon: '🔧', label: 'Manage Tickets', link: '/tickets/all', color: 'bg-red-600' },
              { icon: '🏛️', label: 'Manage Facilities', link: '/facilities', color: 'bg-green-600' },
              { icon: '👥', label: 'Manage Users', link: '/admin/users', color: 'bg-purple-600' },
            ].map((action, i) => (
              <Link key={i} to={action.link}
                className={`${action.color} hover:opacity-90 text-white rounded-xl 
                            p-4 flex flex-col items-center space-y-2 shadow-md 
                            transition duration-200 hover:shadow-lg`}>
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-semibold text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/bookings/all"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking.id}
                  className="flex items-center justify-between p-3 
                             bg-gray-50 rounded-xl hover:bg-gray-100 
                             transition duration-150">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {booking.facility}
                    </p>
                    <p className="text-gray-500 text-xs">{booking.user} • {booking.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full 
                                   ${statusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Tickets</h2>
              <Link to="/tickets/all"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id}
                  className="flex items-center justify-between p-3 
                             bg-gray-50 rounded-xl hover:bg-gray-100 
                             transition duration-150">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {ticket.title}
                    </p>
                    <p className="text-gray-500 text-xs">{ticket.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 
                                     rounded-full ${priorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 
                                     rounded-full ${statusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;