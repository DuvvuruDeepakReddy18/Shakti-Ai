import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Wind, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
    low: { color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', label: 'Low Stress', advice: 'You\'re doing great! Keep up healthy habits.', icon: CheckCircle2 },
    moderate: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Moderate Stress', advice: 'Some warning signs. Try short wellness breaks today.', icon: Activity },
    high: { color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High Stress', advice: 'Your body needs care. Prioritize sleep and reach out to someone.', icon: AlertTriangle },
    critical: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical — Reach Out', advice: 'Please talk to a professional. iCall: 9152987821 (free & confidential).', icon: AlertTriangle },
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6 max-w-[960px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] p-6 shadow-sm bg-[var(--color-surface-lowest)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-[1.25rem] bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0 shadow-inner">
            <Brain size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] tracking-tight">Stress Detector</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Quick check-in to understand your mental state</p>
          </div>
        </div>
      </motion.div>

      {!result && (
        <>
          <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Progress</span>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{answeredCount}/{QUESTIONS.length}</span>
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
              className="w-full px-5 py-4 rounded-xl bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none shadow-inner" />
          </div>

          <button onClick={analyze} disabled={loading || answeredCount < QUESTIONS.length}
            className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0">
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
                <div className={`p-3 rounded-[1rem] bg-white shadow-sm flex-shrink-0 ${info.color}`}>
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

            {result.aiAnalysis && (
              <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
                <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2"><Brain size={16} className="text-purple-600" /> AI Emotion Analysis</h4>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 capitalize font-bold shadow-sm">{result.aiAnalysis.primaryEmotion}</span>
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 capitalize font-bold shadow-sm">{result.aiAnalysis.sentiment}</span>
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] px-2">Intensity {result.aiAnalysis.intensity}/10</span>
                </div>
                <p className="text-sm italic font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] p-4 rounded-xl shadow-inner">"{result.aiAnalysis.suggestion}"</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button onClick={reset} className="py-4 rounded-full bg-[var(--color-surface-lowest)] text-[var(--color-text-primary)] font-bold text-sm shadow-sm hover:bg-[var(--color-surface)] transition-colors active:scale-95">
                Take Again
              </button>
              <a href="/health/companion" className="py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm text-center shadow-md hover:shadow-lg transition-all active:scale-95">
                Talk to SHAKTI
              </a>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
}
