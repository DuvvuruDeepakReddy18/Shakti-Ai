import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Activity, Wind, Loader2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { analyzeEmotion } from '../../services/aiService';
import toast from 'react-hot-toast';

const QUESTIONS = [
  { id: 'sleep', q: 'How well did you sleep last night?', opts: [{ v: 1, t: 'Very poorly' }, { v: 2, t: 'Poorly' }, { v: 3, t: 'OK' }, { v: 4, t: 'Well' }, { v: 5, t: 'Great' }] },
  { id: 'energy', q: 'How is your energy right now?', opts: [{ v: 1, t: 'Exhausted' }, { v: 2, t: 'Low' }, { v: 3, t: 'Moderate' }, { v: 4, t: 'Good' }, { v: 5, t: 'Excellent' }] },
  { id: 'focus', q: 'Can you focus on tasks?', opts: [{ v: 1, t: 'Not at all' }, { v: 2, t: 'Barely' }, { v: 3, t: 'Somewhat' }, { v: 4, t: 'Well' }, { v: 5, t: 'Very well' }] },
  { id: 'appetite', q: 'How is your appetite?', opts: [{ v: 1, t: 'Very poor' }, { v: 2, t: 'Reduced' }, { v: 3, t: 'Normal' }, { v: 4, t: 'Good' }, { v: 5, t: 'Great' }] },
  { id: 'social', q: 'Do you feel connected to others?', opts: [{ v: 1, t: 'Isolated' }, { v: 2, t: 'Lonely' }, { v: 3, t: 'Neutral' }, { v: 4, t: 'Connected' }, { v: 5, t: 'Very connected' }] },
];

