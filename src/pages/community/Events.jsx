import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, CheckCircle2, Video, Coffee, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCENT = '#f59e0b';
const ACCENT_LIGHT = '#fb923c';

const EVENTS = [
  { id: 1, title: 'SHE Leads: Women in Tech Summit', date: 'Apr 25', time: '10:00 AM', mode: 'Online', attendees: 1240, capacity: 2000, tags: ['Tech', 'Leadership'], free: true, host: 'WomenTech India', color: '#3b82f6' },
  { id: 2, title: 'Financial Literacy Workshop for Homemakers', date: 'Apr 27', time: '6:00 PM', mode: 'Online', attendees: 340, capacity: 500, tags: ['Finance', 'Basics'], free: true, host: 'MoneyForShe', color: '#10b981' },
  { id: 3, title: 'Self Defense Training (Free)', date: 'May 1', time: '7:00 AM', mode: 'Bangalore', attendees: 89, capacity: 100, tags: ['Safety', 'Fitness'], free: true, host: 'SafetyFirst', color: '#e11d48' },
  { id: 4, title: 'Freelancing 101: From Zero to Your First Client', date: 'May 3', time: '5:00 PM', mode: 'Online', attendees: 890, capacity: 1500, tags: ['Career', 'Skills'], free: false, price: '₹199', host: 'FreelanceSheCan', color: '#7c3aed' },
  { id: 5, title: 'Period Wellness — Nutritionist AMA', date: 'May 5', time: '8:00 PM', mode: 'Online', attendees: 560, capacity: 1000, tags: ['Health'], free: true, host: 'HealthyHer', color: '#ec4899' },
  { id: 6, title: 'Mumbai Coffee Meetup — Women Founders', date: 'May 8', time: '11:00 AM', mode: 'Mumbai', attendees: 34, capacity: 50, tags: ['Networking', 'Entrepreneurship'], free: true, host: 'FounderSisters', color: '#f59e0b' },
];

export default function Events() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('upcoming');
  const [registered, setRegistered] = useState([]);

  const registerEvent = (id, title) => {
    if (registered.includes(id)) return;
    setRegistered([...registered, id]);
    toast.success(`Registered for "${title}"`);
  };

  const list = tab === 'upcoming' ? EVENTS : EVENTS.filter(e => registered.includes(e.id));

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
            <Calendar size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Community Events</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Workshops, meetups & webinars — for and by women.</p>
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl"
        style={{ background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.06)' }}>
        <button onClick={() => setTab('upcoming')}
          className="flex-1 text-[13px] font-bold transition-all"
          style={{
            padding: '10px', borderRadius: '8px', cursor: 'pointer',
            ...(tab === 'upcoming'
              ? { background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', boxShadow: `0 4px 12px ${ACCENT}30`, border: 'none' }
              : { background: 'transparent', color: 'var(--color-shakti-dark-muted)', border: 'none' }
            )
          }}>
          Upcoming ({EVENTS.length})
        </button>
        <button onClick={() => setTab('registered')}
          className="flex-1 text-[13px] font-bold transition-all"
          style={{
            padding: '10px', borderRadius: '8px', cursor: 'pointer',
            ...(tab === 'registered'
              ? { background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', boxShadow: `0 4px 12px ${ACCENT}30`, border: 'none' }
              : { background: 'transparent', color: 'var(--color-shakti-dark-muted)', border: 'none' }
            )
          }}>
          My events ({registered.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((e, i) => {
          const fillPct = (e.attendees / e.capacity) * 100;
          const isRegistered = registered.includes(e.id);
          return (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[var(--color-surface-lowest)] rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
            >
              {/* Date strip with event color */}
              <div className="relative flex items-center justify-between px-5 py-4"
                style={{ background: `linear-gradient(135deg, ${e.color}, ${e.color}cc)`, color: 'white' }}>
                <div>
                  <p className="text-[20px] font-extrabold leading-none" style={{ fontFamily: 'var(--font-display)' }}>{e.date}</p>
                  <p className="text-[11px] mt-1 opacity-90 font-semibold">{e.time}</p>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ padding: '4px 10px', borderRadius: '999px', background: e.free ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.30)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.30)' }}>
                  {e.free ? 'FREE' : e.price}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-[14px] font-bold mb-1 leading-snug" style={{ color: 'var(--color-shakti-dark-text)' }}>{e.title}</h3>
                <p className="text-[11px] mb-3" style={{ color: 'var(--color-outline)' }}>by {e.host}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {e.tags.map(t => (
                    <span key={t} className="text-[10px] font-bold" style={{ padding: '3px 8px', borderRadius: '6px', background: `${e.color}14`, color: e.color, border: `1px solid ${e.color}33` }}>{t}</span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[11px] mb-3" style={{ color: 'var(--color-outline)' }}>
                  <span className="inline-flex items-center gap-1">
                    {e.mode === 'Online' ? <Video size={11} /> : <MapPin size={11} />} {e.mode}
                  </span>
                  <span className="inline-flex items-center gap-1"><Users size={11} /> {e.attendees}/{e.capacity}</span>
                </div>

                <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--color-surface-low)' }}>
                  <div className="h-full" style={{ width: `${fillPct}%`, background: `linear-gradient(90deg, ${e.color}, ${e.color}cc)`, transition: 'width 0.4s' }} />
                </div>

                <button
                  onClick={() => registerEvent(e.id, e.title)}
                  disabled={isRegistered}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all"
                  style={isRegistered
                    ? { padding: '9px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', cursor: 'default' }
                    : { padding: '9px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}30` }
                  }
                >
                  {isRegistered ? <><CheckCircle2 size={12} /> Registered</> : 'Register'}
                </button>
              </div>
            </motion.div>
          );
        })}

        {tab === 'registered' && registered.length === 0 && (
          <div className="md:col-span-2 bg-[var(--color-surface-lowest)] rounded-2xl p-8 text-center"
            style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}>
            <Coffee size={32} className="mx-auto mb-3" style={{ color: 'var(--color-outline)' }} />
            <p className="text-[13px] font-semibold" style={{ color: 'var(--color-outline)' }}>No events yet. Register from the Upcoming tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}
