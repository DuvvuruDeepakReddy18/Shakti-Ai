import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, FileText, CheckCircle2, FileUp,
  Sparkles, RefreshCcw, Trophy, Target, ArrowRight,
  Zap, Info, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large (max 5MB)');
        return;
      }
      setSelectedFile(file);
      startAnalysis(file);
    }
  };

  const extractTextFromFile = async (file) => {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      return text;
    } else {
      return await file.text();
    }
  };

  // Helper: fetch with timeout
  const fetchWithTimeout = (url, options, timeoutMs = 25000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
      .finally(() => clearTimeout(timer));
  };

  const startAnalysis = async (file) => {
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const extractedText = await extractTextFromFile(file);
      
      const prompt = `You are an expert ATS (Applicant Tracking System) and career coach.
Analyze the following resume text:
"${extractedText.substring(0, 4000)}"

Extract the skills from the resume and show the match scores for 3 different roles it suits best based on those skills.
Also identify missing keywords, strengths, and one specific bullet point improvement.
Respond ONLY with a valid JSON object in this EXACT format, with no markdown or extra text:
{
  "score": 85,
  "roles": [
    { "title": "Frontend Developer", "matchScore": 90 },
    { "title": "UI/UX Designer", "matchScore": 75 },
    { "title": "Technical Writer", "matchScore": 60 }
  ],
  "missingKeywords": ["React Native", "GraphQL", "Jest"],
  "strengths": ["Strong action verbs", "Clear impact metrics"],
  "improvement": {
    "original": "Worked on web app using React.",
    "rewritten": "Developed a scalable web application using React, improving load time by 20%.",
    "reason": "Added specific metrics and impact."
  }
}`;

      const models = [
        'google/gemma-3-4b-it:free',
        'meta-llama/llama-4-scout:free',
        'minimax/minimax-m2.5:free',
      ];

      let parsedResult = null;

      for (const model of models) {
        try {
          console.log(`Trying resume analysis model: ${model}`);
          const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model,
              max_tokens: 1500,
              messages: [{ role: "user", content: prompt }]
            })
          }, 25000);

          if (!response.ok) {
            console.warn(`Model ${model} returned status ${response.status}`);
            continue;
          }
          const data = await response.json();
          if (data.error) {
            console.warn(`Model ${model} error:`, data.error);
            continue;
          }
          const content = data.choices?.[0]?.message?.content;
          if (!content) continue;
          
          const cleanContent = content.replace(/```json/gi, '').replace(/```/g, '').trim();
          const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
          parsedResult = JSON.parse(jsonMatch ? jsonMatch[0] : cleanContent);
          console.log(`Model ${model} succeeded`);
          break;
        } catch (err) {
          console.warn(`Model ${model} failed:`, err.message);
          continue;
        }
      }

      if (parsedResult) {
        setResult(parsedResult);
        toast.success('Analysis complete');
      } else {
        throw new Error('All models failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('AI models are busy. Showing demo analysis.');
      // Fallback result for demo purposes if API fails
      setResult({
        score: 78,
        roles: [
          { title: "General Developer", matchScore: 80 },
          { title: "Project Coordinator", matchScore: 65 },
          { title: "Technical Writer", matchScore: 55 }
        ],
        missingKeywords: ['Leadership', 'Analytics', 'Cloud Computing'],
        strengths: ['Clear structure', 'Basic skills listed', 'Good formatting'],
        improvement: {
          original: 'Did some coding tasks.',
          rewritten: 'Completed 5+ feature tickets ahead of schedule using modern coding practices.',
          reason: 'Quantifies output and highlights efficiency.'
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-shakti-primary)] mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-shakti-primary-container)]">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl pointer-events-none" style={{ background: 'color-mix(in srgb, var(--color-shakti-primary-container) 40%, transparent)' }} />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-shakti-primary-container)] flex items-center justify-center text-[var(--color-shakti-primary)] flex-shrink-0">
            <Target size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">AI Resume Analyzer</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Extract skills and match your resume to the best roles.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-[var(--color-shakti-primary-container)] p-4 rounded-2xl mb-6 flex gap-3 items-start border border-[var(--color-shakti-primary-container)]" style={{ background: 'color-mix(in srgb, var(--color-shakti-primary-container) 50%, transparent)' }}>
        <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-lowest)] flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-[var(--color-shakti-primary)]" />
        </div>
        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
          Our Minimax AI scans your resume text, identifies your key skills, and scores your fit for various roles across the industry.
        </p>
      </div>

      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-16 rounded-3xl bg-[var(--color-surface-lowest)] border-2 border-dashed border-[var(--color-shakti-primary-container)] flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-[var(--color-shakti-primary)] transition-all shadow-sm"
          style={{ '--hover-bg': 'color-mix(in srgb, var(--color-shakti-primary-container) 30%, transparent)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface-lowest)'}
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-shakti-primary-container)] flex items-center justify-center">
            <FileUp size={32} className="text-[var(--color-shakti-primary)]" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">Drop your resume here</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">PDF or TXT (max 5MB)</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-[var(--color-shakti-primary)] text-white text-sm font-semibold hover:bg-[var(--color-shakti-tertiary)] transition-all">
            Browse files
          </button>
          <input
            type="file" ref={fileInputRef} onChange={handleUpload}
            accept=".pdf,.txt" className="hidden"
          />
        </motion.div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-[var(--color-surface-lowest)] rounded-3xl shadow-sm border border-[var(--color-surface-highlight)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-surface-highlight)]">
            <motion.div
              initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }}
              className="h-full bg-[var(--color-shakti-primary)]"
            />
          </div>
          <div className="relative w-20 h-24 mb-6">
            <FileText size={80} className="text-[var(--color-shakti-primary-container)]" />
            <motion.div
              animate={{ y: [0, 80, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-6px] right-[-6px] h-1 bg-[var(--color-shakti-tertiary)] rounded-full"
            />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Analyzing skills & roles…</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">Powered by Minimax AI</p>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-[var(--color-shakti-primary-container)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-shakti-success-container)] rounded-full blur-3xl pointer-events-none" />
              <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-[var(--color-surface-container)]" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <motion.path
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${result.score}, 100` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    className={result.score > 80 ? 'text-[var(--color-shakti-success)]' : 'text-[var(--color-shakti-warning)]'}
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-[var(--color-text-primary)] leading-none">{result.score}</span>
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mt-1">Match</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block px-2.5 py-1 bg-[var(--color-shakti-success-container)] text-[var(--color-shakti-success)] text-xs font-semibold rounded-full border border-[var(--color-shakti-success-container)] mb-2">
                  Overall ATS Score
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">Resume processed</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  We've successfully extracted your skills and mapped them against potential career paths.
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 shadow-sm border border-[var(--color-surface-highlight)] mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-shakti-secondary-container)] flex items-center justify-center text-[var(--color-shakti-secondary)]">
                  <Briefcase size={18} />
                </div>
                <h4 className="text-base font-semibold text-[var(--color-text-primary)]">Top Role Matches</h4>
              </div>
              <div className="space-y-4">
                {result.roles?.map((role, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-[var(--color-text-primary)] truncate flex-1">{role.title}</span>
                    <div className="flex items-center gap-3 w-32 sm:w-48 flex-shrink-0">
                      <div className="flex-1 h-2.5 bg-[var(--color-surface-highlight)] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${role.matchScore}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className={`h-full ${role.matchScore > 80 ? 'bg-[var(--color-shakti-success)]' : role.matchScore > 60 ? 'bg-[var(--color-shakti-warning)]' : 'bg-[var(--color-shakti-error)]'}`} 
                        />
                      </div>
                      <span className="text-xs font-bold text-[var(--color-text-primary)] w-8 text-right flex-shrink-0">{role.matchScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 shadow-sm border border-[var(--color-surface-highlight)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-shakti-warning-container)] flex items-center justify-center text-[var(--color-shakti-warning)]">
                    <Target size={18} />
                  </div>
                  <h4 className="text-base font-semibold text-[var(--color-text-primary)]">Missing keywords</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-[var(--color-shakti-warning-container)] text-[var(--color-shakti-warning)] rounded-full text-xs font-semibold border border-[var(--color-shakti-warning-container)]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 shadow-sm border border-[var(--color-surface-highlight)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-shakti-success-container)] flex items-center justify-center text-[var(--color-shakti-success)]">
                    <Trophy size={18} />
                  </div>
                  <h4 className="text-base font-semibold text-[var(--color-text-primary)]">Strengths</h4>
                </div>
                <div className="space-y-2">
                  {result.strengths?.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
                      <CheckCircle2 size={14} className="text-[var(--color-shakti-success)] flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 shadow-sm border border-[var(--color-shakti-primary-container)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-full pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-shakti-primary-container), transparent)' }} />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-shakti-primary-container)] flex items-center justify-center text-[var(--color-shakti-primary)]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[var(--color-text-primary)]">AI rewrite suggestion</h4>
                  <p className="text-xs text-[var(--color-text-secondary)]">A stronger version of one of your bullets</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Current <ArrowRight size={11} className="text-[var(--color-outline)]" />
                  </p>
                  <div className="p-4 rounded-xl bg-[var(--color-surface-low)] border border-[var(--color-surface-highlight)] min-h-[100px]">
                    <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{result.improvement?.original}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-shakti-primary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Enhanced <Zap size={11} className="text-[var(--color-shakti-tertiary)]" />
                  </p>
                  <div className="p-4 rounded-xl bg-[var(--color-shakti-primary)] text-white min-h-[100px]">
                    <p className="text-sm font-medium leading-relaxed">{result.improvement?.rewritten}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[var(--color-shakti-primary-container)] border border-[var(--color-shakti-primary-container)] flex items-center gap-3 relative z-10" style={{ background: 'color-mix(in srgb, var(--color-shakti-primary-container) 60%, transparent)' }}>
                <Info size={16} className="text-[var(--color-shakti-tertiary)] flex-shrink-0" />
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                  <span className="text-[var(--color-shakti-primary)] font-semibold mr-1">Why:</span>
                  {result.improvement?.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setSelectedFile(null); }}
              className="w-full py-3 rounded-xl bg-[var(--color-shakti-primary)] text-white text-sm font-semibold hover:bg-[var(--color-shakti-tertiary)] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={16} /> Analyze another resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
