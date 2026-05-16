import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, ExternalLink, Search, X,
  Building2, ChevronRight, CheckCircle, Upload, Sparkles,
  ArrowRight, Filter, Target, Zap, Store, TrendingUp, Bookmark,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const jobListings = [
  { id: 1, title: 'Lead UI/UX Designer', company: 'Google', location: 'Bangalore', type: 'Full-time', salary: '₹28-45 LPA', tags: ['Figma', 'Strategy'], posted: '2d ago', color: 'var(--color-shakti-primary)', description: "Design intuitive user interfaces for Google's next-gen products." },
  { id: 2, title: 'Senior Frontend Dev', company: 'Microsoft', location: 'Hyderabad', type: 'Full-time', salary: '₹35-52 LPA', tags: ['React', 'Next.js'], posted: '1d ago', color: 'var(--color-shakti-success)', description: 'Build performant web applications using React and TypeScript.' },
  { id: 3, title: 'Senior Data Analyst', company: 'Amazon', location: 'Remote', type: 'Contract', salary: '₹18-28 LPA', tags: ['Python', 'Tableau'], posted: '3d ago', color: 'var(--color-shakti-warning)', description: 'Analyze large datasets to drive business decisions.' },
  { id: 4, title: 'Growth Product Lead', company: 'Flipkart', location: 'Bangalore', type: 'Full-time', salary: '₹40-60 LPA', tags: ['Product', 'Growth'], posted: '5d ago', color: 'var(--color-shakti-secondary)', description: 'Lead product strategy and roadmap for consumer-facing features.' },
  { id: 5, title: 'AI/ML Researcher', company: 'Zomato', location: 'Delhi', type: 'Full-time', salary: '₹45-75 LPA', tags: ['PyTorch', 'GenAI'], posted: '12h ago', color: 'var(--color-shakti-tertiary)', description: 'Build and deploy machine learning models for recommendation systems.' },
  { id: 6, title: 'Technical Writer', company: 'Swiggy', location: 'Remote', type: 'Part-time', salary: '₹12-18 LPA', tags: ['API', 'Docs'], posted: '4d ago', color: 'var(--color-shakti-error)', description: 'Create engaging content for blogs, social media, and marketing.' },
];

const aiTools = [
  { to: '/jobs/resume-analyzer', icon: Target, title: 'ATS Scanner', desc: 'Resume match score', color: 'var(--color-shakti-tertiary)', bg: 'var(--color-shakti-tertiary-container)' },
  { to: '/jobs/skill-translator', icon: Zap, title: 'Skill Translator', desc: 'Skills into income', color: 'var(--color-shakti-primary)', bg: 'var(--color-shakti-primary-container)' },
  { to: '/jobs/career-simulator', icon: TrendingUp, title: 'Career Simulator', desc: '6-month roadmap', color: 'var(--color-shakti-success)', bg: 'var(--color-shakti-success-container)' },
  { to: '/jobs/marketplace', icon: Store, title: 'Marketplace', desc: 'Women-owned biz', color: 'var(--color-shakti-secondary)', bg: 'var(--color-shakti-secondary-container)' },
  { to: '/jobs/exchange', icon: MapPin, title: 'Job Exchange', desc: 'Hyperlocal tasks', color: 'var(--color-shakti-warning)', bg: 'var(--color-shakti-warning-container)' },
];

const cs = { background: 'var(--color-surface-lowest)', borderRadius: '1rem', boxShadow: '0 1px 6px rgba(24,20,69,0.03)' };

