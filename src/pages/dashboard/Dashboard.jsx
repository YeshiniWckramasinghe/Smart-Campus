import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import LecturerDashboard from './LecturerDashboard';
import TechnicianDashboard from './TechnicianDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
    return null;
  }

  if (user.role === 'ADMIN') return <AdminDashboard user={user} />;
if (user.role === 'TECHNICIAN') return <TechnicianDashboard user={user} />;
return <UserDashboard user={user} />; // LECTURER & USER 
};

export default Dashboard;