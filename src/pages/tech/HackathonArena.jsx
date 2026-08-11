import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Users, ArrowLeft, Calendar, IndianRupee, Tag, X, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EXPERIENCE_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const REG_KEY = 'shakti_hackathon_registered';

const hackathons = [
  { id: 1, title: 'AI for Social Good', sponsor: 'Microsoft', deadline: 'May 12, 2026', daysLeft: 6, prize: '₹2,00,000', participants: 432, tags: ['AI', 'NGO', 'Python'], color: '#3B82F6', bg: '#eff6ff', status: 'live' },
  { id: 2, title: 'WomenInTech Sprint', sponsor: 'Google', deadline: 'May 28, 2026', daysLeft: 22, prize: '₹3,50,000', participants: 781, tags: ['Web', 'React', 'Open'], color: '#7c3aed', bg: '#f5f3ff', status: 'live' },
  { id: 3, title: 'Health-Tech Hack', sponsor: 'Apollo Hospitals', deadline: 'June 4, 2026', daysLeft: 29, prize: '₹1,50,000', participants: 215, tags: ['HealthTech', 'IoT'], color: '#db2777', bg: '#fdf2f8', status: 'live' },
  { id: 4, title: 'Climate Action Hack', sponsor: 'UN India', deadline: 'June 18, 2026', daysLeft: 43, prize: '₹2,75,000', participants: 367, tags: ['Climate', 'Data'], color: '#10B981', bg: '#ecfdf5', status: 'upcoming' },
];

export default function HackathonArena() {
  const [filter, setFilter] = useState('all');
  const [registered, setRegistered] = useState(() => {
    try {
      const raw = localStorage.getItem(REG_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  const [registering, setRegistering] = useState(null); // hackathon being registered
  const [form, setForm] = useState({ teamName: '', members: '1', experience: 'Beginner', motivation: '' });

  useEffect(() => {
    try { localStorage.setItem(REG_KEY, JSON.stringify([...registered])); } catch { /* ignore */ }
  }, [registered]);

  const filtered = filter === 'all' ? hackathons : hackathons.filter(h => h.status === filter);

  const openRegister = (h) => {
    setRegistering(h);
    setForm({ teamName: '', members: '1', experience: 'Beginner', motivation: '' });
  };

  const submitRegistration = () => {
    if (!form.teamName.trim()) return toast.error('Add a team name');
    if (!form.motivation.trim()) return toast.error('Tell us why you want to join');
    setRegistered(prev => new Set(prev).add(registering.id));
    toast.success(`Registered for ${registering.title}! Confirmation sent.`);
    setRegistering(null);
  };

  const cancelRegistration = (h) => {
    setRegistered(prev => {
      const next = new Set(prev);
      next.delete(h.id);
      return next;
    });
    toast(`Registration cancelled for ${h.title}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-[var(--color-surface-lowest)]"
        style={{ marginBottom: '24px', boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
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

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All' },
          { id: 'live', label: 'Live' },
          { id: 'upcoming', label: 'Upcoming' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className="rounded-lg text-[13px] font-bold whitespace-nowrap transition-all"
            style={{
              padding: '8px 14px',
              minHeight: '36px',
              lineHeight: 1,
              ...(filter === t.id
                ? { background: 'linear-gradient(135deg, #e11d48, #f97316)', color: 'white', border: '1px solid transparent', boxShadow: '0 4px 12px rgba(225,29,72,0.30)' }
                : { background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.08)' }
              )
            }}
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
              <StatBlock icon={<Clock size={11} />} label="Days Left" value={h.daysLeft} />
              <StatBlock icon={<IndianRupee size={11} />} label="Prize" value={h.prize} />
              <StatBlock icon={<Users size={11} />} label="Players" value={h.participants} />
            </div>

            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              {h.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-md text-[10px] font-bold inline-flex items-center gap-1" style={{ background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.06)' }}>
                  <Tag size={9} /> {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3" style={{ borderTop: '1px solid var(--color-surface-low)' }}>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-outline)] min-w-0">
                <Calendar size={12} className="flex-shrink-0" />
                <span className="truncate">{h.deadline}</span>
              </div>
              {registered.has(h.id) ? (
                <div className="inline-flex items-center gap-1 flex-shrink-0">
                  <span
                    className="inline-flex items-center gap-1 text-[12px] font-bold"
                    style={{ padding: '8px 12px', minHeight: '34px', lineHeight: 1, borderRadius: '8px 0 0 8px', background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', borderRight: 'none' }}
                  >
                    <CheckCircle2 size={12} /> Registered
                  </span>
                  <button
                    onClick={() => cancelRegistration(h)}
                    title="Cancel registration"
                    style={{ padding: '8px 10px', minHeight: '34px', lineHeight: 1, borderRadius: '0 8px 8px 0', background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(225,29,72,0.22)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                  >
                    <XCircle size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openRegister(h)}
                  className="rounded-lg text-white text-[12px] font-bold transition-all flex-shrink-0"
                  style={{ padding: '8px 16px', minHeight: '34px', lineHeight: 1, background: 'linear-gradient(135deg, #e11d48, #f97316)', boxShadow: '0 4px 12px rgba(225,29,72,0.30)', cursor: 'pointer', border: 'none' }}
                >
                  Register
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Registration modal */}
      <AnimatePresence>
        {registering && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(24,20,69,0.55)', backdropFilter: 'blur(8px)' }}
            onClick={() => setRegistering(null)}
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Register for</p>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.3 }}>{registering.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '4px 0 0' }}>by {registering.sponsor} · {registering.prize} prize</p>
                </div>
                <button
                  onClick={() => setRegistering(null)}
                  style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--color-surface-low)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-outline)', cursor: 'pointer', flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
                <Field label="Team name">
                  <input
                    type="text"
                    value={form.teamName}
                    onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                    placeholder="e.g., Code Avengers"
                    style={inputStyle()}
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <Field label="Team size">
                    <select
                      value={form.members}
                      onChange={(e) => setForm({ ...form, members: e.target.value })}
                      style={inputStyle()}
                    >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} member{n === 1 ? '' : 's'}</option>)}
                    </select>
                  </Field>
                  <Field label="Experience">
                    <select
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      style={inputStyle()}
                    >
                      {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Why this hackathon?">
                  <textarea
                    value={form.motivation}
                    onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                    placeholder="What do you want to build or learn?"
                    rows={3}
                    style={{ ...inputStyle(), resize: 'none', lineHeight: 1.5 }}
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-surface-low)' }}>
                <button
                  onClick={() => setRegistering(null)}
                  style={{ flex: 1, padding: '11px 16px', borderRadius: '10px', background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.08)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitRegistration}
                  style={{ padding: '11px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #e11d48, #f97316)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(225,29,72,0.30)', fontFamily: 'var(--font-sans)' }}
                >
                  Confirm registration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function inputStyle() {
  return {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.08)',
    color: 'var(--color-shakti-dark-text)', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  };
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  );
}

function StatBlock({ icon, label, value }) {
  return (
    <div style={{ background: 'var(--color-surface-low)', borderRadius: '10px', padding: '8px 10px', border: '1px solid rgba(24,20,69,0.04)' }}>
      <div className="flex items-center gap-1" style={{ color: 'var(--color-outline)', marginBottom: '3px' }}>
        {icon}
        <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.1 }}>{value}</p>
    </div>
  );
}
