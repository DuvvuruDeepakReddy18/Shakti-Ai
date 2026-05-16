import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareWarning, ArrowLeft, Sparkles, ShieldCheck, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "minimax/minimax-m2.5:free",
          "messages": [
            {
              "role": "system",
              "content": `You are an empathetic, supportive, and objective safety advisor for women. 
Your job is to analyze the situation described by the user and determine if it is "normal", "concerning", or "dangerous".
You must respond ONLY with a valid JSON object in this exact format, with no markdown formatting or extra text outside the JSON:
{
  "verdict": "normal" | "concerning" | "dangerous",
  "title": "A short, supportive, and clear title summarizing your assessment",
  "summary": "A compassionate but objective 2-3 sentence summary explaining why this behavior is or isn't acceptable.",
  "steps": [
    "Actionable, practical step 1",
    "Actionable, practical step 2",
    "Actionable, practical step 3"
  ],
  "helplines": ["Relevant helpline 1", "Relevant helpline 2"]
}
Always include standard Indian women's helplines if the situation is concerning or dangerous (e.g., 'Women Helpline: 181', 'National Emergency: 112', 'NCW: 7827170170'). Keep steps highly practical, emphasizing boundaries, documentation, and safety.`
            },
            {
              "role": "user",
              "content": text
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      let parsedAnalysis;
      try {
        const cleanContent = content.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedAnalysis = JSON.parse(cleanContent);
      } catch (err) {
        console.error("Failed to parse AI response:", content);
        throw new Error("Failed to parse analysis JSON");
      }

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
    <div className="min-h-screen bg-[var(--color-surface-base)] pb-32 px-4 pt-8 max-w-[700px] mx-auto font-sans">
      <Link to="/safety" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-shakti-primary)] transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Safety
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[var(--color-shakti-primary)] to-[var(--color-shakti-secondary)] rounded-[2rem] p-8 mb-10 shadow-xl shadow-[var(--color-shakti-primary-light)]/30"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 shadow-inner border border-white/20">
            <MessageSquareWarning size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Is This Normal?</h1>
            <p className="text-white/90 text-base md:text-lg leading-relaxed font-medium">Describe a situation. AI gives an honest, supportive read.</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-4 mb-10 shadow-sm border border-[var(--color-surface-highlight)]"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what happened. The more detail, the better the analysis…"
          rows={6}
          className="w-full px-5 py-5 rounded-[1.5rem] bg-[var(--color-surface)] border-transparent text-[var(--color-text-primary)] text-base focus:bg-[var(--color-surface-lowest)] focus:border-[var(--color-shakti-primary-light)] focus:ring-4 focus:ring-[var(--color-shakti-primary-light)]/20 outline-none resize-none mb-3 transition-all placeholder:text-[var(--color-text-secondary)]"
        />
        <div className="flex justify-between items-center px-3 pb-2">
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[var(--color-shakti-success)]" /> Anonymous & Secure
          </p>
          <button
            onClick={analyze}
            disabled={!text.trim() || loading}
            className="px-8 py-3.5 rounded-xl bg-[var(--color-shakti-dark-text)] text-white text-sm font-bold hover:bg-[var(--color-shakti-primary)] hover:shadow-lg hover:shadow-[var(--color-shakti-primary)]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none disabled:hover:bg-[var(--color-shakti-dark-text)] disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2"
          >
            <Sparkles size={16} className={loading ? "animate-spin" : ""} /> 
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </motion.div>

      {!analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center gap-3 mb-5 ml-2">
            <div className="h-px bg-[var(--color-surface-highlight)] flex-1"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Try an example</p>
            <div className="h-px bg-[var(--color-surface-highlight)] flex-1"></div>
          </div>
          <div className="grid gap-3">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="w-full text-left px-6 py-4 rounded-[1.25rem] bg-[var(--color-surface-lowest)] border border-[var(--color-surface-highlight)] text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-shakti-primary-light)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-shakti-primary)] hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
              >
                <span className="pr-4 leading-relaxed">"{ex}"</span>
                <ChevronRight size={18} className="text-[var(--color-outline)] group-hover:text-[var(--color-shakti-primary)] transition-colors flex-shrink-0" />
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
