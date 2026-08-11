import { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Plus, ArrowLeftRight, Star, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const ACCENT = '#10b981';
const ACCENT_LIGHT = '#14b8a6';

const AVATAR_COLORS = ['#7c3aed', '#ec4899', '#10b981', '#3b82f6', '#f59e0b', '#e11d48'];

const DEMO_EXCHANGES = [
  { id: 1, teaching: 'Python Programming', wants: 'Spoken English', by: 'Priya S.', rating: 4.9, swaps: 12 },
  { id: 2, teaching: 'Cooking (South Indian)', wants: 'Graphic Design', by: 'Meera K.', rating: 4.8, swaps: 23 },
  { id: 3, teaching: 'Yoga & Meditation', wants: 'Digital Marketing', by: 'Anita T.', rating: 5.0, swaps: 18 },
  { id: 4, teaching: 'React Development', wants: 'UI/UX Design', by: 'Riya M.', rating: 4.7, swaps: 8 },
  { id: 5, teaching: 'Hindi Tutoring', wants: 'Photography', by: 'Kavitha R.', rating: 4.9, swaps: 34 },
  { id: 6, teaching: 'Embroidery & Crafts', wants: 'Social Media Management', by: 'Rekha D.', rating: 4.6, swaps: 15 },
];

export default function SkillExchange() {
  const navigate = useNavigate();
  const { userProfile } = useAuthStore();
  const [exchanges, setExchanges] = useState(
    DEMO_EXCHANGES.map((e, i) => ({ ...e, color: AVATAR_COLORS[i % AVATAR_COLORS.length] }))
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ teaching: '', wants: '' });
  const [proposed, setProposed] = useState(new Set());

  const addExchange = () => {
    if (!form.teaching || !form.wants) return toast.error('Fill both fields');
    setExchanges([{
      id: Date.now(),
      teaching: form.teaching,
      wants: form.wants,
      by: userProfile?.displayName || 'You',
      rating: 5.0,
      swaps: 0,
      color: ACCENT,
    }, ...exchanges]);
    setForm({ teaching: '', wants: '' });
    setShowForm(false);
    toast.success('Exchange posted!');
  };

  const proposeSwap = (e) => {
    if (proposed.has(e.id)) return;
    setProposed(prev => new Set(prev).add(e.id));
    toast.success(`Swap proposed to ${e.by}`);
  };

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.08)', color: 'var(--color-shakti-dark-text)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-sans)' };

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
            <Repeat size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Skill Exchange</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Trade skills with other women. Learn without spending.</p>
          </div>
        </div>
      </motion.div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full inline-flex items-center justify-center gap-2 mb-6 transition-all"
        style={{ padding: '13px', borderRadius: '12px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 18px ${ACCENT}30`, fontFamily: 'var(--font-sans)' }}
      >
        <Plus size={18} /> {showForm ? 'Hide form' : 'Post a skill swap'}
      </button>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-6"
          style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)', border: `1px solid ${ACCENT}22` }}
        >
          <h3 className="text-[15px] font-extrabold mb-1" style={{ color: 'var(--color-shakti-dark-text)' }}>Post a swap</h3>
          <p className="text-[12px] mb-4" style={{ color: 'var(--color-outline)' }}>Share what you can teach and what you'd like to learn.</p>

          <div className="mb-3">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: '#047857' }}>I can teach</label>
            <input value={form.teaching} onChange={(e) => setForm({ ...form, teaching: e.target.value })} placeholder="e.g., Python, Baking, Hindi…" style={inputStyle} />
          </div>

          <div className="flex justify-center mb-3">
            <div className="rounded-full flex items-center justify-center" style={{ width: '32px', height: '32px', background: `${ACCENT}14`, color: ACCENT, border: `1px solid ${ACCENT}33` }}>
              <ArrowLeftRight size={16} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1.5" style={{ color: '#7c3aed' }}>I want to learn</label>
            <input value={form.wants} onChange={(e) => setForm({ ...form, wants: e.target.value })} placeholder="e.g., Design, Public Speaking…" style={inputStyle} />
          </div>

          <button onClick={addExchange} className="w-full"
            style={{ padding: '11px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}30`, fontFamily: 'var(--font-sans)' }}>
            Post exchange
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {exchanges.map((e, i) => {
          const isProposed = proposed.has(e.id);
          return (
            <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[var(--color-surface-lowest)] rounded-2xl p-5"
              style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl flex items-center justify-center text-white text-[14px] font-extrabold flex-shrink-0"
                  style={{ width: '42px', height: '42px', background: `linear-gradient(135deg, ${e.color}, ${e.color}cc)`, boxShadow: `0 4px 12px ${e.color}33` }}>
                  {e.by.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold truncate" style={{ color: 'var(--color-shakti-dark-text)' }}>{e.by}</p>
                  <div className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-outline)' }}>
                    <Star size={11} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                    <span className="font-bold" style={{ color: 'var(--color-shakti-dark-text)' }}>{e.rating}</span>
                    <span>· {e.swaps} swaps</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-3 mb-3" style={{ background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.04)' }}>
                <div className="mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: '#047857' }}>Teaches</span>
                  <span className="text-[14px] font-bold" style={{ color: 'var(--color-shakti-dark-text)' }}>{e.teaching}</span>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <ArrowLeftRight size={12} style={{ color: ACCENT }} />
                  <div className="flex-1 h-px" style={{ background: 'rgba(24,20,69,0.08)' }} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1" style={{ color: '#7c3aed' }}>Wants</span>
                  <span className="text-[14px] font-bold" style={{ color: 'var(--color-shakti-dark-text)' }}>{e.wants}</span>
                </div>
              </div>

              <button
                onClick={() => proposeSwap(e)}
                disabled={isProposed}
                className="w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-bold transition-all"
                style={isProposed
                  ? { padding: '9px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', cursor: 'default' }
                  : { padding: '9px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}30` }
                }
              >
                <MessageCircle size={13} /> {isProposed ? 'Swap proposed' : 'Propose swap'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
