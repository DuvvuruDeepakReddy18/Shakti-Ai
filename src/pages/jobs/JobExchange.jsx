import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, IndianRupee, Plus, X,
  Briefcase, Search, Filter, Star, User, Calendar,
  ChevronRight, MessageCircle, Heart, Zap, CheckCircle2,
  Phone, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

  // Post form state
  const [newJob, setNewJob] = useState({ title: '', desc: '', location: '', pay: '', category: 'Tutoring', time: '' });

  const filtered = DEMO_JOBS.filter(j => {
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
    toast.success('Task posted successfully!');
    setShowPostForm(false);
    setNewJob({ title: '', desc: '', location: '', pay: '', category: 'Tutoring', time: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a12] via-[#0d0b1a] to-[#0a0a12] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
      </button>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-7 md:p-9 mb-6 border border-white/[0.06]"
        style={{ background: 'linear-gradient(135deg, #1a1505 0%, #2a2010 50%, #1a1508 100%)' }}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-500/8 blur-[80px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 backdrop-blur-md flex items-center justify-center text-amber-300 flex-shrink-0 border border-amber-400/20 shadow-lg shadow-amber-500/10">
            <Briefcase size={30} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1.5 tracking-tight">Job Exchange</h1>
            <p className="text-amber-200/60 text-sm font-medium">Hyperlocal gigs & tasks from your community.</p>
          </div>
        </div>
        <div className="flex gap-3 mt-5 relative z-10">
          <div className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-white/60">{DEMO_JOBS.length} Active</div>
          <div className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-white/60">Hyderabad</div>
        </div>
      </motion.div>

      {/* Search & Post */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:border-amber-500/40 outline-none transition-all" />
        </div>
        <button onClick={() => setShowPostForm(!showPostForm)}
          className="px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 transition-all flex-shrink-0">
          <Plus size={16} /> Post
        </button>
      </div>

      {/* Post Form */}
      <AnimatePresence>
        {showPostForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Post a Task</h3>
                <button onClick={() => setShowPostForm(false)} className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition-all"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <input value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Task title *"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 outline-none focus:border-amber-500/40 transition-all" />
                <textarea value={newJob.desc} onChange={(e) => setNewJob({...newJob, desc: e.target.value})} placeholder="Description" rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 outline-none focus:border-amber-500/40 transition-all resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Location *"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 outline-none focus:border-amber-500/40 transition-all" />
                  <input value={newJob.pay} onChange={(e) => setNewJob({...newJob, pay: e.target.value})} placeholder="Pay (₹) *"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 outline-none focus:border-amber-500/40 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={newJob.category} onChange={(e) => setNewJob({...newJob, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm outline-none focus:border-amber-500/40 transition-all">
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-[#0d0b1a]">{c}</option>)}
                  </select>
                  <input value={newJob.time} onChange={(e) => setNewJob({...newJob, time: e.target.value})} placeholder="Time (e.g. 2 hrs/day)"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 outline-none focus:border-amber-500/40 transition-all" />
                </div>
                <button onClick={handlePost} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:shadow-lg transition-all">
                  Publish Task
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              activeCategory === c ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/60'
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filtered.map((job, i) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/[0.12] transition-all overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <img src={job.avatar} alt={job.poster} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-white/[0.08]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-bold text-white truncate">{job.title}</h3>
                    {job.verified && <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span>{job.poster}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {job.posted}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-base font-black text-amber-400">{job.pay}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15 flex items-center gap-1"><Tag size={9} /> {job.category}</span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] text-white/40 border border-white/[0.06] flex items-center gap-1"><MapPin size={9} /> {job.location}</span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] text-white/40 border border-white/[0.06] flex items-center gap-1"><Clock size={9} /> {job.time}</span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/[0.04] text-white/40 border border-white/[0.06] flex items-center gap-1"><User size={9} /> {job.applicants} applied</span>
              </div>

              {/* Expandable description */}
              <AnimatePresence>
                {expandedId === job.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="text-xs text-white/50 leading-relaxed mb-3 pl-1 border-l-2 border-amber-500/20 ml-1">{job.desc}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                <button onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  className="text-xs font-bold text-white/30 hover:text-amber-400 transition-colors flex items-center gap-1">
                  {expandedId === job.id ? 'Show less' : 'Details'} <ChevronRight size={12} className={`transition-transform ${expandedId === job.id ? 'rotate-90' : ''}`} />
                </button>
                <div className="flex-1" />
                <button onClick={() => handleSave(job.id)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                    saved.has(job.id) ? 'bg-rose-500/15 text-rose-400 border-rose-500/20' : 'bg-white/[0.04] text-white/30 border-white/[0.06] hover:text-rose-400'
                  }`}>
                  <Heart size={14} fill={saved.has(job.id) ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => applied.has(job.id) ? null : handleApply(job.id)} disabled={applied.has(job.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    applied.has(job.id) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/20'
                  }`}>
                  {applied.has(job.id) ? <><CheckCircle2 size={13} /> Applied</> : <><Zap size={13} /> Apply</>}
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={40} className="text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No tasks found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
