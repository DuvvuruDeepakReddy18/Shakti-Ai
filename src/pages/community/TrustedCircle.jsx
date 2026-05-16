import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserPlus, Check, X, MessageCircle, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const reject = (id) => {
    setPending(pending.filter(x => x.id !== id));
  };

  const toggleShare = (id) => {
    setCircle(circle.map(c => c.id === id ? { ...c, shareLocation: !c.shareLocation } : c));
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6" style={{ background: 'color-mix(in srgb, var(--color-shakti-success) 20%, transparent)' }}>
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className="text-[var(--color-shakti-success)]" />
          <h1 className="text-2xl font-display font-bold text-[var(--color-shakti-dark-text)]">Trusted Circle</h1>
        </div>
        <p className="text-sm text-[var(--color-shakti-success)] opacity-70">Your inner circle — trusted contacts for safety, support & connection</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card-static p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-shakti-success)]">{circle.length}</p>
          <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">Members</p>
        </div>
        <div className="card-static p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-shakti-primary)]">{circle.filter(c => c.shareLocation).length}</p>
          <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">Tracking You</p>
        </div>
        <div className="card-static p-4 text-center">
          <p className="text-2xl font-bold text-[var(--color-shakti-warning)]">{pending.length}</p>
          <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">Pending</p>
        </div>
      </div>

      <button onClick={() => setShowAdd(!showAdd)}
        className="w-full py-3 rounded-xl gradient-bg text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-shakti-success)]/20">
        <UserPlus size={18} /> Add to Circle
      </button>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-static p-5 space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name"
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm" />
          <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} placeholder="Relation (e.g., Sister)"
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm" />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number"
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm" />
          <button onClick={addMember} className="w-full py-2.5 rounded-xl gradient-bg text-white font-semibold">Add Member</button>
        </motion.div>
      )}

      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[var(--color-shakti-dark-text)] mb-3">Pending Invites</h3>
          <div className="space-y-2">
            {pending.map(p => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card-static p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-[var(--color-shakti-dark-text)] font-bold text-sm">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-shakti-dark-text)] text-sm">{p.name}</p>
                  <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">{p.relation} · {p.mutual} mutual</p>
                </div>
                <button onClick={() => accept(p.id)} className="w-8 h-8 rounded-lg bg-[var(--color-shakti-success)]/20 text-[var(--color-shakti-success)] flex items-center justify-center hover:bg-[var(--color-shakti-success)]/30">
                  <Check size={16} />
                </button>
                <button onClick={() => reject(p.id)} className="w-8 h-8 rounded-lg bg-[var(--color-shakti-error)]/20 text-[var(--color-shakti-error)] flex items-center justify-center hover:bg-[var(--color-shakti-error)]/30">
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-[var(--color-shakti-dark-text)] mb-3">Your Circle</h3>
        <div className="space-y-2">
          {circle.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="card-static p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-[var(--color-shakti-dark-text)] font-bold">
                    {m.name.charAt(0)}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--color-shakti-dark)] ${
                    m.status === 'online' ? 'bg-[var(--color-shakti-success)]' : m.status === 'away' ? 'bg-[var(--color-shakti-warning)]' : 'bg-[var(--color-shakti-dark-muted)]'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-shakti-dark-text)] text-sm">{m.name}</p>
                  <p className="text-[10px] text-[var(--color-shakti-dark-muted)]">{m.relation} · {m.lastActive}</p>
                </div>
                <button className="w-8 h-8 rounded-lg bg-[var(--color-shakti-primary)]/20 text-[var(--color-shakti-primary)] flex items-center justify-center hover:bg-[var(--color-shakti-primary)]/30">
                  <MessageCircle size={14} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[var(--color-shakti-success)]/20 text-[var(--color-shakti-success)] flex items-center justify-center hover:bg-[var(--color-shakti-success)]/30">
                  <Phone size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-shakti-dark-border)]">
                <span className="text-[10px] text-[var(--color-shakti-dark-muted)] flex items-center gap-1">
                  <MapPin size={10} /> {m.shareLocation ? 'Can see your location' : 'Not sharing location'}
                </span>
                <button onClick={() => toggleShare(m.id)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${m.shareLocation ? 'bg-[var(--color-shakti-success)]' : 'bg-[var(--color-shakti-dark-muted)]'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[var(--color-surface-lowest)] transition-all ${m.shareLocation ? 'left-4' : 'left-0.5'}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
