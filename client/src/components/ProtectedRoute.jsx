import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminMe } from '../services/api';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking'); // checking | ok | denied

  useEffect(() => {
    getAdminMe()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C69A69] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (status === 'denied') return <Navigate to="/admin/login" replace />;
  return children;
}
