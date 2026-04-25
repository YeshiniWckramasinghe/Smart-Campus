import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const statusClassMap = {
  PENDING: {
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    card: 'from-amber-50/70 to-white border-amber-100',
    dot: 'bg-amber-500',
  },
  APPROVED: {
    badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    card: 'from-emerald-50/70 to-white border-emerald-100',
    dot: 'bg-emerald-500',
  },
  REJECTED: {
    badge: 'bg-rose-100 text-rose-700 border border-rose-200',
    card: 'from-rose-50/70 to-white border-rose-100',
    dot: 'bg-rose-500',
  },
  CANCELLED: {
    badge: 'bg-slate-200 text-slate-700 border border-slate-300',
    card: 'from-slate-100/70 to-white border-slate-200',
    dot: 'bg-slate-500',
  },
};

const normalizeSearchText = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const MyBookings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadMyBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Please sign in first.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/api/bookings/my');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error?.response?.status === 401) {
        message.error('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const apiMessage = error?.response?.data?.error || error?.response?.data?.message;
      message.error(apiMessage || 'Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, []);

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

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return bookings;

    const normalizedQuery = normalizeSearchText(query);
    const queryTerms = query.split(/\s+/).filter(Boolean);

    return bookings.filter((booking) => {
      const searchableValues = [
        booking.resourceType,
        booking.status,
        booking.purpose,
        booking.bookingDate,
        booking.startTime,
        booking.endTime,
        formatDate(booking.bookingDate),
        `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
        String(booking.expectedCapacity ?? ''),
      ].filter(Boolean);

      const plainSearchable = searchableValues.join(' ').toLowerCase();
      const normalizedSearchable = normalizeSearchText(searchableValues.join(' '));

      const directMatch = plainSearchable.includes(query) || normalizedSearchable.includes(normalizedQuery);
      if (directMatch) {
        return true;
      }

      return queryTerms.every((term) => {
        const normalizedTerm = normalizeSearchText(term);
        return plainSearchable.includes(term) || normalizedSearchable.includes(normalizedTerm);
      });
    });
  }, [bookings, searchTerm]);

  const handleGeneratePdfReport = () => {
    if (filteredBookings.length === 0) {
      message.warning('No bookings available to generate a report.');
      return;
    }

    const doc = new jsPDF();
    const generatedAt = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text('My Bookings Report', 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated: ${generatedAt}`, 14, 23);
    doc.text(`Records: ${filteredBookings.length}`, 14, 29);
    if (searchTerm.trim()) {
      doc.text(`Filter: ${searchTerm.trim()}`, 14, 35);
    }

    autoTable(doc, {
      startY: searchTerm.trim() ? 40 : 34,
      head: [['Resource', 'Date', 'Time', 'Expected Capacity', 'Status', 'Purpose']],
      body: filteredBookings.map((booking) => [
        booking.resourceType || '-',
        formatDate(booking.bookingDate),
        `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
        String(booking.expectedCapacity ?? '-'),
        booking.status || '-',
        booking.purpose || '-',
      ]),
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [30, 64, 175] },
    });

    doc.save('my-bookings-report.pdf');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl px-6 py-7 md:px-8 md:py-8 mb-6 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-blue-200 text-xs font-semibold tracking-wider uppercase">Bookings</p>
            <h1 className="text-3xl font-bold mt-2">My Bookings</h1>
            <p className="text-blue-100/90 text-sm mt-2">Track all your booking requests and statuses.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
            <span className="text-xl">📋</span>
            <div>
              <p className="text-sm font-semibold">Total Requests</p>
              <p className="text-xs text-blue-100/90">{filteredBookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Booking Cards</h2>
          <p className="text-sm text-gray-500 mt-1">Live status updates for each request.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGeneratePdfReport}
            className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl px-4 py-2 transition-colors"
          >
            Generate PDF Report
          </button>
          <button
            type="button"
            onClick={loadMyBookings}
            disabled={loading}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 bg-white border border-indigo-100 hover:border-indigo-200 rounded-xl px-4 py-2 transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="mb-5">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resource, status, purpose, date, or capacity"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {searchTerm.trim() && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </p>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-sm text-gray-500 flex items-center gap-3">
          <span className="text-lg">🗂️</span>
          <span>{searchTerm.trim() ? 'No bookings match your search.' : 'No bookings found yet.'}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBookings.map((booking) => {
            const statusStyles = statusClassMap[booking.status] || {
              badge: 'bg-slate-100 text-slate-700 border border-slate-200',
              card: 'from-slate-50/70 to-white border-slate-100',
              dot: 'bg-slate-500',
            };

            return (
            <div
              key={booking.id}
              className={`bg-gradient-to-br ${statusStyles.card} rounded-2xl shadow-sm hover:shadow-md border p-5 transition-all duration-200`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-gray-900 leading-6">{booking.resourceType}</h3>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
                  {booking.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold text-gray-800">Date:</span> {formatDate(booking.bookingDate)}</p>
                <p><span className="font-semibold text-gray-800">Time:</span> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                <p><span className="font-semibold text-gray-800">Expected Capacity:</span> {booking.expectedCapacity}</p>
                <p className="pt-1 border-t border-gray-100 mt-2"><span className="font-semibold text-gray-800">Purpose:</span> {booking.purpose || '-'}</p>
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
