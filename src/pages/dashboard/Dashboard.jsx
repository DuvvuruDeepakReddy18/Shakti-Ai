import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Briefcase, Laptop, Heart, Share2,
  MessageCircle, TrendingUp, Calendar, ChevronRight,
  Sparkles, Phone, Award, ArrowRight, Flame, Star,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';
import { getGreeting } from '../../utils/helpers';
import { MOODS } from '../../utils/constants';

const quickActions = [
  { icon: Phone, label: 'Fake Call', color: '#10B981', bg: '#ecfdf5', action: 'fakeCall' },
  { icon: Shield, label: 'SOS', color: '#ec4899', bg: '#fdf2f8', link: '/safety' },
  { icon: Share2, label: 'Share Loc', color: '#3b82f6', bg: '#eff6ff', link: '/safety/tracking' },
  { icon: Heart, label: 'Log Mood', color: '#f43f5e', bg: '#fff1f2', link: '/health/mood' },
  { icon: Briefcase, label: 'Find Jobs', color: '#f59e0b', bg: '#fffbeb', link: '/jobs' },
  { icon: MessageCircle, label: 'AI Chat', color: '#8b5cf6', bg: '#f5f3ff', link: '/health/companion' },
];

const moduleCards = [
  {
    id: 'safety', title: 'Smart Safety', icon: Shield,
    color: '#ec4899', bg: '#fdf2f8',
    stats: [{ label: 'Safety Score', value: '8.5' }, { label: 'Volunteers', value: '12' }],
    action: 'Open Safety', link: '/safety', description: 'Your area is rated Safe',
  },
  {
    id: 'jobs', title: 'Job Engine', icon: Briefcase,
    color: '#f59e0b', bg: '#fffbeb',
    stats: [{ label: 'Matches', value: '5' }, { label: 'Active Jobs', value: '128' }],
    action: 'Browse Jobs', link: '/jobs', description: '3 new jobs found',
  },
  {
    id: 'tech', title: 'Women in Tech', icon: Laptop,
    color: '#3b82f6', bg: '#eff6ff',
    stats: [{ label: 'Hackathons', value: '3' }, { label: 'Rank', value: '#42' }],
    action: 'Explore Tech', link: '/tech', description: '2 events ending soon',
  },
  {
    id: 'health', title: 'Health & Wellness', icon: Heart,
    color: '#f43f5e', bg: '#fff1f2',
    stats: [{ label: 'Mood Streak', value: '7d' }, { label: 'Cycle Day', value: '14' }],
    action: 'Check Health', link: '/health', description: 'Log your mood today',
  },
];

const wellnessTips = [
  'Stay hydrated — drink a glass of water right now.',
  'Take a 2-minute stretch break. Your body will thank you.',
  "You're doing amazing. Remember to be kind to yourself today.",
  'A 5-minute walk can boost your mood by 30%.',
  'Deep breathing: Inhale 4s, Hold 4s, Exhale 6s. Try it now.',
];

