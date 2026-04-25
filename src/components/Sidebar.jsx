import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Briefcase, Laptop, Heart, Users, LayoutDashboard, User, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', color: '#630ed4' },
  { path: '/safety', icon: Shield, label: 'Safety', color: '#a20017' },
  { path: '/jobs', icon: Briefcase, label: 'Jobs', color: '#F59E0B' },
  { path: '/tech', icon: Laptop, label: 'Tech', color: '#3B82F6' },
  { path: '/health', icon: Heart, label: 'Health', color: '#B4136D' },
  { path: '/community', icon: Users, label: 'Community', color: '#10B981' },
];

const bottomItems = [
  { path: '/profile', icon: User, label: 'Profile', color: '#630ed4' },
  { path: '/settings', icon: Settings, label: 'Settings', color: '#7b7487' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(24,20,69,0.3)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          bottom: 0,
          width: '240px',
          zIndex: 40,
          background: 'var(--color-surface-low)',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : '',
        }}
        className={`sidebar-panel ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* Nav items */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <p style={{ padding: '4px 12px 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)' }}>
            Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  marginBottom: '2px',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  background: active ? `${item.color}12` : 'transparent',
                  color: active ? item.color : 'var(--color-shakti-dark-muted)',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--color-surface-container)'; e.currentTarget.style.color = 'var(--color-shakti-dark-text)'; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-shakti-dark-muted)'; }}}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: active ? `${item.color}15` : 'transparent',
                }}>
                  <Icon size={18} style={{ color: active ? item.color : 'inherit' }} />
                </div>
                <span>{item.label}</span>
                {active && (
                  <div style={{ marginLeft: 'auto', width: '4px', height: '20px', borderRadius: '999px', background: item.color }} />
                )}
              </NavLink>
            );
          })}

          <div style={{ height: '1px', background: 'var(--color-outline-variant)', opacity: 0.3, margin: '16px 12px' }} />

          <p style={{ padding: '4px 12px 8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)' }}>
            Account
          </p>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '2px',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  background: active ? 'var(--color-surface-container)' : 'transparent',
                  color: active ? 'var(--color-shakti-dark-text)' : 'var(--color-shakti-dark-muted)',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--color-surface-container)'; e.currentTarget.style.color = 'var(--color-shakti-dark-text)'; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-shakti-dark-muted)'; }}}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom branding */}
        <div style={{
          padding: '12px 16px',
          borderTop: 'none',
          background: 'var(--color-surface-container)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '4px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #630ed4, #7c3aed)',
              color: 'white', fontWeight: 700, fontSize: '12px',
            }}>S</div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-shakti-dark-text)' }}>SHAKTI AI</p>
              <p style={{ fontSize: '9px', color: 'var(--color-outline)' }}>v1.2 • Digital Sanctuary</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
