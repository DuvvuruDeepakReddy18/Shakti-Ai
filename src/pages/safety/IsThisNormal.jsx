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
      case 'dangerous': return 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100';
      case 'concerning': return 'bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100';
      case 'normal': return 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100';
      default: return 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'dangerous': return <AlertCircle size={24} className="text-rose-600" />;
      case 'concerning': return <MessageSquareWarning size={24} className="text-amber-600" />;
      case 'normal': return <ShieldCheck size={24} className="text-emerald-600" />;
      default: return <Info size={24} className="text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 px-4 pt-8 max-w-[700px] mx-auto font-sans">
      <Link to="/safety" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Safety
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 mb-10 shadow-xl shadow-indigo-200"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 shadow-inner border border-white/20">
            <MessageSquareWarning size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Is This Normal?</h1>
            <p className="text-indigo-100 text-base md:text-lg leading-relaxed font-medium">Describe a situation. AI gives an honest, supportive read.</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-3 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe what happened. The more detail, the better the analysis…"
          rows={6}
          className="w-full px-5 py-5 rounded-2xl bg-slate-50/50 border-transparent text-slate-700 text-base focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 outline-none resize-none mb-3 transition-all placeholder:text-slate-400"
        />
        <div className="flex justify-between items-center px-3 pb-2">
          <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} /> Anonymous & Secure
          </p>
          <button
            onClick={analyze}
            disabled={!text.trim() || loading}
            className="px-8 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:transform-none disabled:hover:bg-slate-900 disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2"
          >
            <Sparkles size={16} className={loading ? "animate-spin" : ""} /> 
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </motion.div>

      {!analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center gap-3 mb-5 ml-2">
            <div className="h-px bg-slate-200 flex-1"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Try an example</p>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="grid gap-3">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="w-full text-left px-6 py-4 rounded-2xl bg-white border border-slate-100 text-sm font-medium text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-700 hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
              >
                <span className="pr-4 leading-relaxed">"{ex}"</span>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {analysis && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`rounded-3xl p-8 border shadow-lg ${getVerdictColors(analysis.verdict)} transition-all`}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-sm border border-white/40">
              {getVerdictIcon(analysis.verdict)}
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/60 text-xs font-bold uppercase tracking-wider mb-2 border border-white/40">
                {analysis.verdict || 'Analysis'}
              </span>
              <h3 className="text-xl font-extrabold text-inherit tracking-tight">{analysis.title}</h3>
            </div>
          </div>
          
          <p className="text-base leading-relaxed mb-8 opacity-90 font-medium">
            {analysis.summary}
          </p>

          <div className="bg-white/40 rounded-2xl p-6 border border-white/40 mb-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-5">Suggested steps</p>
            <ol className="space-y-5">
              {analysis.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-white text-current flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm border border-white/50 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium leading-relaxed opacity-90">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-rose-100 rounded-full text-rose-600 mt-1">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-800 mb-1.5 uppercase tracking-wide">Need to talk to someone now?</p>
              <p className="text-sm font-bold text-rose-900">{analysis.helplines.join(' · ')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
