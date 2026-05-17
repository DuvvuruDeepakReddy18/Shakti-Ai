import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Loader2, TrendingUp, Target, Briefcase,
  BookOpen, Award, ChevronRight, Sparkles, Rocket,
  GraduationCap, Calendar, IndianRupee, Zap, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { simulateCareer } from '../../services/aiService';

const SAMPLE_SKILLS = ['HTML/CSS', 'Basic Excel', 'Communication', 'Data Entry', 'Social Media', 'Cooking', 'Teaching'];
const SAMPLE_ROLES = ['Frontend Developer', 'Data Analyst', 'Digital Marketing Manager', 'UX Designer', 'Content Strategist', 'Product Manager'];

export default function CareerSimulator() {
  const navigate = useNavigate();
  const [currentSkills, setCurrentSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);

  const handleSimulate = async () => {
    if (!currentSkills.trim() || !targetRole.trim()) return toast.error('Fill in both fields');
    setLoading(true);
    setSimulation(null);
    try {
      const data = await simulateCareer(currentSkills, targetRole);
      setSimulation(data);
      toast.success('Career path simulated!');
    } catch {
      toast.error('Simulation failed');
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
        style={{ background: 'linear-gradient(135deg, #1a0d25 0%, #2d1050 50%, #1a0d30 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-400/20 to-purple-400/20 backdrop-blur-md flex items-center justify-center text-fuchsia-300 flex-shrink-0 border border-fuchsia-400/20 shadow-lg shadow-fuchsia-500/10">
            <Rocket size={30} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">Career Simulator</h1>
            <p className="text-fuchsia-200/60 text-sm font-medium">AI-powered 6-month roadmap to your dream role.</p>
          </div>
        </div>
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] shadow-xl mb-6">
        
        <div className="mb-5">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block ml-1">Current Skills</label>
          <div className="relative">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-fuchsia-400" size={16} />
            <input value={currentSkills} onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g. HTML, Excel, Communication"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-fuchsia-500/40 focus:ring-1 focus:ring-fuchsia-500/20 outline-none transition-all" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {SAMPLE_SKILLS.map(s => (
              <button key={s} onClick={() => setCurrentSkills(prev => prev ? `${prev}, ${s}` : s)}
                className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-white/[0.03] text-white/30 border border-white/[0.06] hover:bg-fuchsia-500/10 hover:text-fuchsia-400 hover:border-fuchsia-500/20 transition-all">
                + {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block ml-1">Dream Role</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={16} />
            <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-fuchsia-500/40 focus:ring-1 focus:ring-fuchsia-500/20 outline-none transition-all" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {SAMPLE_ROLES.map(r => (
              <button key={r} onClick={() => setTargetRole(r)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition-all ${
                  targetRole === r ? 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20' : 'bg-white/[0.03] text-white/30 border-white/[0.06] hover:bg-fuchsia-500/10 hover:text-fuchsia-400 hover:border-fuchsia-500/20'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSimulate} disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Simulating career path…' : 'Generate 6-Month Roadmap'}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {simulation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06] text-center">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">From</p>
                <p className="text-sm font-bold text-white">{simulation.currentLevel}</p>
                <p className="text-xs text-fuchsia-400 font-semibold mt-1">{simulation.currentSalary}</p>
              </div>
              <div className="bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 rounded-2xl p-5 border border-fuchsia-500/20 text-center">
                <p className="text-[10px] font-bold text-fuchsia-400/60 uppercase tracking-wider mb-1">Target</p>
                <p className="text-sm font-bold text-white">{simulation.targetLevel}</p>
                <p className="text-xs text-emerald-400 font-semibold mt-1">{simulation.targetSalary}</p>
              </div>
            </div>

            {/* Monthly Roadmap */}
            <div className="px-1">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-fuchsia-400" /> Monthly Roadmap
              </h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-fuchsia-500/40 via-purple-500/30 to-transparent" />

              <div className="space-y-4">
                {simulation.months?.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="relative pl-14">
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-5 w-5 h-5 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 border-2 border-[#0d0b1a] shadow-lg shadow-fuchsia-500/30 z-10 flex items-center justify-center">
                      <span className="text-[8px] font-black text-white">{m.month}</span>
                    </div>

                    <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06] hover:border-fuchsia-500/20 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider">Month {m.month}</span>
                          <h3 className="text-sm font-bold text-white mt-0.5">{m.milestone}</h3>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-sm font-black text-emerald-400 flex items-center gap-1">
                            <IndianRupee size={12} />{m.salary?.replace('₹', '')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {m.skills?.map((s, j) => (
                          <span key={j} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/15">{s}</span>
                        ))}
                      </div>

                      {m.course && (
                        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                          <GraduationCap size={12} className="text-amber-400 flex-shrink-0" />
                          <span className="text-xs text-white/40">{m.course}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button onClick={() => setSimulation(null)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-fuchsia-500/20 transition-all mt-2">
              <Sparkles size={16} /> Try Another Career Path
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
