import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, ArrowLeft, Mic, Video, Camera, FileText, Clock, MapPin,
  Shield, CheckCircle2, X, Play, Square, Download, Share2, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#7c3aed';
const ACCENT_LIGHT = '#ec4899';

const evidenceTypes = [
  { id: 'audio', icon: Mic,      label: 'Audio', accent: '#7c3aed', bg: '#f5f3ff', actionText: 'Recording Audio' },
  { id: 'video', icon: Video,    label: 'Video', accent: '#ec4899', bg: '#fdf2f8', actionText: 'Recording Video' },
  { id: 'photo', icon: Camera,   label: 'Photo', accent: '#3b82f6', bg: '#eff6ff', actionText: 'Capturing Photo' },
  { id: 'note',  icon: FileText, label: 'Note',  accent: '#10b981', bg: '#ecfdf5', actionText: 'Writing Note' },
];

const INITIAL_EVIDENCE = [
  { id: 1, type: 'video', name: 'Dashcam_Backup_102', duration: '0:10', size: '1.2 MB', location: 'Whitefield, Bangalore', when: '2 hours ago', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, type: 'audio', name: 'Voice_Memo_004',     duration: '0:03', size: '450 KB', location: 'Indiranagar',         when: 'Yesterday',  url: 'https://www.w3schools.com/html/horse.mp3' },
  { id: 3, type: 'photo', name: 'Street_evidence_img',duration: '—',    size: '2.4 MB', location: 'Koramangala',         when: 'Apr 18',     url: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&w=800&q=80' },
  { id: 4, type: 'note',  name: 'Incident_note_april18',duration:'—',   size: '4 KB',   location: 'Koramangala',         when: 'Apr 18',     content: 'Incident logged at 8:45 PM. A suspicious vehicle (KA-01-XX-1234) was following me near the tech park. I have recorded a short video as evidence.' },
];

const typeMeta = (t) => evidenceTypes.find(e => e.id === t);

export default function EvidenceLocker() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [recentEvidence, setRecentEvidence] = useState(INITIAL_EVIDENCE);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingFile, setPlayingFile] = useState(null);

  useEffect(() => {
    let interval;
    if (selected && !isProcessing) {
      setRecordingTime(0);
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
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
        content: selected === 'note' ? 'New incident note created.' : null,
      };
      setRecentEvidence([newEvidence, ...recentEvidence]);
      setSelected(null);
      setIsProcessing(false);
      setRecordingTime(0);
    }, 1500);
  };

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.25rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
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
          position: 'relative', borderRadius: '1.5rem', padding: '24px',
          marginBottom: '18px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: `${ACCENT}1f`, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px ${ACCENT}40`,
          }}>
            <Lock size={24} color="white" strokeWidth={2.2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '23px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Evidence Locker</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={13} style={{ color: '#10b981' }} /> End-to-end encrypted vault. Only you have the keys.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CAPTURE TILES */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 10px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={12} style={{ color: ACCENT }} /> Capture Evidence
          </h3>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tap to start</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {evidenceTypes.map(t => {
            const Icon = t.icon;
            const isSelected = selected === t.id;
            return (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => { if (!selected) setSelected(t.id); }}
                style={{
                  background: 'var(--color-surface-lowest)',
                  borderRadius: '1rem', padding: '14px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  border: `1px solid ${isSelected ? t.accent : 'rgba(24,20,69,0.05)'}`,
                  boxShadow: isSelected ? `0 4px 14px ${t.accent}22` : '0 1px 6px rgba(24,20,69,0.03)',
                  cursor: selected && !isSelected ? 'not-allowed' : 'pointer',
                  opacity: selected && !isSelected ? 0.5 : 1,
                  transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: t.bg, color: t.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-shakti-dark-text)' }}>{t.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* RECORDING INTERFACE (light) */}
      <AnimatePresence>
        {selected && (() => {
          const meta = typeMeta(selected);
          const SelectedIcon = meta.icon;
          return (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              style={{ overflow: 'hidden', marginBottom: '18px' }}
            >
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'var(--color-surface-lowest)',
                borderRadius: '1.5rem', padding: '36px 24px',
                textAlign: 'center', boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
                border: `1px solid ${meta.accent}33`,
              }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-30px', width: '180px', height: '180px', background: `${meta.accent}18`, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
                {isProcessing ? (
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                    <div style={{
                      width: '84px', height: '84px', borderRadius: '50%',
                      background: '#ecfdf5', border: '1px solid rgba(16,185,129,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '18px', position: 'relative',
                    }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#10b981' }}
                      />
                      <CheckCircle2 size={40} style={{ color: '#10b981' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: '0 0 6px' }}>Encrypting & Saving…</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0 }}>Adding watermark and securing file to vault.</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: meta.accent, opacity: 0.25 }}
                      />
                      <div style={{
                        width: '96px', height: '96px', borderRadius: '50%',
                        background: meta.bg, border: `2px solid ${meta.accent}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', zIndex: 1,
                      }}>
                        <SelectedIcon size={40} style={{ color: meta.accent }} />
                      </div>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: '0 0 10px' }}>
                      {meta.actionText}
                    </h3>

                    {(selected === 'audio' || selected === 'video') && (
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '40px', fontWeight: 900, color: 'var(--color-shakti-dark-text)', fontFamily: 'monospace', letterSpacing: '0.05em', lineHeight: 1 }}>
                          {formatTime(recordingTime)}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4 }}
                            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}
                          />
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>REC</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleStopAndSave}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        width: '100%', maxWidth: '280px',
                        padding: '13px 20px', borderRadius: '12px',
                        background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}dd)`,
                        color: 'white', border: 'none',
                        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: `0 4px 14px ${meta.accent}40`,
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      <Square size={16} fill="currentColor" /> Stop & Secure
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* RECENT EVIDENCE */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 10px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} style={{ color: ACCENT }} /> Recent Evidence
          </h3>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {recentEvidence.length} item{recentEvidence.length === 1 ? '' : 's'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          <AnimatePresence>
            {recentEvidence.map((e, i) => {
              const meta = typeMeta(e.type);
              const Icon = meta.icon;
              return (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  key={e.id}
                  onClick={() => setPlayingFile(e)}
                  style={{
                    ...cardStyle, padding: '14px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    border: '1px solid rgba(24,20,69,0.04)',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e2) => { e2.currentTarget.style.boxShadow = '0 6px 18px rgba(24,20,69,0.06)'; e2.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e2) => { e2.currentTarget.style.boxShadow = '0 1px 6px rgba(24,20,69,0.03)'; e2.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: meta.bg, color: meta.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, position: 'relative', overflow: 'hidden'
                  }}>
                    {e.type === 'photo' ? (
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${e.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    ) : (
                      <Icon size={22} strokeWidth={2} />
                    )}
                    {(e.type === 'video' || e.type === 'audio') && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={16} fill="currentColor" style={{ color: meta.accent }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-outline)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {e.when}
                      </span>
                      <span style={{
                        padding: '2px 7px', borderRadius: '5px',
                        background: 'var(--color-surface-low)', color: 'var(--color-outline)',
                        fontWeight: 600, border: '1px solid rgba(24,20,69,0.04)'
                      }}>
                        {e.size}{e.duration !== '—' && ` · ${e.duration}`}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* PLAYBACK MODAL */}
      <AnimatePresence>
        {playingFile && (() => {
          const meta = typeMeta(playingFile.type);
          const Icon = meta.icon;
          return (
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(24,20,69,0.55)', backdropFilter: 'blur(8px)' }}
              onClick={() => setPlayingFile(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%', maxWidth: '720px', maxHeight: '90vh',
                  background: 'var(--color-surface-lowest)',
                  borderRadius: '1.5rem', overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(24,20,69,0.20)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{
                  padding: '14px 18px', borderBottom: '1px solid var(--color-surface-low)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: meta.bg, color: meta.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playingFile.name}</h3>
                      <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: '2px 0 0' }}>{playingFile.when} · {playingFile.size}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <IconButton><Download size={16} /></IconButton>
                    <IconButton><Share2 size={16} /></IconButton>
                    <IconButton onClick={() => setPlayingFile(null)}><X size={18} /></IconButton>
                  </div>
                </div>
                <div style={{ flex: 1, overflow: 'auto', background: 'var(--color-surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '320px', position: 'relative' }}>
                  {playingFile.type === 'video' && (
                    <video src={playingFile.url} controls autoPlay style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', background: '#000' }} />
                  )}
                  {playingFile.type === 'audio' && (
                    <div style={{ width: '100%', maxWidth: '380px', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                      <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: meta.accent, opacity: 0.3 }}
                        />
                        <div style={{
                          position: 'absolute', inset: '8px', borderRadius: '50%',
                          background: meta.bg, color: meta.accent,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `1px solid ${meta.accent}33`
                        }}>
                          <Mic size={32} />
                        </div>
                      </div>
                      <audio src={playingFile.url} controls autoPlay style={{ width: '100%' }} />
                    </div>
                  )}
                  {playingFile.type === 'photo' && (
                    <img src={playingFile.url} alt={playingFile.name} style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '70vh' }} />
                  )}
                  {playingFile.type === 'note' && (
                    <div style={{ width: '100%', padding: '24px', maxWidth: '640px' }}>
                      <div style={{
                        background: 'var(--color-surface-lowest)', padding: '20px',
                        borderRadius: '14px', border: '1px solid rgba(24,20,69,0.05)',
                        fontFamily: 'monospace', fontSize: '13px',
                        color: 'var(--color-shakti-dark-text)', lineHeight: 1.7,
                        minHeight: '240px'
                      }}>
                        {playingFile.content}
                      </div>
                    </div>
                  )}
                  {playingFile.type !== 'note' && (
                    <div style={{
                      position: 'absolute', bottom: '12px', left: '12px',
                      padding: '6px 12px', borderRadius: '10px',
                      background: 'rgba(24,20,69,0.85)', backdropFilter: 'blur(6px)',
                      color: 'white', fontSize: '11px', fontWeight: 600,
                      display: 'inline-flex', alignItems: 'center', gap: '5px'
                    }}>
                      <MapPin size={11} style={{ color: ACCENT_LIGHT }} /> {playingFile.location}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

function IconButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '34px', height: '34px', borderRadius: '10px',
        background: 'var(--color-surface-low)', border: 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-outline)', cursor: 'pointer', transition: 'background 0.15s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-high)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface-low)'}
    >
      {children}
    </button>
  );
}
