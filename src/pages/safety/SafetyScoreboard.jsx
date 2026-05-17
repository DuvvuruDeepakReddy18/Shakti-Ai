import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Star, MapPin, Plus, TrendingUp, TrendingDown,
  X, ArrowRight, ShieldCheck, ChevronRight, ArrowLeft,
  Users, AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DEMO_RATINGS = [
  { id: 1, location: 'Connaught Place', score: 9.1, reviews: 342, trend: 'up', tags: ['Well-lit', 'Crowded', 'Metro nearby'] },
  { id: 2, location: 'MG Road Metro', score: 8.7, reviews: 289, trend: 'up', tags: ['Police nearby', 'Well-lit'] },
  { id: 3, location: 'Cyber Hub', score: 8.3, reviews: 215, trend: 'up', tags: ['Busy', 'Friendly locals'] },
  { id: 4, location: 'Nehru Place', score: 7.9, reviews: 178, trend: 'stable', tags: ['Crowded', 'Commercial'] },
  { id: 5, location: 'Lajpat Nagar Market', score: 7.4, reviews: 156, trend: 'up', tags: ['Busy', 'Shopping'] },
];

const WORST = [
  { id: 1, location: 'Industrial Area Zone B', score: 2.4, reviews: 78, trend: 'down', tags: ['Isolated', 'Poor lighting'] },
  { id: 2, location: 'Backroad near Metro', score: 3.1, reviews: 45, trend: 'down', tags: ['Unsafe transport'] },
  { id: 3, location: 'Park after 9pm', score: 3.8, reviews: 62, trend: 'stable', tags: ['Isolated', 'No lighting'] },
];

const TAGS = ['Well-lit', 'Crowded', 'Isolated', 'Friendly locals', 'Unsafe transport', 'Harassment reported', 'Police nearby', 'Metro nearby'];

