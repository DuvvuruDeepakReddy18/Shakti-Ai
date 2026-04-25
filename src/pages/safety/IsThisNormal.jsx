import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareWarning, ArrowLeft, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const examples = [
  'My boss texts me at 11pm asking about weekend plans',
  'Stranger on the bus said I look pretty 4 times',
  'Roommate locks the front door without telling me',
  'A friend keeps borrowing money but never returns it',
];

export default function IsThisNormal() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        verdict: 'concerning',
        title: 'This is a boundary issue worth addressing',
        summary:
          'A casual reading might dismiss this, but the pattern you described is not "normal" — and trusting that instinct is the first step. Here are practical next moves.',
        steps: [
          'Document each occurrence with date, time, and context.',
          'Set one clear, calm boundary in writing (text/email leaves a trail).',
          'Tell one trusted person so you have a witness to the pattern.',
          'If escalation continues, reach out to HR / authorities — you have evidence.',
        ],
        helplines: ['Women Helpline: 181', 'iCall: 9152987821'],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[800px] mx-auto font-sans">
      <Link to="/safety" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Safety
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--color-surface)] shadow-inner flex items-center justify-center text-[var(--color-shakti-dark-text)] flex-shrink-0">
            <MessageSquareWarning size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Is This Normal?</h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Describe a situation. AI gives an honest, supportive read.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 mb-8 border border-[var(--color-surface-highlight)] shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what happened. The more detail, the better the analysis…"
          rows={5}
          className="w-full px-5 py-4 rounded-[1rem] bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-[var(--color-text-primary)] text-sm focus:border-[var(--color-shakti-dark-text)] focus:ring-1 focus:ring-[var(--color-shakti-dark-text)] outline-none resize-none mb-4 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder:text-gray-400"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-[var(--color-shakti-light-text)]">Anonymous · not stored</p>
          <button
            onClick={analyze}
            disabled={!text.trim() || loading}
            className="px-6 py-3 rounded-[1rem] bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[var(--color-shakti-dark-text)]/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            <Sparkles size={16} /> {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {!analysis && (
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-shakti-light-text)] mb-4 ml-2">Try an example</p>
          <div className="space-y-3">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="w-full text-left px-5 py-4 rounded-[1.25rem] bg-[var(--color-surface-lowest)] border border-[var(--color-surface-highlight)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-shakti-dark-text)]/30 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] transition-all flex items-center justify-between group shadow-sm"
              >
                <span>"{ex}"</span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-[var(--color-shakti-dark-text)] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 border border-[var(--color-surface-highlight)] shadow-md"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-shakti-dark-text)] shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{analysis.title}</h3>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">{analysis.summary}</p>

          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-shakti-light-text)] mb-4">Suggested steps</p>
          <ol className="space-y-4 mb-6">
            {analysis.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <span className="w-7 h-7 rounded-full bg-[var(--color-surface)] text-[var(--color-shakti-dark-text)] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm border border-[var(--color-surface-highlight)]">
                  {i + 1}
                </span>
                <span className="mt-1 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>

          <div className="bg-rose-50/80 rounded-[1rem] p-4 border border-rose-100">
            <p className="text-xs font-bold text-rose-800 mb-1.5 uppercase tracking-wide">Need to talk to someone now?</p>
            <p className="text-sm font-medium text-rose-900">{analysis.helplines.join(' · ')}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
