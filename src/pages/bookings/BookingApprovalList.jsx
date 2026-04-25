import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';

const statusClassMap = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-gray-200 text-gray-700',
};

const BookingApprovalList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error?.response?.status === 401) {
        message.error('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (error?.response?.status === 403) {
        message.error('Only admins can access booking approvals.');
        navigate('/dashboard');
        return;
      }

      const apiMessage = error?.response?.data?.error || error?.response?.data?.message;
      message.error(apiMessage || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
      message.error('Please sign in first.');
      navigate('/login');
      return;
    }

    if (user?.role !== 'ADMIN') {
      message.error('Only admins can access booking approvals.');
      navigate('/dashboard');
      return;
    }

    loadBookings();
  }, []);

  const updateStatus = async (bookingId, status, reason = null) => {
    setUpdatingId(bookingId);
    try {
      const payload = reason ? { status, reason } : { status };
      await axios.patch(`/api/bookings/${bookingId}/status`, payload);
      message.success(`Booking ${status.toLowerCase()} successfully.`);
      loadBookings();
    } catch (error) {
      const apiMessage = error?.response?.data?.error || error?.response?.data?.message;
      message.error(apiMessage || 'Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = (bookingId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason == null) return;

    if (!reason.trim()) {
      message.error('Rejection reason is required.');
      return;
    }

    updateStatus(bookingId, 'REJECTED', reason.trim());
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const formatTime = (value) => {
    if (!value) return '-';
    const [h, m] = String(value).split(':');
    if (h == null || m == null) return value;
    const date = new Date();
    date.setHours(Number(h), Number(m), 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Approvals</h1>
            <p className="text-sm text-gray-500 mt-1">Review pending bookings and approve or reject requests.</p>
          </div>
          <button
            type="button"
            onClick={loadBookings}
            disabled={loading}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="py-3 pr-4">Requester</th>
                  <th className="py-3 pr-4">Resource</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Time</th>
                  <th className="py-3 pr-4">Capacity</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Purpose</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const isPending = booking.status === 'PENDING';
                  const isUpdating = updatingId === booking.id;

                  return (
                    <tr key={booking.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3 pr-4">{booking.requesterEmail || '-'}</td>
                      <td className="py-3 pr-4 font-medium text-gray-700">{booking.resourceType}</td>
                      <td className="py-3 pr-4">{formatDate(booking.bookingDate)}</td>
                      <td className="py-3 pr-4">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</td>
                      <td className="py-3 pr-4">{booking.expectedCapacity}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClassMap[booking.status] || 'bg-gray-200 text-gray-700'}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 max-w-xs truncate" title={booking.purpose}>{booking.purpose}</td>
                      <td className="py-3">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateStatus(booking.id, 'APPROVED')}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(booking.id)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No actions</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingApprovalList;
