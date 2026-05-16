import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Phone, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HELPLINES } from '../../utils/constants';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom', phone: '+91 98765 43210', relation: 'Mother', priority: 1 },
    { id: 2, name: 'Dad', phone: '+91 98765 43211', relation: 'Father', priority: 2 },
    { id: 3, name: 'Best Friend', phone: '+91 98765 43212', relation: 'Friend', priority: 3 },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts([...contacts, { id: Date.now(), ...newContact, priority: contacts.length + 1 }]);
    setNewContact({ name: '', phone: '', relation: '' });
    setShowAdd(false);
  };

  const removeContact = (id) => setContacts(contacts.filter(c => c.id !== id));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/safety" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-purple)] mb-4">
        <ArrowLeft size={16} /> Back to Safety
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">Emergency Contacts</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">These people are alerted instantly when you trigger SOS.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <ShieldAlert size={20} className="text-rose-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-rose-800">
          We recommend at least <span className="font-semibold">3 trusted contacts</span> with verified phone numbers.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {contacts.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-4 border border-[var(--color-surface-highlight)] shadow-sm flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
              {c.priority}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-[var(--color-text-primary)] truncate">{c.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{c.relation} · {c.phone}</p>
            </div>
            <a href={`tel:${c.phone}`} className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center">
              <Phone size={16} />
            </a>
            <button onClick={() => removeContact(c.id)} className="w-9 h-9 rounded-lg bg-[var(--color-surface-low)] text-[var(--color-text-secondary)] hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center">
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {showAdd ? (
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-6 border border-amber-100 shadow-sm">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">Add new contact</h3>
          <div className="space-y-3">
            <input
              type="text" placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-surface-highlight)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:border-amber-400 outline-none"
            />
            <input
              type="tel" placeholder="Phone (with country code)"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-surface-highlight)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:border-amber-400 outline-none"
            />
            <input
              type="text" placeholder="Relationship (e.g. Friend, Mother)"
              value={newContact.relation}
              onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-surface-highlight)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] focus:border-amber-400 outline-none"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-low)]">
                Cancel
              </button>
              <button onClick={addContact} className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600">
                Save Contact
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-amber-200 text-amber-700 text-sm font-semibold hover:bg-amber-50 mb-6"
        >
          <Plus size={16} /> Add another contact
        </button>
      )}

      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">National helplines</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {HELPLINES.map((h) => (
          <a
            key={h.number}
            href={`tel:${h.number}`}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-4 border border-[var(--color-surface-highlight)] shadow-sm flex items-center gap-3 hover:border-rose-200 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{h.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)] truncate">{h.description}</p>
            </div>
            <span className="text-base font-bold text-rose-600">{h.number}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
