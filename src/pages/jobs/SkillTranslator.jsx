import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Loader2, TrendingUp, MapPin, Briefcase,
  DollarSign, Clock, Zap, ChevronRight, Star,
  Plus, X, Sparkles, IndianRupee, Target, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { translateSkills } from '../../services/aiService';

const SUGGESTED_SKILLS = ['Cooking', 'Stitching', 'Teaching', 'Mehndi', 'Data Entry', 'Social Media', 'Photography', 'Hindi Writing', 'Painting', 'Yoga', 'Accounting', 'Web Design'];

const getDifficultyColor = (d) => {
  if (d === 'Beginner') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (d === 'Intermediate') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
};

export default function SkillTranslator() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const addSkill = (s) => {
    const skill = s || skillInput.trim();
    if (skill && !skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const handleTranslate = async () => {
    if (skills.length === 0) return toast.error('Add at least one skill');
    if (!location.trim()) return toast.error('Enter your location');
    setLoading(true);
    setResults(null);
    try {
      const data = await translateSkills(skills, location);
      setResults(data);
      if (data?.length) toast.success(`Found ${data.length} opportunities!`);
      else toast.error('No results — try different skills');
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0d0b1a] to-[#0a0a12] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
      </button>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-7 md:p-9 mb-6 border border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #0d1a0d 0%, #1a3520 50%, #0d2010 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-500/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20 backdrop-blur-md flex items-center justify-center text-emerald-300 flex-shrink-0 border border-emerald-400/20 shadow-lg shadow-emerald-500/10">
            <IndianRupee size={30} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">Skill → Income Translator</h1>
            <p className="text-emerald-200/60 text-sm font-medium">Turn your existing skills into real earning opportunities.</p>
          </div>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] shadow-xl mb-6">
        
        {/* Skill Input */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block ml-1">Your Skills</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Type a skill and press Enter"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all" />
            </div>
            <button onClick={() => addSkill()} className="px-4 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Suggested Skills */}
        <div className="mb-5">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2 ml-1">Quick add</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 8).map(s => (
              <button key={s} onClick={() => addSkill(s)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-white/40 text-xs font-medium border border-white/[0.06] hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 transition-all">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Skills */}
        {skills.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2 ml-1">Selected ({skills.length})</p>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-white transition-colors"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="mb-5">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block ml-1">Your Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" size={16} />
            <input value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hyderabad, Delhi, Mumbai"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all" />
          </div>
        </div>

        <button onClick={handleTranslate} disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'AI is finding opportunities…' : 'Discover Earning Paths'}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" /> Income Opportunities
              </h2>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{results.length} found</span>
            </div>

            {results.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                      <Briefcase size={14} className="text-emerald-400 flex-shrink-0" />
                      {r.title}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed">{r.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-base font-black text-emerald-400">{r.estimatedEarning}</p>
                    <p className="text-[10px] text-white/30 font-medium">per month</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getDifficultyColor(r.difficulty)}`}>{r.difficulty}</span>
                  {r.platform && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] text-white/40 border border-white/[0.06] flex items-center gap-1">
                      <Target size={10} /> {r.platform}
                    </span>
                  )}
                  {r.timeCommitment && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] text-white/40 border border-white/[0.06] flex items-center gap-1">
                      <Clock size={10} /> {r.timeCommitment}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
