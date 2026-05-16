import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ArrowLeft, Scale, Gavel, HandMetal, Heart, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RIGHTS = [
  { id: 1, title: 'POSH Act Protection', subtitle: 'Sexual harassment prevention', icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50', borderColor: 'border-rose-100', content: 'The POSH Act mandates every organization with 10 or more employees to constitute an Internal Complaints Committee (ICC). You have the right to a safe working environment, free from sexual harassment. Complaints can be filed within 3 months of the incident.' },
  { id: 2, title: 'Maternity Benefits', subtitle: 'Paid leave & facilities', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100', content: 'Women are entitled to 26 weeks of paid maternity leave for the first two children. Includes work from home provisions and mandatory creche facilities for 50+ employee establishments.' },
  { id: 3, title: 'Equal Remuneration', subtitle: 'Fair pay & no discrimination', icon: Gavel, color: 'text-indigo-600', bg: 'bg-indigo-50', borderColor: 'border-indigo-100', content: 'Employers must pay equal remuneration to men and women for same work. Discrimination in recruitment, promotion, training on grounds of sex is strictly prohibited.' },
  { id: 4, title: 'Shift Regulations', subtitle: 'Safe working hours', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-amber-100', content: 'Women cannot be required to work between 7 PM and 6 AM generally. In IT/ITeS sectors, night shifts allowed with adequate safety measures, transportation, and safe environment.' },
];

export default function KnowYourRights() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-purple)] mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-surface-highlight)]">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0"><BookOpen size={28} /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">Know Your Rights</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Legal protections & workplace empowerment.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-emerald-50/50 p-4 rounded-2xl mb-6 flex gap-3 items-start border border-emerald-100">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-lowest)] flex items-center justify-center text-emerald-600 flex-shrink-0"><HandMetal size={16} /></div>
        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
          Knowledge is power. Below is a simplified summary of key protections.
          <span className="text-blue-700 font-semibold"> For specific cases, always consult a legal professional.</span>
        </p>
      </div>

      <div className="space-y-3">
        {RIGHTS.map((r) => {
          const Icon = r.icon;
          const open = expandedId === r.id;
          return (
            <motion.div key={r.id} layout className={`bg-[var(--color-surface-lowest)] rounded-2xl border transition-all shadow-sm ${open ? `${r.borderColor} shadow-md` : 'border-[var(--color-surface-highlight)] hover:border-blue-100'}`}>
              <button onClick={() => toggle(r.id)} className="w-full flex items-center justify-between p-5 text-left outline-none">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${r.bg} ${r.color}`}><Icon size={20} /></div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-0.5 truncate">{r.title}</h3>
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">{r.subtitle}</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${open ? 'bg-[var(--color-text-primary)] text-white rotate-180' : 'bg-[var(--color-surface-low)] text-[var(--color-text-secondary)]'}`}><ChevronDown size={16} /></div>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1">
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed border-l-2 border-[var(--color-surface-highlight)] pl-4">{r.content}</p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <button className="px-4 py-2 rounded-lg bg-[var(--color-text-primary)] text-white text-xs font-semibold hover:opacity-90 transition-all">View full act</button>
                        <button className="px-4 py-2 rounded-lg bg-[var(--color-surface-lowest)] border border-[var(--color-surface-highlight)] text-[var(--color-text-secondary)] text-xs font-semibold hover:bg-[var(--color-surface-low)] transition-all">Download summary</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 p-6 opacity-10"><HandMetal size={80} className="text-white" /></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-1">Legal Support Network</h3>
          <p className="text-sm text-purple-200/90 mb-4 max-w-md">Connect with pro-bono lawyers and legal aid clinics specializing in women's workplace rights.</p>
          <button className="px-5 py-2.5 rounded-xl bg-white text-[var(--color-text-primary)] text-sm font-semibold hover:bg-gray-100 transition-all flex items-center gap-2"><Scale size={15} /> Consult legal aid</button>
        </div>
      </motion.div>
    </div>
  );
}
