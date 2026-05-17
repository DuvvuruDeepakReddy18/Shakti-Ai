import { motion } from 'framer-motion';
import {
  Rocket, Clock, IndianRupee, Zap, MapPin, ArrowLeft,
  Briefcase, Sparkles, ShieldCheck, ArrowRight, Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#0891b2';
const ACCENT_LIGHT = '#06b6d4';
const ACCENT_BG = '#ecfeff';

const INTERNSHIPS = [
  { id: 1, title: 'Content Writing Sprint', company: 'StartupLabs', duration: '1 week', stipend: '5,000', mode: 'Remote', skills: ['Writing', 'SEO'], slots: 3 },
  { id: 2, title: 'UI Design Challenge', company: 'DesignHub', duration: '3 days', stipend: '3,000', mode: 'Remote', skills: ['Figma', 'UI'], slots: 5 },
  { id: 3, title: 'Social Media Growth Project', company: 'BrandRise', duration: '2 weeks', stipend: '8,000', mode: 'Remote', skills: ['Marketing', 'Instagram'], slots: 2 },
  { id: 4, title: 'React Bug Hunt', company: 'TechNova', duration: '5 days', stipend: '6,000', mode: 'Remote', skills: ['React', 'Testing'], slots: 4 },
  { id: 5, title: 'Customer Research Interviews', company: 'UXPro', duration: '1 week', stipend: '4,500', mode: 'Hybrid', skills: ['Research', 'Communication'], slots: 3 },
];

export default function MicroInternships() {
  const navigate = useNavigate();

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.25rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--color-outline)', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '16px', fontFamily: 'var(--font-sans)',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', borderRadius: '1.5rem', padding: '28px 24px',
          marginBottom: '18px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: `${ACCENT}14`, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px ${ACCENT}40`,
          }}>
            <Rocket size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Micro-Internships</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Short-term paid projects to build your portfolio.</p>
          </div>
        </div>
      </motion.div>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
        <div style={{ ...cardStyle, padding: '16px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: ACCENT_BG, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <Zap size={16} />
          </div>
          <h4 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1 }}>12</h4>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0' }}>Live sprints</p>
        </div>
        <div style={{ ...cardStyle, padding: '16px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <Sparkles size={16} />
          </div>
          <h4 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1 }}>₹25k+</h4>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0' }}>Stipends distributed</p>
        </div>
      </div>

      <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Briefcase size={13} style={{ color: ACCENT }} /> Active opportunities
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {INTERNSHIPS.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{ ...cardStyle, padding: '18px', transition: 'box-shadow 0.2s' }}
            whileHover={{ y: -2 }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 18px rgba(24,20,69,0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.3 }}>{job.title}</h3>
                  <span style={{
                    padding: '2px 8px', borderRadius: '6px',
                    background: ACCENT_BG, color: ACCENT,
                    fontSize: '10px', fontWeight: 700,
                    border: `1px solid ${ACCENT}33`
                  }}>
                    {job.slots} slots
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-outline)' }}>
                  <Building2 size={12} /> {job.company}
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                padding: '6px 12px', borderRadius: '10px',
                background: '#ecfdf5', border: '1px solid rgba(16,185,129,0.22)',
                flexShrink: 0
              }}>
                <IndianRupee size={13} style={{ color: '#047857' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#047857' }}>{job.stipend}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 12px', borderRadius: '10px',
                background: 'var(--color-surface-low)', fontSize: '12px', color: 'var(--color-shakti-dark-text)',
                border: '1px solid rgba(24,20,69,0.04)'
              }}>
                <Clock size={12} style={{ color: ACCENT }} /> {job.duration}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 12px', borderRadius: '10px',
                background: 'var(--color-surface-low)', fontSize: '12px', color: 'var(--color-shakti-dark-text)',
                border: '1px solid rgba(24,20,69,0.04)'
              }}>
                <MapPin size={12} style={{ color: '#e11d48' }} /> {job.mode}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-surface-low)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {job.skills.map((s) => (
                  <span key={s} style={{
                    padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                    background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                    border: '1px solid rgba(24,20,69,0.05)'
                  }}>
                    {s}
                  </span>
                ))}
              </div>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', fontWeight: 700, color: ACCENT,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', padding: 0
              }}>
                Apply sprint <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '999px',
          background: 'var(--color-surface-lowest)', border: '1px solid rgba(24,20,69,0.05)',
          boxShadow: '0 1px 6px rgba(24,20,69,0.03)'
        }}>
          <ShieldCheck size={14} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)' }}>Verified partner enterprises</span>
        </div>
      </div>
    </div>
  );
}
