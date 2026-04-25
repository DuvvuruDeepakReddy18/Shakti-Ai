import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gift, Star, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const MERCH_ITEMS = [
  { id: 1, name: 'Shakti Smart Bottle', points: 5000, icon: '💧', color: 'bg-blue-500/10 text-blue-500', desc: 'Stay hydrated with our premium matte-finish smart bottle.' },
  { id: 2, name: 'Wellness Kit', points: 10000, icon: '💄', color: 'bg-pink-500/10 text-pink-500', desc: 'Cruelty-free essential self-care collection.' },
  { id: 3, name: 'Career Pro Kit', points: 25000, icon: '💼', color: 'bg-purple-500/10 text-purple-500', desc: 'Exclusive resume review and mock interview access.' },
  { id: 4, name: 'Safety Device', points: 50000, icon: '📱', color: 'bg-emerald-500/10 text-emerald-500', desc: 'Custom emergency response hardware device.' },
];

export default function MerchandiseStore() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuthStore();
  const [selectedItem, setSelectedItem] = useState(null);

  const userPoints = userProfile?.shePoints || 0;

  const handleRedeem = () => {
    if (userPoints >= selectedItem.points) {
      updateUserProfile({ shePoints: userPoints - selectedItem.points });
      toast.success(`Redeemed ${selectedItem.name}. Details sent to your email.`);
      setSelectedItem(null);
    } else {
      toast.error('Not enough points to redeem this item.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto font-sans">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-600 shadow-inner shrink-0">
            <Gift size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--color-text-primary)] mb-1 tracking-tight">Rewards Store</h1>
            <p className="text-sm text-[var(--color-text-secondary)] m-0">Redeem your hard-earned ShePoints.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[var(--color-shakti-dark-text)] via-purple-600 to-[#db2777] rounded-[1.5rem] p-6 mb-6 text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="fill-white opacity-80" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">Available balance</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-extrabold m-0 leading-none">{userPoints.toLocaleString()}</h2>
              <span className="text-sm font-semibold opacity-80">ShePoints</span>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-[1rem] flex items-center gap-2 shadow-inner">
            <Gift size={20} className="text-pink-200" />
            <p className="text-xs font-bold uppercase tracking-wider text-pink-100 m-0">Gold member</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {MERCH_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedItem(item)}
            className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-[0_8px_24px_rgba(24,20,69,0.06)] hover:border-[var(--color-shakti-dark-text)] cursor-pointer transition-all flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-[1.25rem] ${item.color} flex items-center justify-center text-3xl shadow-inner`}>
                {item.icon}
              </div>
              <div className="px-3 py-1.5 bg-amber-50 rounded-full flex items-center gap-1.5 border border-amber-100">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-amber-700">{item.points.toLocaleString()}</span>
              </div>
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1 m-0">{item.name}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-5 flex-1 leading-relaxed m-0">{item.desc}</p>
            <button className="w-full py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-surface-highlight)] text-[var(--color-shakti-dark-text)] text-sm font-bold transition-all hover:bg-[var(--color-shakti-dark-text)] hover:text-white">
              Claim reward
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-[var(--color-surface-lowest)] p-4 rounded-[1.25rem] flex items-center gap-3 border border-[var(--color-surface-highlight)] shadow-sm">
        <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
          <Info size={16} className="text-[var(--color-shakti-light-text)]" />
        </div>
        <p className="text-xs font-medium text-[var(--color-text-secondary)] leading-relaxed m-0">
          More rewards are added every month. Keep verifying reports and helping others to boost your points.
        </p>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-[var(--color-surface-container)]/80 backdrop-blur-sm z-[1000]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-sm bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 md:p-8 z-[1001] shadow-2xl border border-[var(--color-surface-highlight)]"
            >
              <div className="text-center">
                <div className={`w-20 h-20 rounded-[1.25rem] ${selectedItem.color} flex items-center justify-center text-4xl mx-auto mb-5 shadow-inner`}>
                  {selectedItem.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-[var(--color-text-primary)] mb-2 m-0">{selectedItem.name}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed m-0">{selectedItem.desc}</p>

                <div className="bg-amber-50 p-4 rounded-xl mb-6 border border-amber-100 flex items-center justify-center gap-2">
                  <Star size={20} className="text-amber-500 fill-amber-500" />
                  <span className="text-2xl font-extrabold text-amber-900">{selectedItem.points.toLocaleString()}</span>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pts</span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRedeem}
                    disabled={userPoints < selectedItem.points}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                      userPoints >= selectedItem.points
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                        : 'bg-[var(--color-surface)] text-[var(--color-outline)] cursor-not-allowed border border-[var(--color-surface-highlight)]'
                    }`}
                  >
                    {userPoints >= selectedItem.points ? 'Redeem now' : 'Insufficient points'}
                  </button>
                  <button onClick={() => setSelectedItem(null)} className="py-2 text-sm font-bold text-[var(--color-shakti-light-text)] hover:text-[var(--color-shakti-dark-text)] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
