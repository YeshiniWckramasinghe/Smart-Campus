import React from 'react';
import { Link } from 'react-router-dom';

const TechnicianDashboard = ({ user }) => {
  const assignedTickets = [
    { id: 1, title: 'Projector not working', location: 'Lab A-101', 
      priority: 'HIGH', status: 'IN_PROGRESS', reporter: 'Dr. Smith' },
    { id: 2, title: 'AC malfunction', location: 'Hall B-201', 
      priority: 'MEDIUM', status: 'OPEN', reporter: 'Dr. Jane' },
    { id: 3, title: 'Network issue', location: 'Room C-301', 
      priority: 'HIGH', status: 'OPEN', reporter: 'Dr. Kumar' },
  ];

  const notifications = [
    { id: 1, message: 'New ticket assigned: Projector not working', time: '1h ago', read: false },
    { id: 2, message: 'Ticket #1 deadline approaching', time: '3h ago', read: false },
    { id: 3, message: 'Ticket #3 marked as resolved', time: '1d ago', read: true },
  ];

  const statusColor = (status) => {
    const colors = {
      OPEN: 'bg-red-100 text-red-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      RESOLVED: 'bg-green-100 text-green-700',
      CLOSED: 'bg-gray-100 text-gray-700',
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-sm font-medium">Technician Dashboard</p>
            <h1 className="text-3xl font-bold mt-1">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your assigned maintenance tickets
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3 
                          bg-white/10 rounded-2xl px-5 py-3">
            <span className="text-3xl">🔧</span>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-blue-300 text-xs">Technician</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎫', label: 'Assigned Tickets', value: '3', color: 'border-blue-500' },
            { icon: '🔴', label: 'Open', value: '2', color: 'border-red-500' },
            { icon: '🔵', label: 'In Progress', value: '1', color: 'border-blue-500' },
            { icon: '✅', label: 'Resolved Today', value: '0', color: 'border-green-500' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Assigned Tickets */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Assigned Tickets</h2>
              <Link to="/tickets/all"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {assignedTickets.map((ticket) => (
                <div key={ticket.id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 
                             transition duration-150">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900 text-sm">
                      {ticket.title}
                    </p>
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
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>📍 {ticket.location}</span>
                    <span>👤 {ticket.reporter}</span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white 
                                 px-3 py-1.5 rounded-lg transition duration-200">
                      Update Status
                    </button>
                    <button
                      className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 
                                 px-3 py-1.5 rounded-lg transition duration-200">
                      Add Note
                    </button>
                  </div>
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
      </div>
    </div>
  );
};

export default TechnicianDashboard;