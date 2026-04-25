import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const sampleNotifications = [
  {
    id: 1,
    title: 'Booking Approved',
    message: 'Your booking for Lab A-101 on April 8, 2026 has been approved.',
    type: 'BOOKING_APPROVED',
    isRead: false,
    createdAt: '2026-04-07T08:30:00'
  },
  {
    id: 2,
    title: 'Ticket Status Updated',
    message: 'Your incident ticket #2 status has been updated to IN_PROGRESS.',
    type: 'TICKET_STATUS_CHANGED',
    isRead: false,
    createdAt: '2026-04-07T07:15:00'
  },
  {
    id: 3,
    title: 'New Comment on Ticket',
    message: 'Technician added a comment on your ticket: "Will fix by tomorrow".',
    type: 'NEW_COMMENT',
    isRead: true,
    createdAt: '2026-04-06T15:00:00'
  },
  {
    id: 4,
    title: 'Booking Rejected',
    message: 'Your booking for Hall B-201 has been rejected. Reason: Already booked.',
    type: 'BOOKING_REJECTED',
    isRead: true,
    createdAt: '2026-04-06T10:00:00'
  },
  {
    id: 5,
    title: 'Booking Approved',
    message: 'Your booking for Meeting Room C-101 has been approved.',
    type: 'BOOKING_APPROVED',
    isRead: true,
    createdAt: '2026-04-05T14:00:00'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    setNotifications(sampleNotifications);
    setLoading(false);
  }, []);

  const markAsRead = async (id) => {
    try {
      // Backend connect වෙන්නකොට:
      // await axios.put(`http://localhost:8082/api/notifications/${id}/read`,
      //   {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      BOOKING_APPROVED: '✅',
      BOOKING_REJECTED: '❌',
      TICKET_STATUS_CHANGED: '🔄',
      NEW_COMMENT: '💬',
    };
    return icons[type] || '🔔';
  };

  const getTypeColor = (type) => {
    const colors = {
      BOOKING_APPROVED: 'bg-green-100 text-green-700 border-green-200',
      BOOKING_REJECTED: 'bg-red-100 text-red-700 border-red-200',
      TICKET_STATUS_CHANGED: 'bg-blue-100 text-blue-700 border-blue-200',
      NEW_COMMENT: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTypeLabel = (type) => {
    const labels = {
      BOOKING_APPROVED: 'Booking Approved',
      BOOKING_REJECTED: 'Booking Rejected',
      TICKET_STATUS_CHANGED: 'Ticket Update',
      NEW_COMMENT: 'New Comment',
    };
    return labels[type] || 'Notification';
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 
                      text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Notifications</p>
              <h1 className="text-3xl font-bold mt-1">
                🔔 Notification Panel
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}
                className="bg-white/10 hover:bg-white/20 border border-white/20 
                           text-white px-4 py-2 rounded-xl text-sm font-medium 
                           transition duration-200">
                Mark all as read ✓
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: notifications.length, color: 'border-blue-500', icon: '🔔' },
            { label: 'Unread', value: unreadCount, color: 'border-red-500', icon: '📬' },
            { label: 'Read', value: notifications.length - unreadCount, color: 'border-green-500', icon: '📭' },
          ].map((stat, i) => (
            <div key={i}
              className={`bg-white rounded-2xl p-4 shadow-md border-l-4 ${stat.color}
                         flex items-center justify-between`}>
              <div>
                <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          {['ALL', 'UNREAD', 'READ'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition duration-200 ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}>
              {f === 'ALL' ? `All (${notifications.length})`
                : f === 'UNREAD' ? `Unread (${unreadCount})`
                : `Read (${notifications.length - unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <span className="text-6xl">📭</span>
            <p className="text-gray-500 mt-4 text-lg font-medium">
              No notifications found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div key={notif.id}
                onClick={() => !notif.isRead && markAsRead(notif.id)}
                className={`bg-white rounded-2xl shadow-md p-5 border transition 
                           duration-200 cursor-pointer hover:shadow-lg ${
                  notif.isRead
                    ? 'border-gray-100 opacity-75'
                    : 'border-blue-100 border-l-4 border-l-blue-500'
                }`}>
                <div className="flex items-start space-x-4">

                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl border 
                                  flex items-center justify-center text-xl
                                  ${getTypeColor(notif.type)}`}>
                    {getTypeIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-bold ${
                          notif.isRead ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notif.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border
                                         ${getTypeColor(notif.type)}`}>
                          {getTypeLabel(notif.type)}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"/>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      notif.isRead ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {notif.message}
                    </p>
                    {!notif.isRead && (
                      <p className="text-xs text-blue-500 mt-2 font-medium">
                        Click to mark as read
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <Link to="/dashboard"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
