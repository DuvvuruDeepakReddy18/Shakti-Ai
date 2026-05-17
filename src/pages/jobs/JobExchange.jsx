import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Plus, X,
  Briefcase, Search, User,
  ChevronRight, Heart, Zap, CheckCircle2, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCENT = '#f59e0b';
const ACCENT_LIGHT = '#fb923c';

const CATEGORIES = ['All', 'Tutoring', 'Cooking', 'Tailoring', 'Cleaning', 'Childcare', 'Delivery', 'Tech', 'Beauty'];

const DEMO_JOBS = [
  { id: 1, title: 'Home Tutor for Class 5 Maths', poster: 'Ananya S.', avatar: 'https://i.pravatar.cc/100?u=j1', location: 'Banjara Hills, Hyderabad', pay: '₹500/hr', category: 'Tutoring', time: '2 hrs/day', posted: '2h ago', verified: true, applicants: 3, desc: 'Looking for a patient tutor who can teach basic maths and science to my daughter.' },
  { id: 2, title: 'Tiffin Service (20 boxes daily)', poster: 'Meera R.', avatar: 'https://i.pravatar.cc/100?u=j2', location: 'Kondapur, Hyderabad', pay: '₹15,000/mo', category: 'Cooking', time: 'Morning shift', posted: '5h ago', verified: true, applicants: 7, desc: 'Need someone for daily tiffin preparation. Veg meals for office workers. Kitchen provided.' },
  { id: 3, title: 'Website Design for Boutique', poster: 'Priya K.', avatar: 'https://i.pravatar.cc/100?u=j3', location: 'Remote', pay: '₹8,000', category: 'Tech', time: 'One-time', posted: '1d ago', verified: false, applicants: 12, desc: 'Need a simple portfolio website for my handloom boutique. 5-6 pages.' },
  { id: 4, title: 'Childcare (Mon-Fri, 9am-1pm)', poster: 'Deepa M.', avatar: 'https://i.pravatar.cc/100?u=j4', location: 'Jubilee Hills, Hyderabad', pay: '₹12,000/mo', category: 'Childcare', time: '4 hrs/day', posted: '3h ago', verified: true, applicants: 2, desc: 'Need experienced nanny for a 2-year-old toddler while I work from home.' },
  { id: 5, title: 'Mehndi Artist for Wedding', poster: 'Fatima Z.', avatar: 'https://i.pravatar.cc/100?u=j5', location: 'Tolichowki, Hyderabad', pay: '₹3,000', category: 'Beauty', time: 'One-time (Dec 15)', posted: '6h ago', verified: true, applicants: 5, desc: 'Need skilled mehndi artist for bride + 10 family members.' },
  { id: 6, title: 'Blouse Stitching (Bulk Order)', poster: 'Lakshmi V.', avatar: 'https://i.pravatar.cc/100?u=j6', location: 'Dilsukhnagar, Hyderabad', pay: '₹200/piece', category: 'Tailoring', time: 'Flexible', posted: '1d ago', verified: false, applicants: 8, desc: 'Need 25 designer blouses stitched. Material provided. 2-week deadline.' },
];

