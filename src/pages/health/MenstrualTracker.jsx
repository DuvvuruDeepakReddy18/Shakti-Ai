import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Calendar, Info, Plus, Moon } from 'lucide-react';
import useHealthStore from '../../store/healthStore';
import { CYCLE_PHASES } from '../../utils/constants';
import { getCyclePhase, predictNextPeriod } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', emoji: '🤕' },
  { id: 'headache', label: 'Headache', emoji: '🤯' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'mood', label: 'Mood swings', emoji: '😤' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'acne', label: 'Acne', emoji: '😣' },
  { id: 'cravings', label: 'Cravings', emoji: '🍫' },
  { id: 'tender', label: 'Tenderness', emoji: '💢' },
];
const PHASE_TIPS = {
  period: ["Rest and prioritize sleep.", "Drink warm ginger tea to ease cramps.", "Stick to light stretching or yoga.", "Eat iron-rich foods like spinach and lentils."],
  follicular: ["Great time to start new projects.", "Higher energy levels – perfect for cardio.", "Include probiotic-rich foods.", "Socialize and network – communication peaks!"],
  ovulation: ["Peak energy! Try an intense workout.", "Eat foods high in zinc like pumpkin seeds.", "You're glowing – great time for a presentation.", "Stay hydrated and focus on fiber-rich veggies."],
  luteal: ["Energy might dip. Opt for Pilates.", "Cravings? Reach for dark chocolate.", "Focus on self-care and relaxation.", "Stay warm and hydrated."]
};

