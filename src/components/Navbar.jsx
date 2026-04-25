import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, LogOut, User, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { getInitials } from '../utils/helpers';

export default function Navbar({ onToggleSidebar, sidebarOpen }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, userProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/safety')) return '🛡️ Safety';
    if (path.startsWith('/jobs')) return '💼 Jobs';
    if (path.startsWith('/tech')) return '💻 Tech';
    if (path.startsWith('/health')) return '❤️ Health';
    if (path.startsWith('/community')) return '👥 Community';
    if (path.startsWith('/profile')) return 'Profile';
    if (path.startsWith('/settings')) return 'Settings';
    return 'SHAKTI AI';
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(252,248,255,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', padding: '0 16px' }}>
        {/* Left - Menu + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleSidebar}
            className="hamburger-btn"
            style={{ display: 'none', padding: '8px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-shakti-dark-text)' }}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #630ed4, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'white', fontSize: '14px',
              boxShadow: '0 4px 16px rgba(124,58,237,0.25)',
            }}>
              S
            </div>
            <div className="hide-mobile">
              <h1 className="gradient-text" style={{ fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.2 }}>SHAKTI AI</h1>
            </div>
          </Link>

          <span className="hide-mobile" style={{ fontSize: '14px', color: 'var(--color-shakti-dark-muted)', marginLeft: '16px', fontWeight: 500 }}>
            {getPageTitle()}
          </span>
        </div>

        {/* Center - Search */}
        <div className="hide-mobile" style={{ flex: 1, maxWidth: '400px', margin: '0 32px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-shakti-dark-muted)' }} />
            <input
              type="text"
              placeholder="Search jobs, forums, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px',
                borderRadius: '999px', background: 'var(--color-surface-container)',
                border: '1.5px solid rgba(204,195,216,0.15)',
                fontSize: '14px', color: 'var(--color-shakti-dark-text)',
                fontFamily: 'var(--font-sans)', outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-shakti-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(204,195,216,0.15)'}
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Mobile search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="hide-desktop"
            style={{ padding: '10px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-shakti-dark-muted)' }}
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button style={{ position: 'relative', padding: '10px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-shakti-dark-muted)' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: '#c6252b', borderRadius: '50%', border: '2px solid var(--color-surface-base)' }} />
          </button>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #630ed4, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '12px', fontWeight: 700,
                }}>
                  {getInitials(userProfile?.name || user?.displayName || 'U')}
                </div>
              )}
            </button>

            {profileOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setProfileOpen(false)} />
                <div style={{
                  position: 'absolute', right: 0, top: '48px', width: '224px', zIndex: 50,
                  background: 'var(--color-surface-lowest)', borderRadius: '16px', padding: '8px',
                  boxShadow: '0 20px 60px rgba(24,20,69,0.12)',
                }}>
                  <div style={{ padding: '12px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile?.name || user?.displayName}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                  </div>
                  <div style={{ height: '1px', background: 'var(--color-surface-container)', margin: '4px 0' }} />
                  <Link to="/profile" onClick={() => setProfileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: '14px',
                    borderRadius: '12px', color: 'var(--color-shakti-dark-text)', textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-container)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: '14px',
                    borderRadius: '12px', color: 'var(--color-shakti-dark-text)', textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-container)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <div style={{ height: '1px', background: 'var(--color-surface-container)', margin: '4px 0' }} />
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: '14px', width: '100%',
                    borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ba1a1a', textAlign: 'left',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(186,26,26,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div style={{ padding: '0 16px 12px' }} className="hide-desktop">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-shakti-dark-muted)' }} />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              style={{
                width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px',
                borderRadius: '999px', background: 'var(--color-surface-container)',
                border: '1.5px solid rgba(204,195,216,0.15)',
                fontSize: '14px', color: 'var(--color-shakti-dark-text)',
                fontFamily: 'var(--font-sans)', outline: 'none',
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
}
