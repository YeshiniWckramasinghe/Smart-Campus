import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Notifications from './pages/notifications/Notifications';
import TicketDashboard from './pages/ticketing/TicketDashboard';
import TicketReportForm from './pages/ticketing/TicketReportForm';
import TicketDetail from './pages/ticketing/TicketDetail';
import OAuth2Success from './pages/auth/OAuth2Success';
import ResourceBookingForm from './pages/bookings/ResourceBookingForm';
import FacilityManager from './pages/facilities/FacilityManager';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth2/success" element={<OAuth2Success />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/tickets" element={<TicketDashboard />} />
              <Route path="/tickets/my" element={<TicketDashboard />} />
              <Route path="/tickets/all" element={<TicketDashboard />} />
              <Route path="/tickets/new" element={<TicketReportForm />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/bookings/new" element={<ResourceBookingForm />} />
              <Route path="/facilities" element={<FacilityManager />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;