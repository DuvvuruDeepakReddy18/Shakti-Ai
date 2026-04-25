import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Clock, Wind, Loader2, Flame, Activity } from 'lucide-react';
import { suggestWellnessActivity } from '../../services/aiService';
import useHealthStore from '../../store/healthStore';
import { MOODS } from '../../utils/constants';
import toast from 'react-hot-toast';

const TIME_OPTIONS = [
  { val: 3, label: '3 min' },
  { val: 5, label: '5 min' },
  { val: 10, label: '10 min' },
  { val: 15, label: '15 min' },
];

const QUICK_ACTIVITIES = [
  { title: '4-7-8 Breathing', desc: 'Calm your nervous system', duration: '3 min', emoji: '🫁', color: 'bg-blue-500/20' },
  { title: 'Gratitude List', desc: 'Write 3 things you\'re grateful for', duration: '5 min', emoji: '📝', color: 'bg-green-500/20' },
  { title: 'Body Scan', desc: 'Release tension mindfully', duration: '10 min', emoji: '🧘‍♀️', color: 'bg-purple-500/20' },
  { title: 'Dance Break', desc: 'One song, full-body movement', duration: '4 min', emoji: '💃', color: 'bg-pink-500/20' },
  { title: 'Nature Sound', desc: 'Listen to rain/ocean', duration: '10 min', emoji: '🌧️', color: 'bg-cyan-500/20' },
  { title: 'Self-Compassion', desc: 'Write yourself a kind note', duration: '5 min', emoji: '💌', color: 'bg-yellow-500/20' },
];

export default function WellnessEngine() {
  const { todayMood, todayEnergy, wellnessStreak, incrementStreak } = useHealthStore();
  const [time, setTime] = useState(5);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const suggest = async () => {
    setLoading(true);
    setActivity(null);
    setCompleted(false);
    try {
      const result = await suggestWellnessActivity(todayMood || 'neutral', todayEnergy, time);
      setActivity(result);
    } catch {
      toast.error('Could not fetch activity');
    }
    setLoading(false);
  };

  const complete = () => {
    incrementStreak();
    setCompleted(true);
    toast.success('Well done! Streak +1 🔥');
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] p-6 shadow-sm relative overflow-hidden bg-[var(--color-surface-lowest)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-blue-500/10 blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-[1rem] bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0 shadow-inner">
                <Activity size={24} />
              </div>
              <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] tracking-tight">Wellness Engine</h1>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">AI-powered activities tailored to your mood</p>
          </div>
          <div className="text-center bg-[var(--color-surface)] px-4 py-3 rounded-[1rem] shadow-inner">
            <div className="flex items-center gap-1 justify-center"><Flame size={16} className="text-orange-500" /><span className="text-xl font-bold text-[var(--color-text-primary)]">{wellnessStreak}</span></div>
            <p className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-wider mt-1">day streak</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">How much time do you have?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {TIME_OPTIONS.map(t => {
            const selected = time === t.val;
            return (
              <button key={t.val} onClick={() => setTime(t.val)}
                style={{
                  width: '100%', padding: '14px 10px', borderRadius: '14px',
                  fontSize: '14px', fontWeight: 700, textAlign: 'center',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  transition: 'all 0.2s',
                  background: selected ? 'linear-gradient(135deg, #10B981, #0d9488)' : 'var(--color-surface-low)',
                  color: selected ? 'white' : 'var(--color-text-secondary)',
                  boxShadow: selected ? '0 6px 16px rgba(16,185,129,0.25)' : 'none',
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
        <button onClick={suggest} disabled={loading}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg transition-all active:scale-95">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Finding perfect activity...' : 'Get AI Suggestion'}
        </button>
      </div>

      {activity && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-blue-500/5 blur-3xl opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)]">{activity.activity}</h3>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold flex items-center gap-1 shadow-sm"><Clock size={12} />{activity.duration}</span>
            </div>

            {activity.steps && (
              <div className="mb-6">
                <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Steps</p>
                <ol className="space-y-3">
                  {activity.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-[var(--color-text-primary)]">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">{i + 1}</span>
                      <span className="flex-1 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activity.benefits && (
              <div className="mb-6">
                <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {activity.benefits.map((b, i) => (
                    <span key={i} className="text-[11px] px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-[var(--color-text-secondary)] font-bold">{b}</span>
                  ))}
                </div>
              </div>
            )}

            {activity.encouragement && (
              <p className="text-sm text-pink-600 italic font-medium mb-6 bg-pink-50 p-4 rounded-xl border border-pink-100 shadow-inner">"{activity.encouragement}"</p>
            )}

            <button onClick={complete} disabled={completed}
              className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-md transition-all ${completed ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg active:scale-95'}`}>
              <Heart size={18} /> {completed ? 'Completed ✓' : 'Mark Complete'}
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">Quick Activities</h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIVITIES.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-inner">
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center text-xl mb-3 shadow-sm`}>{a.emoji}</div>
              <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-1">{a.title}</h4>
              <p className="text-[11px] font-medium text-[var(--color-text-secondary)] mb-3 leading-relaxed">{a.desc}</p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md border border-green-100"><Clock size={12} /> {a.duration}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
