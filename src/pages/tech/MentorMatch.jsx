import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, MessageCircle, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const mentors = [
  { id: 1, name: 'Dr. Anjali Mehta', role: 'AI Researcher', company: 'IIT Bombay', rating: 4.9, sessions: 142, expertise: ['AI/ML', 'Research', 'Career'], bio: 'Helping women break into AI research with structured mentorship.', initial: 'A', color: '#7c3aed' },
  { id: 2, name: 'Priya Krishnan', role: 'Engineering Manager', company: 'Microsoft', rating: 4.8, sessions: 89, expertise: ['Leadership', 'Frontend', 'Interview Prep'], bio: '12 years in tech. Specialty: helping ICs become leaders.', initial: 'P', color: '#3B82F6' },
  { id: 3, name: 'Sneha Reddy', role: 'Founder & CEO', company: 'PayWise', rating: 5.0, sessions: 56, expertise: ['Startups', 'Fundraising', 'Product'], bio: 'YC alum. Mentoring future women founders in fintech.', initial: 'S', color: '#db2777' },
  { id: 4, name: 'Maya Iyer', role: 'Senior SDE', company: 'Amazon', rating: 4.7, sessions: 234, expertise: ['DSA', 'System Design', 'Coding'], bio: 'FAANG interviewer. Focused on cracking tough engineering interviews.', initial: 'M', color: '#10B981' },
];

const filters = ['All', 'AI/ML', 'Frontend', 'Leadership', 'Startups', 'Interview Prep'];

export default function MentorMatch() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? mentors
    : mentors.filter(m => m.expertise.includes(activeFilter));

  return (
    <div className="min-h-screen bg-[#fdfcff] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/tech" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-4">
        <ArrowLeft size={16} /> Back to Tech
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 mb-6 shadow-[0_10px_30px_rgba(109,40,217,0.06)] border border-purple-50"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Mentor Match</h1>
            <p className="text-sm text-gray-600">AI-paired mentors who match your goals & schedule.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 mb-6 border border-purple-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-sm flex-shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">AI suggests: <span className="text-purple-700">Priya Krishnan</span></p>
          <p className="text-xs text-gray-600">Based on your interest in frontend & leadership growth.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
        <Filter size={14} className="text-gray-400 flex-shrink-0" />
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === f
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(m => (
          <motion.div
            key={m.id}
            whileHover={{ y: -3 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
                style={{ backgroundColor: m.color }}
              >
                {m.initial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 leading-tight">{m.name}</h3>
                <p className="text-xs text-gray-500">{m.role} · {m.company}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-700">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{m.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">{m.sessions} sessions</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{m.bio}</p>

            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              {m.expertise.map(e => (
                <span key={e} className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-medium">
                  {e}
                </span>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors">
              <MessageCircle size={14} /> Request Session
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
