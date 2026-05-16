import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Moon, Sun, Bell, Shield, Lock,
  Eye, Trash2, LogOut, ChevronRight, Globe,
  Volume2, Vibrate, HelpCircle, ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [sosSoundsOn, setSosSoundsOn] = useState(true);
  const [shakeDetection, setShakeDetection] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative w-12 h-6 rounded-full border-none cursor-pointer flex shrink-0 items-center px-1 transition-colors duration-300 ${checked ? 'bg-[var(--color-shakti-dark-text)]' : 'bg-[var(--color-surface-highlight)]'}`}
    >
      <motion.div
        initial={false}
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 bg-[var(--color-surface-lowest)] rounded-full shadow-sm"
      />
    </button>
  );

  const SettingRow = ({ icon: Icon, iconColor, iconBg, title, desc, right, onClick, danger }) => (
    <motion.button
      whileHover={onClick ? { scale: 0.99, backgroundColor: danger ? 'var(--color-shakti-safety-light)' : 'var(--color-surface)' } : {}}
      whileTap={onClick ? { scale: 0.97 } : {}}
      onClick={onClick}
      className={`w-full flex items-center text-left gap-4 p-3 rounded-xl transition-colors ${onClick ? 'cursor-pointer hover:bg-[var(--color-surface)]' : 'cursor-default'} ${danger ? 'hover:bg-[var(--color-shakti-safety-light)]' : ''}`}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner" style={{ backgroundColor: iconBg }}>
        <Icon size={18} style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold m-0 ${danger ? 'text-[var(--color-shakti-safety)]' : 'text-[var(--color-text-primary)]'}`}>{title}</p>
        {desc && <p className="text-xs font-medium text-[var(--color-text-secondary)] m-0 mt-0.5 truncate">{desc}</p>}
      </div>
      <div className="shrink-0 flex items-center">
        {right || (onClick && <ChevronRight size={18} className="text-[var(--color-shakti-light-text)]" />)}
      </div>
    </motion.button>
  );

  const Section = ({ label, delay, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 mb-4 shadow-sm border border-[var(--color-surface-highlight)]"
    >
      <p className="px-2 mb-3 text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-wider">{label}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]"
      >
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--color-surface)] shadow-inner flex items-center justify-center text-[var(--color-shakti-dark-text)] shrink-0">
            <Settings size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">Settings</h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed m-0">Personalize your SHAKTI experience.</p>
          </div>
        </div>
      </motion.div>

      {/* SECTIONS */}
      <Section label="Appearance" delay={0.05}>
        <SettingRow icon={Globe} iconColor="var(--color-shakti-info)" iconBg="var(--color-surface-highest)"
          title="App language" desc="English (US)" />
      </Section>

      <Section label="Notifications" delay={0.1}>
        <SettingRow icon={Bell} iconColor="var(--color-shakti-success)" iconBg="var(--color-shakti-success-light)"
          title="Push alerts" desc="Stay updated with real-time alerts"
          right={<Toggle checked={notifications} onChange={setNotifications} />} />
        <SettingRow icon={Volume2} iconColor="var(--color-shakti-secondary)" iconBg="var(--color-shakti-secondary-light)"
          title="SOS audio" desc="High-frequency alarm for emergencies"
          right={<Toggle checked={sosSoundsOn} onChange={setSosSoundsOn} />} />
      </Section>

      <Section label="Safety & Privacy" delay={0.15}>
        <SettingRow icon={Vibrate} iconColor="var(--color-shakti-safety)" iconBg="var(--color-shakti-safety-light)"
          title="Shake for SOS" desc="Triple shake to trigger emergency"
          right={<Toggle checked={shakeDetection} onChange={setShakeDetection} />} />
        <SettingRow icon={Shield} iconColor="var(--color-shakti-safety)" iconBg="var(--color-shakti-safety-light)"
          title="Trusted contacts" desc="Manage your circle of safety"
          onClick={() => navigate('/safety/contacts')} />
        <SettingRow icon={Lock} iconColor="var(--color-shakti-primary)" iconBg="var(--color-shakti-primary-light)"
          title="Locker security" desc="Manage your evidence vault PIN"
          onClick={() => navigate('/safety/evidence')} />
        <SettingRow icon={Eye} iconColor="var(--color-shakti-info)" iconBg="var(--color-surface-highest)"
          title="Data & privacy" desc="Control what you share with SHAKTI" />
      </Section>

      <Section label="Support" delay={0.2}>
        <SettingRow icon={HelpCircle} iconColor="var(--color-shakti-success)" iconBg="var(--color-shakti-success-light)"
          title="Help center" desc="FAQs and community support" />
      </Section>

      <Section label="Account" delay={0.25}>
        <SettingRow icon={LogOut} iconColor="var(--color-shakti-warning)" iconBg="var(--color-shakti-warning-light)"
          title="Sign out" desc="Securely exit your account" onClick={handleLogout} />
        <SettingRow icon={Trash2} iconColor="var(--color-shakti-safety)" iconBg="var(--color-shakti-safety-light)"
          title="Close account" desc="Permanently remove all your data"
          onClick={() => setShowModal(true)} danger />
      </Section>

      <div className="text-center py-8">
        <p className="text-[11px] font-bold text-[var(--color-shakti-light-text)] uppercase tracking-wider mb-1">SHAKTI AI Platform</p>
        <p className="text-[11px] text-[var(--color-outline)]">v1.2.0 · Made with 💜 for Her</p>
      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-[var(--color-surface-container)]/80 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-sm bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-8 z-[1001] shadow-xl border border-[var(--color-surface-highlight)]"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-[1.25rem] bg-[var(--color-shakti-safety-light)] flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <AlertTriangle size={32} className="text-[var(--color-shakti-safety)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">Are you sure?</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  Closing your account permanently deletes your safety history, evidence vault, and ShePoints. This action is irreversible.
                </p>
                <div className="flex flex-col gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-[1rem] bg-gradient-to-r from-[var(--color-shakti-safety)] to-rose-700 text-white text-sm font-bold glow-red transition-all shadow-sm"
                  >
                    Delete everything
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)} 
                    className="w-full py-3.5 rounded-[1rem] bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-sm font-bold border border-[var(--color-surface-highlight)] hover:bg-[var(--color-surface-lowest)] hover:text-[var(--color-text-primary)] transition-all"
                  >
                    Keep my account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
