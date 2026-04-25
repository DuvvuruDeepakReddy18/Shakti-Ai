import { useState } from 'react';
import { motion } from 'framer-motion';
import { HandHeart, MapPin, Star, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

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

const URGENCY_STYLE = {
  Low: 'bg-green-500/20 text-green-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  High: 'bg-red-500/20 text-red-400',
};

export default function VolunteerNetwork() {
  const [cause, setCause] = useState('all');
  const [applied, setApplied] = useState([]);

  const items = cause === 'all' ? OPPORTUNITIES : OPPORTUNITIES.filter(o => o.cause === cause);

  const apply = (id, title) => {
    if (applied.includes(id)) return;
    setApplied([...applied, id]);
    toast.success(`Applied to "${title}"`);
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(245,158,11,0.1))' }}>
        <div className="flex items-center gap-3 mb-2">
          <HandHeart size={24} className="text-green-400" />
          <h1 className="text-2xl font-display font-bold text-[var(--color-shakti-dark-text)]">Volunteer Network</h1>
        </div>
        <p className="text-sm text-green-200/70">Give back to your community. Earn SHAKTI points & badges.</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card-static p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{applied.length}</p>
          <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">Applied</p>
        </div>
        <div className="card-static p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">0</p>
          <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">Hours Given</p>
        </div>
        <div className="card-static p-4 text-center">
          <p className="text-2xl font-bold text-pink-400">0</p>
          <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">Lives Touched</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CAUSES.map(c => (
          <button key={c.id} onClick={() => setCause(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${cause === c.id ? 'gradient-bg text-white' : 'bg-[var(--color-shakti-dark-surface)] text-[var(--color-shakti-dark-muted)] border border-[var(--color-shakti-dark-border)]'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card-static p-5">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-[var(--color-shakti-dark-text)] text-sm mb-1">{o.title}</h3>
                <p className="text-xs text-[var(--color-shakti-dark-muted)]">{o.org}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${URGENCY_STYLE[o.urgency]}`}>
                {o.urgency}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3">
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-shakti-dark-muted)]"><Clock size={10} /> {o.hours}</div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-shakti-dark-muted)]"><MapPin size={10} /> {o.mode}</div>
              <div className="flex items-center gap-1 text-[11px] text-yellow-400"><Star size={10} className="fill-yellow-400" /> {o.rating}</div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {o.skills.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/20">{s}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-shakti-dark-border)]">
              <span className="text-[10px] text-[var(--color-shakti-dark-muted)]">{o.volunteers} volunteers</span>
              <button onClick={() => apply(o.id, o.title)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${applied.includes(o.id) ? 'bg-green-500/20 text-green-400' : 'gradient-bg text-white'}`}>
                {applied.includes(o.id) ? <><CheckCircle2 size={12} /> Applied</> : 'Apply Now'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
