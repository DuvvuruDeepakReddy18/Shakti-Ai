import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, ArrowLeft, Calendar, IndianRupee, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const hackathons = [
  { id: 1, title: 'AI for Social Good', sponsor: 'Microsoft', deadline: 'May 12, 2026', daysLeft: 6, prize: '₹2,00,000', participants: 432, tags: ['AI', 'NGO', 'Python'], color: '#3B82F6', bg: '#eff6ff', status: 'live' },
  { id: 2, title: 'WomenInTech Sprint', sponsor: 'Google', deadline: 'May 28, 2026', daysLeft: 22, prize: '₹3,50,000', participants: 781, tags: ['Web', 'React', 'Open'], color: '#7c3aed', bg: '#f5f3ff', status: 'live' },
  { id: 3, title: 'Health-Tech Hack', sponsor: 'Apollo Hospitals', deadline: 'June 4, 2026', daysLeft: 29, prize: '₹1,50,000', participants: 215, tags: ['HealthTech', 'IoT'], color: '#db2777', bg: '#fdf2f8', status: 'live' },
  { id: 4, title: 'Climate Action Hack', sponsor: 'UN India', deadline: 'June 18, 2026', daysLeft: 43, prize: '₹2,75,000', participants: 367, tags: ['Climate', 'Data'], color: '#10B981', bg: '#ecfdf5', status: 'upcoming' },
];

export default function HackathonArena() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? hackathons : hackathons.filter(h => h.status === filter);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 mb-5 bg-[var(--color-surface-lowest)]"
        style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(225,29,72,0.12)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #e11d48, #f97316)', boxShadow: '0 6px 20px rgba(225,29,72,0.30)' }}>
            <Trophy size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Hackathon Arena</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Compete, build, and win with women-only & open hackathons.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2.5 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'live', label: 'Live' },
          { id: 'upcoming', label: 'Upcoming' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              filter === t.id
                ? 'text-white scale-[1.02]'
                : 'bg-[var(--color-surface-lowest)] text-[var(--color-shakti-dark-text)] hover:scale-[1.02]'
            }`}
            style={filter === t.id
              ? { background: 'linear-gradient(135deg, #e11d48, #f97316)', boxShadow: '0 6px 18px rgba(225,29,72,0.35)' }
              : { boxShadow: '0 1px 6px rgba(24,20,69,0.04)', border: '1px solid rgba(24,20,69,0.06)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(h => (
          <motion.div
            key={h.id}
            whileHover={{ y: -2 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 transition-all"
            style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: '46px', height: '46px', backgroundColor: h.bg, border: `1px solid ${h.color}22` }}>
                <Trophy size={20} style={{ color: h.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-[var(--color-shakti-dark-text)] leading-tight mb-0.5 truncate">{h.title}</h3>
                <p className="text-[11px] text-[var(--color-outline)]">by {h.sponsor}</p>
              </div>
              {h.status === 'live' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex-shrink-0" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)' }}>
                  Live
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <div className="flex items-center gap-1 text-[var(--color-outline)] mb-1">
                  <Clock size={12} />
                  <span className="text-[10px] uppercase font-semibold tracking-wide">Days Left</span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{h.daysLeft}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[var(--color-outline)] mb-1">
                  <IndianRupee size={12} />
                  <span className="text-[10px] uppercase font-semibold tracking-wide">Prize</span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{h.prize}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[var(--color-outline)] mb-1">
                  <Users size={12} />
                  <span className="text-[10px] uppercase font-semibold tracking-wide">Players</span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{h.participants}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              {h.tags.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-bold inline-flex items-center gap-1" style={{ background: 'var(--color-surface-low)', color: 'var(--color-outline)', border: '1px solid rgba(24,20,69,0.05)' }}>
                  <Tag size={9} /> {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3" style={{ borderTop: '1px solid var(--color-surface-low)' }}>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-outline)] min-w-0">
                <Calendar size={12} className="flex-shrink-0" />
                <span className="truncate">{h.deadline}</span>
              </div>
              <button
                className="px-4 py-2 rounded-xl text-white text-[12px] font-bold transition-all flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${h.color}, ${h.color}dd)`, boxShadow: `0 4px 12px ${h.color}40` }}
              >
                Register
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
