
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedRoute = ({ allowedRoles, role, children }) => {
  // const { role } = useAuth();
  console.log(allowedRoles)
  console.log(role)


  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" />; 
  }

  return children;

};

export default ProtectedRoute;