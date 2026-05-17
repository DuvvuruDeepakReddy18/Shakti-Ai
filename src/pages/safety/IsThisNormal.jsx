import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareWarning, ArrowLeft, Sparkles, ShieldCheck, ChevronRight, AlertCircle, Info, RotateCcw, Loader2, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { analyzeIncident } from '../../services/aiService';

const ACCENT = '#a855f7';
const ACCENT_LIGHT = '#ec4899';

const examples = [
  { tag: 'Work', text: 'My boss texts me at 11pm asking about weekend plans' },
  { tag: 'Public', text: 'Stranger on the bus said I look pretty 4 times' },
  { tag: 'Home', text: 'Roommate locks the front door without telling me' },
  { tag: 'Friends', text: 'A friend keeps borrowing money but never returns it' },
];

const verdictMeta = (verdict) => {
  switch (verdict?.toLowerCase()) {
    case 'dangerous':
      return { bg: '#fef2f2', border: 'rgba(239,68,68,0.30)', text: '#991b1b', chipBg: '#fee2e2', accent: '#dc2626', Icon: AlertCircle };
    case 'concerning':
      return { bg: '#fffbeb', border: 'rgba(245,158,11,0.30)', text: '#92400e', chipBg: '#fef3c7', accent: '#d97706', Icon: MessageSquareWarning };
    case 'normal':
      return { bg: '#ecfdf5', border: 'rgba(16,185,129,0.30)', text: '#065f46', chipBg: '#d1fae5', accent: '#10b981', Icon: ShieldCheck };
    default:
      return { bg: '#eff6ff', border: 'rgba(59,130,246,0.30)', text: '#1e3a8a', chipBg: '#dbeafe', accent: '#3b82f6', Icon: Info };
  }
};

export default function IsThisNormal() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const parsed = await analyzeIncident(text);
      setAnalysis(parsed);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze the situation. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setText('');
  };

  const charCount = text.length;
  const charMax = 600;
  const tooLong = charCount > charMax;

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
          position: 'relative', borderRadius: '1.5rem', padding: '24px',
          marginBottom: '16px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: `${ACCENT}1f`, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px ${ACCENT}40`,
          }}>
            <MessageSquareWarning size={24} color="white" strokeWidth={2.2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '23px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Is This Normal?</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Describe a situation. AI gives an honest, supportive read.</p>
          </div>
        </div>
      </motion.div>

      {/* INPUT */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{
          background: 'var(--color-surface-lowest)',
          borderRadius: '1.25rem', padding: '16px',
          boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
          marginBottom: '18px',
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what happened. The more detail, the better the analysis…"
          rows={5}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '14px 16px', borderRadius: '14px',
            background: 'var(--color-surface-low)',
            border: `1px solid ${tooLong ? 'rgba(239,68,68,0.40)' : 'rgba(24,20,69,0.05)'}`,
            color: 'var(--color-shakti-dark-text)',
            fontSize: '14px', lineHeight: 1.55,
            resize: 'none', outline: 'none',
            fontFamily: 'var(--font-sans)',
            transition: 'border 0.15s'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'var(--color-outline)' }}>
              <ShieldCheck size={13} style={{ color: '#10b981' }} /> Anonymous & Secure
            </span>
            <span style={{ color: tooLong ? '#dc2626' : 'var(--color-outline)', fontWeight: 600 }}>
              {charCount}/{charMax}
            </span>
          </div>
          <button
            onClick={analyze}
            disabled={!text.trim() || loading || tooLong}
            style={{
              padding: '11px 22px', borderRadius: '12px',
              background: (!text.trim() || loading || tooLong) ? '#cbd5e1' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
              color: 'white', border: 'none',
              fontSize: '13px', fontWeight: 700,
              cursor: (!text.trim() || loading || tooLong) ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: (!text.trim() || loading || tooLong) ? 'none' : `0 4px 12px ${ACCENT}40`,
              fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
            }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </motion.div>

      {/* EXAMPLES (hidden once we have an analysis) */}
      {!analysis && !loading && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ marginBottom: '12px' }}
        >
          <p style={{
            fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            margin: '0 4px 10px', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Sparkles size={12} style={{ color: ACCENT }} /> Try an example
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex.text)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', textAlign: 'left',
                  padding: '12px 14px', borderRadius: '12px',
                  background: 'var(--color-surface-lowest)',
                  border: '1px solid rgba(24,20,69,0.05)',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ACCENT}55`; e.currentTarget.style.background = `${ACCENT}08`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(24,20,69,0.05)'; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
              >
                <span style={{
                  flexShrink: 0,
                  padding: '3px 9px', borderRadius: '999px',
                  background: `${ACCENT}14`, color: ACCENT,
                  fontSize: '10px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  border: `1px solid ${ACCENT}33`
                }}>{ex.tag}</span>
                <span style={{ flex: 1, fontSize: '13px', color: 'var(--color-shakti-dark-text)', lineHeight: 1.45 }}>"{ex.text}"</span>
                <ChevronRight size={15} style={{ color: 'var(--color-outline)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* RESULT */}
      <AnimatePresence>
        {analysis && (() => {
          const meta = verdictMeta(analysis.verdict);
          const Icon = meta.Icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              <div
                style={{
                  borderRadius: '1.5rem', padding: '22px',
                  background: meta.bg, border: `1px solid ${meta.border}`,
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'white', color: meta.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, border: `1px solid ${meta.border}`,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px', borderRadius: '999px',
                      background: meta.chipBg, color: meta.text,
                      fontSize: '10px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      marginBottom: '6px',
                      border: `1px solid ${meta.border}`
                    }}>
                      {analysis.verdict || 'Analysis'}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: meta.text, margin: 0, lineHeight: 1.3 }}>
                      {analysis.title}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: meta.text, opacity: 0.9, margin: '0 0 16px', lineHeight: 1.6, fontWeight: 500 }}>
                  {analysis.summary}
                </p>

                {analysis.steps?.length > 0 && (
                  <div style={{
                    background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(6px)',
                    borderRadius: '14px', padding: '14px',
                    border: `1px solid ${meta.border}`,
                  }}>
                    <p style={{
                      fontSize: '10px', fontWeight: 800, color: meta.text,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      margin: '0 0 10px', opacity: 0.7
                    }}>
                      Suggested steps
                    </p>
                    <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {analysis.steps.map((s, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{
                            width: '24px', height: '24px', borderRadius: '8px',
                            background: 'white', color: meta.accent,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 800,
                            flexShrink: 0,
                            border: `1px solid ${meta.border}`,
                            marginTop: '1px'
                          }}>{i + 1}</span>
                          <span style={{ fontSize: '13px', color: meta.text, lineHeight: 1.55, fontWeight: 500 }}>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Helplines */}
              {analysis.helplines?.length > 0 && (
                <div style={{
                  background: 'var(--color-surface-lowest)',
                  borderRadius: '1.25rem', padding: '14px',
                  boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
                  border: '1px solid rgba(239,68,68,0.18)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: '#fef2f2', color: '#dc2626',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Phone size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>
                      Need to talk to someone now?
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>
                      {analysis.helplines.join(' · ')}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={reset}
                style={{
                  width: '100%', padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--color-surface-lowest)',
                  color: 'var(--color-outline)',
                  border: '1px solid rgba(24,20,69,0.05)',
                  fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <RotateCcw size={14} /> Describe something else
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