export default function MenstrualTracker() {
  const { menstrualData, updateMenstrualData } = useHealthStore();
  const [lastPeriod, setLastPeriod] = useState(menstrualData.lastPeriod || '');
  const [cycleLength, setCycleLength] = useState(menstrualData.cycleLength || 28);
  const [symptoms, setSymptoms] = useState(menstrualData.symptoms || []);
  const [explorerDay, setExplorerDay] = useState(1);

  const explorerPhase = useMemo(() => {
    if (explorerDay <= 5) return 'period';
    if (explorerDay <= 13) return 'follicular';
    if (explorerDay <= 16) return 'ovulation';
    return 'luteal';
  }, [explorerDay]);

  const save = () => {
    updateMenstrualData({ lastPeriod, cycleLength, symptoms });
    toast.success('Cycle data saved');
  };

  const toggleSymptom = (id) => {
    setSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const currentPhase = useMemo(() => {
    if (!lastPeriod) return null;
    return getCyclePhase(lastPeriod, cycleLength);
  }, [lastPeriod, cycleLength]);

  const nextPeriod = useMemo(() => {
    if (!lastPeriod) return null;
    return predictNextPeriod(lastPeriod, cycleLength);
  }, [lastPeriod, cycleLength]);

  const daysUntil = nextPeriod ? Math.ceil((new Date(nextPeriod) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  // Build 28-day cycle calendar
  const calendar = useMemo(() => {
    if (!lastPeriod) return [];
    const start = new Date(lastPeriod);
    return Array.from({ length: cycleLength }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      let phase = 'luteal';
      if (i < 5) phase = 'period';
      else if (i < 14) phase = 'follicular';
      else if (i < 17) phase = 'ovulation';
      return { day: i + 1, date: d, phase };
    });
  }, [lastPeriod, cycleLength]);

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6 max-w-[960px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] p-6 shadow-sm bg-[var(--color-surface-lowest)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-shakti-secondary)]/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-[1.25rem] bg-[var(--color-shakti-secondary)]/10 flex items-center justify-center text-[var(--color-shakti-secondary)] flex-shrink-0 shadow-inner">
            <Droplet size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--color-text-primary)] tracking-tight">Cycle Tracker</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">Private. Secure. Understand your body's rhythm.</p>
          </div>
        </div>
      </motion.div>

      {currentPhase && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="rounded-[1.5rem] p-6 shadow-sm" style={{ background: `linear-gradient(135deg, ${CYCLE_PHASES[currentPhase].color}15, ${CYCLE_PHASES[currentPhase].color}05)` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Current Phase</p>
                <h2 className="text-2xl font-display font-bold text-[var(--color-text-primary)]">{CYCLE_PHASES[currentPhase].label}</h2>
                <p className="text-sm font-medium mt-1" style={{ color: CYCLE_PHASES[currentPhase].color }}>{CYCLE_PHASES[currentPhase].description}</p>
              </div>
              <div className="text-center bg-[var(--color-surface-lowest)] p-4 rounded-2xl shadow-sm">
                <p className="text-4xl font-bold text-[var(--color-text-primary)]">{daysUntil > 0 ? daysUntil : 0}</p>
                <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase mt-1">Days Until</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[var(--color-shakti-secondary)]/10"><Info size={16} style={{ color: CYCLE_PHASES[currentPhase].color }} /></div> Tips for this phase
            </h3>
            <ul className="space-y-3">
              {PHASE_TIPS[currentPhase].map((tip, idx) => (
                <li key={idx} className="text-sm font-medium text-[var(--color-text-primary)] flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: CYCLE_PHASES[currentPhase].color }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">Log Your Cycle</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-[var(--color-text-primary)] mb-2 block">First day of last period</label>
            <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-shakti-secondary)]/20 focus:border-[var(--color-shakti-secondary)] transition-all shadow-inner" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-[var(--color-text-primary)]">Cycle length</label>
              <span className="text-sm font-bold text-[var(--color-shakti-secondary)] bg-[var(--color-shakti-secondary)]/10 px-3 py-1 rounded-lg">{cycleLength} days</span>
            </div>
            <input type="range" min="21" max="35" value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-[var(--color-shakti-secondary)] mt-2" />
          </div>
        </div>
        <button onClick={save} className="w-full py-4 mt-2 rounded-full bg-gradient-to-r from-[var(--color-shakti-secondary)] to-[var(--color-shakti-error)] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95">Save Details</button>
      </div>

      {calendar.length > 0 && (
        <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
          <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--color-shakti-secondary)]/10"><Calendar size={16} className="text-[var(--color-shakti-secondary)]" /></div> Cycle Calendar
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {calendar.map(d => (
              <div key={d.day} className="aspect-square rounded-xl flex flex-col items-center justify-center text-xs shadow-sm hover:scale-105 transition-transform"
                style={{ background: `${CYCLE_PHASES[d.phase].color}15`, border: `1px solid ${CYCLE_PHASES[d.phase].color}30` }}>
                <span className="font-bold text-[var(--color-text-primary)]">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {Object.entries(CYCLE_PHASES).map(([k, p]) => (
              <div key={k} className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2 py-1 rounded-md">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cycle Sync Explorer */}
      <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--color-shakti-primary)]/10"><Moon size={20} className="text-[var(--color-shakti-primary)]" /></div> Cycle Sync Explorer
          </h3>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Slide to explore how your body changes throughout your cycle and get personalized wellness tips.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-[var(--color-text-primary)]">Day {explorerDay}</label>
            <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ color: CYCLE_PHASES[explorerPhase].color, background: `${CYCLE_PHASES[explorerPhase].color}15` }}>
              {CYCLE_PHASES[explorerPhase].label}
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max={cycleLength} 
            value={explorerDay}
            onChange={(e) => setExplorerDay(Number(e.target.value))}
            className="w-full mt-2"
            style={{ accentColor: CYCLE_PHASES[explorerPhase].color }}
          />
        </div>

        <div className="p-5 rounded-[1rem] shadow-sm" style={{ background: `linear-gradient(135deg, ${CYCLE_PHASES[explorerPhase].color}10, ${CYCLE_PHASES[explorerPhase].color}05)` }}>
           <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-[var(--color-text-primary)]">
             <div className="p-1 rounded bg-[var(--color-surface-lowest)] shadow-sm"><Info size={14} style={{ color: CYCLE_PHASES[explorerPhase].color }} /></div>
             Tips for Day {explorerDay}
           </h4>
           <ul className="space-y-2">
              {PHASE_TIPS[explorerPhase].map((tip, idx) => (
                <li key={idx} className="text-sm font-medium text-[var(--color-text-primary)] flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: CYCLE_PHASES[explorerPhase].color }} />
                  {tip}
                </li>
              ))}
            </ul>
        </div>
      </div>

      <div className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-6 shadow-sm">
        <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4">Today's Symptoms</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {SYMPTOMS.map(s => (
            <motion.button key={s.id} whileTap={{ scale: 0.95 }} onClick={() => toggleSymptom(s.id)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm ${
                symptoms.includes(s.id) ? 'bg-[var(--color-shakti-secondary)]/10' : 'bg-[var(--color-surface)] hover:bg-[var(--color-shakti-secondary)]/5'
              }`}>
              <span className="text-2xl">{s.emoji}</span>
              <span className={`text-[10px] font-bold ${symptoms.includes(s.id) ? 'text-[var(--color-shakti-secondary)]' : 'text-[var(--color-text-secondary)]'}`}>{s.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-shakti-primary)]/10 rounded-[1rem] p-5 flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-[var(--color-surface-lowest)] rounded-lg shadow-sm"><Info size={18} className="text-[var(--color-shakti-primary)] shrink-0" /></div>
        <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed">
          Your cycle data is stored privately on your device. We never share or sell your data.
        </p>
      </div>
    </div>
  );
}
