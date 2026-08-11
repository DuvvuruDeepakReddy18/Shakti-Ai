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
        className="relative overflow-hidden rounded-3xl p-6 bg-[var(--color-surface-lowest)]"
        style={{ marginBottom: '40px', boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
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
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {topRanks.map(t => (
          <motion.div
            key={t.rank}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t.rank * 0.08 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl text-center relative"
            style={{ padding: '20px 12px 14px', boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
          >
            <div
              style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                width: '28px', height: '28px', borderRadius: '50%',
                background: t.rank === 1 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : t.rank === 2 ? 'linear-gradient(135deg, #cbd5e1, #94a3b8)' : 'linear-gradient(135deg, #fb923c, #c2410c)',
                color: 'white', fontSize: '12px', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.10)', border: '2px solid var(--color-surface-lowest)'
              }}
            >
              {t.rank}
            </div>
            <div
              className="rounded-2xl flex items-center justify-center mx-auto text-white text-base font-extrabold"
              style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`, boxShadow: `0 4px 14px ${t.color}40` }}
            >
              {t.initial}
            </div>
            <p className="text-[12px] font-bold text-[var(--color-shakti-dark-text)] truncate mt-2">{t.name}</p>
            <p className="text-lg font-extrabold text-[var(--color-shakti-dark-text)] leading-tight">{t.points.toLocaleString()}</p>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)' }}>
              <TrendingUp size={9} /> {t.delta}
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

      <div className="bg-[var(--color-surface-lowest)] rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--color-surface-low)' }}>
          <h3 className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--color-outline)]">Ranks 4 – 8</h3>
          <span className="text-[10px] font-bold text-[var(--color-outline)]">Weekly</span>
        </div>
        <div>
          {others.map((o, i) => (
            <div
              key={o.rank}
              className="flex items-center gap-3 px-5 py-3 transition-colors"
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-surface-low)' }}
            >
              <span style={{ width: '28px', fontSize: '13px', fontWeight: 800, color: 'var(--color-outline)' }}>#{o.rank}</span>
              <div
                className="rounded-xl flex items-center justify-center text-white text-[13px] font-extrabold flex-shrink-0"
                style={{ width: '36px', height: '36px', background: `linear-gradient(135deg, ${o.color}, ${o.color}cc)`, boxShadow: `0 3px 8px ${o.color}33` }}
              >
                {o.initial}
              </div>
              <span className="flex-1 text-[14px] font-bold text-[var(--color-shakti-dark-text)] truncate">{o.name}</span>
              <span className="text-[14px] font-extrabold text-[var(--color-shakti-dark-text)]">{o.points.toLocaleString()}</span>
              <span className="text-[11px] font-bold w-12 text-right" style={{ color: '#047857' }}>{o.delta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
