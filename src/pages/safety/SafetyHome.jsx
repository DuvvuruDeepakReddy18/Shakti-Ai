import { Link } from 'react-router-dom';
import {
  Shield, Map, Radio, Users, Lock, Award, ChevronRight,
  Phone, MessageSquareWarning, Archive, Scale, Zap, CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import useUiStore from '../../store/uiStore';
import { motion } from 'framer-motion';

const features = [
  { icon: Phone, title: 'Fake Call', desc: 'Simulate an incoming call instantly', action: 'fakeCall', color: '#6d28d9', bg: '#f0edff' },
  { icon: MessageSquareWarning, title: 'Is This Normal?', desc: 'AI incident & boundary analyzer', link: '/safety/is-this-normal', color: '#db2777', bg: '#fdf2f8' },
  { icon: Archive, title: 'Time Capsule', desc: 'Cryptographically sealed evidence', link: '/safety/time-capsule', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Map, title: 'Safety Map', desc: 'Predictive zones & route analysis', link: '/safety/map', color: '#059669', bg: '#ecfdf5' },
  { icon: Radio, title: 'Live Tracking', desc: 'Crowd Shield virtual escort', link: '/safety/tracking', color: '#2563eb', bg: '#eff6ff' },
  { icon: Users, title: 'Trusted Contacts', desc: 'Manage your trusted contacts', link: '/safety/contacts', color: '#d97706', bg: '#fffbeb' },
  { icon: Lock, title: 'Evidence Locker', desc: 'Encrypted audio/video vault', link: '/safety/evidence', color: '#6d28d9', bg: '#f0edff' },
  { icon: Award, title: 'Scoreboard', desc: 'Rate & review locations', link: '/safety/scoreboard', color: '#db2777', bg: '#fdf2f8' },
  { icon: Scale, title: 'Know Your Rights', desc: 'Quick-access legal protections', link: '/safety/rights', color: '#059669', bg: '#ecfdf5' },
];

export default function SafetyHome() {
  const { triggerFakeCall } = useUiStore();

  return (
    <div>
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', borderRadius: '1.5rem', padding: '28px 24px',
          marginBottom: '20px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(219,39,119,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-30px', width: '160px', height: '160px', background: 'rgba(124,58,237,0.06)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(236,72,153,0.25)',
              }}>
                <Shield size={24} color="white" strokeWidth={2.2} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Smart Safety</h1>
                <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>AI-powered protection in real time.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { label: 'System active', color: '#10B981', bg: '#ecfdf5', border: '#d1fae5', dot: true },
              { label: 'Score 9.2', color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe', icon: Zap },
              { label: '12 nearby', color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7', icon: Users },
            ].map((badge, i) => {
              const BadgeIcon = badge.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '999px',
                  background: badge.bg, border: `1px solid ${badge.border}`,
                  fontSize: '11px', fontWeight: 700, color: badge.color,
                }}>
                  {badge.dot && (
                    <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                      <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: badge.color, opacity: 0.4, animation: 'sos-pulse 1.5s ease-in-out infinite' }} />
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badge.color }} />
                    </span>
                  )}
                  {BadgeIcon && <BadgeIcon size={12} />}
                  {badge.label}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* QUICK SOS */}
      <motion.button
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={triggerFakeCall}
        style={{
          width: '100%', marginBottom: '20px', padding: '18px 20px',
          borderRadius: '1.25rem', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #d946ef 100%)',
          color: 'white', display: 'flex', alignItems: 'center', gap: '14px',
          boxShadow: '0 8px 24px rgba(244,63,94,0.25)',
          position: 'relative', overflow: 'hidden',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <AlertTriangle size={22} color="white" />
        </div>
        <div style={{ flex: 1, textAlign: 'left', position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: '14px', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>Need help right now?</p>
          <p style={{ fontSize: '12px', opacity: 0.9, margin: '2px 0 0' }}>Tap to trigger a fake call instantly</p>
        </div>
        <ChevronRight size={20} style={{ opacity: 0.9, flexShrink: 0 }} />
      </motion.button>

      {/* FEATURE GRID */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: '0 0 12px 4px' }}>Safety toolkit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
          {features.map((feat, i) => {
            const Icon = feat.icon;
            const isButton = feat.action === 'fakeCall';

            const cardContent = (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                whileHover={{ y: -2 }}
                style={{
                  background: 'var(--color-surface-lowest)',
                  borderRadius: '1rem', overflow: 'hidden',
                  boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  height: '100%',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 24px rgba(24,20,69,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}
              >
                <div style={{ height: '2px', background: feat.color, opacity: 0, transition: 'opacity 0.2s' }}
                  className="accent-bar" />
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'transform 0.2s',
                  }}>
                    <Icon size={20} style={{ color: feat.color }} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.3 }}>{feat.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feat.desc}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--color-outline-variant)', flexShrink: 0 }} />
                </div>
              </motion.div>
            );

            return isButton ? (
              <button key={i} onClick={triggerFakeCall} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}>{cardContent}</button>
            ) : (
              <Link key={i} to={feat.link} style={{ textDecoration: 'none' }}>{cardContent}</Link>
            );
          })}
        </div>
      </div>

      {/* TIPS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          background: 'var(--color-surface-lowest)',
          borderRadius: '1.25rem', padding: '20px',
          boxShadow: '0 1px 8px rgba(24,20,69,0.03)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(124,58,237,0.06)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124,58,237,0.2)',
          }}>
            <span style={{ fontSize: '16px' }}>💡</span>
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Proactive safety tips</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px', position: 'relative', zIndex: 10 }}>
          {[
            'Share your live location when traveling late.',
            'Keep your emergency contacts verified.',
            'Rate locations to empower the community.',
            'Enable shake-to-SOS in settings.',
          ].map((tip, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px', borderRadius: '12px',
              background: 'var(--color-surface-low)',
              fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.5,
            }}>
              <CheckCircle size={15} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
              {tip}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
