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

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'live', label: 'Live' },
          { id: 'upcoming', label: 'Upcoming' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === t.id
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/25'
                : 'bg-[var(--color-surface-lowest)] text-[var(--color-outline)] border border-[var(--color-surface-highlight)] hover:border-rose-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(h => (
          <motion.div
            key={h.id}
            whileHover={{ y: -3 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: h.bg }}>
                <Trophy size={22} style={{ color: h.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight mb-1">{h.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">by {h.sponsor}</p>
              </div>
              {h.status === 'live' && (
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold uppercase tracking-wide">
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

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {h.tags.map(t => (
                <span key={t} className="px-2 py-1 rounded-md bg-[var(--color-surface-low)] text-[var(--color-text-secondary)] text-[10px] font-medium flex items-center gap-1">
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-surface-highlight)]">
              <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                <Calendar size={12} /> {h.deadline}
              </div>
              <button
                className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: h.color }}
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