export default function JobsHome() {
  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saved, setSaved] = useState([]);
  const [applied, setApplied] = useState([]);
  const [applyingJob, setApplyingJob] = useState(null);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [resume, setResume] = useState(null);

  const filteredJobs = jobListings.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleApplyClick = (job) => { setApplyingJob(job); setQ1(''); setQ2(''); setResume(null); };
  const handleConfirmApply = () => {
    if (!q1 || !q2) { toast.error('Please answer both questions'); return; }
    if (!resume) { toast.error('Please upload your resume'); return; }
    setApplied((prev) => [...prev, applyingJob.id]);
    toast.success(`Application sent to ${applyingJob.company}`);
    setApplyingJob(null);
  };
  const handleSave = (id) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    toast.success(saved.includes(id) ? 'Removed from saved' : 'Job saved');
  };

  const inputSt = { width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'var(--color-surface-low)', border: '1px solid var(--color-surface-container)', fontSize: '13px', color: 'var(--color-shakti-dark-text)', outline: 'none', fontFamily: 'var(--font-sans)', resize: 'none' };

  return (
    <div>
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', borderRadius: '1.5rem', padding: '28px 24px', marginBottom: '20px', overflow: 'hidden', background: 'var(--color-surface-lowest)', boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'color-mix(in srgb, var(--color-shakti-primary) 8%, transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-30px', width: '160px', height: '160px', background: 'color-mix(in srgb, var(--color-shakti-tertiary) 6%, transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--color-shakti-primary), var(--color-shakti-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px color-mix(in srgb, var(--color-shakti-primary) 25%, transparent)' }}>
              <Briefcase size={24} color="white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Career Launchpad</h1>
              <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Curated opportunities & AI-powered tools.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { l: '128 active', c: 'var(--color-shakti-primary)', bg: 'var(--color-shakti-primary-container)', bd: 'color-mix(in srgb, var(--color-shakti-primary) 20%, transparent)', I: Briefcase },
              { l: '5 matches', c: 'var(--color-shakti-success)', bg: 'var(--color-shakti-success-container)', bd: 'color-mix(in srgb, var(--color-shakti-success) 20%, transparent)', I: Sparkles },
              { l: 'Trending', c: 'var(--color-shakti-warning)', bg: 'var(--color-shakti-warning-container)', bd: 'color-mix(in srgb, var(--color-shakti-warning) 20%, transparent)', I: TrendingUp }
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '999px', background: b.bg, border: `1px solid ${b.bd}`, fontSize: '11px', fontWeight: 700, color: b.c }}><b.I size={12} />{b.l}</div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SEARCH */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline-variant)' }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search roles, companies, skills…"
            style={{ ...inputSt, paddingLeft: '40px', paddingRight: searchQuery ? '36px' : '14px' }} />
          {searchQuery && <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}><X size={16} /></button>}
        </div>
        <button style={{ padding: '10px 16px', borderRadius: '12px', background: 'var(--color-surface-lowest)', border: '1px solid var(--color-surface-container)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--color-shakti-dark-muted)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>
          <Filter size={14} /> Filters
        </button>
      </div>

      {/* AI TOOLS */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: '0 0 12px 4px' }}>AI tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
          {aiTools.map((t, i) => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} style={{ textDecoration: 'none' }}>
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -2 }}
                  style={{ ...cs, overflow: 'hidden', transition: 'box-shadow 0.3s', height: '100%' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 24px rgba(24,20,69,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'}>
                  <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} style={{ color: t.color }} strokeWidth={2.2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>{t.title}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{t.desc}</p>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--color-outline-variant)', flexShrink: 0 }} />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* JOB LISTINGS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', margin: 0 }}>Featured opportunities</h2>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-outline)' }}>{filteredJobs.length} jobs</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredJobs.map((job, i) => (
          <motion.div key={job.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            onClick={() => setExpanded(expanded === job.id ? null : job.id)}
            style={{ ...cs, cursor: 'pointer', overflow: 'hidden', transition: 'box-shadow 0.3s', boxShadow: expanded === job.id ? '0 6px 24px rgba(24,20,69,0.08)' : cs.boxShadow }}>
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `color-mix(in srgb, ${job.color} 15%, transparent)` }}>
                <Building2 size={20} style={{ color: job.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.3 }}>{job.title}</h3>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-outline)', padding: '2px 6px', background: 'var(--color-surface-low)', borderRadius: '4px' }}>{job.posted}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: job.color }}>{job.company}</span>
                  <span style={{ color: 'var(--color-outline-variant)' }}>·</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-outline)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} />{job.location}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--color-shakti-primary-container)', color: 'var(--color-shakti-primary)', fontSize: '11px', fontWeight: 700 }}>{job.type}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--color-shakti-success-container)', color: 'var(--color-shakti-success)', fontSize: '11px', fontWeight: 700 }}>{job.salary}</span>
                  {job.tags.map((tag) => <span key={tag} style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--color-surface-low)', color: 'var(--color-shakti-dark-muted)', fontSize: '11px', fontWeight: 600 }}>{tag}</span>)}
                </div>
              </div>
              <ChevronRight size={18} style={{ color: expanded === job.id ? 'var(--color-shakti-primary)' : 'var(--color-outline-variant)', flexShrink: 0, transform: expanded === job.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            <AnimatePresence>
              {expanded === job.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', borderTop: '1px solid var(--color-surface-container)' }}>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-surface-low)', marginBottom: '14px' }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-shakti-warning)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={11} />About the role</p>
                      <p style={{ fontSize: '13px', color: 'var(--color-shakti-dark-muted)', lineHeight: 1.6, margin: 0 }}>{job.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={(e) => { e.stopPropagation(); if (!applied.includes(job.id)) handleApplyClick(job); }} disabled={applied.includes(job.id)}
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-sans)', background: applied.includes(job.id) ? 'var(--color-shakti-success-container)' : 'linear-gradient(135deg, var(--color-shakti-primary), var(--color-shakti-tertiary))', color: applied.includes(job.id) ? 'var(--color-shakti-success)' : 'white', boxShadow: applied.includes(job.id) ? 'none' : '0 4px 12px color-mix(in srgb, var(--color-shakti-primary) 25%, transparent)' }}>
                        {applied.includes(job.id) ? <><CheckCircle size={16} />Applied</> : <><ExternalLink size={16} />Fast Apply</>}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleSave(job.id); }}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--color-surface-container)', background: saved.includes(job.id) ? 'var(--color-shakti-error-container)' : 'var(--color-surface-lowest)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: saved.includes(job.id) ? 'var(--color-shakti-error)' : 'var(--color-outline)' }}>
                        <Bookmark size={16} fill={saved.includes(job.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* APPLY MODAL */}
      <AnimatePresence>
        {applyingJob && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyingJob(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(24,20,69,0.4)', backdropFilter: 'blur(6px)', zIndex: 1000 }} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--color-surface-lowest)', maxWidth: '520px', margin: '0 auto', borderRadius: '1.5rem 1.5rem 0 0', padding: '24px', zIndex: 1001, boxShadow: '0 -10px 40px rgba(24,20,69,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `color-mix(in srgb, ${applyingJob.color} 15%, transparent)` }}>
                    <Building2 size={20} style={{ color: applyingJob.color }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-shakti-primary)', margin: '0 0 2px' }}>Applying for</p>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{applyingJob.title}</h2>
                    <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{applyingJob.company}</p>
                  </div>
                </div>
                <button onClick={() => setApplyingJob(null)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-surface-low)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-outline)', flexShrink: 0 }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', display: 'block', marginBottom: '6px' }}>Why are you a fit?</label>
                  <textarea value={q1} onChange={(e) => setQ1(e.target.value)} rows={3} placeholder="Why are you the perfect match?" style={inputSt} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', display: 'block', marginBottom: '6px' }}>What makes you stand out?</label>
                  <textarea value={q2} onChange={(e) => setQ2(e.target.value)} rows={2} placeholder="A unique strength or experience" style={inputSt} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-outline)', display: 'block', marginBottom: '6px' }}>Resume</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', border: '2px dashed color-mix(in srgb, var(--color-shakti-primary) 30%, transparent)', background: 'color-mix(in srgb, var(--color-shakti-primary-container) 40%, transparent)', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-surface-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-shakti-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}><Upload size={18} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume ? resume.name : 'Upload resume'}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{resume ? 'Attached' : 'PDF format'}</p>
                    </div>
                    {resume && <CheckCircle size={18} style={{ color: 'var(--color-shakti-success)', flexShrink: 0 }} />}
                    <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setApplyingJob(null)} style={{ padding: '12px 16px', background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, color: 'var(--color-outline)', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
                <button onClick={handleConfirmApply} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-shakti-primary), var(--color-shakti-tertiary))', color: 'white', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'var(--font-sans)', boxShadow: '0 4px 12px color-mix(in srgb, var(--color-shakti-primary) 25%, transparent)' }}>
                  Submit application <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
