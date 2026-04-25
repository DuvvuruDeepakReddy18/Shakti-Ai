import { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Plus, ArrowLeftRight, Star, MessageCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const DEMO_EXCHANGES = [
  { id: 1, teaching: 'Python Programming', wants: 'Spoken English', by: 'Priya S.', rating: 4.9, swaps: 12, avatar: 'bg-blue-500' },
  { id: 2, teaching: 'Cooking (South Indian)', wants: 'Graphic Design', by: 'Meera K.', rating: 4.8, swaps: 23, avatar: 'bg-pink-500' },
  { id: 3, teaching: 'Yoga & Meditation', wants: 'Digital Marketing', by: 'Anita T.', rating: 5.0, swaps: 18, avatar: 'bg-green-500' },
  { id: 4, teaching: 'React Development', wants: 'UI/UX Design', by: 'Riya M.', rating: 4.7, swaps: 8, avatar: 'bg-purple-500' },
  { id: 5, teaching: 'Hindi Tutoring', wants: 'Photography', by: 'Kavitha R.', rating: 4.9, swaps: 34, avatar: 'bg-yellow-500' },
  { id: 6, teaching: 'Embroidery & Crafts', wants: 'Social Media Management', by: 'Rekha D.', rating: 4.6, swaps: 15, avatar: 'bg-red-500' },
];

export default function SkillExchange() {
  const { userProfile } = useAuthStore();
  const [exchanges, setExchanges] = useState(DEMO_EXCHANGES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ teaching: '', wants: '' });

  const addExchange = () => {
    if (!form.teaching || !form.wants) return toast.error('Fill both fields');
    setExchanges([{
      id: Date.now(),
      teaching: form.teaching,
      wants: form.wants,
      by: userProfile?.displayName || 'You',
      rating: 5.0,
      swaps: 0,
      avatar: 'gradient-bg'
    }, ...exchanges]);
    setForm({ teaching: '', wants: '' });
    setShowForm(false);
    toast.success('Exchange posted!');
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(16,185,129,0.1))' }}>
        <div className="flex items-center gap-3 mb-2">
          <Repeat size={24} className="text-blue-400" />
          <h1 className="text-2xl font-display font-bold text-[var(--color-shakti-dark-text)]">Skill Exchange</h1>
        </div>
        <p className="text-sm text-blue-200/70">Trade skills with other women. Learn without spending.</p>
      </motion.div>

      <button onClick={() => setShowForm(!showForm)}
        className="w-full py-3 rounded-xl gradient-bg text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
        <Plus size={18} /> Post a Skill Swap
      </button>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-static p-5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-green-400 mb-1.5 block">I can teach</label>
            <input value={form.teaching} onChange={(e) => setForm({ ...form, teaching: e.target.value })}
              placeholder="e.g., Python, Baking, Hindi..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm" />
          </div>
          <div className="flex justify-center">
            <ArrowLeftRight size={20} className="text-blue-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-400 mb-1.5 block">I want to learn</label>
            <input value={form.wants} onChange={(e) => setForm({ ...form, wants: e.target.value })}
              placeholder="e.g., Design, Public Speaking..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm" />
          </div>
          <button onClick={addExchange} className="w-full py-2.5 rounded-xl gradient-bg text-white font-semibold">Post Exchange</button>
        </motion.div>
      )}

      <div className="space-y-3">
        {exchanges.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card-static p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full ${e.avatar} flex items-center justify-center text-[var(--color-shakti-dark-text)] font-bold text-sm`}>
                {e.by.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[var(--color-shakti-dark-text)] text-sm">{e.by}</p>
                <div className="flex items-center gap-1 text-[10px] text-[var(--color-shakti-dark-muted)]">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" /> {e.rating} · {e.swaps} swaps
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-shakti-dark-surface)] rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-green-400 font-semibold uppercase">Teaches</span>
                <span className="text-sm text-[var(--color-shakti-dark-text)] font-medium">{e.teaching}</span>
              </div>
              <div className="flex items-center gap-2 my-2">
                <ArrowLeftRight size={12} className="text-blue-400" />
                <div className="flex-1 h-px bg-[var(--color-shakti-dark-border)]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-semibold uppercase">Wants</span>
                <span className="text-sm text-[var(--color-shakti-dark-text)] font-medium">{e.wants}</span>
              </div>
            </div>

            <button className="w-full py-2 rounded-lg gradient-bg text-white text-xs font-semibold flex items-center justify-center gap-1.5">
              <MessageCircle size={12} /> Propose Swap
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
