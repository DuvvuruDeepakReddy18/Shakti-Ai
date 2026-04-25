import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { MOODS } from '../../utils/constants';
import { analyzeEmotion } from '../../services/aiService';
import useHealthStore from '../../store/healthStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const MOOD_SCORE = { happy: 9, calm: 7, neutral: 5, sad: 3, anxious: 2 };

const DEMO_HISTORY = [
  { date: 'Mon', score: 6, mood: 'neutral' },
  { date: 'Tue', score: 8, mood: 'happy' },
  { date: 'Wed', score: 5, mood: 'neutral' },
  { date: 'Thu', score: 3, mood: 'sad' },
  { date: 'Fri', score: 7, mood: 'calm' },
  { date: 'Sat', score: 9, mood: 'happy' },
  { date: 'Sun', score: 8, mood: 'happy' },
];

export default function MoodTracker() {
  const { todayMood, setTodayMood, todayEnergy, setTodayEnergy, addMoodEntry, moodHistory } = useHealthStore();
  const { awardPoints } = useAuthStore();
  const [note, setNote] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const log = async () => {
    if (!todayMood) return toast.error('Select your mood first');
    const entry = { mood: todayMood, energy: todayEnergy, note, date: new Date().toISOString() };
    addMoodEntry(entry);

    if (note.trim()) {
      setLoading(true);
      try {
        const result = await analyzeEmotion(note);
        setAnalysis(result);
      } catch {
        toast.error('AI analysis unavailable');
      }
      setLoading(false);
    }
    awardPoints(10, 'Logged daily mood');
    toast.success('Mood logged! You earned 10 ShePoints 🌟');
    setNote('');
  };

  const chartData = moodHistory.length > 0
    ? moodHistory.slice(0, 7).reverse().map((e, i) => ({
        date: `Day ${i + 1}`,
        score: MOOD_SCORE[e.mood] || 5,
        mood: e.mood,
      }))
    : DEMO_HISTORY;

  const avg = chartData.reduce((a, b) => a + b.score, 0) / chartData.length;

  return (
    <div>
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', borderRadius: '1.5rem', padding: '28px 24px',
          marginBottom: '20px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(236,72,153,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(236,72,153,0.25)',
          }}>
            <Smile size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Mood Tracker</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Check in daily — your emotional wellbeing matters.</p>
          </div>
        </div>
      </motion.div>

      {/* INPUT SECTION */}
      <div style={{ background: 'var(--color-surface-lowest)', borderRadius: '1.5rem', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 6px rgba(24,20,69,0.03)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: '0 0 16px 0' }}>How are you feeling today?</h3>
        
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {MOODS.map(m => (
            <button key={m.id} onClick={() => setTodayMood(m.id)}
              style={{
                flexShrink: 0, width: '100px', height: '110px', borderRadius: '16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: todayMood === m.id ? `${m.color}25` : 'var(--color-surface-low)',
                border: todayMood === m.id ? `2px solid ${m.color}` : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: todayMood === m.id ? `0 8px 24px ${m.color}30` : 'none',
                transform: todayMood === m.id ? 'translateY(-2px)' : 'none',
              }}
            >
              <span style={{ fontSize: '36px' }}>{m.emoji}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-shakti-dark-text)' }}>{m.label}</span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-shakti-dark-text)' }}>Energy Level</label>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899' }}>{todayEnergy}/10</span>
          </div>
          <input type="range" min="1" max="10" value={todayEnergy}
            onChange={(e) => setTodayEnergy(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#ec4899', height: '6px', borderRadius: '4px', background: 'var(--color-surface-low)', appearance: 'none', outline: 'none' }} />
        </div>

        <textarea value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Optional: What's on your mind? (AI will offer support)"
          rows={3}
          style={{
            width: '100%', padding: '16px', background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)', borderRadius: '16px', color: 'var(--color-shakti-dark-text)', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s', resize: 'none', marginBottom: '20px', fontFamily: 'var(--font-sans)'
          }}
          onFocus={(e) => { e.currentTarget.style.border = '1px solid #ec4899'; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
          onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(24,20,69,0.05)'; e.currentTarget.style.background = 'var(--color-surface-low)'; }}
        />

        <button onClick={log} disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', border: 'none', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-sans)', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 8px 24px rgba(236,72,153,0.3)', opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(236,72,153,0.4)'; } }}
          onMouseLeave={(e) => { if(!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(236,72,153,0.3)'; } }}
        >
          {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={18} />}
          {loading ? 'Analyzing...' : 'Log Mood'}
        </button>
      </div>

      {/* AI ANALYSIS RESULT */}
      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--color-surface-lowest)', borderRadius: '1.5rem', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 6px rgba(24,20,69,0.03)', borderLeft: '4px solid #8b5cf6' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: '#8b5cf6' }} /> AI Analysis
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '4px 12px', borderRadius: '999px', textTransform: 'capitalize' }}>{analysis.primaryEmotion}</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '4px 12px', borderRadius: '999px', textTransform: 'capitalize' }}>{analysis.sentiment}</span>
            <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>Intensity: {analysis.intensity}/10</span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-outline)', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>"{analysis.suggestion}"</p>
          {analysis.needsSupport && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: '#fff1f2', border: '1px solid #ffe4e6', color: '#be123c', fontSize: '13px', lineHeight: 1.5 }}>
              💜 It looks like you could use extra support. Call iCall (9152987821) anytime — free & confidential.
            </div>
          )}
        </motion.div>
      )}

      {/* CHART */}
      <div style={{ background: 'var(--color-surface-lowest)', borderRadius: '1.5rem', padding: '24px', boxShadow: '0 1px 6px rgba(24,20,69,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#10b981' }} /> 7-Day Mood Trend
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>Avg: <span style={{ color: '#ec4899', fontWeight: 700 }}>{avg.toFixed(1)}</span></span>
        </div>
        <div style={{ height: '240px', width: '100%', position: 'relative', marginLeft: '-10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(24,20,69,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-outline-variant)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} stroke="var(--color-outline-variant)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface-lowest)', border: '1px solid rgba(24,20,69,0.05)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: '#ec4899', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="score" stroke="#ec4899" strokeWidth={3} fill="url(#moodGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
