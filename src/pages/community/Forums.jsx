import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Eye, Plus, TrendingUp, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FORUM_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ACCENT = '#3b82f6';
const ACCENT_LIGHT = '#60a5fa';

const DEMO_POSTS = [
  { id: 1, title: 'How I switched from teaching to tech at 32 — AMA', category: 'career', author: 'Priya S.', replies: 47, likes: 128, views: 1200, time: '2h ago', pinned: true, preview: 'After 10 years of teaching, I decided to pivot to tech. Here\'s my journey...' },
  { id: 2, title: 'Is the Metro safe after 10pm in Delhi?', category: 'safety', author: 'Anon', replies: 23, likes: 56, views: 412, time: '4h ago', preview: 'I work late shifts and the commute is concerning. What are your experiences?' },
  { id: 3, title: 'Dealing with PCOS — what actually worked for me', category: 'health', author: 'Meera K.', replies: 89, likes: 234, views: 2100, time: '1d ago', preview: 'It took 3 years and many doctors. Sharing what helped, from diet to meditation...' },
  { id: 4, title: 'React or Next.js for first portfolio project?', category: 'tech', author: 'Ananya R.', replies: 31, likes: 42, views: 567, time: '1d ago', preview: 'I\'m a beginner — confused between React and Next.js. Need honest opinions.' },
  { id: 5, title: 'Started my own online store — ask me anything', category: 'career', author: 'Kavita D.', replies: 56, likes: 98, views: 876, time: '2d ago', preview: 'Built a small handmade crafts store during pandemic. Now earning ₹40k/month...' },
  { id: 6, title: 'Imposter syndrome hitting hard after promotion', category: 'general', author: 'Anon', replies: 42, likes: 167, views: 1450, time: '3d ago', preview: 'Just got promoted to lead engineer and I feel like a fraud. Anyone else?' },
];

const CAT_META = {
  safety:  { bg: '#fef2f2', text: '#b91c1c', border: 'rgba(225,29,72,0.22)' },
  career:  { bg: '#fffbeb', text: '#b45309', border: 'rgba(245,158,11,0.22)' },
  health:  { bg: '#fdf2f8', text: '#a21caf', border: 'rgba(217,70,239,0.22)' },
  tech:    { bg: '#eff6ff', text: '#1d4ed8', border: 'rgba(59,130,246,0.22)' },
  general: { bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.22)' },
};

export default function Forums() {
  const navigate = useNavigate();
  const [cat, setCat] = useState('all');
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'general', content: '' });

  const filtered = cat === 'all' ? posts : posts.filter(p => p.category === cat);

  const submitPost = () => {
    if (!form.title.trim()) return toast.error('Enter a title');
    setPosts([{ id: Date.now(), ...form, author: 'You', replies: 0, likes: 0, views: 1, time: 'just now', preview: form.content }, ...posts]);
    setForm({ title: '', category: 'general', content: '' });
    setShowNew(false);
    toast.success('Posted!');
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
            <MessageSquare size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Community Forums</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Discuss. Support. Share. Anonymous options available.</p>
          </div>
        </div>
      </motion.div>

      <button
        onClick={() => setShowNew(!showNew)}
        className="w-full inline-flex items-center justify-center gap-2 mb-6 transition-all"
        style={{ padding: '13px', borderRadius: '12px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 18px ${ACCENT}30`, fontFamily: 'var(--font-sans)' }}
      >
        <Plus size={18} /> {showNew ? 'Hide form' : 'Start a discussion'}
      </button>

      {showNew && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-6"
          style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)', border: `1px solid ${ACCENT}22` }}
        >
          <h3 className="text-[15px] font-extrabold mb-3" style={{ color: 'var(--color-shakti-dark-text)' }}>Start a new discussion</h3>
          <div className="flex flex-col gap-2.5 mb-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" style={inputStyle} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {FORUM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="What's on your mind?" rows={4} style={{ ...inputStyle, resize: 'none', lineHeight: 1.55 }} />
          </div>
          <button onClick={submitPost} className="w-full inline-flex items-center justify-center gap-2"
            style={{ padding: '11px', borderRadius: '10px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}30`, fontFamily: 'var(--font-sans)' }}>
            <Send size={14} /> Post discussion
          </button>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <CatChip active={cat === 'all'} label="All" onClick={() => setCat('all')} />
        {FORUM_CATEGORIES.map(c => (
          <CatChip key={c.id} active={cat === c.id} label={c.label} onClick={() => setCat(c.id)} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((p, i) => {
          const meta = CAT_META[p.category] || CAT_META.general;
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[var(--color-surface-lowest)] rounded-2xl p-4 cursor-pointer transition-all"
              style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 18px rgba(24,20,69,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="rounded-xl flex items-center justify-center text-white text-[13px] font-extrabold flex-shrink-0"
                  style={{ width: '38px', height: '38px', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, boxShadow: `0 3px 8px ${ACCENT}33` }}>
                  {p.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    {p.pinned && <span className="text-[9px] font-extrabold uppercase" style={{ padding: '2px 7px', borderRadius: '6px', background: '#fffbeb', color: '#b45309', border: '1px solid rgba(245,158,11,0.22)' }}>📌 Pinned</span>}
                    <span className="text-[9px] font-extrabold uppercase" style={{ padding: '2px 7px', borderRadius: '6px', background: meta.bg, color: meta.text, border: `1px solid ${meta.border}` }}>{p.category}</span>
                  </div>
                  <h3 className="text-[14px] font-bold mb-1 leading-snug" style={{ color: 'var(--color-shakti-dark-text)' }}>{p.title}</h3>
                  <p className="text-[12px] mb-2 line-clamp-2" style={{ color: 'var(--color-outline)', lineHeight: 1.5 }}>{p.preview}</p>
                  <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--color-outline)' }}>
                    <span className="font-semibold">{p.author}</span>
                    <span>·</span>
                    <span>{p.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-3 text-[11px] font-semibold" style={{ borderTop: '1px solid var(--color-surface-low)', color: 'var(--color-outline)' }}>
                <span className="flex items-center gap-1"><Heart size={11} style={{ color: '#e11d48' }} /> {p.likes}</span>
                <span className="flex items-center gap-1"><MessageSquare size={11} style={{ color: ACCENT }} /> {p.replies}</span>
                <span className="flex items-center gap-1"><Eye size={11} /> {p.views}</span>
                {p.likes > 100 && <span className="ml-auto flex items-center gap-1" style={{ color: '#d97706' }}><TrendingUp size={11} /> Trending</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CatChip({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-[13px] font-bold whitespace-nowrap transition-all"
      style={{
        padding: '8px 14px', borderRadius: '10px', minHeight: '36px', lineHeight: 1, cursor: 'pointer',
        ...(active
          ? { background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white', border: '1px solid transparent', boxShadow: `0 4px 12px ${ACCENT}30` }
          : { background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.08)' }
        )
      }}
    >
      {label}
    </button>
  );
}
