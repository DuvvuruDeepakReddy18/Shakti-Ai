import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Upload, FileText, Camera, Mic, Lock,
  ShieldCheck, Info, Loader2, CheckCircle2, Database,
  Fingerprint, Clock, FileKey,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TimeCapsule() {
  const navigate = useNavigate();
  const [evidenceType, setEvidenceType] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [sealedRecord, setSealedRecord] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
        preview: evidenceType === 'text' ? textContent.substring(0, 50) + '...' : selectedFile?.name,
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

  const TYPES = [
    { id: 'text', icon: FileText, label: 'Written log' },
    { id: 'photo', icon: Camera, label: 'Visual capture' },
    { id: 'audio', icon: Mic, label: 'Audio trace' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--color-surface)] shadow-inner flex items-center justify-center text-[var(--color-shakti-dark-text)] flex-shrink-0">
            <Fingerprint size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Digital Vault</h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">Immutable evidence hashing & verification.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-emerald-50/50 p-4 rounded-[1rem] mb-6 flex gap-3 items-start border border-emerald-100">
        <div className="w-9 h-9 rounded-full bg-[var(--color-surface-lowest)] shadow-sm flex items-center justify-center text-emerald-600 flex-shrink-0 border border-emerald-100">
          <ShieldCheck size={16} />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Records here create an <span className="text-emerald-700 font-semibold">immutable digital footprint</span>.
          Verification hashes ensure integrity and can be used in legal proceedings.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 bg-[var(--color-surface-lowest)] p-1.5 rounded-[1rem] border border-[var(--color-surface-highlight)] shadow-sm">
        {TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = evidenceType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setEvidenceType(type.id)}
              className={`py-3 px-2 rounded-[0.75rem] flex flex-col items-center justify-center gap-1.5 transition-all
                ${isActive ? 'bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white shadow-md' : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'}`}
            >
              <Icon size={18} />
              <span className="text-xs font-bold">{type.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={evidenceType} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 border border-[var(--color-surface-highlight)] shadow-sm mb-6"
      >
        {evidenceType === 'text' ? (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Describe the incident with as much detail as possible (date, time, involved parties)…"
            className="w-full h-44 px-5 py-4 rounded-[1rem] bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-outline)] focus:outline-none focus:border-[var(--color-shakti-dark-text)] focus:ring-1 focus:ring-[var(--color-shakti-dark-text)] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none leading-relaxed"
          />
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-44 rounded-[1rem] bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-surface-highlight)] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[var(--color-shakti-dark-text)] hover:bg-[var(--color-surface-lowest)] transition-all"
          >
            {selectedFile ? (
              <div className="text-center px-4">
                <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-[var(--color-text-primary)] max-w-xs truncate mx-auto">{selectedFile.name}</p>
                <p className="text-xs text-[var(--color-shakti-light-text)] mt-1">Tap to replace</p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-[1rem] bg-[var(--color-surface-lowest)] flex items-center justify-center text-[var(--color-shakti-dark-text)] shadow-sm border border-[var(--color-surface-highlight)]">
                  <Upload size={24} />
                </div>
                <p className="text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-wider">Upload {evidenceType === 'photo' ? 'image' : 'recording'}</p>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>
        )}

        <button
          onClick={handleSeal}
          disabled={isSealing || (evidenceType === 'text' && !textContent) || (evidenceType !== 'text' && !selectedFile)}
          className="w-full py-4 mt-6 rounded-[1rem] bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[#3A2D80] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[var(--color-shakti-dark-text)]/20 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {isSealing ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} className="text-emerald-400" />}
          {isSealing ? 'Sealing cryptographic block…' : 'Seal evidence & generate hash'}
        </button>
      </motion.div>

      <AnimatePresence>
        {sealedRecord && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-6 border border-emerald-100 shadow-sm relative"
          >
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={11} /> Immutable
              </span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Fingerprint size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Record sealed</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Evidence ID: {sealedRecord.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[var(--color-surface-low)] p-4 rounded-xl border border-[var(--color-surface-highlight)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <FileKey size={12} className="text-indigo-500" /> Verification hash
                  </p>
                  <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">SHA-256</span>
                </div>
                <p className="text-xs font-semibold text-[var(--color-text-primary)] font-mono break-all leading-relaxed p-3 bg-[var(--color-surface-lowest)] rounded-lg border border-[var(--color-surface-highlight)]">
                  {sealedRecord.hash}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[var(--color-surface-low)] p-3 rounded-xl border border-[var(--color-surface-highlight)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-lowest)] flex items-center justify-center text-[var(--color-text-secondary)] flex-shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-0.5">Timestamp</p>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">{new Date(sealedRecord.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-[var(--color-surface-low)] p-3 rounded-xl border border-[var(--color-surface-highlight)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-lowest)] flex items-center justify-center text-[var(--color-text-secondary)] flex-shrink-0">
                    <Database size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-0.5">Storage</p>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)]">Decentralized vault</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <Info size={14} className="text-indigo-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-indigo-700">Export this record to include in official reports.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
