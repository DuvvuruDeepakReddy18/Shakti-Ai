import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ArrowLeft, Sparkles, Target, Clock, Layers, Star, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const sampleProjects = [
  {
    title: 'Personal Finance Tracker (CLI)',
    desc: 'Track expenses, set goals, generate monthly reports — all from the terminal.',
    stack: ['Python', 'SQLite', 'Click'],
    difficulty: 'Beginner',
    time: '1 week',
    impact: 'Master CLI tools & basic database design',
    gradient: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-500/20',
  },
  {
    title: 'AI-Powered Recipe Generator',
    desc: 'Take a photo of your fridge → get 3 recipes you can make right now.',
    stack: ['React', 'OpenAI Vision', 'Tailwind'],
    difficulty: 'Intermediate',
    time: '2 weeks',
    impact: 'Learn vision APIs & responsive UI',
    gradient: 'from-blue-500 to-indigo-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    title: 'Real-time Chat with E2E Encryption',
    desc: 'WhatsApp-clone with proper end-to-end encrypted messaging.',
    stack: ['Next.js', 'Socket.io', 'Crypto'],
    difficulty: 'Advanced',
    time: '4 weeks',
    impact: 'Deep dive into encryption & WebSockets',
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-purple-500/20',
  },
];

const skillOptions = ['Python', 'JavaScript', 'React', 'AI/ML', 'Mobile', 'DevOps', 'Cloud', 'Design'];
const interestOptions = ['Health', 'Finance', 'Education', 'Climate', 'Safety', 'Productivity', 'Gaming', 'Art'];

export default function ProjectGenerator() {
  const [skills, setSkills] = useState(['Python']);
  const [interests, setInterests] = useState(['Health']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#faf9fc] pb-32 relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-300/20 blur-[120px] pointer-events-none" />

      <div className="max-w-[960px] mx-auto px-4 pt-8 relative z-10">
        <Link to="/tech" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Tech
        </Link>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 mb-8 shadow-sm border border-white/40"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 flex-shrink-0">
              <Code size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">Project Generator</h1>
              <p className="text-base text-slate-600">Discover your next big idea. Tailored to your unique skills and passions.</p>
            </div>
          </div>
        </motion.div>

        {/* Configuration Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-indigo-50/50 to-transparent rounded-bl-full pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Skills */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star size={18} className="text-amber-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Your Arsenal (Skills)</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {skillOptions.map(s => {
                  const isSelected = skills.includes(s);
                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={s}
                      onClick={() => toggle(skills, setSkills, s)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-500'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/50'
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                      {s}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Interests */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-pink-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Your Focus (Interests)</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {interestOptions.map(i => {
                  const isSelected = interests.includes(i);
                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={i}
                      onClick={() => toggle(interests, setInterests, i)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isSelected
                          ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20 border border-pink-400'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/50'
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                      {i}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                disabled={isGenerating || skills.length === 0 || interests.length === 0}
                onClick={handleGenerate}
                className="w-full relative group overflow-hidden rounded-2xl p-0.5 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-xy"></span>
                <div className="relative flex items-center justify-center gap-3 bg-slate-900 px-8 py-4 rounded-[14px] text-white font-semibold">
                  {isGenerating ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Sparkles size={18} className="text-pink-300" /> 
                      <span className="text-base tracking-wide">Generate Project Ideas</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {generated && (
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between px-2 mb-2"
              >
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Your Personalized Roadmap</h2>
                <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                  <Check size={14} /> 3 Matches Found
                </span>
              </motion.div>

              {sampleProjects.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
                  className="bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${p.gradient} text-white shadow-lg ${p.shadow} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Code size={26} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                          <Target size={12} /> {p.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-base text-slate-600 mb-5 leading-relaxed">{p.desc}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <Layers size={16} className="text-indigo-500" />
                          <span className="text-sm font-semibold text-slate-700 truncate">{p.stack.join(' · ')}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <Clock size={16} className="text-pink-500" />
                          <span className="text-sm font-semibold text-slate-700">{p.time} estimated</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <p className="text-sm font-semibold text-emerald-800">
                          {p.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
