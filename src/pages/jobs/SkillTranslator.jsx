import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, IndianRupee, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SKILL_CATEGORIES } from '../../utils/constants';

const sampleResults = [
  { title: 'Home-Tutor: Class 6–10 Math', earning: '₹8,000 – ₹15,000 / month', platform: 'UrbanPro', difficulty: 'Easy', time: '6h/week', color: '#3B82F6' },
  { title: 'Tiffin Service (Lunchboxes)', earning: '₹15,000 – ₹35,000 / month', platform: 'WhatsApp + locality', difficulty: 'Medium', time: 'Daily morning', color: '#F59E0B' },
  { title: 'Custom Embroidery Listings', earning: '₹500 – ₹2,500 / piece', platform: 'Etsy / Instagram', difficulty: 'Easy', time: 'Flexible', color: '#db2777' },
  { title: 'Freelance Bengali → English Translation', earning: '₹0.80 – ₹2 / word', platform: 'Upwork', difficulty: 'Medium', time: 'Project-based', color: '#10B981' },
  { title: 'Voice-Over Artist (Regional)', earning: '₹3,000 – ₹10,000 / project', platform: 'Voices.com', difficulty: 'Easy', time: 'Per gig', color: '#7c3aed' },
];

export default function SkillTranslator() {
  const [selected, setSelected] = useState(['Cooking', 'Tutoring']);
  const [location, setLocation] = useState('Bangalore');
  const [hours, setHours] = useState(10);
  const [results, setResults] = useState(null);

  const toggleSkill = (s) =>
    setSelected(selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s]);

  const translate = () => {
    setResults(sampleResults);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-amber-600 mb-4">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-amber-50"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">Skill → Income Translator</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Turn skills you already have into real, local income.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-6 border border-[var(--color-surface-highlight)] shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">Select your skills</p>
        <div className="flex flex-wrap gap-2 mb-5 max-h-32 overflow-y-auto">
          {SKILL_CATEGORIES.map(s => (
            <button
              key={s}
              onClick={() => toggleSkill(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selected.includes(s)
                  ? 'bg-amber-500 text-white'
                  : 'bg-[var(--color-surface-low)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-highlight)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block">Location</label>
            <input
              type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-surface-highlight)] text-sm focus:border-amber-400 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block">Hours / week: {hours}</label>
            <input
              type="range" min="2" max="40" value={hours} onChange={(e) => setHours(parseInt(e.target.value))}
              className="w-full accent-amber-500 mt-3"
            />
          </div>
        </div>

        <button
          onClick={translate}
          disabled={selected.length === 0}
          className="w-full py-3 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={16} /> Find Income Opportunities
        </button>
      </div>

      {results && (
        <>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">{results.length} opportunities matched</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2 leading-tight">{r.title}</h3>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                    <IndianRupee size={11} /> {r.earning}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-[var(--color-surface-low)] text-[var(--color-text-secondary)] text-[11px] font-medium flex items-center gap-1">
                    <Clock size={11} /> {r.time}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-surface-highlight)]">
                  <span className="text-xs text-[var(--color-text-secondary)]">{r.platform} · {r.difficulty}</span>
                  <button
                    className="text-xs font-semibold flex items-center gap-1 hover:underline"
                    style={{ color: r.color }}
                  >
                    Learn more <ExternalLink size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
