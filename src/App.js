import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Notifications from './pages/notifications/Notifications';
import TicketDashboard from './pages/ticketing/TicketDashboard';
import TicketReportForm from './pages/ticketing/TicketReportForm';
import TicketDetail from './pages/ticketing/TicketDetail';

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={
                <div className="flex items-center justify-center h-full py-20">
                  <h1 className="text-3xl font-bold text-blue-800">
                    Welcome to Smart Campus 🎓
                  </h1>
                </div>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Ticketing Routes */}
              <Route path="/tickets" element={<TicketDashboard />} />
              <Route path="/tickets/my" element={<TicketDashboard />} />
              <Route path="/tickets/all" element={<TicketDashboard />} />
              <Route path="/tickets/new" element={<TicketReportForm />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;