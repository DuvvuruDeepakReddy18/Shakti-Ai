import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Edit3, Save, Mail, Phone, MapPin,
  Briefcase, Award, Flame, Trophy, Star,
  Sparkles, Gift, Shield, ArrowRight,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useHealthStore from '../../store/healthStore';
import { getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ACHIEVEMENTS = [
  { id: 1, title: 'First Step', desc: 'Completed onboarding', emoji: '🌱', earned: true, bg: 'bg-emerald-50' },
  { id: 2, title: 'Safe Traveler', desc: 'Used Safety Map 5x', emoji: '🛡️', earned: true, bg: 'bg-pink-50' },
  { id: 3, title: 'Wellness Warrior', desc: '7-day mood streak', emoji: '🧘‍♀️', earned: true, bg: 'bg-purple-50' },
  { id: 4, title: 'Helping Hand', desc: 'Volunteered once', emoji: '🤝', earned: false, bg: 'bg-amber-50' },
  { id: 5, title: 'Tech Titan', desc: 'Built 10 projects', emoji: '💻', earned: false, bg: 'bg-blue-50' },
  { id: 6, title: 'Community Star', desc: '50 forum likes', emoji: '⭐', earned: false, bg: 'bg-amber-50' },
];

export default function ProfilePage() {
  const { userProfile, updateUserProfile } = useAuthStore();
  const { wellnessStreak } = useHealthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: userProfile?.name || '', phone: userProfile?.phone || '',
    mode: userProfile?.mode || 'student', skills: userProfile?.skills || [],
    interests: userProfile?.interests || [], isVolunteer: userProfile?.isVolunteer || false,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await updateUserProfile(form); toast.success('Profile updated'); setEditing(false); }
    catch { toast.error('Update failed'); }
    setSaving(false);
  };

  const earnedCount = ACHIEVEMENTS.filter((a) => a.earned).length;
  const points = userProfile?.shePoints || 0;
  const progress = Math.min((points / 1000) * 100, 100);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]"
      >
        <div className="absolute -top-16 -right-10 w-48 h-48 bg-gradient-to-br from-[var(--color-accent-blue)]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-8 w-40 h-40 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="" className="w-20 h-20 rounded-[1.25rem] object-cover border-4 border-[var(--color-surface-lowest)] glow-purple" />
            ) : (
              <div className="w-20 h-20 rounded-[1.25rem] bg-gradient-to-br from-[var(--color-shakti-gradient-start)] to-[var(--color-shakti-gradient-end)] flex items-center justify-center text-white text-2xl font-bold border-4 border-[var(--color-surface-lowest)] glow-purple">
                {getInitials(userProfile?.name || 'User')}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[var(--color-shakti-success)] border-[3px] border-[var(--color-surface-lowest)] rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-[var(--color-surface-lowest)] rounded-full" />
            </span>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold font-display text-[var(--color-text-primary)] mb-1">{userProfile?.name || 'SHAKTI Warrior'}</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">{userProfile?.email}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-bold text-purple-600">{userProfile?.mode || 'Beginner'}</span>
              {userProfile?.isVolunteer && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Shield size={12} /> Volunteer
                </span>
              )}
            </div>
            <button onClick={() => editing ? save() : setEditing(true)} disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[var(--color-shakti-dark-text)] to-[var(--color-shakti-secondary)] text-white text-sm font-bold flex items-center gap-2 mx-auto glow-purple transition-opacity disabled:opacity-60"
            >
              {editing ? <><Save size={16} /> {saving ? 'Saving…' : 'Save'}</> : <><Edit3 size={16} /> Edit profile</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* POINTS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 mb-4 shadow-sm border border-[var(--color-surface-highlight)] relative overflow-hidden"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[var(--color-shakti-dark-text)]">
              <Sparkles size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Current balance</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] leading-none m-0">
              {points.toLocaleString()} <span className="text-sm font-medium text-[var(--color-text-secondary)]">Pts</span>
            </h2>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-1">
              <Trophy size={14} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-800">{userProfile?.sheLevel || 'Bronze'} tier</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] m-0">{Math.max(1000 - points, 0)} pts to next</p>
          </div>
        </div>
        <div className="w-full h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-[var(--color-shakti-dark-text)] to-[var(--color-shakti-secondary)] rounded-full" 
          />
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} 
          className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-sm border border-[var(--color-surface-highlight)] text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-shakti-safety)] to-orange-500 flex items-center justify-center mx-auto mb-2 glow-red">
            <Flame size={24} className="text-white fill-white" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--color-text-primary)] m-0 leading-none">{wellnessStreak}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mt-1.5">Day streak</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
          className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-sm border border-[var(--color-surface-highlight)] text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2 shadow-[0_4px_12px_rgba(217,119,6,0.2)]">
            <Award size={24} className="text-white" />
          </div>
          <p className="text-2xl font-extrabold text-[var(--color-text-primary)] m-0 leading-none">{earnedCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mt-1.5">Badges won</p>
        </motion.div>
      </div>

      {/* EDIT / DISPLAY */}
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="editing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 mb-4 shadow-sm border border-[var(--color-surface-highlight)]"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--color-shakti-primary)] to-[var(--color-shakti-secondary)] flex items-center justify-center glow-purple">
                <Edit3 size={20} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)] m-0">Edit information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">Display name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-shakti-dark-text)]" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-shakti-dark-text)]" 
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="display" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-3 mb-4"
          >
            <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-sm border border-[var(--color-surface-highlight)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)] m-0">Contact details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Mail, label: 'Email', value: userProfile?.email, color: 'text-purple-600', bg: 'bg-purple-50' },
                  userProfile?.phone && { icon: Phone, label: 'Mobile', value: userProfile.phone, color: 'text-blue-500', bg: 'bg-blue-50' },
                  userProfile?.city && { icon: MapPin, label: 'Location', value: userProfile.city, color: 'text-rose-500', bg: 'bg-rose-50' },
                ].filter(Boolean).map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--color-surface)]">
                      <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                        <Icon size={16} className={item.color} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] m-0">{item.label}</p>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] m-0 mt-0.5 truncate">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {userProfile?.skillsHave && (
              <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-sm border border-[var(--color-surface-highlight)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-[0_4px_12px_rgba(217,119,6,0.2)]">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)] m-0">Skillset</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skillsHave.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BADGES */}
      <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 mb-4 shadow-sm border border-[var(--color-surface-highlight)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center shadow-[0_4px_12px_rgba(217,119,6,0.2)]">
              <Award size={20} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] m-0">Badges</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-bold text-amber-800">
            {earnedCount} / {ACHIEVEMENTS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              whileHover={a.earned ? { y: -3 } : {}}
              className={`p-3.5 rounded-[14px] relative overflow-hidden ${a.earned ? a.bg : 'bg-[var(--color-surface)] opacity-50 grayscale'}`}
            >
              <div className="text-3xl mb-2">{a.emoji}</div>
              <p className="text-sm font-bold text-[var(--color-text-primary)] m-0 mb-0.5 leading-snug">{a.title}</p>
              <p className="text-xs text-[var(--color-text-secondary)] m-0 leading-snug">{a.desc}</p>
              {a.earned && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[var(--color-surface-lowest)] rounded-full flex items-center justify-center shadow-sm">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* REWARDS CTA */}
      <Link to="/profile/store" className="block text-inherit no-underline">
        <motion.div whileHover={{ y: -3 }}
          className="rounded-[1.25rem] p-5 flex items-center justify-between text-white shadow-[0_8px_24px_rgba(99,14,212,0.2)] relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900"
        >
          <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-pink-500/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-base font-bold m-0 mb-1 flex items-center gap-2">
              Rewards Store <Gift size={18} className="text-pink-300" />
            </h3>
            <p className="text-sm text-purple-200/90 m-0">Redeem your ShePoints for exclusive perks.</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 relative z-10">
            <ArrowRight size={20} />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
