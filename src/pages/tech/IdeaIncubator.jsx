import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowLeft, ThumbsUp, MessageCircle, Plus, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const JOINED_KEY = 'shakti_ideas_joined';

const seedIdeas = [
  { id: 1, title: 'AI Resume Builder for Career Restart', author: 'Riya P.', stack: ['React', 'OpenAI', 'PDF'], votes: 84, comments: 12, looking: 2, color: '#3B82F6' },
  { id: 2, title: 'Period-Pain Yoga Companion App', author: 'Sneha R.', stack: ['Flutter', 'Firebase'], votes: 67, comments: 9, looking: 1, color: '#db2777' },
  { id: 3, title: 'Voice-First Safety Diary', author: 'Anjali M.', stack: ['React Native', 'Whisper'], votes: 142, comments: 28, looking: 3, color: '#7c3aed' },
  { id: 4, title: 'Hyperlocal Marketplace for Tiffin Services', author: 'Maya I.', stack: ['Next.js', 'Stripe'], votes: 51, comments: 7, looking: 2, color: '#F59E0B' },
];

const NEW_IDEA_COLORS = ['#10b981', '#14b8a6', '#0ea5e9', '#a855f7', '#ec4899'];

export default function IdeaIncubator() {
  const [ideas, setIdeas] = useState(seedIdeas);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [joined, setJoined] = useState(() => {
    try {
      const raw = localStorage.getItem(JOINED_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    try { localStorage.setItem(JOINED_KEY, JSON.stringify([...joined])); } catch { /* ignore */ }
  }, [joined]);

  const toggleJoin = (idea) => {
    setJoined(prev => {
      const next = new Set(prev);
      if (next.has(idea.id)) {
        next.delete(idea.id);
        toast('Left the project');
      } else {
        next.add(idea.id);
        toast.success(`Joined "${idea.title}"`);
      }
      return next;
    });
  };

  const handlePublish = () => {
    if (!title.trim()) return toast.error('Add an idea title first');
    if (!description.trim()) return toast.error('Add a short description');
    const newIdea = {
      id: Date.now(),
      title: title.trim(),
      author: 'You',
      stack: description.split(/[,\s]+/).filter(w => /^[A-Z]/.test(w)).slice(0, 4),
      votes: 0,
      comments: 0,
      looking: 1,
      color: NEW_IDEA_COLORS[Math.floor(Math.random() * NEW_IDEA_COLORS.length)],
    };
    if (newIdea.stack.length === 0) newIdea.stack = ['New'];
    setIdeas(prev => [newIdea, ...prev]);
    setTitle('');
    setDescription('');
    setShowForm(false);
    toast.success('Idea published! 🚀');
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-[var(--color-surface-lowest)]"
        style={{ marginBottom: '24px', boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(16,185,129,0.14)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 6px 20px rgba(16,185,129,0.32)' }}>
            <Lightbulb size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Idea Incubator</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Pitch ideas. Find collaborators. Build together.</p>
          </div>
        </div>
      </motion.div>

      {/* Pitch Idea CTA */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <p className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-outline)]">
          {ideas.length} idea{ideas.length === 1 ? '' : 's'} in flight
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 text-white text-[13px] font-bold transition-all"
          style={{ padding: '10px 18px', borderRadius: '10px', minHeight: '38px', lineHeight: 1, background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 4px 14px rgba(16,185,129,0.30)' }}
        >
          <Plus size={15} /> {showForm ? 'Hide form' : 'Pitch your idea'}
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 mb-6" style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)', border: '1px solid rgba(16,185,129,0.22)' }}>
          <h3 className="text-[15px] font-extrabold text-[var(--color-shakti-dark-text)] mb-1">Pitch a new idea</h3>
          <p className="text-[12px] text-[var(--color-outline)] mb-4">Be specific — clear titles get more collaborators.</p>

          <div className="mb-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-outline)] mb-1.5">Idea title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Period Pain Tracker for Athletes"
              className="w-full text-[14px] outline-none transition-all"
              style={{ padding: '11px 14px', borderRadius: '10px', background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.08)', color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(24,20,69,0.08)'; e.currentTarget.style.background = 'var(--color-surface-low)'; }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-outline)] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description, tech stack, what kind of teammates you need… (mention tech names like React, Firebase to auto-tag)"
              rows={4}
              className="w-full text-[14px] outline-none resize-none transition-all"
              style={{ padding: '11px 14px', borderRadius: '10px', background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.08)', color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-sans)', boxSizing: 'border-box', lineHeight: 1.55 }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(24,20,69,0.08)'; e.currentTarget.style.background = 'var(--color-surface-low)'; }}
            />
          </div>

          <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--color-surface-low)' }}>
            <button
              onClick={() => { setShowForm(false); setTitle(''); setDescription(''); }}
              className="flex-1 text-[13px] font-bold transition-all"
              style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', border: '1px solid rgba(24,20,69,0.08)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="text-white text-[13px] font-bold transition-all"
              style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 4px 12px rgba(16,185,129,0.30)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              Publish idea
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {ideas.map(idea => (
          <motion.div
            key={idea.id}
            whileHover={{ y: -2 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${idea.color}15` }}
              >
                <Lightbulb size={22} style={{ color: idea.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight mb-1">{idea.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-3">by {idea.author}</p>
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                  {idea.stack.map(s => (
                    <span key={s} className="px-2 py-1 rounded-md bg-[var(--color-surface-low)] text-[var(--color-text-secondary)] text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                    <button className="flex items-center gap-1 hover:text-emerald-600">
                      <ThumbsUp size={14} /> {idea.votes}
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} /> {idea.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} /> Needs {idea.looking}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleJoin(idea)}
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold transition-all"
                    style={joined.has(idea.id)
                      ? { padding: '7px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #14b8a6)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.30)' }
                      : { padding: '7px 12px', borderRadius: '8px', background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)', cursor: 'pointer' }
                    }
                  >
                    {joined.has(idea.id) ? <><CheckCircle2 size={13} /> Joined · Leave</> : <>Join Project</>}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
