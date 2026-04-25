import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Briefcase, Laptop, Heart, Users } from 'lucide-react';

const tabs = [
  { path: '/safety', icon: Shield, label: 'Safety', color: '#a20017' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs', color: '#F59E0B' },
  { path: '/', icon: null, label: 'Home', color: '#630ed4', isHome: true },
  { path: '/health', icon: Heart, label: 'Health', color: '#B4136D' },
  { path: '/community', icon: Users, label: 'Community', color: '#10B981' },
];

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(252,248,255,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: 'none',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '60px',
        padding: '0 8px',
        maxWidth: '420px',
        margin: '0 auto',
      }}>
        {tabs.map((tab) => {
          const active = isActive(tab.path);

          if (tab.isHome) {
            return (
              <NavLink key={tab.path} to={tab.path}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-16px', textDecoration: 'none' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #630ed4, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.30)',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span style={{ fontSize: '9px', marginTop: '3px', fontWeight: 600, color: '#630ed4' }}>Home</span>
              </NavLink>
            );
          }

          const Icon = tab.icon;
          return (
            <NavLink key={tab.path} to={tab.path}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '4px 12px', borderRadius: '12px', textDecoration: 'none',
              }}>
              <div style={{
                padding: '5px', borderRadius: '10px',
                background: active ? `${tab.color}15` : 'transparent',
                transform: active ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s',
              }}>
                <Icon size={18} style={{ color: active ? tab.color : 'var(--color-shakti-dark-muted)' }} />
              </div>
              <span style={{
                fontSize: '9px', marginTop: '2px', fontWeight: 500,
                color: active ? tab.color : 'var(--color-shakti-dark-muted)',
              }}>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
