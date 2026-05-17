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
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [pendingResult, setPendingResult] = useState(null);
  const [minWaitDone, setMinWaitDone] = useState(false);

  const MIN_WAIT = 60;

  // Timer + step progression during loading
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next >= MIN_WAIT) setMinWaitDone(true);
        // Progress through steps
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

  // Rotate tips every 8 seconds
  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => setTipIndex(p => (p + 1) % TIPS.length), 8000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Show result once both API + min wait are done
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0d0b1a] to-[#0a0a12] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
      </button>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-7 md:p-9 mb-6 border border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #1a1030 0%, #2a1545 50%, #151030 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-fuchsia-500/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 backdrop-blur-md flex items-center justify-center text-violet-300 flex-shrink-0 border border-violet-400/20 shadow-lg shadow-violet-500/10">
            <Target size={30} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">AI Resume Analyzer</h1>
            <p className="text-violet-200/60 text-sm font-medium">ATS scoring, role matching & AI rewrite suggestions.</p>
          </div>
        </div>
      </motion.div>

      {/* Info */}
      <div className="bg-violet-500/5 p-4 rounded-xl mb-6 flex gap-3 items-start border border-violet-500/10">
        <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
          <Zap size={16} />
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          Our AI extracts your skills, scores ATS compatibility, and suggests improvements.
          <span className="text-violet-400 font-semibold"> Analysis takes about a minute — we show helpful tips while you wait!</span>
        </p>
      </div>

      {/* Upload Area */}
      {!result && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-20 rounded-2xl bg-white/[0.02] border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/[0.02] transition-all group">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 flex items-center justify-center border border-violet-500/20 group-hover:scale-105 transition-transform" style={{ width: '72px', height: '72px' }}>
            <FileUp size={32} className="text-violet-400" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold text-white mb-1">Drop your resume here</h3>
            <p className="text-xs text-white/40">PDF or TXT · Max 5 MB</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-500/20 transition-all">
            Browse files
          </button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} accept=".pdf,.txt" className="hidden" />
        </motion.div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] shadow-xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-white/[0.04] relative">
            <motion.div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-r-full"
              style={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
          </div>

          <div className="p-8 flex flex-col items-center text-center">
            {/* Animated icon */}
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 flex items-center justify-center mb-6 border border-violet-500/20">
              <StepIcon size={36} className="text-violet-400" />
            </motion.div>

            {/* Current step */}
            <AnimatePresence mode="wait">
              <motion.p key={loadingStep} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="text-base font-bold text-white mb-2">
                {LOADING_STEPS[loadingStep]?.label}
              </motion.p>
            </AnimatePresence>

            {/* Timer */}
            <div className="flex items-center gap-2 mb-6">
              <Clock size={14} className="text-white/30" />
              <span className="text-sm text-white/40 font-mono">
                {remaining > 0 ? `~${remaining}s remaining` : 'Wrapping up…'}
              </span>
            </div>

            {/* Step indicators */}
            <div className="flex gap-2 mb-8">
              {LOADING_STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= loadingStep ? 'w-8 bg-gradient-to-r from-violet-500 to-fuchsia-500' : 'w-4 bg-white/[0.06]'
                }`} />
              ))}
            </div>

            {/* Rotating tips */}
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] max-w-md">
              <AnimatePresence mode="wait">
                <motion.p key={tipIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-white/50 leading-relaxed">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Score Card */}
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 border border-white/[0.06] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-white/[0.06]" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <motion.path
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${result.score}, 100` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    className={result.score > 80 ? 'text-emerald-400' : result.score > 60 ? 'text-amber-400' : 'text-rose-400'}
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-white leading-none">{result.score}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">ATS Score</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${result.score > 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : result.score > 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {result.score > 80 ? 'Excellent Match' : result.score > 60 ? 'Good — Room to Improve' : 'Needs Optimization'}
                </span>
                <h3 className="text-lg font-bold text-white mb-1">Resume Analyzed</h3>
                <p className="text-sm text-white/50">Skills extracted and matched against career paths.</p>
              </div>
            </div>

            {/* Top Roles */}
            <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Briefcase size={18} /></div>
                <h4 className="text-base font-bold text-white">Top Role Matches</h4>
              </div>
              <div className="space-y-4">
                {result.roles?.map((role, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-white/80 truncate flex-1">{role.title}</span>
                    <div className="flex items-center gap-3 w-32 sm:w-48 flex-shrink-0">
                      <div className="flex-1 h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${role.matchScore}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                          className={`h-full rounded-full ${role.matchScore > 80 ? 'bg-emerald-500' : role.matchScore > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      </div>
                      <span className="text-xs font-bold text-white w-8 text-right">{role.matchScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords + Strengths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400"><Target size={18} /></div>
                  <h4 className="text-base font-bold text-white">Missing Keywords</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/15">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Trophy size={18} /></div>
                  <h4 className="text-base font-bold text-white">Strengths</h4>
                </div>
                <div className="space-y-2">
                  {result.strengths?.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" /> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Rewrite */}
            <div className="bg-white/[0.03] rounded-2xl p-5 border border-violet-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-violet-500/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400"><Sparkles size={18} /></div>
                <div>
                  <h4 className="text-base font-bold text-white">AI Rewrite Suggestion</h4>
                  <p className="text-xs text-white/40">A stronger version of one of your bullets</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1.5">Current <ArrowRight size={10} /></p>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] min-h-[90px]">
                    <p className="text-sm text-white/50 leading-relaxed">{result.improvement?.original}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">Enhanced <Zap size={10} /></p>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white min-h-[90px]">
                    <p className="text-sm font-medium leading-relaxed">{result.improvement?.rewritten}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 flex items-center gap-3 relative z-10">
                <Info size={14} className="text-violet-400 flex-shrink-0" />
                <p className="text-sm text-white/50"><span className="text-violet-400 font-semibold mr-1">Why:</span>{result.improvement?.reason}</p>
              </div>
            </div>

            <button onClick={() => { setResult(null); setSelectedFile(null); }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-500/20 transition-all">
              <RefreshCcw size={16} /> Analyze Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
