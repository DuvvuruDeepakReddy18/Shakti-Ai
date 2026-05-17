import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowLeft, PlayCircle, Clock, ExternalLink, Award, QrCode, Lock, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const tracks = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'mobile', label: 'Mobile' },
];

const courses = [
  { track: 'frontend', title: 'React in 100 Mins', provider: 'Fireship', duration: '1h 40m', paid: false, link: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', color: '#3B82F6' },
  { track: 'frontend', title: 'Tailwind From Scratch', provider: 'freeCodeCamp', duration: '5h 20m', paid: false, link: 'https://www.youtube.com/watch?v=UBOj6rqRUME', color: '#0891b2' },
  { track: 'backend', title: 'Node.js Crash Course', provider: 'Net Ninja', duration: '4h 12m', paid: false, link: 'https://www.youtube.com/watch?v=zb3Qk8SG5Ms', color: '#10B981' },
  { track: 'backend', title: 'Postgres for Devs', provider: 'Fireship', duration: '12h', paid: true, link: 'https://www.youtube.com/watch?v=1bMcsZp801w', color: '#7c3aed' },
  { track: 'ai', title: 'ML for Beginners', provider: 'Microsoft', duration: '10h', paid: false, link: 'https://www.youtube.com/watch?v=i_LwzRVP7bg', color: '#db2777' },
  { track: 'ai', title: 'LLM Engineering', provider: 'DeepLearning.AI', duration: '6h', paid: true, link: 'https://www.youtube.com/watch?v=zjkBMFhNj_g', color: '#F59E0B' },
  { track: 'mobile', title: 'Flutter Build-Along', provider: 'YouTube', duration: '8h', paid: false, link: 'https://www.youtube.com/watch?v=x0uigEPIWCE', color: '#EF4444' },
];

export default function LearningCenter() {
  const [activeTrack, setActiveTrack] = useState('frontend');
  const [selectedPaidCourse, setSelectedPaidCourse] = useState(null);
  const [unlockedCourses, setUnlockedCourses] = useState([]);
  const [scanning, setScanning] = useState(false);

  const visible = courses.filter(c => c.track === activeTrack);

  const handleCourseClick = (e, c) => {
    e.preventDefault();
    if (!c.paid || unlockedCourses.includes(c.title)) {
      window.open(c.link, '_blank');
    } else {
      setSelectedPaidCourse(c);
      setScanning(false);
    }
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setUnlockedCourses([...unlockedCourses, selectedPaidCourse.title]);
      setScanning(false);
      setSelectedPaidCourse(null);
      // Immediately open the newly unlocked course in a new tab
      if (selectedPaidCourse && selectedPaidCourse.link) {
        window.open(selectedPaidCourse.link, '_blank');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-outline)] hover:text-[var(--color-shakti-dark-text)] transition-colors mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 mb-5 bg-[var(--color-surface-lowest)]"
        style={{ boxShadow: '0 2px 16px rgba(24,20,69,0.04)' }}>
        <div className="absolute pointer-events-none" style={{ top: '-60px', right: '-40px', width: '200px', height: '200px', background: 'rgba(2,132,199,0.14)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #0284c7, #06b6d4)', boxShadow: '0 6px 20px rgba(2,132,199,0.34)' }}>
            <BookOpen size={24} color="white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[26px] font-extrabold tracking-tight mb-0.5" style={{ color: 'var(--color-shakti-dark-text)', fontFamily: 'var(--font-display)' }}>Learning Center</h1>
            <p className="text-sm font-medium" style={{ color: 'var(--color-outline)' }}>Hand-picked premium courses to level up your skills.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2.5 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {tracks.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTrack(t.id)}
            className={`px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTrack === t.id
                ? 'text-white scale-[1.02]'
                : 'bg-[var(--color-surface-lowest)] text-[var(--color-shakti-dark-text)] hover:scale-[1.02]'
            }`}
            style={activeTrack === t.id
              ? { background: 'linear-gradient(135deg, #0284c7, #06b6d4)', boxShadow: '0 6px 18px rgba(2,132,199,0.35)' }
              : { boxShadow: '0 1px 6px rgba(24,20,69,0.04)', border: '1px solid rgba(24,20,69,0.06)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {visible.map((c, i) => {
          const isUnlocked = unlockedCourses.includes(c.title);
          const tagMeta = c.paid && !isUnlocked
            ? { bg: '#f5f3ff', text: '#7c3aed', border: 'rgba(124,58,237,0.22)', label: 'Premium' }
            : c.paid && isUnlocked
              ? { bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.22)', label: 'Unlocked' }
              : { bg: '#ecfeff', text: '#0e7490', border: 'rgba(6,182,212,0.22)', label: 'Free' };
          return (
            <motion.a
              key={i}
              href={c.link}
              onClick={(e) => handleCourseClick(e, c)}
              whileHover={{ y: -2 }}
              className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 transition-all group cursor-pointer flex flex-col h-full"
              style={{ boxShadow: '0 1px 6px rgba(24,20,69,0.03)', border: '1px solid rgba(24,20,69,0.04)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: '44px', height: '44px', backgroundColor: `${c.color}15`, border: `1px solid ${c.color}22` }}
                >
                  {c.paid && !isUnlocked ? (
                    <Lock size={20} style={{ color: c.color }} />
                  ) : (
                    <PlayCircle size={20} style={{ color: c.color }} />
                  )}
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider" style={{ background: tagMeta.bg, color: tagMeta.text, border: `1px solid ${tagMeta.border}` }}>
                  {tagMeta.label}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-[var(--color-shakti-dark-text)] mb-1 leading-tight">{c.title}</h3>
                <p className="text-[12px] text-[var(--color-outline)] mb-3">{c.provider}</p>
              </div>

              <div className="pt-3 flex items-center justify-between text-[11px] font-bold mt-auto" style={{ borderTop: '1px solid var(--color-surface-low)' }}>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: 'var(--color-surface-low)', color: 'var(--color-outline)' }}>
                  <Clock size={12} /> {c.duration}
                </span>
                <span className="inline-flex items-center gap-1" style={{ color: c.paid && !isUnlocked ? '#7c3aed' : '#0e7490' }}>
                  {c.paid && !isUnlocked ? <><QrCode size={12} /> Unlock</> : <><ExternalLink size={12} /> Open</>}
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>

      <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)', boxShadow: '0 6px 24px rgba(2,132,199,0.25)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30" style={{ width: '48px', height: '48px' }}>
            <Award size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold mb-0.5">Earn certificates as you learn</h2>
            <p className="text-cyan-50 text-[12px] font-medium">Complete a track to unlock a verified SHAKTI badge.</p>
          </div>
          <button className="px-3.5 py-2 bg-white text-[12px] rounded-xl font-bold transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0" style={{ color: '#0284c7' }}>
            Badges <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedPaidCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => !scanning && setSelectedPaidCourse(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[var(--color-surface-lowest)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex justify-end mb-2 relative z-10">
                 <button onClick={() => !scanning && setSelectedPaidCourse(null)} disabled={scanning} className="p-2 rounded-full bg-[var(--color-surface-low)] text-[var(--color-outline)] hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50">
                   <X size={18} />
                 </button>
              </div>

              {scanning ? (
                <div className="flex flex-col items-center justify-center py-8">
                   <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6 relative">
                     <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
                     <CheckCircle2 size={48} className="text-green-500 relative z-10" />
                   </div>
                   <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Unlocking Course...</h3>
                   <p className="text-sm font-medium text-[var(--color-text-secondary)]">Payment verified. Opening course...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-purple-50 flex items-center justify-center text-purple-600 mb-4 shadow-inner border border-purple-100">
                    <Lock size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{selectedPaidCourse.title}</h3>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-8">Scan the QR code to purchase and unlock this premium course.</p>
                  
                  <div className="bg-[var(--color-surface-lowest)] p-4 rounded-3xl shadow-sm border border-[var(--color-surface-highlight)] mb-8 inline-block shadow-purple-500/5">
                    <div className="grid grid-cols-5 gap-1.5 w-32 h-32">
                      {[...Array(25)].map((_, i) => (
                        <div key={i} className={`rounded-[4px] ${Math.random() > 0.4 ? 'bg-purple-900' : 'bg-purple-100'}`}></div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSimulateScan}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md shadow-purple-500/20 hover:shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <QrCode size={18} /> Simulate Scan to Unlock
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

