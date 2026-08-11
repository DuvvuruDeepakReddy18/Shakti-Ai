import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Star, MessageCircle, ArrowLeft, Filter, Sparkles, X, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const TIME_SLOTS = ['Weekday mornings', 'Weekday evenings', 'Weekend mornings', 'Weekend evenings', 'Flexible'];
const REQ_KEY = 'shakti_mentor_requested';

const mentors = [
  { id: 1, name: 'Dr. Anjali Mehta', role: 'AI Researcher', company: 'IIT Bombay', rating: 4.9, sessions: 142, expertise: ['AI/ML', 'Research', 'Career'], bio: 'Helping women break into AI research with structured mentorship.', initial: 'A', color: '#7c3aed' },
  { id: 2, name: 'Priya Krishnan', role: 'Engineering Manager', company: 'Microsoft', rating: 4.8, sessions: 89, expertise: ['Leadership', 'Frontend', 'Interview Prep'], bio: '12 years in tech. Specialty: helping ICs become leaders.', initial: 'P', color: '#3B82F6' },
  { id: 3, name: 'Sneha Reddy', role: 'Founder & CEO', company: 'PayWise', rating: 5.0, sessions: 56, expertise: ['Startups', 'Fundraising', 'Product'], bio: 'YC alum. Mentoring future women founders in fintech.', initial: 'S', color: '#db2777' },
  { id: 4, name: 'Maya Iyer', role: 'Senior SDE', company: 'Amazon', rating: 4.7, sessions: 234, expertise: ['DSA', 'System Design', 'Coding'], bio: 'FAANG interviewer. Focused on cracking tough engineering interviews.', initial: 'M', color: '#10B981' },
];

const filters = ['All', 'AI/ML', 'Frontend', 'Leadership', 'Startups', 'Interview Prep'];

export default function MentorMatch() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [requested, setRequested] = useState(() => {
    try {
      const raw = localStorage.getItem(REQ_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  const [requesting, setRequesting] = useState(null);
  const [form, setForm] = useState({ topic: '', timeSlot: TIME_SLOTS[0], message: '' });

  useEffect(() => {
    try { localStorage.setItem(REQ_KEY, JSON.stringify([...requested])); } catch { /* ignore */ }
  }, [requested]);

  const filtered = activeFilter === 'All'
    ? mentors
    : mentors.filter(m => m.expertise.includes(activeFilter));

  const openRequest = (m) => {
    setRequesting(m);
    setForm({ topic: '', timeSlot: TIME_SLOTS[0], message: '' });
  };

  const submitRequest = () => {
    if (!form.topic.trim()) return toast.error('What do you want to discuss?');
    if (!form.message.trim()) return toast.error('Send a short message');
    setRequested(prev => new Set(prev).add(requesting.id));
    toast.success(`Session requested with ${requesting.name}!`);
    setRequesting(null);
  };

  const cancelRequest = (m) => {
    setRequested(prev => {
      const next = new Set(prev);
      next.delete(m.id);
      return next;
    });
    toast(`Cancelled request to ${m.name}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-[var(--color-surface-lowest)]"
        style={{ marginBottom: '32px', boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
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

      <div className="rounded-2xl p-3.5 mb-6 flex items-center gap-3" style={{ background: '#fffbeb', border: '1px solid rgba(245,158,11,0.22)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.18)', color: '#b45309' }}>
          <Sparkles size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[var(--color-shakti-dark-text)]" style={{ margin: 0 }}>AI suggests: <span style={{ color: '#b45309' }}>Priya Krishnan</span></p>
          <p className="text-[11px]" style={{ color: 'var(--color-outline)', margin: '2px 0 0' }}>Based on your interest in frontend & leadership growth.</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <Filter size={13} className="text-[var(--color-outline)]" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-outline)]">Filter mentors</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="rounded-lg text-[13px] font-bold whitespace-nowrap transition-all"
              style={{
                padding: '8px 14px',
                minHeight: '36px',
                lineHeight: 1,
                ...(activeFilter === f
                  ? { background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', border: '1px solid transparent', boxShadow: '0 4px 12px rgba(245,158,11,0.30)' }
                  : { background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.08)' }
                )
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(m => (
          <motion.div
            key={m.id}
            whileHover={{ y: -2 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 transition-all"
            style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-lg font-extrabold"
                style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)`, boxShadow: `0 4px 12px ${m.color}33` }}
              >
                {m.initial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-[var(--color-shakti-dark-text)] leading-tight mb-0.5 truncate">{m.name}</h3>
                <p className="text-[11px] text-[var(--color-outline)] truncate">{m.role} · {m.company}</p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-shakti-dark-text)]">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    {m.rating}
                  </span>
                  <span className="text-[11px] text-[var(--color-outline)]">{m.sessions} sessions</span>
                </div>
              </div>
            </div>

            <p className="text-[13px] text-[var(--color-shakti-dark-muted)] mb-3 leading-relaxed">{m.bio}</p>

            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {m.expertise.map(e => (
                <span key={e} className="px-2 py-1 rounded-md text-[10px] font-bold" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid rgba(245,158,11,0.22)' }}>
                  {e}
                </span>
              ))}
            </div>

            {requested.has(m.id) ? (
              <div className="flex w-full">
                <span
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold"
                  style={{ background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', borderRight: 'none', borderRadius: '12px 0 0 12px' }}
                >
                  <CheckCircle2 size={14} /> Requested
                </span>
                <button
                  onClick={() => cancelRequest(m)}
                  title="Cancel request"
                  className="flex items-center justify-center"
                  style={{ padding: '0 14px', background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(225,29,72,0.22)', borderRadius: '0 12px 12px 0', cursor: 'pointer' }}
                >
                  <XCircle size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openRequest(m)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(245,158,11,0.28)', cursor: 'pointer' }}
              >
                <MessageCircle size={14} /> Request Session
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Session request modal */}
      <AnimatePresence>
        {requesting && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(24,20,69,0.55)', backdropFilter: 'blur(8px)' }}
            onClick={() => setRequesting(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'auto',
                background: 'var(--color-surface-lowest)', borderRadius: '1.5rem', padding: '24px',
                boxShadow: '0 20px 50px rgba(24,20,69,0.20)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `linear-gradient(135deg, ${requesting.color}, ${requesting.color}cc)`,
                    color: 'white', fontWeight: 800, fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    {requesting.initial}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Request session</p>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>{requesting.name}</h3>
                    <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{requesting.role} · {requesting.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setRequesting(null)}
                  style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--color-surface-low)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-outline)', cursor: 'pointer', flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <MMField label="Topic">
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    placeholder="e.g., Career switch into AI/ML"
                    style={mmInputStyle()}
                  />
                </MMField>

                <MMField label="Preferred time">
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    style={mmInputStyle()}
                  >
                    {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </MMField>

                <MMField label="Message to mentor">
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Brief intro — your background and what you'd like to discuss."
                    rows={4}
                    style={{ ...mmInputStyle(), resize: 'none', lineHeight: 1.55 }}
                  />
                </MMField>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-surface-low)' }}>
                <button
                  onClick={() => setRequesting(null)}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.08)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitRequest}
                  style={{ padding: '11px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.30)', fontFamily: 'var(--font-sans)' }}
                >
                  Send request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function mmInputStyle() {
  return {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.08)',
    color: 'var(--color-shakti-dark-text)', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  };
}

function MMField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  );
}