export default function Dashboard() {
  const { userProfile, user } = useAuthStore();
  const { triggerFakeCall } = useUiStore();
  const [tip] = useState(wellnessTips[Math.floor(Math.random() * wellnessTips.length)]);
  const name = userProfile?.name || user?.displayName || 'there';
  const points = userProfile?.shePoints || 450;
  const initial = (name?.[0] || 'S').toUpperCase();

  return (
    <div>
      {/* HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--color-surface-lowest)',
          borderRadius: '1.5rem',
          padding: '28px 24px',
          marginBottom: '20px',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        {/* User greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #630ed4, #B4136D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '18px', fontWeight: 700,
                boxShadow: '0 4px 16px rgba(99,14,212,0.25)',
              }}>
                {initial}
              </div>
              <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '14px', height: '14px', background: '#10B981', border: '3px solid var(--color-surface-lowest)', borderRadius: '50%' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', lineHeight: 1.2, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getGreeting()}, {name}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--color-outline)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Calendar size={13} style={{ color: 'var(--color-shakti-primary)' }} />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '999px',
            background: 'var(--color-surface-container)',
            fontSize: '13px', fontWeight: 700, color: 'var(--color-shakti-primary)',
            flexShrink: 0,
          }}>
            <Sparkles size={14} /> {points.toLocaleString()}
          </div>
        </div>

        {/* Level progress */}
        <div style={{
          background: 'var(--color-surface-low)', borderRadius: '1rem', padding: '16px 18px', marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
              }}>
                <Award size={18} color="white" />
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)' }}>Current level</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', lineHeight: 1.2 }}>{userProfile?.sheLevel || 'Silver'}</p>
              </div>
            </div>
            <Link to="/profile/store" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-shakti-primary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              Rewards <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ width: '100%', height: '8px', background: 'var(--color-surface-container)', borderRadius: '999px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #630ed4, #B4136D)', borderRadius: '999px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-outline)', fontWeight: 600, marginTop: '8px' }}>
            <span>{points} / 1000</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
              <Star size={11} fill="currentColor" /> Next: Gold
            </span>
          </div>
        </div>

        {/* Wellness tip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px', borderRadius: '1rem',
          background: 'var(--color-surface-low)',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(244,63,94,0.2)',
          }}>
            <Heart size={16} color="white" fill="white" />
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.5 }}>{tip}</p>
        </div>
      </motion.div>

      {/* QUICK ACTIONS */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: '0 0 12px 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={13} style={{ color: '#f97316' }} /> Quick actions
        </h2>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            const content = (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '68px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px',
                  background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform 0.2s',
                }}>
                  <Icon size={22} style={{ color: action.color }} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-shakti-dark-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>{action.label}</span>
              </div>
            );

            if (action.action === 'fakeCall') {
              return (
                <button key={i} onClick={triggerFakeCall} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {content}
                </button>
              );
            }
            return <Link key={i} to={action.link} style={{ textDecoration: 'none' }}>{content}</Link>;
          })}
        </div>
      </div>

      {/* MOOD CHECK */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{
          background: 'var(--color-surface-lowest)', borderRadius: '1.25rem',
          padding: '20px', marginBottom: '24px',
          boxShadow: '0 1px 8px rgba(24,20,69,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>How are you feeling?</h2>
          <Link to="/health/mood" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-shakti-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Track <ChevronRight size={12} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {MOODS.map((mood) => (
            <Link key={mood.id} to="/health/mood" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              padding: '10px 4px', borderRadius: '12px', textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-low)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '28px' }}>{mood.emoji}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-shakti-dark-muted)', textAlign: 'center' }}>{mood.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* MODULE CARDS */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: '0 0 12px 4px' }}>Your modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {moduleCards.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.id} to={mod.link} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  whileHover={{ y: -3 }}
                  style={{
                    background: 'var(--color-surface-lowest)',
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 8px rgba(24,20,69,0.03)',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    height: '100%',
                    display: 'flex', flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 32px rgba(24,20,69,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 8px rgba(24,20,69,0.03)'}
                >
                  {/* Accent bar */}
                  <div style={{ height: '3px', background: mod.color }} />

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: mod.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={20} style={{ color: mod.color }} strokeWidth={2.2} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>{mod.title}</h3>
                        <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.description}</p>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--color-outline-variant)', flexShrink: 0 }} />
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', flex: 1 }}>
                      {mod.stats.map((stat, j) => (
                        <div key={j} style={{
                          background: 'var(--color-surface-low)', padding: '12px', borderRadius: '12px',
                        }}>
                          <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: '0 0 2px', lineHeight: 1 }}>{stat.value}</p>
                          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-outline)', margin: 0 }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-surface-container)', fontSize: '12px', fontWeight: 700, color: mod.color }}>
                      <span>{mod.action}</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: 'var(--color-surface-lowest)', borderRadius: '1.25rem', padding: '20px',
            boxShadow: '0 1px 8px rgba(24,20,69,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <Award size={15} style={{ color: '#f59e0b' }} /> Badges
            </h3>
            <Link to="/profile" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-shakti-primary)', textDecoration: 'none' }}>All</Link>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['🌱', '🛡️', '🧘‍♀️'].map((emoji, i) => (
              <motion.div
                key={i} whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'var(--color-surface-low)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{
            background: 'var(--color-surface-lowest)', borderRadius: '1.25rem', padding: '20px',
            boxShadow: '0 1px 8px rgba(24,20,69,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
            }}>
              <TrendingUp size={20} color="white" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>AI Career Insight</h3>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.6, margin: 0 }}>
                Learning <span style={{ color: 'var(--color-shakti-primary)', fontWeight: 700 }}>React & Node.js</span> could lift your earning potential by <span style={{ color: '#10B981', fontWeight: 700 }}>+60%</span>.
              </p>
              <Link to="/jobs" style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#3b82f6', textDecoration: 'none' }}>
                Explore paths <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
