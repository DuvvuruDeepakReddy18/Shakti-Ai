import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Sparkles, Target, BookOpen, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

const sampleRoadmap = {
  current: { role: 'Junior Frontend Dev', salary: 6 },
  target: { role: 'Senior Frontend Engineer', salary: 22 },
  milestones: [
    { month: 'M1', salary: 6, focus: 'TypeScript fundamentals' },
    { month: 'M2', salary: 7, focus: 'Build 2 portfolio projects' },
    { month: 'M3', salary: 9, focus: 'System design basics' },
    { month: 'M4', salary: 12, focus: 'Advanced React patterns' },
    { month: 'M5', salary: 16, focus: 'Lead a small team feature' },
    { month: 'M6', salary: 22, focus: 'Switch / promotion' },
  ],
  courses: [
    { name: 'Total TypeScript', provider: 'Matt Pocock', price: 'Free trial' },
    { name: 'Frontend System Design', provider: 'GreatFrontEnd', price: '₹4,500' },
    { name: 'Advanced React Patterns', provider: 'Epic React', price: '₹6,000' },
  ],
};

export default function CareerSimulator() {
  const [skills, setSkills] = useState('React, JavaScript, CSS');
  const [target, setTarget] = useState('Senior Frontend Engineer');
  const [result, setResult] = useState(null);

  const simulate = () => setResult(sampleRoadmap);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-32 px-4 pt-6 max-w-[960px] mx-auto">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-amber-600 mb-4">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface-lowest)] rounded-3xl p-6 md:p-8 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--color-shakti-primary)]/10"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-shakti-primary)]/10 flex items-center justify-center text-[var(--color-shakti-primary)] flex-shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1">Career Growth Simulator</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">See your 6-month path to your dream role.</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 mb-6 border border-[var(--color-surface-highlight)] shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block">Your current skills</label>
          <input
            type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-surface-highlight)] text-sm focus:border-[var(--color-shakti-primary)] outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 block">Target role</label>
          <input
            type="text" value={target} onChange={(e) => setTarget(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-surface-highlight)] text-sm focus:border-[var(--color-shakti-primary)] outline-none"
          />
        </div>
        <button
          onClick={simulate}
          className="w-full py-3 rounded-xl bg-[var(--color-shakti-primary)] text-white text-sm font-semibold hover:bg-[var(--color-shakti-primary-container)] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={16} /> Simulate Path
        </button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">From</p>
              <p className="text-base font-semibold text-[var(--color-text-primary)]">{result.current.role}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1 flex items-center gap-1">
                <IndianRupee size={12} /> {result.current.salary} LPA
              </p>
            </div>
            <div className="bg-gradient-to-br from-[var(--color-shakti-primary)]/5 to-[var(--color-shakti-secondary)]/5 rounded-2xl p-5 border border-[var(--color-shakti-primary)]/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-shakti-primary-container)] mb-1">In 6 months</p>
              <p className="text-base font-semibold text-[var(--color-text-primary)]">{result.target.role}</p>
              <p className="text-sm text-[var(--color-shakti-success)] mt-1 font-semibold flex items-center gap-1">
                <IndianRupee size={12} /> {result.target.salary} LPA · +{Math.round((result.target.salary - result.current.salary) / result.current.salary * 100)}%
              </p>
            </div>
          </div>

          <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Projected salary growth</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.milestones}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} unit=" L" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12, border: '1px solid #e5e7eb',
                      fontSize: 12, padding: '8px 12px',
                    }}
                  />
                  <Line
                    type="monotone" dataKey="salary"
                    stroke="var(--color-shakti-primary)" strokeWidth={3}
                    dot={{ fill: 'var(--color-shakti-primary)', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <Target size={16} className="text-[var(--color-shakti-primary)]" /> Monthly milestones
            </h3>
            <div className="space-y-2">
              {result.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-10 text-[var(--color-shakti-primary)] font-semibold text-xs">{m.month}</span>
                  <span className="flex-1 text-[var(--color-text-primary)]">{m.focus}</span>
                  <span className="text-[var(--color-outline)] text-xs">₹{m.salary}L</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-surface-lowest)] rounded-2xl p-5 border border-[var(--color-surface-highlight)] shadow-sm">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-[var(--color-shakti-success)]" /> Recommended courses
            </h3>
            <div className="space-y-2">
              {result.courses.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-low)]">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{c.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{c.provider}</p>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-shakti-success)]">{c.price}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
