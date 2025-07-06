
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ allowedRoles, role, children }) => {
  // const { role } = useAuth();
  console.log(allowedRoles)
  console.log(role)
  // console.log('ProtectedRoute - Current role:', role);

  // if (!role) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (!allowedRoles.includes(role)) {
  //   return <>{children}</>;
  // }

  // return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" />; // หรือหน้า login
  }

  return children;

};

export default ProtectedRoute;