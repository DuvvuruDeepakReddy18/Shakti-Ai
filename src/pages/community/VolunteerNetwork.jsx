import { useState } from 'react';
import { motion } from 'framer-motion';
import { HandHeart, MapPin, Star, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCENT = '#e11d48';
const ACCENT_LIGHT = '#f43f5e';

const CAUSES = [
  { id: 'all', label: 'All' },
  { id: 'education', label: '📚 Education' },
  { id: 'safety', label: '🛡️ Safety' },
  { id: 'health', label: '💊 Health' },
  { id: 'skills', label: '🎯 Skills' },
  { id: 'legal', label: '⚖️ Legal' },
];

const OPPORTUNITIES = [
  { id: 1, title: 'Teach Math to Underprivileged Girls', org: 'Vidya Foundation', cause: 'education', hours: '2 hrs/week', mode: 'Online', urgency: 'Low', skills: ['Teaching', 'Math'], rating: 4.8, volunteers: 45 },
  { id: 2, title: 'Crisis Helpline Volunteer (Night Shift)', org: 'iCall', cause: 'safety', hours: '4 hrs/week', mode: 'Remote', urgency: 'High', skills: ['Counseling', 'Empathy'], rating: 4.9, volunteers: 23 },
  { id: 3, title: 'Digital Literacy for Senior Women', org: 'ShakeSeniors', cause: 'skills', hours: '3 hrs/week', mode: 'Hybrid', urgency: 'Medium', skills: ['Patience', 'Tech Basics'], rating: 4.7, volunteers: 67 },
  { id: 4, title: 'Period Poverty Awareness Campaign', org: 'PadUp', cause: 'health', hours: 'Flexible', mode: 'On-ground', urgency: 'Medium', skills: ['Communication', 'Empathy'], rating: 4.9, volunteers: 89 },
  { id: 5, title: 'Free Legal Aid for Domestic Violence Victims', org: 'WeLegal', cause: 'legal', hours: '5 hrs/week', mode: 'Remote', urgency: 'High', skills: ['Law Degree'], rating: 5.0, volunteers: 12 },
  { id: 6, title: 'Mentor First-Gen College Girls', org: 'Udaan', cause: 'education', hours: '1 hr/week', mode: 'Online', urgency: 'Low', skills: ['Mentoring'], rating: 4.8, volunteers: 134 },
];

const URGENCY_META = {
  Low: { bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.22)' },
  Medium: { bg: '#fffbeb', text: '#b45309', border: 'rgba(245,158,11,0.22)' },
  High: { bg: '#fef2f2', text: '#b91c1c', border: 'rgba(225,29,72,0.22)' },
};

export default function VolunteerNetwork() {
  const navigate = useNavigate();
  const [cause, setCause] = useState('all');
  const [applied, setApplied] = useState([]);

  const items = cause === 'all' ? OPPORTUNITIES : OPPORTUNITIES.filter(o => o.cause === cause);

  const apply = (id, title) => {
    if (applied.includes(id)) return;
    setApplied([...applied, id]);
    toast.success(`Applied to "${title}"`);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-outline)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-[var(--color-surface-lowest)]"
        style={{ marginBottom: '24px', boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: `${ACCENT}1f`, borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: '52px', height: '52px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, boxShadow: `0 6px 20px ${ACCENT}40` }}>
            <HandHeart size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Volunteer Network</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Give back to your community. Earn SHAKTI points & badges.</p>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <StatTile value={applied.length} label="Applied" color={ACCENT} />
        <StatTile value={0} label="Hours given" color="#7c3aed" />
        <StatTile value={0} label="Lives touched" color="#10b981" />
      </div>

      {/* CAUSE FILTER */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CAUSES.map(c => (
          <button
            key={c.id}
            onClick={() => setCause(c.id)}
            className="text-[13px] font-bold whitespace-nowrap transition-all"
            style={{
              padding: '8px 14px', borderRadius: '10px', minHeight: '36px', lineHeight: 1, cursor: 'pointer',
              ...(cause === c.id
                ? { background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: '1px solid transparent', boxShadow: `0 4px 12px ${ACCENT}30` }
                : { background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.08)' }
              )
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((o, i) => {
          const u = URGENCY_META[o.urgency];
          const isApplied = applied.includes(o.id);
          return (
            <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[var(--color-surface-lowest)] rounded-2xl p-5"
              style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold mb-0.5 leading-tight" style={{ color: 'var(--color-shakti-dark-text)' }}>{o.title}</h3>
                  <p className="text-[12px]" style={{ color: 'var(--color-outline)' }}>{o.org}</p>
                </div>
                <span className="text-[10px] font-extrabold uppercase shrink-0" style={{ padding: '4px 10px', borderRadius: '999px', background: u.bg, color: u.text, border: `1px solid ${u.border}`, letterSpacing: '0.05em' }}>
                  {o.urgency}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <StatBlock icon={<Clock size={11} />} label={o.hours} accent={ACCENT} />
                <StatBlock icon={<MapPin size={11} />} label={o.mode} accent={ACCENT} />
                <StatBlock icon={<Star size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />} label={o.rating} accent="#d97706" />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {o.skills.map(s => (
                  <span key={s} className="text-[10px] font-bold" style={{ padding: '3px 8px', borderRadius: '6px', background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(225,29,72,0.22)' }}>{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--color-surface-low)' }}>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--color-outline)' }}>{o.volunteers} volunteers</span>
                <button
                  onClick={() => apply(o.id, o.title)}
                  disabled={isApplied}
                  className="text-[12px] font-bold inline-flex items-center gap-1.5"
                  style={isApplied
                    ? { padding: '8px 14px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', cursor: 'default' }
                    : { padding: '8px 16px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}30` }
                  }
                >
                  {isApplied ? <><CheckCircle2 size={12} /> Applied</> : 'Apply now'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatTile({ value, label, color }) {
  return (
    <div className="bg-[var(--color-surface-lowest)] rounded-xl p-3.5 text-center"
      style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}>
      <p className="text-[20px] font-extrabold" style={{ color, margin: 0, lineHeight: 1 }}>{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--color-outline)' }}>{label}</p>
    </div>
  );
}

function StatBlock({ icon, label, accent }) {
  return (
    <div style={{ background: 'var(--color-surface-low)', borderRadius: '10px', padding: '7px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(24,20,69,0.04)' }}>
      <span style={{ color: accent }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-shakti-dark-text)' }}>{label}</span>
    </div>
  );
}
