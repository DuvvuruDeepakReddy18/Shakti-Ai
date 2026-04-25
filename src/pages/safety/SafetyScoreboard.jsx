import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Star, MapPin, Plus, TrendingUp, TrendingDown,
  X, ArrowRight, ShieldCheck, ChevronRight, ArrowLeft,
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

export default function SafetyScoreboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('best');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showRating, setShowRating] = useState(false);

  const submitRating = () => {
    if (!location || rating === 0) return toast.error('Enter location and rating');
    toast.success('Thanks for making the community safer.');
    setLocation(''); setRating(0); setSelectedTags([]); setShowRating(false);
  };

  const toggleTag = (t) => setSelectedTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const items = tab === 'best' ? DEMO_RATINGS : WORST;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--color-surface)] shadow-inner flex items-center justify-center text-[var(--color-shakti-dark-text)] flex-shrink-0">
            <Award size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Safety Scoreboard</h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Crowdsourced safety insights for women.</p>
          </div>
        </div>
      </motion.div>

      {!showRating ? (
        <button
          onClick={() => setShowRating(true)}
          className="w-full py-4 mt-2 rounded-[1rem] bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[var(--color-shakti-dark-text)]/20 transition-all mb-8"
        >
          <Plus size={18} className="text-emerald-400" /> Rate a location
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 md:p-8 mb-8 border border-[var(--color-surface-highlight)] shadow-sm relative"
        >
          <button onClick={() => setShowRating(false)} className="absolute top-6 right-6 text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors">
            <X size={20} />
          </button>

          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">Contribute safety data</h3>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-wider mb-3">Location</p>
              <input
                value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="Search area or landmark"
                className="w-full px-5 py-4 rounded-[1rem] bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-[var(--color-text-primary)] text-sm placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-shakti-dark-text)] focus:ring-1 focus:ring-[var(--color-shakti-dark-text)] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              />
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-[1rem] border border-[var(--color-surface-highlight)]">
              <p className="text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-wider mb-4 text-center">Your safety rating</p>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className="active:scale-90 transition-transform p-1">
                    <Star
                      size={40}
                      fill={s <= rating ? '#ec4899' : 'transparent'}
                      className={`transition-colors ${s <= rating ? 'text-pink-500' : 'text-gray-300 hover:text-pink-200'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-wider mb-3">Add safety tags</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button
                    key={t} onClick={() => toggleTag(t)}
                    className={`px-4 py-2 rounded-[0.75rem] text-xs font-bold transition-all border
                      ${selectedTags.includes(t)
                        ? 'bg-[var(--color-shakti-dark-text)] text-white border-[var(--color-shakti-dark-text)] shadow-sm'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-surface-highlight)] hover:bg-[var(--color-surface-lowest)] hover:text-[var(--color-text-primary)]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[var(--color-surface-highlight)]">
              <button onClick={submitRating} className="flex-1 py-4 rounded-[1rem] bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white text-sm font-bold hover:shadow-lg hover:shadow-[var(--color-shakti-dark-text)]/20 transition-all">Submit Rating</button>
              <button onClick={() => setShowRating(false)} className="px-6 py-4 rounded-[1rem] bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-sm font-bold border border-[var(--color-surface-highlight)] hover:bg-[var(--color-surface-lowest)] transition-all">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-[var(--color-surface-lowest)] p-1.5 rounded-[1rem] border border-[var(--color-surface-highlight)] shadow-sm flex mb-8 max-w-sm mx-auto">
        <button onClick={() => setTab('best')}
          className={`flex-1 py-2.5 px-4 rounded-[0.75rem] text-xs font-bold transition-all
            ${tab === 'best' ? 'bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>
          Safe zones
        </button>
        <button onClick={() => setTab('worst')}
          className={`flex-1 py-2.5 px-4 rounded-[0.75rem] text-xs font-bold transition-all
            ${tab === 'worst' ? 'bg-rose-500 text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}>
          Red zones
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner
                    ${item.score >= 7 ? 'bg-emerald-50 text-emerald-700' : item.score >= 5 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                  {item.score}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-[var(--color-shakti-dark-text)] flex-shrink-0" />
                    <h3 className="text-base font-bold text-[var(--color-text-primary)] truncate tracking-tight">{item.location}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-[var(--color-text-secondary)]">
                    <span>{item.reviews} verified reviews</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ShieldCheck size={12} /> Assessed
                    </span>
                  </div>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform
                 ${item.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : item.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-400'}`}>
                {item.trend === 'up' && <TrendingUp size={18} strokeWidth={2.5} />}
                {item.trend === 'down' && <TrendingDown size={18} strokeWidth={2.5} />}
                {item.trend === 'stable' && <ArrowRight size={18} strokeWidth={2.5} />}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((t, j) => (
                <span key={j} className="px-3 py-1 rounded-[0.5rem] bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-[11px] font-bold border border-[var(--color-surface-highlight)]">
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--color-surface-highlight)] flex items-center justify-between">
              <button className="text-xs font-bold text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors flex items-center gap-1">
                Read community reviews <ChevronRight size={14} />
              </button>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((p) => (
                  <div key={p} className="w-8 h-8 rounded-full border-2 border-[var(--color-surface-lowest)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${item.id}${p}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
