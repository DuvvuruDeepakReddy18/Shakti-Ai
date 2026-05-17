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
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 mb-5 bg-[var(--color-surface-lowest)]"
        style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(234,179,8,0.16)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #eab308, #f59e0b)', boxShadow: '0 6px 20px rgba(234,179,8,0.34)' }}>
            <Award size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Leaderboard</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Top builders this week. Keep the streak going.</p>
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
      <div className="rounded-2xl p-5 mb-6 text-white" style={{ background: 'linear-gradient(135deg, #eab308, #f97316)', boxShadow: '0 6px 24px rgba(234,179,8,0.30)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Crown size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-white/85 mb-0.5 font-bold">Your Rank</p>
            <p className="text-xl font-extrabold">#42 · 1,840 points</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-white/85 font-semibold">Next reward</p>
            <p className="text-sm font-bold">160 pts away</p>
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
