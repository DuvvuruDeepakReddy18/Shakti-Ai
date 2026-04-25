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
    <div className="min-h-screen bg-[#fdfcff] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-[0_10px_30px_rgba(109,40,217,0.06)] border border-amber-50">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Micro-Internships</h1>
            <p className="text-sm text-gray-600">Short-term paid projects to build your portfolio.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <Zap size={18} className="text-amber-500 mb-2" />
          <h4 className="text-2xl font-bold text-gray-900">12</h4>
          <p className="text-xs text-gray-500 font-medium">Live sprints</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <Sparkles size={18} className="text-emerald-500 mb-2" />
          <h4 className="text-2xl font-bold text-gray-900">₹25k+</h4>
          <p className="text-xs text-gray-500 font-medium">Stipends distributed</p>
        </div>
      </div>

      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Briefcase size={13} className="text-amber-500" /> Active opportunities
      </h3>

      <div className="space-y-3">
        {INTERNSHIPS.map((job, i) => (
          <motion.div
            key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-100 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-semibold text-gray-900 leading-tight">{job.title}</h3>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-semibold rounded-md border border-amber-100">
                    {job.slots} slots
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Building2 size={12} /> {job.company}
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex-shrink-0">
                <IndianRupee size={13} className="text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">{job.stipend}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-700 p-2 rounded-lg bg-gray-50">
                <Clock size={12} className="text-blue-500" /> {job.duration}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-700 p-2 rounded-lg bg-gray-50">
                <MapPin size={12} className="text-rose-500" /> {job.mode}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100 flex-wrap">
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-gray-50 text-[11px] font-medium text-gray-600 rounded-md border border-gray-100">
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
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-xs font-semibold text-gray-600">Verified partner enterprises</span>
        </div>
      </div>
    </div>
  );
}
