import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, IndianRupee, Plus, Star, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialTasks = [
  { id: 1, title: 'Need a Math tutor (Class 10) for 2 weeks', category: 'Tutoring', pay: '₹500/hr', distance: '1.2 km', location: 'Indiranagar', poster: 'Anita S.', rating: 4.8, urgent: true },
  { id: 2, title: 'Babysitter needed Saturday evening 6–10pm', category: 'Childcare', pay: '₹2,000', distance: '0.8 km', location: 'Koramangala', poster: 'Priya M.', rating: 4.9 },
  { id: 3, title: 'Tailor for school uniform alterations (5 pieces)', category: 'Tailoring', pay: '₹1,200', distance: '2.5 km', location: 'HSR Layout', poster: 'Meena K.', rating: 5.0 },
  { id: 4, title: 'Catering: 30-person family lunch on Sunday', category: 'Catering', pay: '₹6,500', distance: '3.1 km', location: 'Whitefield', poster: 'Suman R.', rating: 4.7, urgent: true },
  { id: 5, title: 'Mehndi artist for engagement ceremony', category: 'Beauty', pay: '₹3,500', distance: '4.0 km', location: 'JP Nagar', poster: 'Rita V.', rating: 4.9 },
];

const categories = ['All', 'Tutoring', 'Childcare', 'Tailoring', 'Catering', 'Beauty'];

export default function JobExchange() {
  const [activeCat, setActiveCat] = useState('All');
  const filtered = activeCat === 'All' ? initialTasks : initialTasks.filter(t => t.category === activeCat);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-amber-600 mb-4">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-amber-50"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <MapPin size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">Hyperlocal Job Exchange</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Local tasks, posted by women, for women.</p>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors flex-shrink-0">
            <Plus size={16} /> Post Task
          </button>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        <Filter size={14} className="text-[var(--color-outline)] flex-shrink-0" />
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCat === c ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-[var(--color-surface-lowest)] text-[var(--color-text-secondary)] border border-[var(--color-surface-highlight)] hover:border-amber-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(t => (
          <motion.div
            key={t.id}
            whileHover={{ x: 2 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold">{t.category}</span>
                  {t.urgent && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-semibold">Urgent</span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight">{t.title}</h3>
              </div>
              <span className="text-base font-bold text-emerald-600 flex items-center gap-0.5 flex-shrink-0">
                <IndianRupee size={14} />{t.pay.replace('₹', '')}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin size={12} /> {t.location} · {t.distance}</span>
                <span className="flex items-center gap-1">
                  {t.poster} · <Star size={11} className="text-amber-400 fill-amber-400" /> {t.rating}
                </span>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100">
                Apply
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