export default function StressDetector() {
  const [answers, setAnswers] = useState({});
  const [journal, setJournal] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / QUESTIONS.length) * 100;

  const analyze = async () => {
    if (answeredCount < QUESTIONS.length) return toast.error('Answer all questions first');
    setLoading(true);
    try {
      const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
      const maxScore = QUESTIONS.length * 5;
      const wellnessPct = Math.round((totalScore / maxScore) * 100);
      const stressLevel = wellnessPct > 75 ? 'low' : wellnessPct > 50 ? 'moderate' : wellnessPct > 30 ? 'high' : 'critical';

      let aiAnalysis = null;
      if (journal.trim()) {
        aiAnalysis = await analyzeEmotion(journal);
      }

      setResult({ wellnessPct, stressLevel, totalScore, maxScore, aiAnalysis });
    } catch {
      toast.error('Analysis failed');
    }
    setLoading(false);
  };

  const reset = () => { setAnswers({}); setJournal(''); setResult(null); };

  const STRESS_MAP = {
    low: {
      color: 'text-[var(--color-shakti-success)]', bg: 'bg-[var(--color-shakti-success)]/10', border: 'border-[var(--color-shakti-success)]/30', label: 'Low Stress', icon: CheckCircle2,
      advice: 'You\'re doing great! Keep up healthy habits.',
      suggestions: [
        'Keep your sleep schedule consistent — it\'s clearly working for you',
        'Take a 10-minute walk or stretch to keep your energy topped up',
        'Write down one thing you\'re grateful for today',
        'Check in on a friend — connection protects your mood long-term',
      ],
    },
    moderate: {
      color: 'text-[var(--color-shakti-warning)]', bg: 'bg-[var(--color-shakti-warning)]/10', border: 'border-[var(--color-shakti-warning)]/30', label: 'Moderate Stress', icon: Activity,
      advice: 'Some warning signs. A few small resets today can stop this from building up.',
      suggestions: [
        '4-7-8 breathing: inhale 4s, hold 7s, exhale 8s — repeat 4 times',
        'Take a 15-minute screen-free break — step away from your desk and phone',
        'Get 10 minutes of daylight: a short walk outside lifts mood fast',
        'Skip caffeine after 2pm and aim for an earlier bedtime tonight',
        'Message or call someone you trust and tell them how your day really was',
      ],
    },
    high: {
      color: 'text-[var(--color-shakti-error)]', bg: 'bg-[var(--color-shakti-error)]/10', border: 'border-[var(--color-shakti-error)]/30', label: 'High Stress', icon: AlertTriangle,
      advice: 'Your body is asking for care. Try these now — small actions bring stress down.',
      suggestions: [
        'Box breathing right now: inhale 4s, hold 4s, exhale 4s, hold 4s — 5 rounds',
        'Ground yourself (5-4-3-2-1): name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
        'Drop one non-essential task from today — give yourself permission',
        'Do 10 minutes of gentle stretching or yoga before bed instead of scrolling',
        'Tell one trusted person how you\'re actually feeling today',
      ],
    },
    critical: {
      color: 'text-[var(--color-shakti-error)]', bg: 'bg-[var(--color-shakti-error)]/20', border: 'border-[var(--color-shakti-error)]/50', label: 'Critical — Reach Out', icon: AlertTriangle,
      advice: 'You don\'t have to carry this alone. Start with one small step below, and please consider talking to a professional — iCall: 9152987821 (free & confidential).',
      suggestions: [
        'Slow your breathing: hand on your belly, 6 slow breaths per minute for 2 minutes',
        'Stay near someone you trust today — avoid being alone if you can',
        'Postpone big decisions and non-urgent tasks — nothing needs solving right now',
        'Drink water and eat something small, even if appetite is low',
        'iCall: 9152987821 or Women Helpline: 181 — free, confidential, judgement-free',
      ],
    },
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6 max-w-[960px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.5rem] p-6 relative overflow-hidden bg-[var(--color-surface-lowest)] shadow-[0_2px_16px_rgba(24,20,69,0.04)]"
      >
        <div className="absolute -top-16 -right-10 w-52 h-52 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(139,92,246,0.10)' }} />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', boxShadow: '0 6px 20px rgba(139,92,246,0.25)' }}>
            <Brain size={24} color="white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--color-shakti-dark-text)] tracking-tight">Stress Detector</h1>
            <p className="text-sm text-[var(--color-outline)]">Quick check-in to understand your mental state</p>
          </div>
        </div>
      </motion.div>

      {!result && (
        <>
          <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Progress</span>
              <span className="text-xs font-bold text-[var(--color-shakti-primary)] bg-[var(--color-shakti-primary)]/10 px-2 py-1 rounded-md">{answeredCount}/{QUESTIONS.length}</span>
            </div>
            <div className="h-2.5 w-full bg-[var(--color-surface)] rounded-full overflow-hidden shadow-inner">
              <motion.div className="h-full bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80]" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>

          {QUESTIONS.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
              <p className="text-base font-bold text-[var(--color-text-primary)] mb-4">{i + 1}. {q.q}</p>
              <div className="flex flex-col gap-3">
                {q.opts.map(o => {
                  const selected = answers[q.id] === o.v;
                  return (
                    <button key={o.v} onClick={() => setAnswers({ ...answers, [q.id]: o.v })}
                      style={{
                        width: '100%', padding: '14px 18px', borderRadius: '14px',
                        fontSize: '14px', fontWeight: 500, textAlign: 'left',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        transition: 'all 0.2s',
                        background: selected ? 'linear-gradient(135deg, #630ed4, #db2777)' : 'var(--color-surface-low)',
                        color: selected ? 'white' : 'var(--color-shakti-dark-muted)',
                        boxShadow: selected ? '0 6px 16px rgba(99,14,212,0.25)' : 'none',
                      }}>
                      <span>{o.t}</span>
                      {selected && <CheckCircle2 size={16} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
            <label className="text-sm font-bold text-[var(--color-text-primary)] mb-3 block">Optional: Journal your feelings</label>
            <textarea value={journal} onChange={(e) => setJournal(e.target.value)}
              placeholder="Share what's weighing on your mind..." rows={4}
              className="w-full px-5 py-4 rounded-xl bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-shakti-primary)]/20 focus:border-[var(--color-shakti-primary)] transition-all resize-none shadow-inner" />
          </div>

          <button onClick={analyze} disabled={loading || answeredCount < QUESTIONS.length}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--color-shakti-primary)] to-[var(--color-shakti-secondary)] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
            {loading ? 'Analyzing...' : 'Analyze My Wellbeing'}
          </button>
        </>
      )}

      {result && (() => {
        const info = STRESS_MAP[result.stressLevel];
        const Icon = info.icon;
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className={`rounded-[1.5rem] p-8 ${info.bg} shadow-sm`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-[1rem] bg-[var(--color-surface-lowest)] shadow-sm flex-shrink-0 ${info.color}`}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`text-2xl font-display font-bold ${info.color} mb-1 tracking-tight`}>{info.label}</h3>
                  <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Wellness score: {result.wellnessPct}%</p>
                </div>
              </div>
              <div className="h-3.5 w-full bg-white/50 rounded-full overflow-hidden mb-4 shadow-inner">
                <div className="h-full rounded-full" style={{ width: `${result.wellnessPct}%`, background: `linear-gradient(90deg, ${result.wellnessPct > 60 ? '#10B981' : result.wellnessPct > 30 ? '#F59E0B' : '#EF4444'}, ${result.wellnessPct > 60 ? '#3B82F6' : result.wellnessPct > 30 ? '#EF4444' : '#991B1B'})` }} />
              </div>
              <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed">{info.advice}</p>
            </div>

            <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
              <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-[var(--color-shakti-primary)]" /> What you can do right now
              </h4>
              <ul className="space-y-3">
                {info.suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-surface)] shadow-inner"
                  >
                    <CheckCircle2 size={16} className={`${info.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {result.aiAnalysis && (
              <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
                <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2"><Brain size={16} className="text-[var(--color-shakti-primary)]" /> AI Emotion Analysis</h4>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-shakti-primary)]/10 text-[var(--color-shakti-primary)] capitalize font-bold shadow-sm">{result.aiAnalysis.primaryEmotion}</span>
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-[var(--color-shakti-secondary)]/10 text-[var(--color-shakti-secondary)] capitalize font-bold shadow-sm">{result.aiAnalysis.sentiment}</span>
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] px-2">Intensity {result.aiAnalysis.intensity}/10</span>
                </div>
                <p className="text-sm italic font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] p-4 rounded-xl shadow-inner">"{result.aiAnalysis.suggestion}"</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={reset} className="py-4 rounded-full bg-[var(--color-surface-lowest)] text-[var(--color-text-primary)] font-bold text-sm shadow-sm hover:bg-[var(--color-surface)] transition-colors active:scale-95">
                Take Again
              </button>
              {/* inline color: the unlayered `a` rule in globals.css beats Tailwind's layered text-white */}
              <Link to="/health/companion" style={{ color: 'white' }} className="py-4 rounded-full bg-gradient-to-r from-[var(--color-shakti-primary)] to-[var(--color-shakti-secondary)] font-bold text-sm text-center shadow-md hover:shadow-lg transition-all active:scale-95">
                Talk to SHAKTI
              </Link>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
}
