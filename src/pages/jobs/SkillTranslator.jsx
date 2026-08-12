import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Loader2, TrendingUp, MapPin, Briefcase,
  Clock, Plus, X, Sparkles, IndianRupee, Target, Layers,
  Search, Brain, BarChart3, ExternalLink, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { translateSkills } from '../../services/aiService';

const ACCENT = '#10b981';
const ACCENT_LIGHT = '#34d399';
const ACCENT_BG = '#ecfdf5';

const SUGGESTED_SKILLS = ['Cooking', 'Stitching', 'Teaching', 'Mehndi', 'Data Entry', 'Social Media', 'Photography', 'Hindi Writing', 'Painting', 'Yoga', 'Accounting', 'Web Design'];

const LOADING_STEPS = [
  { icon: Search, label: 'Mapping your skills to market demand…' },
  { icon: Brain, label: 'AI is matching opportunities to your profile…' },
  { icon: BarChart3, label: 'Estimating earnings for your area…' },
  { icon: Sparkles, label: 'Finalizing personalized recommendations…' },
];

const difficultyMeta = (d) => {
  if (d === 'Beginner') return { bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.22)' };
  if (d === 'Intermediate') return { bg: '#fffbeb', text: '#b45309', border: 'rgba(245,158,11,0.22)' };
  return { bg: '#fef2f2', text: '#b91c1c', border: 'rgba(239,68,68,0.22)' };
};

