import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, MessageCircle, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const mentors = [
  { id: 1, name: 'Dr. Anjali Mehta', role: 'AI Researcher', company: 'IIT Bombay', rating: 4.9, sessions: 142, expertise: ['AI/ML', 'Research', 'Career'], bio: 'Helping women break into AI research with structured mentorship.', initial: 'A', color: '#7c3aed' },
  { id: 2, name: 'Priya Krishnan', role: 'Engineering Manager', company: 'Microsoft', rating: 4.8, sessions: 89, expertise: ['Leadership', 'Frontend', 'Interview Prep'], bio: '12 years in tech. Specialty: helping ICs become leaders.', initial: 'P', color: '#3B82F6' },
  { id: 3, name: 'Sneha Reddy', role: 'Founder & CEO', company: 'PayWise', rating: 5.0, sessions: 56, expertise: ['Startups', 'Fundraising', 'Product'], bio: 'YC alum. Mentoring future women founders in fintech.', initial: 'S', color: '#db2777' },
  { id: 4, name: 'Maya Iyer', role: 'Senior SDE', company: 'Amazon', rating: 4.7, sessions: 234, expertise: ['DSA', 'System Design', 'Coding'], bio: 'FAANG interviewer. Focused on cracking tough engineering interviews.', initial: 'M', color: '#10B981' },
];

const filters = ['All', 'AI/ML', 'Frontend', 'Leadership', 'Startups', 'Interview Prep'];

export default function MentorMatch() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? mentors
    : mentors.filter(m => m.expertise.includes(activeFilter));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 mb-5 bg-[var(--color-surface-lowest)]"
        style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(245,158,11,0.14)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 6px 20px rgba(245,158,11,0.32)' }}>
            <Users size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Mentor Match</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>AI-paired mentors who match your goals & schedule.</p>
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl p-4 mb-5 flex items-start gap-3" style={{ background: '#fffbeb', border: '1px solid rgba(245,158,11,0.25)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)', color: '#b45309' }}>
          <Sparkles size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-shakti-dark-text)] mb-1">AI suggests: <span style={{ color: '#b45309' }}>Priya Krishnan</span></p>
          <p className="text-xs" style={{ color: 'var(--color-outline)' }}>Based on your interest in frontend & leadership growth.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        <Filter size={14} className="text-[var(--color-outline)] flex-shrink-0" />
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === f
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                : 'bg-[var(--color-surface-lowest)] text-[var(--color-outline)] border border-[var(--color-surface-highlight)] hover:border-amber-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <motion.div
            key={m.id}
            whileHover={{ y: -3 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
                style={{ backgroundColor: m.color }}
              >
                {m.initial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight">{m.name}</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">{m.role} · {m.company}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-primary)]">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{m.rating}</span>
                  </div>
                  <span className="text-xs text-[var(--color-outline)]">{m.sessions} sessions</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">{m.bio}</p>

            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              {m.expertise.map(e => (
                <span key={e} className="px-2 py-1 rounded-md text-[10px] font-semibold" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid rgba(245,158,11,0.22)' }}>
                  {e}
                </span>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold transition-all" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 12px rgba(245,158,11,0.30)' }}>
              <MessageCircle size={14} /> Request Session
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
