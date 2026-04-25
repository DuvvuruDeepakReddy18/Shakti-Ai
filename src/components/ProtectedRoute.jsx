import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requireOnboarding = true }) {
  const { user, userProfile, loading } = useAuthStore();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  
  if (!user) {
    if (location.pathname === '/') {
      return <Navigate to="/landing" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user hasn't finished onboarding and this route requires it
  if (requireOnboarding && userProfile && userProfile.onboardingComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }

  // If the user HAS finished onboarding, prevent them from accessing the onboarding page again
  if (!requireOnboarding && userProfile && userProfile.onboardingComplete === true) {
    return <Navigate to="/" replace />;
  }

  return children;
}