export default function SkillTranslator() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [resultLocation, setResultLocation] = useState('');

  useEffect(() => {
    if (!loading) { setLoadingStep(0); return; }
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const addSkill = (s) => {
    const skill = s || skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const handleTranslate = async () => {
    if (skills.length === 0) return toast.error('Add at least one skill');
    if (!location.trim()) return toast.error('Enter your location');
    setLoading(true);
    setResults(null);
    setResultLocation(location.trim());
    try {
      const data = await translateSkills(skills, location);
      setResults(data);
      if (data?.length && data[0]?.isDemo) toast('Live AI is busy — showing sample data. Try again in a moment.', { icon: '⚠️' });
      else if (data?.length) toast.success(`Found ${data.length} opportunities!`);
      else toast.error('No results — try different skills');
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  // Universal job search link — works for both formal jobs and local gig work
  const applyUrl = (r) => {
    const kw = (r.searchKeywords || r.title || '').trim();
    const loc = resultLocation.trim();
    const q = kw.toLowerCase().includes(loc.toLowerCase()) ? `${kw} jobs` : `${kw} jobs in ${loc}`;
    return `https://www.google.com/search?q=${encodeURIComponent(q)}&ibp=htl;jobs`;
  };

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.25rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 38px',
    background: 'var(--color-surface-low)',
    border: '1px solid rgba(24,20,69,0.05)',
    borderRadius: '12px', fontSize: '14px', color: 'var(--color-shakti-dark-text)',
    boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)'
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
            <IndianRupee size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Skill → Income Translator</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Turn your existing skills into real earning opportunities.</p>
          </div>
        </div>
      </motion.div>

      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ ...cardStyle, padding: '22px', marginBottom: '18px' }}
      >
        {/* Skill Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>Your Skills</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Layers size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: ACCENT }} />
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Type a skill and press Enter"
                style={inputStyle}
              />
            </div>
            <button
              onClick={() => addSkill()}
              aria-label="Add skill"
              style={{
                padding: '0 16px', borderRadius: '12px',
                background: ACCENT_BG, color: ACCENT,
                border: `1px solid ${ACCENT}33`, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-sans)'
              }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Suggested */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Quick add</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 8).map(s => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                style={{
                  padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
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

        {/* Selected */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Selected ({skills.length})</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map(s => (
                <span key={s} style={{
                  padding: '6px 10px', borderRadius: '8px',
                  background: `${ACCENT}1a`, color: ACCENT,
                  border: `1px solid ${ACCENT}33`,
                  fontSize: '12px', fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', gap: '6px'
                }}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0 }}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>Your Location</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#14b8a6' }} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hyderabad, Delhi, Mumbai"
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={handleTranslate}
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
          {loading ? 'AI is finding opportunities…' : 'Discover Earning Paths'}
        </button>
      </motion.div>

      {/* Loading screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ ...cardStyle, overflow: 'hidden', marginBottom: '18px' }}
          >
            <div style={{ height: '4px', background: 'var(--color-surface-low)', position: 'relative', overflow: 'hidden' }}>
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: '200%' }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0, width: '40%', background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }}
              />
            </div>
            <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: `linear-gradient(135deg, ${ACCENT}15, ${ACCENT_LIGHT}15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '18px', border: `1px solid ${ACCENT}22`
                }}
              >
                {(() => {
                  const StepIcon = LOADING_STEPS[loadingStep]?.icon || Loader2;
                  return <StepIcon size={28} style={{ color: ACCENT }} />;
                })()}
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 16px' }}
                >
                  {LOADING_STEPS[loadingStep]?.label}
                </motion.p>
              </AnimatePresence>
              <div style={{ display: 'flex', gap: '6px' }}>
                {LOADING_STEPS.map((_, i) => (
                  <div key={i} style={{
                    height: '5px', borderRadius: '999px',
                    width: i === loadingStep ? '24px' : '10px',
                    background: i === loadingStep ? `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})` : 'var(--color-surface-low)',
                    transition: 'all 0.4s'
                  }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {!loading && results && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', padding: '0 4px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: ACCENT }} /> Income Opportunities
              </h2>
              <span style={{
                fontSize: '11px', fontWeight: 700, color: ACCENT,
                background: ACCENT_BG, padding: '4px 10px', borderRadius: '999px',
                border: `1px solid ${ACCENT}33`
              }}>{results.length} found</span>
            </div>

            {results.some(r => r.isDemo) && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', borderRadius: '12px',
                background: '#fffbeb', border: '1px solid rgba(245,158,11,0.25)',
              }}>
                <AlertTriangle size={16} style={{ color: '#b45309', flexShrink: 0 }} />
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#b45309', margin: 0 }}>
                  Live AI was unavailable, so these are sample opportunities — not personalized to your skills. Please try again in a minute.
                </p>
              </div>
            )}

            {results.map((r, i) => {
              const dm = difficultyMeta(r.difficulty);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ ...cardStyle, padding: '18px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px', gap: '14px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Briefcase size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                        {r.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: 0, lineHeight: 1.5 }}>{r.description}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '16px', fontWeight: 800, color: ACCENT, margin: 0 }}>{r.estimatedEarning}</p>
                      <p style={{ fontSize: '10px', color: 'var(--color-outline)', margin: '2px 0 0', fontWeight: 600 }}>per month</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--color-surface-low)' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                      background: dm.bg, color: dm.text, border: `1px solid ${dm.border}`
                    }}>{r.difficulty}</span>
                    {r.usesSkill && (
                      <span style={{
                        padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                        background: `${ACCENT}12`, color: ACCENT,
                        border: `1px solid ${ACCENT}2e`,
                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Layers size={10} /> Uses: {r.usesSkill}
                      </span>
                    )}
                    {resultLocation && (
                      <span style={{
                        padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                        background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                        border: '1px solid rgba(24,20,69,0.05)',
                        display: 'inline-flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize'
                      }}>
                        <MapPin size={10} /> {resultLocation}
                      </span>
                    )}
                    {r.platform && (
                      <span style={{
                        padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                        background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                        border: '1px solid rgba(24,20,69,0.05)',
                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Target size={10} /> {r.platform}
                      </span>
                    )}
                    {r.timeCommitment && (
                      <span style={{
                        padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                        background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                        border: '1px solid rgba(24,20,69,0.05)',
                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Clock size={10} /> {r.timeCommitment}
                      </span>
                    )}
                    <a
                      href={applyUrl(r)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 'auto', padding: '7px 14px', borderRadius: '10px',
                        fontSize: '11px', fontWeight: 700, textDecoration: 'none',
                        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                        color: 'white', boxShadow: `0 3px 10px ${ACCENT}33`,
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        fontFamily: 'var(--font-sans)'
                      }}
                    >
                      Apply <ExternalLink size={11} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
