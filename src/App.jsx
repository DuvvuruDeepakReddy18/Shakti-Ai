import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { Toaster } from 'react-hot-toast';
import { initTheme } from './store/uiStore';

// Layouts & Guards
import RootLayout from './pages/RootLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import OnboardingPage from './pages/auth/OnboardingPage';

// Main Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/dashboard/Dashboard';

// Safety
import SafetyHome from './pages/safety/SafetyHome';
import SafetyMap from './pages/safety/SafetyMap';
import LiveTracking from './pages/safety/LiveTracking';
import EmergencyContacts from './pages/safety/EmergencyContacts';
import EvidenceLocker from './pages/safety/EvidenceLocker';
import SafetyScoreboard from './pages/safety/SafetyScoreboard';
import IsThisNormal from './pages/safety/IsThisNormal';
import TimeCapsule from './pages/safety/TimeCapsule';
import KnowYourRights from './pages/safety/KnowYourRights';
import ActiveSOSPage from './pages/safety/ActiveSOSPage';


// Jobs
import JobsHome from './pages/jobs/JobsHome';
import SkillTranslator from './pages/jobs/SkillTranslator';
import JobExchange from './pages/jobs/JobExchange';
import Marketplace from './pages/jobs/Marketplace';
import CareerSimulator from './pages/jobs/CareerSimulator';
import MicroInternships from './pages/jobs/MicroInternships';
import ResumeAnalyzer from './pages/jobs/ResumeAnalyzer';

// Tech
import TechHome from './pages/tech/TechHome';
import HackathonArena from './pages/tech/HackathonArena';
import MentorMatch from './pages/tech/MentorMatch';
import IdeaIncubator from './pages/tech/IdeaIncubator';
import Leaderboard from './pages/tech/Leaderboard';
import ProjectGenerator from './pages/tech/ProjectGenerator';
import LearningCenter from './pages/tech/LearningCenter';

// Health
import HealthHome from './pages/health/HealthHome';
import MoodTracker from './pages/health/MoodTracker';
import MenstrualTracker from './pages/health/MenstrualTracker';
import WellnessEngine from './pages/health/WellnessEngine';
import StressDetector from './pages/health/StressDetector';
import AICompanion from './pages/health/AICompanion';
import FoodScanner from './pages/health/FoodScanner';

// Community
import CommunityHome from './pages/community/CommunityHome';
import TrustedCircle from './pages/community/TrustedCircle';
import VolunteerNetwork from './pages/community/VolunteerNetwork';
import Forums from './pages/community/Forums';
import Events from './pages/community/Events';
import SkillExchange from './pages/community/SkillExchange';

// Profile
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/profile/SettingsPage';
import MerchandiseStore from './pages/profile/MerchandiseStore';

export default function App() {
  const { initAuth, loading } = useAuthStore();

  useEffect(() => {
    initAuth();
    initTheme();
  }, [initAuth]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-surface-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Starting SHAKTI AI..." size="lg" />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--color-surface-lowest)',
            color: 'var(--color-shakti-dark-text)',
            border: 'none',
            borderRadius: '16px',
            fontSize: '14px',
            boxShadow: '0 8px 32px rgba(24,20,69,0.08)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } }
        }}
      />

      <Routes>
        {/* Auth Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute requireOnboarding={false}>
            <OnboardingPage />
          </ProtectedRoute>
        } />

        {/* Protected Main App Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />

          {/* Safety */}
          <Route path="safety" element={<SafetyHome />} />
          <Route path="safety/map" element={<SafetyMap />} />
          <Route path="safety/tracking" element={<LiveTracking />} />
          <Route path="safety/contacts" element={<EmergencyContacts />} />
          <Route path="safety/evidence" element={<EvidenceLocker />} />
          <Route path="safety/scoreboard" element={<SafetyScoreboard />} />
          <Route path="safety/is-this-normal" element={<IsThisNormal />} />
          <Route path="safety/time-capsule" element={<TimeCapsule />} />
          <Route path="safety/rights" element={<KnowYourRights />} />
          <Route path="safety/active" element={<ActiveSOSPage />} />


          {/* Jobs */}
          <Route path="jobs" element={<JobsHome />} />
          <Route path="jobs/skill-translator" element={<SkillTranslator />} />
          <Route path="jobs/exchange" element={<JobExchange />} />
          <Route path="jobs/marketplace" element={<Marketplace />} />
          <Route path="jobs/career-simulator" element={<CareerSimulator />} />
          <Route path="jobs/internships" element={<MicroInternships />} />
          <Route path="jobs/resume-analyzer" element={<ResumeAnalyzer />} />

          {/* Tech */}
          <Route path="tech" element={<TechHome />} />
          <Route path="tech/hackathons" element={<HackathonArena />} />
          <Route path="tech/mentors" element={<MentorMatch />} />
          <Route path="tech/ideas" element={<IdeaIncubator />} />
          <Route path="tech/leaderboard" element={<Leaderboard />} />
          <Route path="tech/projects" element={<ProjectGenerator />} />
          <Route path="tech/learning" element={<LearningCenter />} />

          {/* Health */}
          <Route path="health" element={<HealthHome />} />
          <Route path="health/mood" element={<MoodTracker />} />
          <Route path="health/menstrual" element={<MenstrualTracker />} />
          <Route path="health/wellness" element={<WellnessEngine />} />
          <Route path="health/stress" element={<StressDetector />} />
          <Route path="health/companion" element={<AICompanion />} />
          <Route path="health/food-scanner" element={<FoodScanner />} />

          {/* Community */}
          <Route path="community" element={<CommunityHome />} />
          <Route path="community/circle" element={<TrustedCircle />} />
          <Route path="community/volunteers" element={<VolunteerNetwork />} />
          <Route path="community/forums" element={<Forums />} />
          <Route path="community/events" element={<Events />} />
          <Route path="community/skill-exchange" element={<SkillExchange />} />

          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/store" element={<MerchandiseStore />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
