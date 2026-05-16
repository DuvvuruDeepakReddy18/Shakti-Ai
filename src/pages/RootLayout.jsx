import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import Navbar from '../components/Navbar';
import FakeCallOverlay from '../components/FakeCallOverlay';
import FloatingSOSButton from '../components/FloatingSOSButton';


export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-surface-base)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-shakti-dark-text)',
    }}>
      
      {/* ── Top App Bar ── */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      {/* ── Sidebar ── */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Main Content ── */}
      <main style={{ paddingTop: '64px', paddingBottom: '80px', minHeight: '100vh' }}>
        <div className="main-with-sidebar">
          <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 20px' }}>
            <Outlet />
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <BottomNav />

      {/* ── Fake Call Overlay ── */}
      <FakeCallOverlay />

      {/* ── Floating SOS Button ── */}
      <FloatingSOSButton />
    </div>
  );
}
