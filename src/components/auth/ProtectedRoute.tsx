import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { currentUser } = useAuth();

  // Hvis vi kræver auth og brugeren ikke er logget ind, redirect til login
  if (requireAuth && !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Hvis vi ikke kræver auth og brugeren er logget ind, redirect til dashboard
  if (!requireAuth && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 