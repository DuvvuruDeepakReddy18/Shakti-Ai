import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Eye, Plus, TrendingUp, Send } from 'lucide-react';
import { FORUM_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const DEMO_POSTS = [
  { id: 1, title: 'How I switched from teaching to tech at 32 — AMA', category: 'career', author: 'Priya S.', replies: 47, likes: 128, views: 1200, time: '2h ago', pinned: true, preview: 'After 10 years of teaching, I decided to pivot to tech. Here\'s my journey...' },
  { id: 2, title: 'Is the Metro safe after 10pm in Delhi?', category: 'safety', author: 'Anon', replies: 23, likes: 56, views: 412, time: '4h ago', preview: 'I work late shifts and the commute is concerning. What are your experiences?' },
  { id: 3, title: 'Dealing with PCOS — what actually worked for me', category: 'health', author: 'Meera K.', replies: 89, likes: 234, views: 2100, time: '1d ago', preview: 'It took 3 years and many doctors. Sharing what helped, from diet to meditation...' },
  { id: 4, title: 'React or Next.js for first portfolio project?', category: 'tech', author: 'Ananya R.', replies: 31, likes: 42, views: 567, time: '1d ago', preview: 'I\'m a beginner — confused between React and Next.js. Need honest opinions.' },
  { id: 5, title: 'Started my own online store — ask me anything', category: 'career', author: 'Kavita D.', replies: 56, likes: 98, views: 876, time: '2d ago', preview: 'Built a small handmade crafts store during pandemic. Now earning ₹40k/month...' },
  { id: 6, title: 'Imposter syndrome hitting hard after promotion', category: 'general', author: 'Anon', replies: 42, likes: 167, views: 1450, time: '3d ago', preview: 'Just got promoted to lead engineer and I feel like a fraud. Anyone else?' },
];

const CAT_COLORS = {
  safety: 'bg-red-500/20 text-red-400',
  career: 'bg-amber-500/20 text-amber-400',
  health: 'bg-pink-500/20 text-pink-400',
  tech: 'bg-blue-500/20 text-blue-400',
  general: 'bg-green-500/20 text-green-400',
};

export default function Forums() {
  const [cat, setCat] = useState('all');
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'general', content: '' });

  const filtered = cat === 'all' ? posts : posts.filter(p => p.category === cat);

  const post = () => {
    if (!form.title.trim()) return toast.error('Enter a title');
    setPosts([{ id: Date.now(), ...form, author: 'You', replies: 0, likes: 0, views: 1, time: 'just now', preview: form.content }, ...posts]);
    setForm({ title: '', category: 'general', content: '' });
    setShowNew(false);
    toast.success('Posted!');
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.1))' }}>
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare size={24} className="text-green-400" />
          <h1 className="text-2xl font-display font-bold text-[var(--color-shakti-dark-text)]">Community Forums</h1>
        </div>
        <p className="text-sm text-green-200/70">Discuss. Support. Share. Anonymous options available.</p>
      </motion.div>

      <button onClick={() => setShowNew(!showNew)}
        className="w-full py-3 rounded-xl gradient-bg text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
        <Plus size={18} /> Start a Discussion
      </button>

      {showNew && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-static p-5 space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Post title" className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm">
            {FORUM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="What's on your mind?" rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] text-sm resize-none" />
          <button onClick={post} className="w-full py-2.5 rounded-xl gradient-bg text-white font-semibold flex items-center justify-center gap-2">
            <Send size={14} /> Post
          </button>
        </motion.div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setCat('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${cat === 'all' ? 'gradient-bg text-white' : 'bg-[var(--color-shakti-dark-surface)] text-[var(--color-shakti-dark-muted)] border border-[var(--color-shakti-dark-border)]'}`}>
          All
        </button>
        {FORUM_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${cat === c.id ? 'gradient-bg text-white' : 'bg-[var(--color-shakti-dark-surface)] text-[var(--color-shakti-dark-muted)] border border-[var(--color-shakti-dark-border)]'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card-static p-4 hover:border-green-500/30 cursor-pointer">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-[var(--color-shakti-dark-text)] text-xs font-bold shrink-0">
                {p.author.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  {p.pinned && <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold uppercase">📌 Pinned</span>}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${CAT_COLORS[p.category]}`}>{p.category}</span>
                </div>
                <h3 className="font-semibold text-[var(--color-shakti-dark-text)] text-sm mb-1 line-clamp-2">{p.title}</h3>
                <p className="text-xs text-[var(--color-shakti-dark-muted)] line-clamp-2 mb-2">{p.preview}</p>
                <div className="flex items-center gap-3 text-[10px] text-[var(--color-shakti-dark-muted)]">
                  <span>{p.author}</span>
                  <span>·</span>
                  <span>{p.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t border-[var(--color-shakti-dark-border)] text-[11px] text-[var(--color-shakti-dark-muted)]">
              <span className="flex items-center gap-1"><Heart size={11} className="text-pink-400" /> {p.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare size={11} className="text-blue-400" /> {p.replies}</span>
              <span className="flex items-center gap-1"><Eye size={11} /> {p.views}</span>
              {p.likes > 100 && <span className="ml-auto flex items-center gap-1 text-orange-400"><TrendingUp size={11} /> Trending</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
