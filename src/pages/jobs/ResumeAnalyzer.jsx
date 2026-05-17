import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FileText, CheckCircle2, FileUp,
  Sparkles, RefreshCcw, Trophy, Target, ArrowRight,
  Zap, Info, Briefcase, Loader2, Clock, Brain,
  Shield, Search, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { analyzeResume } from '../../services/aiService';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const ACCENT = '#4f46e5';
const ACCENT_LIGHT = '#6366f1';
const ACCENT_BG = '#eef2ff';

const LOADING_STEPS = [
  { icon: FileText, label: 'Extracting text from your resume…', duration: 8 },
  { icon: Search, label: 'Identifying skills & keywords…', duration: 12 },
  { icon: Brain, label: 'AI is matching roles to your profile…', duration: 15 },
  { icon: BarChart3, label: 'Calculating ATS compatibility score…', duration: 12 },
  { icon: Shield, label: 'Generating improvement suggestions…', duration: 10 },
  { icon: Sparkles, label: 'Finalizing your personalized report…', duration: 3 },
];

const TIPS = [
  '💡 Tip: Use action verbs like "Developed", "Led", "Optimized" in your bullets.',
  '💡 Tip: Include measurable outcomes — numbers make your resume 40% stronger.',
  '💡 Tip: Tailor your resume keywords to each job description for higher ATS scores.',
  '💡 Tip: Keep your resume to 1-2 pages max for early/mid career roles.',
  '💡 Tip: A skills section with 8-12 relevant keywords boosts ATS match rates.',
];

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [, setSelectedFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [pendingResult, setPendingResult] = useState(null);
  const [minWaitDone, setMinWaitDone] = useState(false);

  const MIN_WAIT = 60;

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next >= MIN_WAIT) setMinWaitDone(true);
        let acc = 0;
        for (let i = 0; i < LOADING_STEPS.length; i++) {
          acc += LOADING_STEPS[i].duration;
          if (next < acc) { setLoadingStep(i); break; }
          if (i === LOADING_STEPS.length - 1) setLoadingStep(i);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => setTipIndex(p => (p + 1) % TIPS.length), 8000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  useEffect(() => {
    if (minWaitDone && pendingResult) {
      setResult(pendingResult);
      setPendingResult(null);
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
    }
  }, [minWaitDone, pendingResult]);

  const handleUpload = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { toast.error('File too large (max 5MB)'); return; }
      setSelectedFile(file);
      startAnalysis(file);
    }
  };

  const extractTextFromFile = async (file) => {
    if (file.type === 'application/pdf') {
      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      return text;
    }
    return await file.text();
  };

  const startAnalysis = async (file) => {
    setIsAnalyzing(true);
    setResult(null);
    setPendingResult(null);
    setMinWaitDone(false);
    setElapsed(0);
    setLoadingStep(0);
    setTipIndex(0);

    try {
      const extractedText = await extractTextFromFile(file);
      const parsed = await analyzeResume(extractedText);
      if (parsed) {
        setPendingResult(parsed);
      } else {
        throw new Error('All models failed');
      }
    } catch {
      toast.error('AI models busy — showing demo analysis.');
      setPendingResult({
        score: 78,
        roles: [
          { title: 'General Developer', matchScore: 80 },
          { title: 'Project Coordinator', matchScore: 65 },
          { title: 'Technical Writer', matchScore: 55 },
        ],
        missingKeywords: ['Leadership', 'Analytics', 'Cloud Computing'],
        strengths: ['Clear structure', 'Basic skills listed', 'Good formatting'],
        improvement: {
          original: 'Did some coding tasks.',
          rewritten: 'Completed 5+ feature tickets ahead of schedule using modern coding practices.',
          reason: 'Quantifies output and highlights efficiency.',
        },
      });
    }
  };

  const progressPct = Math.min((elapsed / MIN_WAIT) * 100, 100);
  const remaining = Math.max(MIN_WAIT - elapsed, 0);
  const StepIcon = LOADING_STEPS[loadingStep]?.icon || Loader2;

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.25rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  const scoreMeta = (score) =>
    score > 80
      ? { color: '#10b981', bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.22)', label: 'Excellent Match' }
      : score > 60
        ? { color: '#f59e0b', bg: '#fffbeb', text: '#b45309', border: 'rgba(245,158,11,0.22)', label: 'Good — Room to Improve' }
        : { color: '#ef4444', bg: '#fef2f2', text: '#b91c1c', border: 'rgba(239,68,68,0.22)', label: 'Needs Optimization' };

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
            <Target size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>ATS Scanner</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>ATS scoring, role matching & AI rewrite suggestions.</p>
          </div>
        </div>
      </motion.div>

      {/* Info banner */}
      <div style={{
        background: ACCENT_BG, padding: '14px', borderRadius: '14px', marginBottom: '18px',
        display: 'flex', gap: '12px', alignItems: 'flex-start',
        border: `1px solid ${ACCENT}22`
      }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${ACCENT}1a`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={16} />
        </div>
        <p style={{ fontSize: '13px', color: '#3730a3', margin: 0, lineHeight: 1.5 }}>
          Our AI extracts your skills, scores ATS compatibility, and suggests improvements.
          <span style={{ fontWeight: 700 }}> Analysis takes about a minute — we show tips while you wait!</span>
        </p>
      </div>

      {/* Upload */}
      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%', padding: '60px 24px', borderRadius: '20px',
            background: 'var(--color-surface-lowest)',
            border: `2px dashed ${ACCENT}40`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = ACCENT_BG; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${ACCENT}40`; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
        >
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: `linear-gradient(135deg, ${ACCENT}15, ${ACCENT_LIGHT}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${ACCENT}22` }}>
            <FileUp size={32} style={{ color: ACCENT }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Drop your resume here</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '6px 0 0' }}>PDF or TXT · Max 5 MB</p>
          </div>
          <button style={{
            padding: '12px 24px', borderRadius: '12px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white',
            border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 4px 12px ${ACCENT}33`, fontFamily: 'var(--font-sans)'
          }}>
            Browse files
          </button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} accept=".pdf,.txt" style={{ display: 'none' }} />
        </motion.div>
      )}

      {/* Loading */}
      {isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ height: '6px', background: 'var(--color-surface-low)', position: 'relative' }}>
            <motion.div
              style={{ height: '100%', background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`, width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div style={{ padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '76px', height: '76px', borderRadius: '20px',
                background: `linear-gradient(135deg, ${ACCENT}15, ${ACCENT_LIGHT}15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px', border: `1px solid ${ACCENT}22`
              }}>
              <StepIcon size={32} style={{ color: ACCENT }} />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p key={loadingStep} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 6px' }}>
                {LOADING_STEPS[loadingStep]?.label}
              </motion.p>
            </AnimatePresence>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <Clock size={14} style={{ color: 'var(--color-outline)' }} />
              <span style={{ fontSize: '13px', color: 'var(--color-outline)', fontFamily: 'monospace' }}>
                {remaining > 0 ? `~${remaining}s remaining` : 'Wrapping up…'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
              {LOADING_STEPS.map((_, i) => (
                <div key={i} style={{
                  height: '6px', borderRadius: '999px',
                  width: i <= loadingStep ? '28px' : '14px',
                  background: i <= loadingStep ? `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})` : 'var(--color-surface-low)',
                  transition: 'all 0.4s'
                }} />
              ))}
            </div>
            <div style={{ background: 'var(--color-surface-low)', borderRadius: '12px', padding: '12px 16px', border: '1px solid rgba(24,20,69,0.04)', maxWidth: '420px' }}>
              <AnimatePresence mode="wait">
                <motion.p key={tipIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)', margin: 0, lineHeight: 1.6 }}>
                  {TIPS[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(() => {
              const sm = scoreMeta(result.score);
              return (
                <div style={{ ...cardStyle, padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '160px', height: '160px', background: `${sm.color}10`, borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', width: '128px', height: '128px', flexShrink: 0 }}>
                    <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                      <path style={{ color: 'var(--color-surface-low)' }} stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <motion.path
                        initial={{ strokeDasharray: '0, 100' }}
                        animate={{ strokeDasharray: `${result.score}, 100` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                        stroke={sm.color} strokeWidth="2.8" strokeLinecap="round" fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-shakti-dark-text)', lineHeight: 1 }}>{result.score}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>ATS Score</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: sm.bg, color: sm.text, border: `1px solid ${sm.border}`, marginBottom: '8px' }}>
                      {sm.label}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: '0 0 4px' }}>Resume Analyzed</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>Skills extracted and matched against career paths.</p>
                  </div>
                </div>
              );
            })()}

            {/* Top roles */}
            <div style={{ ...cardStyle, padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ACCENT_BG, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Briefcase size={18} /></div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Top Role Matches</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {result.roles?.map((role, i) => {
                  const c = role.matchScore > 80 ? '#10b981' : role.matchScore > 60 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '180px', flexShrink: 0 }}>
                        <div style={{ flex: 1, height: '8px', background: 'var(--color-surface-low)', borderRadius: '999px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${role.matchScore}%` }} transition={{ duration: 1, delay: i * 0.15 }}
                            style={{ height: '100%', background: c, borderRadius: '999px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', width: '36px', textAlign: 'right' }}>{role.matchScore}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keywords + Strengths */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              <div style={{ ...cardStyle, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={18} /></div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Missing Keywords</h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} style={{ padding: '5px 10px', background: '#fffbeb', color: '#b45309', borderRadius: '8px', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(245,158,11,0.22)' }}>{kw}</span>
                  ))}
                </div>
              </div>
              <div style={{ ...cardStyle, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={18} /></div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Strengths</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.strengths?.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-shakti-dark-text)' }}>
                      <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0 }} /> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rewrite */}
            <div style={{ ...cardStyle, padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '140px', height: '100%', background: `linear-gradient(to left, ${ACCENT}08, transparent)`, pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ACCENT_BG, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={18} /></div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>AI Rewrite Suggestion</h4>
                  <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: '2px 0 0' }}>A stronger version of one of your bullets</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', position: 'relative', zIndex: 1 }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>Current <ArrowRight size={10} /></p>
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)', minHeight: '90px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.55, margin: 0 }}>{result.improvement?.original}</p>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '5px' }}>Enhanced <Zap size={10} /></p>
                  <div style={{ padding: '14px', borderRadius: '12px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', minHeight: '90px' }}>
                    <p style={{ fontSize: '13px', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>{result.improvement?.rewritten}</p>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '14px', padding: '12px', borderRadius: '12px', background: ACCENT_BG, border: `1px solid ${ACCENT}22`, display: 'flex', alignItems: 'flex-start', gap: '10px', position: 'relative', zIndex: 1 }}>
                <Info size={14} style={{ color: ACCENT, flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)', margin: 0, lineHeight: 1.5 }}>
                  <span style={{ color: ACCENT, fontWeight: 700, marginRight: '4px' }}>Why:</span>{result.improvement?.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setSelectedFile(null); }}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white',
                border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: `0 4px 12px ${ACCENT}33`, fontFamily: 'var(--font-sans)', marginTop: '4px'
              }}
            >
              <RefreshCcw size={16} /> Analyze Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
