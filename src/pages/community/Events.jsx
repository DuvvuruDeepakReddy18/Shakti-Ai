import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, CheckCircle2, Clock, Video, Coffee } from 'lucide-react';
import toast from 'react-hot-toast';

const EVENTS = [
  { id: 1, title: 'SHE Leads: Women in Tech Summit', date: 'Apr 25', time: '10:00 AM', mode: 'Online', attendees: 1240, capacity: 2000, tags: ['Tech', 'Leadership'], free: true, host: 'WomenTech India', color: 'bg-[var(--color-shakti-info)]' },
  { id: 2, title: 'Financial Literacy Workshop for Homemakers', date: 'Apr 27', time: '6:00 PM', mode: 'Online', attendees: 340, capacity: 500, tags: ['Finance', 'Basics'], free: true, host: 'MoneyForShe', color: 'bg-[var(--color-shakti-success)]' },
  { id: 3, title: 'Self Defense Training (Free)', date: 'May 1', time: '7:00 AM', mode: 'Bangalore', attendees: 89, capacity: 100, tags: ['Safety', 'Fitness'], free: true, host: 'SafetyFirst', color: 'bg-[var(--color-shakti-error)]' },
  { id: 4, title: 'Freelancing 101: From Zero to Your First Client', date: 'May 3', time: '5:00 PM', mode: 'Online', attendees: 890, capacity: 1500, tags: ['Career', 'Skills'], free: false, price: '₹199', host: 'FreelanceSheCan', color: 'bg-[var(--color-shakti-primary)]' },
  { id: 5, title: 'Period Wellness — Nutritionist AMA', date: 'May 5', time: '8:00 PM', mode: 'Online', attendees: 560, capacity: 1000, tags: ['Health'], free: true, host: 'HealthyHer', color: 'bg-[var(--color-shakti-tertiary)]' },
  { id: 6, title: 'Mumbai Coffee Meetup — Women Founders', date: 'May 8', time: '11:00 AM', mode: 'Mumbai', attendees: 34, capacity: 50, tags: ['Networking', 'Entrepreneurship'], free: true, host: 'FounderSisters', color: 'bg-[var(--color-shakti-warning)]' },
];

export default function Events() {
  const [tab, setTab] = useState('upcoming');
  const [registered, setRegistered] = useState([]);

  const register = (id, title) => {
    if (registered.includes(id)) return;
    setRegistered([...registered, id]);
    toast.success(`Registered for "${title}"`);
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-shakti-primary) 20%, transparent), color-mix(in srgb, var(--color-shakti-info) 10%, transparent))' }}>
        <div className="flex items-center gap-3 mb-2">
          <Calendar size={24} className="text-[var(--color-shakti-primary)]" />
          <h1 className="text-2xl font-display font-bold text-[var(--color-shakti-dark-text)]">Community Events</h1>
        </div>
        <p className="text-sm text-[var(--color-shakti-dark-muted)]">Workshops, meetups & webinars — for and by women</p>
      </motion.div>

      <div className="flex gap-2">
        <button onClick={() => setTab('upcoming')}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm ${tab === 'upcoming' ? 'gradient-bg text-white' : 'bg-[var(--color-shakti-dark-surface)] text-[var(--color-shakti-dark-muted)]'}`}>
          Upcoming ({EVENTS.length})
        </button>
        <button onClick={() => setTab('registered')}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm ${tab === 'registered' ? 'gradient-bg text-white' : 'bg-[var(--color-shakti-dark-surface)] text-[var(--color-shakti-dark-muted)]'}`}>
          My Events ({registered.length})
        </button>
      </div>

      <div className="space-y-3">
        {(tab === 'upcoming' ? EVENTS : EVENTS.filter(e => registered.includes(e.id))).map((e, i) => {
          const fillPct = (e.attendees / e.capacity) * 100;
          const isRegistered = registered.includes(e.id);
          return (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-static overflow-hidden">
              <div className={`h-20 ${e.color} flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                <div className="relative text-center">
                  <p className="text-2xl font-display font-bold text-[var(--color-shakti-dark-text)]">{e.date}</p>
                  <p className="text-[11px] text-[var(--color-shakti-dark-text)]/80">{e.time}</p>
                </div>
                {!e.free && (
                  <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/40 text-[var(--color-shakti-dark-text)] font-bold">{e.price}</span>
                )}
                {e.free && (
                  <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded bg-[var(--color-shakti-success)] text-[var(--color-shakti-success-on)] font-bold">FREE</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[var(--color-shakti-dark-text)] text-sm mb-2">{e.title}</h3>
                <p className="text-[11px] text-[var(--color-shakti-dark-muted)] mb-3">by {e.host}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {e.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-shakti-primary-container)] text-[var(--color-shakti-primary)]">{t}</span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[var(--color-shakti-dark-muted)] mb-3">
                  <div className="flex items-center gap-1">
                    {e.mode === 'Online' ? <Video size={11} /> : <MapPin size={11} />}
                    <span>{e.mode}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={11} /> {e.attendees}/{e.capacity}
                  </div>
                </div>

                <div className="h-1.5 w-full bg-[var(--color-shakti-dark)] rounded-full overflow-hidden mb-3">
                  <div className="h-full gradient-bg" style={{ width: `${fillPct}%` }} />
                </div>

                <button onClick={() => register(e.id, e.title)} disabled={isRegistered}
                  className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 ${
                    isRegistered ? 'bg-[var(--color-shakti-success-container)] text-[var(--color-shakti-success)]' : 'gradient-bg text-white'
                  }`}>
                  {isRegistered ? <><CheckCircle2 size={12} /> Registered</> : 'Register'}
                </button>
              </div>
            </motion.div>
          );
        })}
        {tab === 'registered' && registered.length === 0 && (
          <div className="card-static p-8 text-center">
            <Coffee size={32} className="text-[var(--color-shakti-dark-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--color-shakti-dark-muted)]">No events yet. Register from the Upcoming tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}
