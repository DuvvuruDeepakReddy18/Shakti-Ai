import { motion } from 'framer-motion';
import {
  Rocket, Clock, IndianRupee, Zap, MapPin, ArrowLeft,
  Briefcase, Sparkles, ShieldCheck, ArrowRight, Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INTERNSHIPS = [
  { id: 1, title: 'Content Writing Sprint', company: 'StartupLabs', duration: '1 week', stipend: '5,000', mode: 'Remote', skills: ['Writing', 'SEO'], slots: 3 },
  { id: 2, title: 'UI Design Challenge', company: 'DesignHub', duration: '3 days', stipend: '3,000', mode: 'Remote', skills: ['Figma', 'UI'], slots: 5 },
  { id: 3, title: 'Social Media Growth Project', company: 'BrandRise', duration: '2 weeks', stipend: '8,000', mode: 'Remote', skills: ['Marketing', 'Instagram'], slots: 2 },
  { id: 4, title: 'React Bug Hunt', company: 'TechNova', duration: '5 days', stipend: '6,000', mode: 'Remote', skills: ['React', 'Testing'], slots: 4 },
  { id: 5, title: 'Customer Research Interviews', company: 'UXPro', duration: '1 week', stipend: '4,500', mode: 'Hybrid', skills: ['Research', 'Communication'], slots: 3 },
];

export default function MicroInternships() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-amber-600 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] p-6 md:p-8 mb-6 shadow-2xl border border-white/10 bg-gradient-to-br from-[#1a153a] to-[#0d0a1f]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-shakti-primary)]/20 blur-[80px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--color-shakti-secondary)]/20 blur-[60px]" />
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-[1.25rem] bg-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-white flex-shrink-0 border border-white/5">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Micro-Internships</h1>
            <p className="text-sm text-white/70">Short-term paid projects to build your portfolio.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-4 border border-[var(--color-surface-highlight)] shadow-sm">
          <Zap size={18} className="text-amber-500 mb-2" />
          <h4 className="text-2xl font-bold text-[var(--color-text-primary)]">12</h4>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">Live sprints</p>
        </div>
        <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-4 border border-[var(--color-surface-highlight)] shadow-sm">
          <Sparkles size={18} className="text-emerald-500 mb-2" />
          <h4 className="text-2xl font-bold text-[var(--color-text-primary)]">₹25k+</h4>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">Stipends distributed</p>
        </div>
      </div>

      <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-2">
        <Briefcase size={13} className="text-amber-500" /> Active opportunities
      </h3>

      <div className="space-y-3">
        {INTERNSHIPS.map((job, i) => (
          <motion.div
            key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm hover:shadow-md hover:border-amber-100 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-tight">{job.title}</h3>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded-md border border-amber-100">
                    {job.slots} slots
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                  <Building2 size={12} /> {job.company}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex-shrink-0">
                <IndianRupee size={13} className="text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">{job.stipend}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-primary)] p-2 rounded-lg bg-[var(--color-surface-low)]">
                <Clock size={12} className="text-blue-500" /> {job.duration}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-primary)] p-2 rounded-lg bg-[var(--color-surface-low)]">
                <MapPin size={12} className="text-rose-500" /> {job.mode}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-[var(--color-surface-highlight)] flex-wrap">
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-[var(--color-surface-low)] text-[11px] font-medium text-[var(--color-text-secondary)] rounded-md border border-[var(--color-surface-highlight)]">
                    {s}
                  </span>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:underline whitespace-nowrap">
                Apply sprint <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-lowest)] border border-[var(--color-surface-highlight)] shadow-sm">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Verified partner enterprises</span>
        </div>
      </div>
    </div>
  );
}
