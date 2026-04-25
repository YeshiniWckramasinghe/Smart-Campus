import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const name = searchParams.get('name');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      name: name || 'User',
      role: role || 'USER',
      email: name || 'user'
    }));

    navigate('/dashboard', { replace: true });
  }, [navigate, searchParams]);

  return <div className="p-6 text-center">Signing you in...</div>;
};

export default OAuth2Success;