export default function JobExchange() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPostForm, setShowPostForm] = useState(false);
  const [applied, setApplied] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);

  const [newJob, setNewJob] = useState({ title: '', desc: '', location: '', pay: '', category: 'Tutoring', time: '' });

  const allJobs = [...postedJobs, ...DEMO_JOBS];
  const filtered = allJobs.filter(j => {
    const matchCat = activeCategory === 'All' || j.category === activeCategory;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleApply = (id) => {
    setApplied(prev => new Set(prev).add(id));
    toast.success('Application sent! The poster will contact you.');
  };

  const handleSave = (id) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from saved'); }
      else { next.add(id); toast.success('Saved for later'); }
      return next;
    });
  };

  const handlePost = () => {
    if (!newJob.title || !newJob.location || !newJob.pay) return toast.error('Fill required fields');
    const job = {
      id: `posted-${Date.now()}`,
      title: newJob.title,
      poster: 'You',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=You&backgroundColor=f59e0b&textColor=ffffff`,
      location: newJob.location,
      pay: newJob.pay.startsWith('₹') ? newJob.pay : `₹${newJob.pay}`,
      category: newJob.category,
      time: newJob.time || 'Flexible',
      posted: 'Just now',
      verified: false,
      applicants: 0,
      desc: newJob.desc || 'No description provided.',
    };
    setPostedJobs(prev => [job, ...prev]);
    if (activeCategory !== 'All' && activeCategory !== newJob.category) setActiveCategory('All');
    toast.success('Task posted successfully!');
    setShowPostForm(false);
    setNewJob({ title: '', desc: '', location: '', pay: '', category: 'Tutoring', time: '' });
  };

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.25rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
    borderRadius: '12px', fontSize: '14px', color: 'var(--color-shakti-dark-text)',
    boxSizing: 'border-box', outline: 'none', fontFamily: 'var(--font-sans)'
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--color-outline)', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '16px', fontFamily: 'var(--font-sans)',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', borderRadius: '1.5rem', padding: '28px 24px',
          marginBottom: '18px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: `${ACCENT}14`, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px ${ACCENT}40`,
          }}>
            <Briefcase size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Job Exchange</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Hyperlocal gigs & tasks from your community.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
          <Chip text={`${DEMO_JOBS.length} Active`} />
          <Chip text="Hyderabad" />
        </div>
      </motion.div>

      {/* Search + Post */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            style={{ ...inputStyle, paddingLeft: '40px' }}
          />
        </div>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          style={{
            padding: '0 20px', borderRadius: '12px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`, color: 'white',
            border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            boxShadow: `0 4px 12px ${ACCENT}33`, fontFamily: 'var(--font-sans)', flexShrink: 0
          }}
        >
          <Plus size={16} /> Post
        </button>
      </div>

      {/* Post Form */}
      <AnimatePresence>
        {showPostForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{ ...cardStyle, padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Post a Task</h3>
                <button onClick={() => setShowPostForm(false)} style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'var(--color-surface-low)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-outline)', cursor: 'pointer'
                }}><X size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Task title *" style={inputStyle} />
                <textarea value={newJob.desc} onChange={(e) => setNewJob({...newJob, desc: e.target.value})} placeholder="Description" rows={2} style={{ ...inputStyle, resize: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <input value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Location *" style={inputStyle} />
                  <input value={newJob.pay} onChange={(e) => setNewJob({...newJob, pay: e.target.value})} placeholder="Pay (₹) *" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <select value={newJob.category} onChange={(e) => setNewJob({...newJob, category: e.target.value})} style={inputStyle}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={newJob.time} onChange={(e) => setNewJob({...newJob, time: e.target.value})} placeholder="Time (e.g. 2 hrs/day)" style={inputStyle} />
                </div>
                <button
                  onClick={handlePost}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px',
                    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                    color: 'white', border: 'none', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer', boxShadow: `0 4px 12px ${ACCENT}33`,
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  Publish Task
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            style={{
              padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
              whiteSpace: 'nowrap',
              background: activeCategory === c ? `${ACCENT}1a` : 'var(--color-surface-lowest)',
              color: activeCategory === c ? '#b45309' : 'var(--color-outline)',
              border: `1px solid ${activeCategory === c ? `${ACCENT}33` : 'rgba(24,20,69,0.05)'}`,
              cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{ ...cardStyle, overflow: 'hidden' }}
          >
            <div style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <img src={job.avatar} alt={job.poster} style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-surface-low)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</h3>
                    {job.verified && <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0 }} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-outline)' }}>
                    <span>{job.poster}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Clock size={10} /> {job.posted}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: ACCENT, margin: 0 }}>{job.pay}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                <Tagline icon={<Tag size={9} />} text={job.category} accent />
                <Tagline icon={<MapPin size={9} />} text={job.location} />
                <Tagline icon={<Clock size={9} />} text={job.time} />
                <Tagline icon={<User size={9} />} text={`${job.applicants} applied`} />
              </div>

              <AnimatePresence>
                {expandedId === job.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '12px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.6, margin: '0 0 12px', paddingLeft: '10px', borderLeft: `3px solid ${ACCENT}33` }}>{job.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-surface-low)' }}>
                <button
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '11px', fontWeight: 700, color: ACCENT,
                    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0, fontFamily: 'var(--font-sans)'
                  }}
                >
                  {expandedId === job.id ? 'Show less' : 'Details'} <ChevronRight size={12} style={{ transform: expandedId === job.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => handleSave(job.id)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: saved.has(job.id) ? '#fef2f2' : 'var(--color-surface-low)',
                    color: saved.has(job.id) ? '#e11d48' : 'var(--color-outline)',
                    border: `1px solid ${saved.has(job.id) ? 'rgba(225,29,72,0.22)' : 'rgba(24,20,69,0.05)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <Heart size={14} fill={saved.has(job.id) ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => applied.has(job.id) ? null : handleApply(job.id)}
                  disabled={applied.has(job.id)}
                  style={{
                    padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700,
                    background: applied.has(job.id) ? '#ecfdf5' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
                    color: applied.has(job.id) ? '#047857' : 'white',
                    border: applied.has(job.id) ? '1px solid rgba(16,185,129,0.22)' : 'none',
                    cursor: applied.has(job.id) ? 'default' : 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    boxShadow: applied.has(job.id) ? 'none' : `0 4px 12px ${ACCENT}33`,
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {applied.has(job.id) ? <><CheckCircle2 size={13} /> Applied</> : <><Zap size={13} /> Apply</>}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-outline)' }}>
            <Search size={40} style={{ margin: '0 auto 10px', display: 'block', color: 'var(--color-surface-low)' }} />
            <p style={{ fontSize: '13px', margin: 0 }}>No tasks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ text }) {
  return (
    <div style={{
      padding: '5px 12px', borderRadius: '999px',
      background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
      fontSize: '11px', fontWeight: 600, color: 'var(--color-shakti-dark-text)'
    }}>
      {text}
    </div>
  );
}

function Tagline({ icon, text, accent }) {
  return (
    <span style={{
      padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
      background: accent ? '#fffbeb' : 'var(--color-surface-low)',
      color: accent ? '#b45309' : 'var(--color-outline)',
      border: `1px solid ${accent ? 'rgba(245,158,11,0.22)' : 'rgba(24,20,69,0.05)'}`,
      display: 'inline-flex', alignItems: 'center', gap: '4px'
    }}>
      {icon} {text}
    </span>
  );
}
