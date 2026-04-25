import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ChevronDown, ArrowLeft, Scale, Gavel,
  HandMetal, Heart, Clock, BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RIGHTS = [
  {
    id: 1,
    title: 'POSH Act Protection',
    subtitle: 'Sexual harassment prevention',
    icon: Shield,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    borderColor: 'border-rose-100',
    content: 'The POSH Act mandates every organization with 10 or more employees to constitute an Internal Complaints Committee (ICC). You have the right to a safe working environment, free from sexual harassment. Complaints can be filed within 3 months of the incident.',
  },
  {
    id: 2,
    title: 'Maternity Benefits',
    subtitle: 'Paid leave & facilities',
    icon: Heart,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    content: 'Women are entitled to 26 weeks of paid maternity leave for the first two children (12 weeks for subsequent children). It includes provisions for work from home after the leave period, depending on the nature of work, and mandatory creche facilities for establishments with 50+ employees.',
  },
  {
    id: 3,
    title: 'Equal Remuneration',
    subtitle: 'Fair pay & no discrimination',
    icon: Gavel,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    content: 'Employers must pay equal remuneration to men and women workers for same work or work of a similar nature. Discrimination in recruitment, promotion, training, or transfer on the ground of sex is strictly prohibited.',
  },
  {
    id: 4,
    title: 'Shift Regulations',
    subtitle: 'Safe working hours',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    borderColor: 'border-amber-100',
    content: 'Generally, women cannot be required to work between 7 PM and 6 AM. However, in specific sectors (like IT/ITeS), night shifts are allowed provided the employer ensures adequate safety measures, transportation, and a safe working environment.',
  },
];

export default function KnowYourRights() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  const toggleAccordion = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="min-h-screen bg-[#fdfcff] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-[0_10px_30px_rgba(109,40,217,0.06)] border border-blue-50">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Know Your Rights</h1>
            <p className="text-sm text-gray-600">Legal protections & workplace empowerment.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-emerald-50/50 p-4 rounded-2xl mb-6 flex gap-3 items-start border border-emerald-100">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-emerald-600 flex-shrink-0">
          <HandMetal size={16} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Knowledge is power. Below is a simplified summary of key protections.
          <span className="text-blue-700 font-semibold"> For specific cases, always consult a legal professional.</span>
        </p>
      </div>

      <div className="space-y-3">
        {RIGHTS.map((right) => {
          const Icon = right.icon;
          const isExpanded = expandedId === right.id;

          return (
            <motion.div
              key={right.id}
              layout
              className={`bg-white rounded-2xl border transition-all shadow-sm
                ${isExpanded ? `${right.borderColor} shadow-md` : 'border-gray-100 hover:border-blue-100'}`}
            >
              <button
                onClick={() => toggleAccordion(right.id)}
                className="w-full flex items-center justify-between p-5 text-left outline-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${right.bg} ${right.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5 truncate">{right.title}</h3>
                    <p className="text-xs font-medium text-gray-500">{right.subtitle}</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isExpanded ? 'bg-gray-900 text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                  <ChevronDown size={16} />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1">
                      <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4">
                        {right.content}
                      </p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        <button className="px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-all">View full act</button>
                        <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all">Download summary</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-gray-900 rounded-2xl p-6 relative overflow-hidden shadow-md"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <HandMetal size={80} className="text-white" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-1">Legal Support Network</h3>
          <p className="text-sm text-gray-400 mb-4 max-w-md">Connect with pro-bono lawyers and legal aid clinics specializing in women's workplace rights.</p>
          <button className="px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-all flex items-center gap-2">
            <Scale size={15} /> Consult legal aid
          </button>
        </div>
      </motion.div>
    </div>
  );
}
