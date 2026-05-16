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
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-8 shadow-sm border border-white/40"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-[1.25rem] bg-cyan-50 shadow-inner flex items-center justify-center text-cyan-600 flex-shrink-0">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-[var(--color-text-primary)] mb-1 tracking-tight">Learning Center</h1>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Hand-picked premium courses to level up your skills.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide px-1">
        {tracks.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTrack(t.id)}
            className={`px-6 py-3 rounded-[1.25rem] text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-2 ${
              activeTrack === t.id
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 scale-105'
                : 'bg-[var(--color-surface-lowest)] text-[var(--color-text-primary)] border border-[var(--color-surface-highlight)] hover:border-cyan-200 hover:shadow-md'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {visible.map((c, i) => {
          const isUnlocked = unlockedCourses.includes(c.title);
          return (
            <motion.a
              key={i}
              href={c.link}
              onClick={(e) => handleCourseClick(e, c)}
              whileHover={{ y: -5 }}
              className="bg-[var(--color-surface-lowest)] rounded-[1.75rem] p-6 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden flex flex-col h-full border border-white/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div
                  className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 shadow-inner transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${c.color}15` }}
                >
                  {c.paid && !isUnlocked ? (
                    <Lock size={24} style={{ color: c.color }} />
                  ) : (
                    <PlayCircle size={24} style={{ color: c.color }} />
                  )}
                </div>
                
                {c.paid && !isUnlocked ? (
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">Premium</span>
                ) : c.paid && isUnlocked ? (
                  <span className="px-2.5 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">Unlocked</span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-[11px] font-extrabold uppercase tracking-wider shadow-sm">Free</span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 leading-tight group-hover:text-cyan-600 transition-colors">{c.title}</h3>
                <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">{c.provider}</p>
              </div>
              
              <div className="pt-4 border-t border-[var(--color-surface-highlight)] flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)] mt-auto">
                <span className="flex items-center gap-1.5 bg-[var(--color-surface-low)] px-2.5 py-1.5 rounded-lg">
                  <Clock size={14} className="text-[var(--color-outline)]" /> {c.duration}
                </span>
                <span className={`flex items-center gap-1 transition-colors ${c.paid && !isUnlocked ? 'text-purple-600' : 'text-cyan-600'}`}>
                  {c.paid && !isUnlocked ? <><QrCode size={14} /> Unlock</> : <><ExternalLink size={14} /> Open</>}
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/30">
            <Award size={32} className="text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold mb-2">Earn certificates as you learn</h2>
            <p className="text-cyan-50 text-sm font-medium">Complete a track to unlock a verified SHAKTI badge for your professional profile.</p>
          </div>
          <button className="px-6 py-3 bg-[var(--color-surface-lowest)] text-cyan-600 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap">
            View Badges <ChevronRight size={16} />
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

