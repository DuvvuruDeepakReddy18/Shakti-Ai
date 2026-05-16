import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, Mic, Video, Camera, FileText, Clock, MapPin, Shield, CheckCircle2, X, Play, Square, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const evidenceTypes = [
  { id: 'audio', icon: Mic, label: 'Audio', color: 'var(--color-shakti-primary)', bg: 'var(--color-shakti-primary-light)', actionText: 'Recording Audio' },
  { id: 'video', icon: Video, label: 'Video', color: 'var(--color-shakti-secondary)', bg: 'var(--color-shakti-secondary-light)', actionText: 'Recording Video' },
  { id: 'photo', icon: Camera, label: 'Photo', color: 'var(--color-shakti-info)', bg: 'var(--color-surface-highest)', actionText: 'Capturing Photo' },
  { id: 'note', icon: FileText, label: 'Note', color: 'var(--color-shakti-success)', bg: 'var(--color-shakti-success-light)', actionText: 'Writing Note' },
];

const INITIAL_EVIDENCE = [
  { 
    id: 1,
    type: 'video', 
    name: 'Dashcam_Backup_102', 
    duration: '0:10', 
    size: '1.2 MB', 
    location: 'Whitefield, Bangalore', 
    when: '2 hours ago',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  { 
    id: 2,
    type: 'audio', 
    name: 'Voice_Memo_004', 
    duration: '0:03', 
    size: '450 KB', 
    location: 'Indiranagar', 
    when: 'Yesterday',
    url: 'https://www.w3schools.com/html/horse.mp3'
  },
  { 
    id: 3,
    type: 'photo', 
    name: 'Street_evidence_img', 
    duration: '—', 
    size: '2.4 MB', 
    location: 'Koramangala', 
    when: 'Apr 18',
    url: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 4,
    type: 'note', 
    name: 'Incident_note_april18', 
    duration: '—', 
    size: '4 KB', 
    location: 'Koramangala', 
    when: 'Apr 18',
    content: 'Incident logged at 8:45 PM. A suspicious vehicle (KA-01-XX-1234) was following me near the tech park. I have recorded a short video as evidence.'
  },
];

const typeMeta = (t) => evidenceTypes.find(e => e.id === t);

export default function EvidenceLocker() {
  const [selected, setSelected] = useState(null);
  const [recentEvidence, setRecentEvidence] = useState(INITIAL_EVIDENCE);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingFile, setPlayingFile] = useState(null);

  useEffect(() => {
    let interval;
    if (selected && !isProcessing) {
      setRecordingTime(0);
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selected, isProcessing]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleStopAndSave = () => {
    if (!selected) return;
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const newEvidence = {
        id: Date.now(),
        type: selected,
        name: `${selected.charAt(0).toUpperCase() + selected.slice(1)}_evidence_${new Date().toISOString().slice(11,19).replace(/:/g, '')}`,
        duration: selected === 'audio' || selected === 'video' ? formatTime(recordingTime) : '—',
        size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
        location: 'Current Location',
        when: 'Just now',
        url: selected === 'video' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : 
             selected === 'audio' ? 'https://www.w3schools.com/html/horse.mp3' :
             selected === 'photo' ? 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80' : null,
        content: selected === 'note' ? 'New incident note created.' : null
      };
      
      setRecentEvidence([newEvidence, ...recentEvidence]);
      setSelected(null);
      setIsProcessing(false);
      setRecordingTime(0);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] pb-32 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent-blue)]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-shakti-primary)]/20 blur-[120px] pointer-events-none" />

      <div className="max-w-[960px] mx-auto px-4 pt-8 relative z-10">
        <Link to="/safety" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Safety
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--color-surface-lowest)]/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-surface-highlight)]"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-shakti-primary)] shadow-lg shadow-[var(--color-surface-dim)] flex-shrink-0 relative overflow-hidden border border-[var(--color-surface-highlight)]">
              <Lock size={28} strokeWidth={2} className="relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Evidence Locker</h1>
              <p className="text-base text-[var(--color-text-secondary)] flex items-center gap-2">
                <Shield size={16} className="text-[var(--color-shakti-success)]" />
                End-to-end encrypted vault. Only you have the keys.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Capture New Evidence */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4 ml-2 flex items-center gap-2">
            <Plus size={16} className="text-[var(--color-shakti-primary)]" /> Capture Evidence
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {evidenceTypes.map(t => {
              const Icon = t.icon;
              return (
                <motion.button
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={t.id}
                  onClick={() => { if(!selected) setSelected(t.id); }}
                  className={`bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 flex flex-col items-center justify-center gap-4 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[var(--color-surface-highlight)] group aspect-square ${
                    selected === t.id ? 'ring-2 ring-[var(--color-shakti-primary)] shadow-[var(--color-shakti-primary)]/10' : 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
                  }`}
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300" 
                    style={{ backgroundColor: t.bg }}
                  >
                    <Icon size={28} style={{ color: t.color }} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-bold text-[var(--color-text-primary)]">{t.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Recording Interface */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mb-10 overflow-hidden"
            >
              <div className="bg-[var(--color-inverse-surface)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center relative border border-[var(--color-surface-variant)] overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-shakti-secondary)]/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-shakti-primary)]/20 blur-[100px] rounded-full pointer-events-none" />
                
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center relative z-10 py-10">
                    <div className="w-24 h-24 rounded-full bg-[var(--color-shakti-success)]/20 flex items-center justify-center mb-6 border border-[var(--color-shakti-success)]/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] relative">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-t-2 border-[var(--color-shakti-success-light)] rounded-full" />
                      <CheckCircle2 size={48} className="text-[var(--color-shakti-success-light)]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Encrypting & Saving...</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">Adding watermark and securing file to vault.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center relative z-10 py-6">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-20" style={{ animationDuration: '2s' }}></div>
                      <div className="w-28 h-28 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(236,72,153,0.15)] relative z-10">
                        {(() => {
                          const SelectedIcon = typeMeta(selected).icon;
                          return <SelectedIcon size={48} className="text-pink-400" />;
                        })()}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                      {typeMeta(selected).actionText}
                    </h3>
                    
                    {(selected === 'audio' || selected === 'video') && (
                      <div className="text-6xl font-mono font-black text-white mb-10 tracking-wider">
                        {formatTime(recordingTime)}
                        <span className="block text-sm text-pink-400 font-sans tracking-normal mt-2 animate-pulse flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-pink-500"></span> REC
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={handleStopAndSave}
                      className="flex items-center justify-center gap-3 w-full max-w-[280px] mx-auto py-4 px-8 rounded-2xl bg-[var(--color-surface-lowest)] text-slate-900 text-base font-bold shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                      <Square size={18} className="text-pink-600 fill-pink-600" /> Stop & Secure
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Evidence List */}
        <div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4 ml-2 flex items-center gap-2">
            <Clock size={16} className="text-[var(--color-shakti-primary)]" /> Recent Evidence ({recentEvidence.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {recentEvidence.map((e, i) => {
                const meta = typeMeta(e.type);
                const Icon = meta.icon;
                return (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={e.id} 
                    onClick={() => setPlayingFile(e)}
                    className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-[var(--color-surface-highlight)] flex items-center gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[var(--color-shakti-primary-light)] transition-all group w-full text-left"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden bg-[var(--color-surface)]"
                    >
                      {/* Thumbnail Preview logic based on type */}
                      {e.type === 'photo' ? (
                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${e.url})` }} />
                      ) : e.type === 'video' ? (
                        <div className="absolute inset-0 bg-slate-200">
                          <video src={e.url} className="w-full h-full object-cover opacity-60" />
                        </div>
                      ) : (
                        <Icon size={24} style={{ color: meta.color }} strokeWidth={1.5} className="absolute z-10 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      
                      {/* Play overlay for media */}
                      {(e.type === 'video' || e.type === 'audio') && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Play size={20} className="text-white fill-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-[var(--color-text-primary)] truncate mb-1.5 group-hover:text-[var(--color-shakti-primary)] transition-colors">{e.name}</p>
                      <div className="flex items-center gap-3 text-xs font-medium text-[var(--color-text-secondary)]">
                        <span className="flex items-center gap-1"><Clock size={12} className="text-[var(--color-outline)]" /> {e.when}</span>
                        <span className="bg-[var(--color-surface-high)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-md">{e.size}{e.duration !== '—' && ` · ${e.duration}`}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Media Playback Modal */}
        <AnimatePresence>
          {playingFile && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[var(--color-shakti-dark-text)]/80 backdrop-blur-md" onClick={() => setPlayingFile(null)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-[var(--color-surface-lowest)] rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--color-surface-highlight)] flex items-center justify-between bg-[var(--color-surface-lowest)] z-10 relative">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: typeMeta(playingFile.type).bg }}>
                      {(() => {
                        const Icon = typeMeta(playingFile.type).icon;
                        return <Icon size={20} style={{ color: typeMeta(playingFile.type).color }} />;
                      })()}
                    </div>
                    <div className="truncate">
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] truncate">{playingFile.name}</h3>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)]">{playingFile.when} • {playingFile.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hidden sm:flex">
                      <Download size={18} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hidden sm:flex">
                      <Share2 size={18} />
                    </button>
                    <button onClick={() => setPlayingFile(null)} className="p-2 rounded-full hover:bg-[var(--color-shakti-safety-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-shakti-safety)] transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-[var(--color-surface)] relative flex items-center justify-center min-h-[300px]">
                  
                  {playingFile.type === 'video' && (
                    <video 
                      src={playingFile.url} 
                      controls 
                      autoPlay 
                      className="w-full max-h-[60vh] object-contain bg-black shadow-lg"
                    />
                  )}
                  
                  {playingFile.type === 'audio' && (
                    <div className="w-full max-w-md px-6 py-12 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-8 shadow-inner relative">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ repeat: Infinity, duration: 2 }} 
                          className="absolute inset-0 bg-purple-200 rounded-full opacity-50"
                        />
                        <Mic size={40} className="text-purple-600 relative z-10" />
                      </div>
                      <audio src={playingFile.url} controls autoPlay className="w-full" />
                    </div>
                  )}
                  
                  {playingFile.type === 'photo' && (
                    <img 
                      src={playingFile.url} 
                      alt={playingFile.name} 
                      className="w-full h-full object-contain max-h-[70vh]" 
                    />
                  )}
                  
                  {playingFile.type === 'note' && (
                    <div className="w-full p-8 max-w-2xl mx-auto h-full">
                      <div className="bg-[var(--color-surface-lowest)] p-8 rounded-2xl shadow-sm border border-[var(--color-surface-highlight)] min-h-[300px] font-mono text-[var(--color-text-primary)] leading-relaxed">
                        <p>{playingFile.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Location Overlay for media types */}
                  {playingFile.type !== 'note' && (
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium">
                      <MapPin size={12} className="text-pink-400" /> {playingFile.location}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