const getScoreMeta = (score) => {
  if (score >= 7) return { color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.22)' };
  if (score >= 5) return { color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', bg: '#fffbeb', text: '#b45309', border: 'rgba(245,158,11,0.25)' };
  return { color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', bg: '#fef2f2', text: '#b91c1c', border: 'rgba(239,68,68,0.25)' };
};

export default function SafetyScoreboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('best');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const [review, setReview] = useState('');

  const submitRating = () => {
    if (!location || rating === 0) return toast.error('Enter location and rating');
    toast.success('Thanks for making the community safer!');
    setLocation(''); setRating(0); setSelectedTags([]); setShowRating(false); setReview('');
  };

  const toggleTag = (t) => setSelectedTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const items = tab === 'best' ? DEMO_RATINGS : WORST;

  const totalReviews = [...DEMO_RATINGS, ...WORST].reduce((s, i) => s + i.reviews, 0);
  const avgScore = (DEMO_RATINGS.reduce((s, i) => s + i.score, 0) / DEMO_RATINGS.length).toFixed(1);

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.5rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--color-outline)', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '16px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

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
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(168,85,247,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(168,85,247,0.25)',
          }}>
            <Award size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Safety Scoreboard</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Crowdsourced safety data from real women.</p>
          </div>
        </div>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '18px', position: 'relative', zIndex: 10 }}>
          <StatTile value={DEMO_RATINGS.length + WORST.length} label="Zones Rated" />
          <StatTile value={avgScore} label="Avg Safety" accent="#10b981" />
          <StatTile value={totalReviews.toLocaleString()} label="Reviews" />
        </div>
      </motion.div>

      {/* Rate a location toggle */}
      {!showRating ? (
        <motion.button
          whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
          onClick={() => setShowRating(true)}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            color: 'white', border: 'none', fontSize: '14px', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: 'pointer', marginBottom: '20px',
            boxShadow: '0 6px 16px rgba(168,85,247,0.22)',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <Plus size={18} /> Rate a Location
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ ...cardStyle, padding: '24px', marginBottom: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Contribute Safety Data</h3>
            <button onClick={() => setShowRating(false)} style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'var(--color-surface-low)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-outline)', cursor: 'pointer'
            }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Location</p>
              <input
                value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="Search area or landmark"
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
                  borderRadius: '12px', fontSize: '14px', color: 'var(--color-shakti-dark-text)',
                  boxSizing: 'border-box', outline: 'none', fontFamily: 'var(--font-sans)'
                }}
              />
            </div>

            <div style={{ background: 'var(--color-surface-low)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(24,20,69,0.04)' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', textAlign: 'center' }}>Your Safety Rating</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <Star
                      size={34}
                      fill={s <= rating ? '#ec4899' : 'transparent'}
                      style={{ color: s <= rating ? '#ec4899' : '#cbd5e1', transition: 'all 0.15s' }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Your review (optional)</p>
              <textarea
                value={review} onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience to help other women..."
                rows={2}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
                  borderRadius: '12px', fontSize: '14px', color: 'var(--color-shakti-dark-text)',
                  boxSizing: 'border-box', outline: 'none', resize: 'none', fontFamily: 'var(--font-sans)'
                }}
              />
            </div>

            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Add Safety Tags</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    style={{
                      padding: '7px 11px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                      background: selectedTags.includes(t) ? 'rgba(168,85,247,0.12)' : 'var(--color-surface-low)',
                      color: selectedTags.includes(t) ? '#7c3aed' : 'var(--color-outline)',
                      border: `1px solid ${selectedTags.includes(t) ? 'rgba(168,85,247,0.25)' : 'rgba(24,20,69,0.05)'}`,
                      cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--color-surface-low)' }}>
              <button
                onClick={submitRating}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  color: 'white', border: 'none', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(168,85,247,0.22)',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRating(false)}
                style={{
                  padding: '12px 18px', borderRadius: '12px',
                  background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                  border: '1px solid rgba(24,20,69,0.05)', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Switcher */}
      <div style={{
        background: 'var(--color-surface-lowest)', padding: '6px', borderRadius: '12px',
        display: 'flex', marginBottom: '20px', maxWidth: '380px', margin: '0 auto 20px',
        boxShadow: '0 1px 6px rgba(24,20,69,0.03)'
      }}>
        <button
          onClick={() => setTab('best')}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '8px',
            background: tab === 'best' ? 'rgba(16,185,129,0.12)' : 'transparent',
            color: tab === 'best' ? '#047857' : 'var(--color-outline)',
            border: tab === 'best' ? '1px solid rgba(16,185,129,0.22)' : '1px solid transparent',
            fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <ShieldCheck size={14} /> Safe Zones
        </button>
        <button
          onClick={() => setTab('worst')}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '8px',
            background: tab === 'worst' ? 'rgba(239,68,68,0.12)' : 'transparent',
            color: tab === 'worst' ? '#b91c1c' : 'var(--color-outline)',
            border: tab === 'worst' ? '1px solid rgba(239,68,68,0.22)' : '1px solid transparent',
            fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <AlertTriangle size={14} /> Red Zones
        </button>
      </div>

      {/* Zone List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => {
          const meta = getScoreMeta(item.score);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              style={{ ...cardStyle, padding: '18px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: meta.gradient, color: 'white', fontSize: '18px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: `0 4px 12px ${meta.color}33`
                  }}>
                    {item.score}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <MapPin size={13} style={{ color: '#a855f7', flexShrink: 0 }} />
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.location}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-outline)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Users size={11} /> {item.reviews} reviews</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                        padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700,
                        background: meta.bg, color: meta.text, border: `1px solid ${meta.border}`,
                        textTransform: 'uppercase', letterSpacing: '0.04em'
                      }}>
                        <ShieldCheck size={10} /> Verified
                      </span>
                    </div>
                  </div>
                </div>
                <TrendBadge trend={item.trend} />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {item.tags.map((t, j) => (
                  <span key={j} style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                    background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                    border: '1px solid rgba(24,20,69,0.05)'
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ paddingTop: '10px', borderTop: '1px solid var(--color-surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 700, color: '#7c3aed',
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: 0, fontFamily: 'var(--font-sans)'
                }}>
                  Read community reviews <ChevronRight size={13} />
                </button>
                <div style={{ display: 'flex', marginLeft: '-6px' }}>
                  {[1, 2, 3].map((p) => (
                    <div key={p} style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      border: '2px solid var(--color-surface-lowest)', overflow: 'hidden',
                      marginLeft: '-6px'
                    }}>
                      <img src={`https://i.pravatar.cc/100?u=${item.id}${p}`} alt="user" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatTile({ value, label, accent }) {
  return (
    <div style={{
      background: 'var(--color-surface-low)', borderRadius: '12px', padding: '12px 8px',
      textAlign: 'center', border: '1px solid rgba(24,20,69,0.04)'
    }}>
      <p style={{ fontSize: '20px', fontWeight: 800, color: accent || 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 0' }}>{label}</p>
    </div>
  );
}

function TrendBadge({ trend }) {
  const cfg = trend === 'up'
    ? { bg: '#ecfdf5', color: '#047857', Icon: TrendingUp }
    : trend === 'down'
      ? { bg: '#fef2f2', color: '#b91c1c', Icon: TrendingDown }
      : { bg: 'var(--color-surface-low)', color: 'var(--color-outline)', Icon: ArrowRight };
  return (
    <div style={{
      width: '34px', height: '34px', borderRadius: '10px',
      background: cfg.bg, color: cfg.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <cfg.Icon size={15} />
    </div>
  );
}
