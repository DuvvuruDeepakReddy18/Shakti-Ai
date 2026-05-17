import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Clock, IndianRupee, Zap, MapPin, ArrowLeft,
  Briefcase, Sparkles, ShieldCheck, ArrowRight, Building2,
  CheckCircle2, ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCENT = '#0891b2';
const ACCENT_LIGHT = '#06b6d4';
const ACCENT_BG = '#ecfeff';

const INTERNSHIPS = [
  { id: 1, title: 'Content Writing Sprint', company: 'StartupLabs', duration: '1 week', stipend: '5,000', mode: 'Remote', skills: ['Writing', 'SEO'], slots: 3, desc: 'Write 4 long-form blog posts on B2B SaaS topics. Editor will review drafts and you get a published portfolio piece.' },
  { id: 2, title: 'UI Design Challenge', company: 'DesignHub', duration: '3 days', stipend: '3,000', mode: 'Remote', skills: ['Figma', 'UI'], slots: 5, desc: 'Redesign 3 onboarding screens for a fintech mobile app. Top submissions get featured in our design newsletter.' },
  { id: 3, title: 'Social Media Growth Project', company: 'BrandRise', duration: '2 weeks', stipend: '8,000', mode: 'Remote', skills: ['Marketing', 'Instagram'], slots: 2, desc: 'Drive +500 followers and 10% engagement on a beauty brand Instagram. Daily posting + analytics report at the end.' },
  { id: 4, title: 'React Bug Hunt', company: 'TechNova', duration: '5 days', stipend: '6,000', mode: 'Remote', skills: ['React', 'Testing'], slots: 4, desc: 'Reproduce + fix 8 open GitHub issues on a production React SaaS. Pair with a senior engineer for code review.' },
  { id: 5, title: 'Customer Research Interviews', company: 'UXPro', duration: '1 week', stipend: '4,500', mode: 'Hybrid', skills: ['Research', 'Communication'], slots: 3, desc: 'Conduct 10 user interviews (5 in-person, 5 remote) for a B2B HR tool. Synthesize findings into a research deck.' },
];

const MODES = ['All', 'Remote', 'Hybrid'];

export default function MicroInternships() {
  const navigate = useNavigate();
  const [applied, setApplied] = useState(new Set());
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const handleApply = (job) => {
    if (applied.has(job.id)) return;
    if (job.slots <= 0) return toast.error('All slots are taken');
    setApplied(prev => new Set(prev).add(job.id));
    toast.success(`Applied to ${job.title}! ${job.company} will review and reach out.`);
  };

  const filteredJobs = filter === 'All' ? INTERNSHIPS : INTERNSHIPS.filter(j => j.mode === filter);
  const liveCount = INTERNSHIPS.length - applied.size;

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
        <div style={{ ...cardStyle, padding: '14px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: ACCENT_BG, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Zap size={14} />
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1 }}>{liveCount}</h4>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0' }}>Live sprints</p>
        </div>
        <div style={{ ...cardStyle, padding: '14px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <Sparkles size={14} />
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1 }}>₹26.5k</h4>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0' }}>Total stipend</p>
        </div>
        <div style={{ ...cardStyle, padding: '14px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
            <CheckCircle2 size={14} />
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1 }}>{applied.size}</h4>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0' }}>You applied</p>
        </div>
      </div>

      {/* Mode filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Briefcase size={13} style={{ color: ACCENT }} /> Active opportunities
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          {MODES.map(m => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              style={{
                padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                background: filter === m ? ACCENT_BG : 'var(--color-surface-lowest)',
                color: filter === m ? ACCENT : 'var(--color-outline)',
                border: `1px solid ${filter === m ? `${ACCENT}33` : 'rgba(24,20,69,0.05)'}`,
                cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredJobs.map((job, i) => {
          const isApplied = applied.has(job.id);
          const remaining = isApplied ? Math.max(job.slots - 1, 0) : job.slots;
          const isFull = !isApplied && remaining <= 0;
          const isExpanded = expandedId === job.id;
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ ...cardStyle, padding: '18px', transition: 'box-shadow 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 18px rgba(24,20,69,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.3 }}>{job.title}</h3>
                    <span style={{
                      padding: '2px 8px', borderRadius: '999px',
                      background: isFull ? '#fef2f2' : ACCENT_BG,
                      color: isFull ? '#b91c1c' : ACCENT,
                      fontSize: '10px', fontWeight: 700,
                      border: `1px solid ${isFull ? 'rgba(239,68,68,0.22)' : `${ACCENT}33`}`
                    }}>
                      {isFull ? 'Full' : `${remaining} slots`}
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

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      fontSize: '13px', color: 'var(--color-shakti-dark-muted)',
                      margin: '0 0 12px', lineHeight: 1.6,
                      paddingLeft: '12px', borderLeft: `3px solid ${ACCENT}33`
                    }}>{job.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-surface-low)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1, minWidth: 0 }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : job.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '6px 10px', borderRadius: '8px',
                      fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)',
                      background: 'var(--color-surface-low)',
                      border: '1px solid rgba(24,20,69,0.05)', cursor: 'pointer',
                      fontFamily: 'var(--font-sans)'
                    }}
                  >
                    Details <ChevronDown size={12} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  <button
                    onClick={() => handleApply(job)}
                    disabled={isApplied || isFull}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '10px',
                      fontSize: '12px', fontWeight: 700,
                      background: isApplied ? '#ecfdf5' : isFull ? 'var(--color-surface-low)' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                      color: isApplied ? '#047857' : isFull ? 'var(--color-outline)' : 'white',
                      border: isApplied ? '1px solid rgba(16,185,129,0.22)' : 'none',
                      cursor: (isApplied || isFull) ? 'default' : 'pointer',
                      boxShadow: (isApplied || isFull) ? 'none' : `0 4px 12px ${ACCENT}33`,
                      fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
                    }}
                  >
                    {isApplied ? <><CheckCircle2 size={13} /> Applied</> : isFull ? 'Full' : <>Apply sprint <ArrowRight size={13} /></>}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-outline)' }}>
            <Briefcase size={36} style={{ margin: '0 auto 10px', display: 'block', color: 'var(--color-surface-low)' }} />
            <p style={{ fontSize: '13px', margin: 0 }}>No {filter.toLowerCase()} sprints right now.</p>
          </div>
        )}
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
