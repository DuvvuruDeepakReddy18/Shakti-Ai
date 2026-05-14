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
    <div className="min-h-screen bg-[#fdfcff] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-[0_10px_30px_rgba(109,40,217,0.06)] border border-purple-50">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Target size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">AI Resume Analyzer</h1>
            <p className="text-sm text-gray-600">Extract skills and match your resume to the best roles.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-purple-50/50 p-4 rounded-2xl mb-6 flex gap-3 items-start border border-purple-100">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-purple-600" />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Our Minimax AI scans your resume text, identifies your key skills, and scores your fit for various roles across the industry.
        </p>
      </div>

      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-16 rounded-3xl bg-white border-2 border-dashed border-purple-200 flex flex-col items-center justify-center gap-5 cursor-pointer hover:bg-purple-50/30 hover:border-purple-300 transition-all shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center">
            <FileUp size={32} className="text-purple-600" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Drop your resume here</h3>
            <p className="text-xs text-gray-500">PDF or TXT (max 5MB)</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all">
            Browse files
          </button>
          <input
            type="file" ref={fileInputRef} onChange={handleUpload}
            accept=".pdf,.txt" className="hidden"
          />
        </motion.div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
            <motion.div
              initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }}
              className="h-full bg-purple-500"
            />
          </div>
          <div className="relative w-20 h-24 mb-6">
            <FileText size={80} className="text-purple-100" />
            <motion.div
              animate={{ y: [0, 80, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-6px] right-[-6px] h-1 bg-purple-400 rounded-full"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Analyzing skills & roles…</h3>
          <p className="text-xs text-gray-500">Powered by Minimax AI</p>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-purple-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
              <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" stroke="currentColor" strokeWidth="2.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <motion.path
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${result.score}, 100` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    className={result.score > 80 ? 'text-emerald-500' : 'text-amber-500'}
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-gray-900 leading-none">{result.score}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Match</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 mb-2">
                  Overall ATS Score
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Resume processed</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We've successfully extracted your skills and mapped them against potential career paths.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Briefcase size={18} />
                </div>
                <h4 className="text-base font-semibold text-gray-900">Top Role Matches</h4>
              </div>
              <div className="space-y-4">
                {result.roles?.map((role, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">{role.title}</span>
                    <div className="flex items-center gap-3 w-32 sm:w-48 flex-shrink-0">
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${role.matchScore}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className={`h-full ${role.matchScore > 80 ? 'bg-emerald-500' : role.matchScore > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-900 w-8 text-right flex-shrink-0">{role.matchScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Target size={18} />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Missing keywords</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Trophy size={18} />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">Strengths</h4>
                </div>
                <div className="space-y-2">
                  {result.strengths?.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-purple-50 to-transparent pointer-events-none" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">AI rewrite suggestion</h4>
                  <p className="text-xs text-gray-500">A stronger version of one of your bullets</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Current <ArrowRight size={11} className="text-gray-300" />
                  </p>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 min-h-[100px]">
                    <p className="text-sm text-gray-700 leading-relaxed">{result.improvement?.original}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    Enhanced <Zap size={11} className="text-purple-500" />
                  </p>
                  <div className="p-4 rounded-xl bg-purple-600 text-white min-h-[100px]">
                    <p className="text-sm font-medium leading-relaxed">{result.improvement?.rewritten}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-3 relative z-10">
                <Info size={16} className="text-purple-400 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="text-purple-700 font-semibold mr-1">Why:</span>
                  {result.improvement?.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => { setResult(null); setSelectedFile(null); }}
              className="w-full py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={16} /> Analyze another resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
