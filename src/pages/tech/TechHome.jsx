import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Laptop, Trophy, Users, Lightbulb, Award, Code, BookOpen,
  ChevronRight, Sparkles, Zap, CheckCircle,
} from 'lucide-react';

const features = [
  { icon: Trophy, title: 'Hackathon Arena', desc: 'Active challenges & live leaderboards', link: '/tech/hackathons', color: '#3B82F6', bg: '#eff6ff' },
  { icon: Users, title: 'Mentor Match', desc: 'AI-paired mentors in your field', link: '/tech/mentors', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Lightbulb, title: 'Idea Incubator', desc: 'Pitch ideas, find collaborators', link: '/tech/ideas', color: '#F59E0B', bg: '#fffbeb' },
  { icon: Award, title: 'Leaderboard', desc: 'Top builders this week', link: '/tech/leaderboard', color: '#10B981', bg: '#ecfdf5' },
  { icon: Code, title: 'Project Generator', desc: 'AI-curated project ideas', link: '/tech/projects', color: '#db2777', bg: '#fdf2f8' },
  { icon: BookOpen, title: 'Learning Center', desc: 'Free courses & curated tracks', link: '/tech/learning', color: '#0891b2', bg: '#ecfeff' },
];

const quickStats = [
  { label: 'Active Hackathons', value: '3', icon: Trophy, color: '#3B82F6', bg: '#eff6ff' },
  { label: 'Your Rank', value: '#42', icon: Award, color: '#10B981', bg: '#ecfdf5' },
  { label: 'Projects', value: '7', icon: Code, color: '#db2777', bg: '#fdf2f8' },
];

export default function TechHome() {
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
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(59,130,246,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-30px', width: '160px', height: '160px', background: 'rgba(124,58,237,0.06)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #3B82F6, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(59,130,246,0.25)',
              }}>
                <Laptop size={24} color="white" strokeWidth={2.2} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Women in Tech</h1>
                <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Build, learn, and grow with a supportive network.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { label: '3 hackathons', color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe', icon: Trophy },
              { label: 'Rank #42', color: '#10B981', bg: '#ecfdf5', border: '#d1fae5', icon: Award },
              { label: '7 projects', color: '#db2777', bg: '#fdf2f8', border: '#fce7f3', icon: Code },
            ].map((badge, i) => {
              const BadgeIcon = badge.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '999px',
                  background: badge.bg, border: `1px solid ${badge.border}`,
                  fontSize: '11px', fontWeight: 700, color: badge.color,
                }}>
                  <BadgeIcon size={12} />
                  {badge.label}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* FEATURE GRID */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: '0 0 12px 4px' }}>Tech toolkit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Link key={i} to={feat.link} style={{ textDecoration: 'none' }}>
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
                  <div style={{ height: '2px', background: feat.color, opacity: 0, transition: 'opacity 0.2s' }} />
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
              </Link>
            );
          })}
        </div>
      </div>

      {/* DAILY CHALLENGE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          background: 'var(--color-surface-lowest)',
          borderRadius: '1.25rem', padding: '20px',
          boxShadow: '0 1px 8px rgba(24,20,69,0.03)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(59,130,246,0.06)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.2)',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Daily Challenge</h3>
            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: '2px 0 0' }}>Build & earn points</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px', position: 'relative', zIndex: 10 }}>
          {[
            'Build a To-Do CLI in 30 minutes using Python.',
            'Create a REST API with Node.js & Express.',
            'Design a responsive navbar with pure CSS.',
            'Solve 3 LeetCode Easy problems today.',
          ].map((tip, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px', borderRadius: '12px',
              background: 'var(--color-surface-low)',
              fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.5,
            }}>
              <CheckCircle size={15} style={{ color: '#3B82F6', flexShrink: 0, marginTop: '2px' }} />
              {tip}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
