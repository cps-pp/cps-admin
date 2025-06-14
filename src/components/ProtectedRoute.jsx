
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useAuth();

  console.log('ProtectedRoute - Current role:', role);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles: string[];
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
//   const { role, isAuthenticated } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {  
//     return <Navigate to="/login" />;
//   }

//   if (role && allowedRoles.includes(role)) {
//     return <>{children}</>;
//   }

//   return <Navigate to="/login" />;
// };

// export default ProtectedRoute;