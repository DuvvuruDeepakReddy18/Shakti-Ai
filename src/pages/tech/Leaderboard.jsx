import { motion } from 'framer-motion';
import { Award, ArrowLeft, TrendingUp, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const topRanks = [
  { rank: 1, name: 'Riya Patel', points: 4820, badge: '🏆', delta: '+340', initial: 'R', color: '#F59E0B' },
  { rank: 2, name: 'Sneha Reddy', points: 4570, badge: '🥈', delta: '+210', initial: 'S', color: '#3B82F6' },
  { rank: 3, name: 'Anjali Mehta', points: 4310, badge: '🥉', delta: '+155', initial: 'A', color: '#db2777' },
];

const others = [
  { rank: 4, name: 'Maya Iyer', points: 3980, delta: '+98', initial: 'M', color: '#10B981' },
  { rank: 5, name: 'Priya Krishnan', points: 3720, delta: '+125', initial: 'P', color: '#7c3aed' },
  { rank: 6, name: 'Divya Shah', points: 3580, delta: '+62', initial: 'D', color: '#0891b2' },
  { rank: 7, name: 'Tanvi Joshi', points: 3340, delta: '+88', initial: 'T', color: '#EF4444' },
  { rank: 8, name: 'Pooja Nair', points: 3210, delta: '+44', initial: 'P', color: '#F59E0B' },
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-blue-600 mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-emerald-50"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Award size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">Leaderboard</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Top builders this week. Keep the streak going.</p>
          </div>
        </div>
      </motion.div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {topRanks.map(t => (
          <motion.div
            key={t.rank}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t.rank * 0.1 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm text-center"
          >
            <div className="text-3xl mb-2">{t.badge}</div>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-lg font-bold"
              style={{ backgroundColor: t.color }}
            >
              {t.initial}
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{t.name}</p>
            <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">{t.points.toLocaleString()}</p>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold mt-2">
              <TrendingUp size={10} /> {t.delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Your Rank */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Crown size={22} />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-white/80 mb-0.5">Your Rank</p>
            <p className="text-xl font-bold">#42 · 1,840 points</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/80">Next reward</p>
            <p className="text-sm font-semibold">160 pts away</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface-lowest)] rounded-2xl border border-[var(--color-surface-highlight)] shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--color-surface-highlight)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Ranks 4 – 8</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {others.map(o => (
            <div key={o.rank} className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--color-surface-low)] transition-colors">
              <span className="w-6 text-sm font-semibold text-[var(--color-outline)]">#{o.rank}</span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                style={{ backgroundColor: o.color }}
              >
                {o.initial}
              </div>
              <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">{o.name}</span>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{o.points.toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-semibold w-12 text-right">{o.delta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
