// src/components/RoleGuard.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/AuthContext';

const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      navigate('/dashboard');
    }
  }, [user, allowedRoles, location.pathname]);

  return <>{children}</>;
};

export default RoleGuard;
