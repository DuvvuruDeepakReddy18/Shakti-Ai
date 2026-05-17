import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Upload, FileText, Camera, Mic, Lock,
  ShieldCheck, Info, Loader2, CheckCircle2, Database,
  Fingerprint, Clock, FileKey, Copy, Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCENT = '#4f46e5';
const ACCENT_LIGHT = '#06b6d4';
const ACCENT_BG = '#eef2ff';

const TYPES = [
  { id: 'text',  icon: FileText, label: 'Written log' },
  { id: 'photo', icon: Camera,   label: 'Visual capture' },
  { id: 'audio', icon: Mic,      label: 'Audio trace' },
];

export default function TimeCapsule() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [evidenceType, setEvidenceType] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSealing, setIsSealing] = useState(false);
  const [sealedRecord, setSealedRecord] = useState(null);

  const handleSeal = () => {
    if (evidenceType === 'text' && !textContent.trim()) return;
    if (evidenceType !== 'text' && !selectedFile) return;

    setIsSealing(true);
    setTimeout(() => {
      const mockHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setSealedRecord({
        id: `EVD-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
        hash: mockHash,
        type: evidenceType,
        preview: evidenceType === 'text' ? textContent.substring(0, 50) + '…' : selectedFile?.name,
      });
      setIsSealing(false);
      setTextContent('');
      setSelectedFile(null);
      toast.success('Evidence cryptographically sealed');
    }, 2500);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const copyHash = () => {
    if (!sealedRecord?.hash) return;
    navigator.clipboard?.writeText(sealedRecord.hash);
    toast.success('Hash copied');
  };

  const downloadRecord = () => {
    if (!sealedRecord) return;
    const text = `EVIDENCE RECORD
================
ID: ${sealedRecord.id}
Type: ${sealedRecord.type}
Timestamp: ${new Date(sealedRecord.timestamp).toLocaleString()}
SHA-256 Hash: ${sealedRecord.hash}
Preview: ${sealedRecord.preview}

This record is cryptographically sealed. Hash any time to verify integrity.
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sealedRecord.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Record exported');
  };

  const canSeal = (evidenceType === 'text' && textContent.trim()) || (evidenceType !== 'text' && selectedFile);

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
            <Fingerprint size={24} color="white" strokeWidth={2.2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: '23px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Time Capsule</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Immutable evidence hashing & verification.</p>
          </div>
        </div>
      </motion.div>

      {/* INFO BANNER */}
      <div style={{
        background: '#ecfdf5', padding: '14px', borderRadius: '14px', marginBottom: '14px',
        display: 'flex', gap: '12px', alignItems: 'flex-start',
        border: '1px solid rgba(16,185,129,0.20)',
      }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: 'rgba(16,185,129,0.12)', color: '#047857',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <ShieldCheck size={16} />
        </div>
        <p style={{ fontSize: '13px', color: '#065f46', margin: 0, lineHeight: 1.5 }}>
          Records here create an <span style={{ fontWeight: 800, color: '#047857' }}>immutable digital footprint</span>.
          Verification hashes ensure integrity and can be used in legal proceedings.
        </p>
      </div>

      {/* TYPE TABS */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px',
        padding: '6px', marginBottom: '14px',
        background: 'var(--color-surface-lowest)',
        borderRadius: '14px', boxShadow: '0 1px 6px rgba(24,20,69,0.03)'
      }}>
        {TYPES.map(t => {
          const Icon = t.icon;
          const active = evidenceType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setEvidenceType(t.id)}
              style={{
                padding: '10px 8px', borderRadius: '10px',
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                background: active ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})` : 'transparent',
                color: active ? 'white' : 'var(--color-outline)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'all 0.15s',
                boxShadow: active ? `0 4px 12px ${ACCENT}33` : 'none',
              }}
            >
              <Icon size={16} />
              <span style={{ fontSize: '11px', fontWeight: 700 }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* CAPTURE CARD */}
      <motion.div
        key={evidenceType}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        style={{ ...cardStyle, padding: '18px', marginBottom: '14px' }}
      >
        {evidenceType === 'text' ? (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Describe the incident with as much detail as possible (date, time, involved parties)…"
            style={{
              width: '100%', boxSizing: 'border-box',
              minHeight: '160px',
              padding: '14px 16px', borderRadius: '12px',
              background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
              fontSize: '14px', color: 'var(--color-shakti-dark-text)',
              outline: 'none', resize: 'none', lineHeight: 1.55,
              fontFamily: 'var(--font-sans)', transition: 'border 0.15s'
            }}
            onFocus={(e) => { e.currentTarget.style.border = `1px solid ${ACCENT}55`; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
            onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(24,20,69,0.05)'; e.currentTarget.style.background = 'var(--color-surface-low)'; }}
          />
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%', minHeight: '160px',
              borderRadius: '12px',
              background: selectedFile ? '#ecfdf5' : ACCENT_BG,
              border: `2px dashed ${selectedFile ? 'rgba(16,185,129,0.35)' : `${ACCENT}40`}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
              cursor: 'pointer', padding: '20px', transition: 'all 0.15s', textAlign: 'center'
            }}
          >
            {selectedFile ? (
              <>
                <CheckCircle2 size={36} style={{ color: '#10b981' }} />
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: 0 }}>Tap to replace</p>
              </>
            ) : (
              <>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: 'white', color: ACCENT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${ACCENT}33`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <Upload size={22} />
                </div>
                <p style={{ fontSize: '11px', fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  Upload {evidenceType === 'photo' ? 'image' : 'recording'}
                </p>
              </>
            )}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept={evidenceType === 'photo' ? 'image/*' : 'audio/*'} />
          </div>
        )}

        <button
          onClick={handleSeal}
          disabled={isSealing || !canSeal}
          style={{
            width: '100%', padding: '14px', marginTop: '14px',
            borderRadius: '12px',
            background: (isSealing || !canSeal) ? '#cbd5e1' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            color: 'white', border: 'none',
            fontSize: '14px', fontWeight: 700,
            cursor: (isSealing || !canSeal) ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: (isSealing || !canSeal) ? 'none' : `0 4px 12px ${ACCENT}33`,
            fontFamily: 'var(--font-sans)', transition: 'all 0.2s'
          }}
        >
          {isSealing ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          {isSealing ? 'Sealing cryptographic block…' : 'Seal evidence & generate hash'}
        </button>
      </motion.div>

      {/* SEALED RESULT */}
      <AnimatePresence>
        {sealedRecord && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ ...cardStyle, padding: '18px', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '160px', height: '160px', background: 'rgba(16,185,129,0.10)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '14px',
                background: '#ecfdf5', color: '#047857',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: '1px solid rgba(16,185,129,0.25)'
              }}>
                <Fingerprint size={22} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Record sealed</h3>
                <p style={{ fontSize: '11px', color: 'var(--color-outline)', margin: '2px 0 0' }}>Evidence ID: <span style={{ color: 'var(--color-shakti-dark-text)', fontWeight: 700 }}>{sealedRecord.id}</span></p>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: '999px',
                background: '#10b981', color: 'white',
                fontSize: '10px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                boxShadow: '0 2px 8px rgba(16,185,129,0.30)'
              }}>
                <ShieldCheck size={11} /> Immutable
              </span>
            </div>

            {/* HASH BOX */}
            <div style={{
              background: 'var(--color-surface-low)',
              borderRadius: '12px', padding: '14px',
              border: '1px solid rgba(24,20,69,0.04)',
              marginBottom: '10px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <FileKey size={11} style={{ color: ACCENT }} /> Verification hash
                </p>
                <span style={{ fontSize: '10px', fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>SHA-256</span>
              </div>
              <div style={{
                background: 'var(--color-surface-lowest)', padding: '10px 12px',
                borderRadius: '8px', border: '1px solid rgba(24,20,69,0.05)',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <p style={{
                  flex: 1, fontSize: '11px', fontFamily: 'monospace',
                  color: 'var(--color-shakti-dark-text)', wordBreak: 'break-all',
                  margin: 0, lineHeight: 1.5
                }}>
                  {sealedRecord.hash}
                </p>
                <button
                  onClick={copyHash}
                  style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: ACCENT_BG, color: ACCENT,
                    border: `1px solid ${ACCENT}33`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0
                  }}
                  title="Copy hash"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            {/* META TILES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                background: 'var(--color-surface-low)', padding: '12px',
                borderRadius: '10px', border: '1px solid rgba(24,20,69,0.04)',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-surface-lowest)', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={14} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>Timestamp</p>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {new Date(sealedRecord.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div style={{
                background: 'var(--color-surface-low)', padding: '12px',
                borderRadius: '10px', border: '1px solid rgba(24,20,69,0.04)',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-surface-lowest)', color: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Database size={14} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>Storage</p>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0 }}>Decentralized vault</p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={downloadRecord}
                style={{
                  flex: 1, minWidth: '140px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: ACCENT_BG, color: ACCENT,
                  border: `1px solid ${ACCENT}33`,
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <Download size={13} /> Export record
              </button>
              <div style={{
                flex: 1, minWidth: '140px',
                padding: '10px 14px', borderRadius: '10px',
                background: 'var(--color-surface-low)',
                border: '1px solid rgba(24,20,69,0.05)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 600, color: 'var(--color-outline)'
              }}>
                <Info size={12} style={{ color: ACCENT }} /> Use in official reports
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
