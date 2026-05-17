import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Loader2, Target, Briefcase,
  Sparkles, Rocket, GraduationCap, Calendar, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { simulateCareer } from '../../services/aiService';

const ACCENT = '#c026d3';
const ACCENT_LIGHT = '#d946ef';
const ACCENT_BG = '#fdf4ff';

const SAMPLE_SKILLS = ['HTML/CSS', 'Basic Excel', 'Communication', 'Data Entry', 'Social Media', 'Cooking', 'Teaching'];
const SAMPLE_ROLES = ['Frontend Developer', 'Data Analyst', 'Digital Marketing Manager', 'UX Designer', 'Content Strategist', 'Product Manager'];

export default function CareerSimulator() {
  const navigate = useNavigate();
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);

  const handleSimulate = async () => {
    if (!currentSkills.trim() || !targetRole.trim()) return toast.error('Fill in both fields');
    setLoading(true);
    setSimulation(null);
    try {
      const data = await simulateCareer(currentSkills, targetRole);
      setSimulation(data);
      toast.success('Career path simulated!');
    } catch {
      toast.error('Simulation failed');
    }
    setLoading(false);
  };

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.25rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 38px',
    background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
    borderRadius: '12px', fontSize: '14px', color: 'var(--color-shakti-dark-text)',
    boxSizing: 'border-box', outline: 'none', fontFamily: 'var(--font-sans)', transition: 'all 0.2s'
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
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Career Simulator</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>AI-powered 6-month roadmap to your dream role.</p>
          </div>
        </div>
      </motion.div>

      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ ...cardStyle, padding: '22px', marginBottom: '18px' }}
      >
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>Current Skills</label>
          <div style={{ position: 'relative' }}>
            <Target size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: ACCENT }} />
            <input
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g. HTML, Excel, Communication"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {SAMPLE_SKILLS.map(s => (
              <button
                key={s}
                onClick={() => setCurrentSkills(prev => prev ? `${prev}, ${s}` : s)}
                style={{
                  padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                  background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                  border: '1px solid rgba(24,20,69,0.05)', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = ACCENT_BG; e.currentTarget.style.color = ACCENT; e.currentTarget.style.borderColor = `${ACCENT}33`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-surface-low)'; e.currentTarget.style.color = 'var(--color-outline)'; e.currentTarget.style.borderColor = 'rgba(24,20,69,0.05)'; }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>Dream Role</label>
          <div style={{ position: 'relative' }}>
            <Briefcase size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9333ea' }} />
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {SAMPLE_ROLES.map(r => {
              const active = targetRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setTargetRole(r)}
                  style={{
                    padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                    background: active ? `${ACCENT}1a` : 'var(--color-surface-low)',
                    color: active ? ACCENT : 'var(--color-outline)',
                    border: `1px solid ${active ? `${ACCENT}33` : 'rgba(24,20,69,0.05)'}`,
                    cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: loading ? '#94a3b8' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            color: 'white', border: 'none', fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: loading ? 'none' : `0 4px 12px ${ACCENT}33`, fontFamily: 'var(--font-sans)',
            transition: 'all 0.2s'
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? 'Simulating career path…' : 'Generate 6-Month Roadmap'}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {simulation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Summary tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ ...cardStyle, padding: '18px', textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>From</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>{simulation.currentLevel}</p>
                <p style={{ fontSize: '12px', fontWeight: 700, color: ACCENT, margin: '4px 0 0' }}>{simulation.currentSalary}</p>
              </div>
              <div style={{
                padding: '18px', textAlign: 'center', borderRadius: '1.25rem',
                background: `linear-gradient(135deg, ${ACCENT}15, ${ACCENT_LIGHT}15)`,
                border: `1px solid ${ACCENT}22`
              }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Target</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>{simulation.targetLevel}</p>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#047857', margin: '4px 0 0' }}>{simulation.targetSalary}</p>
              </div>
            </div>

            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '6px 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} style={{ color: ACCENT }} /> Monthly Roadmap
            </h2>

            <div style={{ position: 'relative' }}>
              {/* Timeline line */}
              <div style={{ position: 'absolute', left: '20px', top: '8px', bottom: '8px', width: '2px', background: `linear-gradient(to bottom, ${ACCENT}55, ${ACCENT_LIGHT}33, transparent)` }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {simulation.months?.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ position: 'relative', paddingLeft: '54px' }}
                  >
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: '12px', top: '18px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                      border: '3px solid var(--color-surface-base)',
                      boxShadow: `0 0 0 2px ${ACCENT}33, 0 2px 8px ${ACCENT}33`,
                      zIndex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'white' }}>{m.month}</span>
                    </div>

                    <div style={{ ...cardStyle, padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px', gap: '12px' }}>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Month {m.month}</span>
                          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '2px 0 0' }}>{m.milestone}</h3>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 800, color: '#047857', margin: 0, display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                          <IndianRupee size={12} />{m.salary?.replace('₹', '')}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {m.skills?.map((s, j) => (
                          <span key={j} style={{
                            padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                            background: `${ACCENT}10`, color: ACCENT, border: `1px solid ${ACCENT}22`
                          }}>{s}</span>
                        ))}
                      </div>

                      {m.course && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--color-surface-low)' }}>
                          <GraduationCap size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)' }}>{m.course}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSimulation(null)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white',
                border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: `0 4px 12px ${ACCENT}33`, fontFamily: 'var(--font-sans)', marginTop: '6px'
              }}
            >
              <Sparkles size={16} /> Try Another Career Path
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
