import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';

const MonitorIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const inputClass =
  'w-full border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white';

const labelClass = 'block text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2';

const statusClassMap = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700',
  CANCELLED: 'bg-gray-200 text-gray-700',
};

const normalizeDate = (value) => {
  if (!value) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return value;

  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const normalizeTime = (value) => {
  if (!value) return value;
  const raw = value.trim();

  if (/^\d{2}:\d{2}$/.test(raw)) return raw;

  const match = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return raw;

  const [, h, m, periodRaw] = match;
  const period = periodRaw.toUpperCase();
  let hour = Number(h);

  if (period === 'AM' && hour === 12) hour = 0;
  if (period === 'PM' && hour < 12) hour += 12;

  return `${String(hour).padStart(2, '0')}:${m}`;
};

const ResourceBookingForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceType: '',
    date: '',
    startTime: '',
    endTime: '',
    expectedCapacity: '',
    purpose: '',
  });

  useEffect(() => {
    const loadFacilities = async () => {
      setLoadingResources(true);
      try {
        const response = await axios.get('/api/facility-options');
        const options = Array.isArray(response.data)
          ? response.data.map((facility) => ({
              value: `${facility.name}${facility.location ? ` - ${facility.location}` : ''}`,
              label: `${facility.name} - ${facility.location || 'Location N/A'} (Capacity: ${facility.capacity ?? 'N/A'})`,
              capacity: facility.capacity,
            }))
          : [];

        setResources(options);
      } catch (error) {
        const apiMessage = error?.response?.data?.error || error?.response?.data?.message;
        message.error(apiMessage || 'Failed to load facilities.');
        setResources([]);
      } finally {
        setLoadingResources(false);
      }
    };

    loadFacilities();
  }, []);

  const loadMyBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setBookings([]);
      return;
    }

    setLoadingBookings(true);
    try {
      const response = await axios.get('/api/bookings/my');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      const apiMessage = error?.response?.data?.error || error?.response?.data?.message;
      message.error(apiMessage || 'Unable to load your bookings.');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectedResource = resources.find((r) => r.value === form.resourceType);
  const selectedCapacity = selectedResource?.capacity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Please sign in before creating a booking.');
      navigate('/login');
      return;
    }
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      message.error('End time must be after start time.');
      return;
    }

    if (
      selectedCapacity != null &&
      selectedCapacity > 0 &&
      Number(form.expectedCapacity) > Number(selectedCapacity)
    ) {
      message.error(`Expected capacity cannot exceed selected facility capacity (${selectedCapacity}).`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        resourceType: form.resourceType,
        date: normalizeDate(form.date),
        startTime: normalizeTime(form.startTime),
        endTime: normalizeTime(form.endTime),
        expectedCapacity: Number(form.expectedCapacity),
        purpose: form.purpose,
      };

      await axios.post('/api/bookings', payload);
      message.success('Booking request submitted and saved successfully.');
      setForm({
        resourceType: '',
        date: '',
        startTime: '',
        endTime: '',
        expectedCapacity: '',
        purpose: '',
      });
      loadMyBookings();
    } catch (error) {
      if (error?.response?.status === 401) {
        message.error('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = error?.response?.data;
      const apiMessage =
        data?.error ||
        data?.detail ||
        data?.title ||
        data?.message ||
        (typeof data === 'string' ? data : null);

      const networkMessage = error?.message;

      message.error(apiMessage || networkMessage || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/dashboard');
  };

  const formatDateForTable = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const formatTimeForTable = (value) => {
    if (!value) return '-';
    const [h, m] = value.split(':');
    if (h == null || m == null) return value;
    const date = new Date();
    date.setHours(Number(h), Number(m), 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} noValidate>

          {/* Resource Type */}
          <div className="mb-6">
            <label className={labelClass}>Resource Type</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 z-10 flex items-center">
                <MonitorIcon />
              </span>
              <select
                name="resourceType"
                value={form.resourceType}
                onChange={handleChange}
                disabled={loadingResources}
                required
                className={`${inputClass} pl-10 pr-10 appearance-none cursor-pointer disabled:text-gray-400`}
              >
                <option value="" disabled>
                  {loadingResources
                    ? 'Loading facilities...'
                    : resources.length > 0
                      ? 'Select a resource type'
                      : 'No facilities available'}
                </option>
                {resources.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <span className="absolute right-3 flex items-center">
                <ChevronIcon />
              </span>
            </div>
          </div>

          {/* Date / Start Time / End Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Time</label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Expected Capacity */}
          <div className="mb-6">
            <label className={labelClass}>Expected Capacity</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 flex items-center">
                <MonitorIcon />
              </span>
              <input
                type="number"
                name="expectedCapacity"
                value={form.expectedCapacity}
                onChange={handleChange}
                placeholder="e.g. 25"
                min={1}
                max={selectedCapacity != null ? selectedCapacity : undefined}
                required
                className={`${inputClass} pl-10`}
              />
            </div>
            {selectedCapacity != null && (
              <p className="mt-2 text-xs text-gray-500">
                Maximum allowed for selected resource: {selectedCapacity}
              </p>
            )}
          </div>

          {/* Purpose / Description */}
          <div className="mb-8">
            <label className={labelClass}>Purpose / Description</label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              rows={5}
              placeholder="Briefly describe what you'll be using this resource for..."
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting || loadingResources}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              {submitting ? 'Submitting...' : 'Confirm Booking'}
            </button>
          </div>

        </form>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">My Bookings</h3>
          <button
            type="button"
            onClick={loadMyBookings}
            disabled={loadingBookings}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
          >
            {loadingBookings ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="py-3 pr-4">Resource</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Time</th>
                  <th className="py-3 pr-4">Capacity</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 pr-4 font-medium text-gray-700">{booking.resourceType}</td>
                    <td className="py-3 pr-4">{formatDateForTable(booking.bookingDate)}</td>
                    <td className="py-3 pr-4">
                      {formatTimeForTable(booking.startTime)} - {formatTimeForTable(booking.endTime)}
                    </td>
                    <td className="py-3 pr-4">{booking.expectedCapacity}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClassMap[booking.status] || 'bg-gray-200 text-gray-700'}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 max-w-xs truncate" title={booking.purpose}>{booking.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceBookingForm;
