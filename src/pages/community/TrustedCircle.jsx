import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserPlus, Check, X, MessageCircle, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCENT = '#7c3aed';
const ACCENT_LIGHT = '#a855f7';

const DEMO_CIRCLE = [
  { id: 1, name: 'Mom', relation: 'Family', phone: '+91 98********', lastActive: 'Active now', status: 'online', shareLocation: true },
  { id: 2, name: 'Priya', relation: 'Best Friend', phone: '+91 99********', lastActive: '5 min ago', status: 'online', shareLocation: true },
  { id: 3, name: 'Kavya Di', relation: 'Sister', phone: '+91 97********', lastActive: '1h ago', status: 'away', shareLocation: false },
  { id: 4, name: 'Aisha', relation: 'College Friend', phone: '+91 96********', lastActive: '3h ago', status: 'offline', shareLocation: true },
];

const PENDING = [
  { id: 10, name: 'Riya M.', relation: 'Mentor', mutual: 3 },
  { id: 11, name: 'Sneha K.', relation: 'Colleague', mutual: 8 },
];

export default function TrustedCircle() {
  const navigate = useNavigate();
  const [circle, setCircle] = useState(DEMO_CIRCLE);
  const [pending, setPending] = useState(PENDING);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', relation: '', phone: '' });

  const addMember = () => {
    if (!form.name || !form.phone) return toast.error('Name and phone required');
    setCircle([...circle, { id: Date.now(), ...form, lastActive: 'New', status: 'offline', shareLocation: false }]);
    setForm({ name: '', relation: '', phone: '' });
    setShowAdd(false);
    toast.success('Added to circle');
  };

  const accept = (id) => {
    const p = pending.find(x => x.id === id);
    setCircle([...circle, { id, name: p.name, relation: p.relation, phone: 'Hidden', lastActive: 'Just added', status: 'online', shareLocation: false }]);
    setPending(pending.filter(x => x.id !== id));
    toast.success(`${p.name} added`);
  };

  const reject = (id) => setPending(pending.filter(x => x.id !== id));
  const toggleShare = (id) => setCircle(circle.map(c => c.id === id ? { ...c, shareLocation: !c.shareLocation } : c));

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.08)', color: 'var(--color-shakti-dark-text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-outline)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}
      >
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
            <Shield size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Trusted Circle</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Your inner circle — trusted contacts for safety & support.</p>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <StatTile value={circle.length} label="Members" color={ACCENT} />
        <StatTile value={circle.filter(c => c.shareLocation).length} label="Tracking" color="#10b981" />
        <StatTile value={pending.length} label="Pending" color="#f59e0b" />
      </div>

      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full inline-flex items-center justify-center gap-2 mb-6 transition-all"
        style={{ padding: '13px', borderRadius: '12px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 18px ${ACCENT}30`, fontFamily: 'var(--font-sans)' }}
      >
        <UserPlus size={18} /> {showAdd ? 'Hide form' : 'Add to circle'}
      </button>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-6"
          style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)', border: `1px solid ${ACCENT}22` }}
        >
          <h3 className="text-[15px] font-extrabold mb-3" style={{ color: 'var(--color-shakti-dark-text)' }}>Add new contact</h3>
          <div className="flex flex-col gap-2.5 mb-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" style={inputStyle} />
            <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} placeholder="Relation (e.g., Sister)" style={inputStyle} />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" style={inputStyle} />
          </div>
          <button onClick={addMember} className="w-full"
            style={{ padding: '11px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}30`, fontFamily: 'var(--font-sans)' }}>
            Add member
          </button>
        </motion.div>
      )}

      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--color-outline)' }}>Pending invites</h3>
          <div className="flex flex-col gap-2">
            {pending.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-[var(--color-surface-lowest)] rounded-2xl p-4 flex items-center gap-3"
                style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
              >
                <div className="rounded-xl flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0"
                  style={{ width: '40px', height: '40px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})` }}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px]" style={{ color: 'var(--color-shakti-dark-text)' }}>{p.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--color-outline)' }}>{p.relation} · {p.mutual} mutual</p>
                </div>
                <button onClick={() => accept(p.id)}
                  className="flex items-center justify-center"
                  style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', cursor: 'pointer' }}>
                  <Check size={16} />
                </button>
                <button onClick={() => reject(p.id)}
                  className="flex items-center justify-center"
                  style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(225,29,72,0.22)', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--color-outline)' }}>Your circle</h3>
        <div className="flex flex-col gap-2">
          {circle.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[var(--color-surface-lowest)] rounded-2xl p-4"
              style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex-shrink-0">
                  <div className="rounded-xl flex items-center justify-center text-white text-sm font-extrabold"
                    style={{ width: '44px', height: '44px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, boxShadow: `0 4px 12px ${ACCENT}33` }}>
                    {m.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 rounded-full"
                    style={{ width: '13px', height: '13px', border: '2px solid var(--color-surface-lowest)', background: m.status === 'online' ? '#10b981' : m.status === 'away' ? '#f59e0b' : '#94a3b8' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] truncate" style={{ color: 'var(--color-shakti-dark-text)' }}>{m.name}</p>
                  <p className="text-[11px]" style={{ color: 'var(--color-outline)' }}>{m.relation} · {m.lastActive}</p>
                </div>
                <button className="flex items-center justify-center"
                  style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid rgba(59,130,246,0.22)', cursor: 'pointer' }}>
                  <MessageCircle size={14} />
                </button>
                <button className="flex items-center justify-center"
                  style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', cursor: 'pointer' }}>
                  <Phone size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-2.5" style={{ borderTop: '1px solid var(--color-surface-low)' }}>
                <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-outline)' }}>
                  <MapPin size={11} /> {m.shareLocation ? 'Can see your location' : 'Not sharing'}
                </span>
                <button onClick={() => toggleShare(m.id)}
                  className="relative transition-colors"
                  style={{ width: '40px', height: '22px', borderRadius: '999px', background: m.shareLocation ? ACCENT : 'var(--color-surface-high)', border: 'none', cursor: 'pointer' }}>
                  <div className="absolute top-0.5 rounded-full transition-all"
                    style={{ width: '18px', height: '18px', background: 'white', left: m.shareLocation ? '20px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
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
