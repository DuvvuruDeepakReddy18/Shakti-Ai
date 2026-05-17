import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Star, MapPin, Plus, TrendingUp, TrendingDown,
  X, ArrowRight, ShieldCheck, ChevronRight, ArrowLeft,
  Users, Shield, AlertTriangle, BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DEMO_RATINGS = [
  { id: 1, location: 'Connaught Place', score: 9.1, reviews: 342, trend: 'up', tags: ['Well-lit', 'Crowded', 'Metro nearby'] },
  { id: 2, location: 'MG Road Metro', score: 8.7, reviews: 289, trend: 'up', tags: ['Police nearby', 'Well-lit'] },
  { id: 3, location: 'Cyber Hub', score: 8.3, reviews: 215, trend: 'up', tags: ['Busy', 'Friendly locals'] },
  { id: 4, location: 'Nehru Place', score: 7.9, reviews: 178, trend: 'stable', tags: ['Crowded', 'Commercial'] },
  { id: 5, location: 'Lajpat Nagar Market', score: 7.4, reviews: 156, trend: 'up', tags: ['Busy', 'Shopping'] },
];

const WORST = [
  { id: 1, location: 'Industrial Area Zone B', score: 2.4, reviews: 78, trend: 'down', tags: ['Isolated', 'Poor lighting'] },
  { id: 2, location: 'Backroad near Metro', score: 3.1, reviews: 45, trend: 'down', tags: ['Unsafe transport'] },
  { id: 3, location: 'Park after 9pm', score: 3.8, reviews: 62, trend: 'stable', tags: ['Isolated', 'No lighting'] },
];

const TAGS = ['Well-lit', 'Crowded', 'Isolated', 'Friendly locals', 'Unsafe transport', 'Harassment reported', 'Police nearby', 'Metro nearby'];

const getScoreColor = (score) => {
  if (score >= 7) return { gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
  if (score >= 5) return { gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
  return { gradient: 'from-rose-500 to-rose-600', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
};

export default function SafetyScoreboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('best');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const [review, setReview] = useState('');

  const submitRating = () => {
    if (!location || rating === 0) return toast.error('Enter location and rating');
    toast.success('Thanks for making the community safer!');
    setLocation(''); setRating(0); setSelectedTags([]); setShowRating(false); setReview('');
  };

  const toggleTag = (t) => setSelectedTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const items = tab === 'best' ? DEMO_RATINGS : WORST;

  const totalReviews = [...DEMO_RATINGS, ...WORST].reduce((s, i) => s + i.reviews, 0);
  const avgScore = (DEMO_RATINGS.reduce((s, i) => s + i.score, 0) / DEMO_RATINGS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0d0b1a] to-[#0a0a12] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
      </button>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-7 md:p-9 mb-6 border border-white/[0.06]" style={{ background: 'linear-gradient(135deg, #1a1025 0%, #2d1b4e 50%, #1a1040 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-500/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-md flex items-center justify-center text-purple-300 flex-shrink-0 border border-purple-400/20 shadow-lg shadow-purple-500/10">
            <Award size={30} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">Safety Scoreboard</h1>
            <p className="text-purple-200/60 text-sm font-medium">Crowdsourced safety data from real women.</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
          <div className="bg-white/[0.05] backdrop-blur-sm rounded-xl p-3 border border-white/[0.06] text-center">
            <p className="text-xl font-black text-white">{DEMO_RATINGS.length + WORST.length}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Zones Rated</p>
          </div>
          <div className="bg-white/[0.05] backdrop-blur-sm rounded-xl p-3 border border-white/[0.06] text-center">
            <p className="text-xl font-black text-emerald-400">{avgScore}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Avg Safety</p>
          </div>
          <div className="bg-white/[0.05] backdrop-blur-sm rounded-xl p-3 border border-white/[0.06] text-center">
            <p className="text-xl font-black text-white">{totalReviews.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Reviews</p>
          </div>
        </div>
      </motion.div>

      {/* Rate a location toggle */}
      {!showRating ? (
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => setShowRating(true)}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold flex items-center justify-center gap-2.5 hover:shadow-lg hover:shadow-purple-500/20 transition-all mb-6"
        >
          <Plus size={18} /> Rate a Location
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] shadow-xl mb-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white">Contribute Safety Data</h3>
            <button onClick={() => setShowRating(false)} className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-all">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">Location</p>
              <input
                value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="Search area or landmark"
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all"
              />
            </div>

            <div className="bg-white/[0.03] p-5 rounded-xl border border-white/[0.06]">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-4 text-center">Your Safety Rating</p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className="active:scale-90 transition-transform p-1 group">
                    <Star
                      size={36}
                      fill={s <= rating ? '#ec4899' : 'transparent'}
                      className={`transition-all ${s <= rating ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-white/20 group-hover:text-pink-300/40'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">Your review (optional)</p>
              <textarea
                value={review} onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience to help other women..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2.5">Add Safety Tags</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button
                    key={t} onClick={() => toggleTag(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                      selectedTags.includes(t)
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-white/[0.06]">
              <button onClick={submitRating} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all">Submit Rating</button>
              <button onClick={() => setShowRating(false)} className="px-5 py-3.5 rounded-xl bg-white/[0.04] text-white/50 text-sm font-bold border border-white/[0.06] hover:bg-white/[0.08] transition-all">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Switcher */}
      <div className="bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.06] flex mb-6 max-w-sm mx-auto">
        <button onClick={() => setTab('best')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            tab === 'best' ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 border border-emerald-500/20' : 'text-white/40 hover:text-white/60'
          }`}>
          <ShieldCheck size={14} /> Safe Zones
        </button>
        <button onClick={() => setTab('worst')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            tab === 'worst' ? 'bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-400 border border-rose-500/20' : 'text-white/40 hover:text-white/60'
          }`}>
          <AlertTriangle size={14} /> Red Zones
        </button>
      </div>

      {/* Zone List */}
      <div className="space-y-3">
        {items.map((item, i) => {
          const colors = getScoreColor(item.score);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-5 border border-white/[0.06] hover:border-white/[0.12] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-13 h-13 rounded-xl flex items-center justify-center font-black text-lg text-white flex-shrink-0 bg-gradient-to-br ${colors.gradient} shadow-lg`} style={{ width: '52px', height: '52px' }}>
                    {item.score}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={13} className="text-purple-400 flex-shrink-0" />
                      <h3 className="text-sm font-bold text-white truncate">{item.location}</h3>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Users size={11} /> {item.reviews} reviews</span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                        <ShieldCheck size={10} /> Verified
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : item.trend === 'down' ? 'bg-rose-500/10 text-rose-400' : 'bg-white/[0.04] text-white/30'
                }`}>
                  {item.trend === 'up' && <TrendingUp size={16} />}
                  {item.trend === 'down' && <TrendingDown size={16} />}
                  {item.trend === 'stable' && <ArrowRight size={16} />}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map((t, j) => (
                  <span key={j} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/50 text-[10px] font-bold border border-white/[0.06]">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <button className="text-xs font-bold text-white/30 hover:text-purple-400 transition-colors flex items-center gap-1">
                  Read community reviews <ChevronRight size={14} />
                </button>
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((p) => (
                    <div key={p} className="w-7 h-7 rounded-full border-2 border-[#0d0b1a] overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${item.id}${p}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
