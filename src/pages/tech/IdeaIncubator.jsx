import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowLeft, ThumbsUp, MessageCircle, Plus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const seedIdeas = [
  { id: 1, title: 'AI Resume Builder for Career Restart', author: 'Riya P.', stack: ['React', 'OpenAI', 'PDF'], votes: 84, comments: 12, looking: 2, color: '#3B82F6' },
  { id: 2, title: 'Period-Pain Yoga Companion App', author: 'Sneha R.', stack: ['Flutter', 'Firebase'], votes: 67, comments: 9, looking: 1, color: '#db2777' },
  { id: 3, title: 'Voice-First Safety Diary', author: 'Anjali M.', stack: ['React Native', 'Whisper'], votes: 142, comments: 28, looking: 3, color: '#7c3aed' },
  { id: 4, title: 'Hyperlocal Marketplace for Tiffin Services', author: 'Maya I.', stack: ['Next.js', 'Stripe'], votes: 51, comments: 7, looking: 2, color: '#F59E0B' },
];

export default function IdeaIncubator() {
  const [ideas] = useState(seedIdeas);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 mb-5 bg-[var(--color-surface-lowest)]"
        style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(16,185,129,0.14)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 6px 20px rgba(16,185,129,0.32)' }}>
              <Lightbulb size={24} color="white" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Idea Incubator</h1>
              <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Pitch ideas. Find collaborators. Build together.</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 4px 12px rgba(16,185,129,0.30)' }}
          >
            <Plus size={16} /> Pitch Idea
          </button>
        </div>
      </motion.div>

      {showForm && (
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-5 border" style={{ borderColor: 'rgba(16,185,129,0.22)' }}>
          <h3 className="text-base font-bold text-[var(--color-shakti-dark-text)] mb-3">Pitch a new idea</h3>
          <input
            type="text"
            placeholder="Idea title (e.g., Period Pain Tracker for Athletes)"
            className="w-full px-4 py-2.5 rounded-xl border text-sm mb-3 outline-none"
            style={{ background: 'var(--color-surface-low)', borderColor: 'rgba(24,20,69,0.05)' }}
          />
          <textarea
            placeholder="Brief description, tech stack, what kind of teammates you need..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border text-sm mb-3 outline-none resize-none"
            style={{ background: 'var(--color-surface-low)', borderColor: 'rgba(24,20,69,0.05)' }}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-[var(--color-outline)] hover:bg-[var(--color-surface-low)]">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 4px 12px rgba(16,185,129,0.30)' }}>
              Publish
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
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid rgba(16,185,129,0.22)' }}>
                    Join Project
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
