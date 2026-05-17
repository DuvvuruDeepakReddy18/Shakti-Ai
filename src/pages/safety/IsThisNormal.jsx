import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareWarning, ArrowLeft, Sparkles, ShieldCheck, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { analyzeIncident } from '../../services/aiService';

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

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setAnalysis(null);
    
    try {
      const parsedAnalysis = await analyzeIncident(text);
      setAnalysis(parsedAnalysis);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze the situation. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColors = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'dangerous': return 'bg-[var(--color-shakti-error-container)]/80 border-[var(--color-shakti-error)]/30 text-[var(--color-shakti-error)] shadow-[0_8px_30px_rgba(186,26,26,0.15)]';
      case 'concerning': return 'bg-[var(--color-shakti-warning-light)]/30 border-[var(--color-shakti-warning)]/40 text-[#b45309] shadow-[0_8px_30px_rgba(245,158,11,0.15)]';
      case 'normal': return 'bg-[var(--color-shakti-success-light)]/20 border-[var(--color-shakti-success)]/40 text-[var(--color-shakti-success)] shadow-[0_8px_30px_rgba(16,185,129,0.15)]';
      default: return 'bg-[var(--color-shakti-info)]/10 border-[var(--color-shakti-info)]/30 text-[var(--color-shakti-info)] shadow-[0_8px_30px_rgba(59,130,246,0.15)]';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'dangerous': return <AlertCircle size={24} className="text-[var(--color-shakti-error)]" />;
      case 'concerning': return <MessageSquareWarning size={24} className="text-[#b45309]" />;
      case 'normal': return <ShieldCheck size={24} className="text-[var(--color-shakti-success)]" />;
      default: return <Info size={24} className="text-[var(--color-shakti-info)]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] pb-32 px-4 pt-6 max-w-[760px] mx-auto font-sans">
      <Link to="/safety" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-shakti-primary)] transition-colors mb-4">
        <ArrowLeft size={16} /> Back to Safety
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 md:p-7 mb-5 bg-[var(--color-surface-lowest)]"
        style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(168,85,247,0.10)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className="rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 6px 20px rgba(168,85,247,0.30)' }}
          >
            <MessageSquareWarning size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold mb-0.5 tracking-tight" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Is This Normal?</h1>
            <p className="text-sm font-medium leading-snug" style={{ color: 'var(--color-outline)' }}>Describe a situation. AI gives an honest, supportive read.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-5 shadow-[0_1px_6px_rgba(24,20,69,0.03)] border border-[var(--color-surface-highlight)] mb-6"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what happened. The more detail, the better the analysis…"
          rows={5}
          className="w-full px-4 py-4 rounded-2xl bg-[var(--color-surface-low)] border border-transparent text-[var(--color-text-primary)] text-sm focus:bg-[var(--color-surface-lowest)] focus:border-[var(--color-shakti-primary-light)] focus:ring-2 focus:ring-[var(--color-shakti-primary-light)]/20 outline-none resize-none mb-3 transition-all placeholder:text-[var(--color-text-secondary)]"
        />
        <div className="flex justify-between items-center px-1">
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[var(--color-shakti-success)]" /> Anonymous & Secure
          </p>
          <button
            onClick={analyze}
            disabled={!text.trim() || loading}
            className="px-6 py-2.5 rounded-xl bg-[var(--color-shakti-dark-text)] text-white text-sm font-bold hover:bg-[var(--color-shakti-primary)] hover:shadow-md hover:shadow-[var(--color-shakti-primary)]/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none disabled:hover:bg-[var(--color-shakti-dark-text)] disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2"
          >
            <Sparkles size={15} className={loading ? "animate-spin" : ""} />
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </motion.div>

      {!analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="h-px bg-[var(--color-surface-highlight)] flex-1"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Try an example</p>
            <div className="h-px bg-[var(--color-surface-highlight)] flex-1"></div>
          </div>
          <div className="grid gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="w-full text-left px-4 py-3 rounded-2xl bg-[var(--color-surface-lowest)] border border-[var(--color-surface-highlight)] text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-shakti-primary-light)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-shakti-primary)] transition-all duration-200 flex items-center justify-between group"
              >
                <span className="pr-3 leading-relaxed text-[13px]">"{ex}"</span>
                <ChevronRight size={16} className="text-[var(--color-outline)] group-hover:text-[var(--color-shakti-primary)] transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`rounded-[2rem] p-8 border ${getVerdictColors(analysis.verdict)} transition-all`}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-[1.25rem] bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-sm border border-white/40">
              {getVerdictIcon(analysis.verdict)}
            </div>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-[10px] font-bold uppercase tracking-wider mb-2 border border-white/60 shadow-sm">
                {analysis.verdict || 'Analysis'}
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold text-inherit tracking-tight leading-tight">{analysis.title}</h3>
            </div>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed mb-8 opacity-90 font-medium">
            {analysis.summary}
          </p>

          <div className="bg-white/50 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/60 mb-8 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-5">Suggested steps</p>
            <ol className="space-y-5">
              {analysis.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-[10px] bg-white text-current flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm border border-white/50 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold leading-relaxed opacity-90">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/60 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-[var(--color-shakti-error-container)] rounded-[12px] text-[var(--color-shakti-error)] mt-1 shadow-inner">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-shakti-error)] mb-1.5 uppercase tracking-wide">Need to talk to someone now?</p>
              <p className="text-sm md:text-base font-extrabold text-[var(--color-shakti-error)]">{analysis.helplines.join(' · ')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
