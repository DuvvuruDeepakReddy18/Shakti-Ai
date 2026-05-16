import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Droplet, Moon, Calendar,
  ChevronRight, Sparkles, ArrowRight, Brain, Zap, Battery,
  Activity, Apple, Flower2, Check, X, CheckCircle2, Sun, Sunset, MoonStar,
  Plus, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useHealthStore from '../../store/healthStore';
import { MOODS } from '../../utils/constants';

const tools = [
  { to: '/health/companion', icon: Brain, title: 'Shakti AI', desc: 'Anonymous wellness mentor', color: '#7c3aed', bg: '#f5f3ff' },
  { to: '/health/food-scanner', icon: Zap, title: 'Ingredient Scanner', desc: 'Identify endocrine disruptors', color: '#f43f5e', bg: '#fff1f2' },
  { to: '/health/menstrual', icon: Calendar, title: 'Menstrual Tracker', desc: 'Cycle, symptoms & predictions', color: '#ec4899', bg: '#fdf2f8' },
  { to: '/health/stress', icon: Activity, title: 'Stress Detector', desc: 'Quick check-in via questions', color: '#3b82f6', bg: '#eff6ff' },
  { to: '/health/wellness', icon: Apple, title: 'Wellness Engine', desc: 'Daily routines & nutrition', color: '#10B981', bg: '#ecfdf5' },
  { to: '/health/mood', icon: MessageCircle, title: 'Mood Tracker', desc: 'Log & visualize emotions', color: '#f59e0b', bg: '#fffbeb' },
];

const DEFAULT_TASKS = [
  { id: 1, text: 'Drink 500ml water on waking up', time: 'Morning' },
  { id: 2, text: '10 mins stretching or yoga', time: 'Morning' },
  { id: 3, text: 'Take daily vitamins', time: 'Morning' },
  { id: 4, text: 'Log mood & energy level', time: 'Mid-day' },
  { id: 5, text: 'No screens 1 hour before bed', time: 'Evening' },
  { id: 6, text: 'Skincare routine', time: 'Evening' }
];

export default function HealthHome() {
  const { todayMood } = useHealthStore();
  const [sleepTime, setSleepTime] = useState(6.5);
  const [energyLevel, setEnergyLevel] = useState(8);
  const [showRoutine, setShowRoutine] = useState(false);
  const [routineTasks, setRoutineTasks] = useState(DEFAULT_TASKS);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('Morning');

  const todayMoodObj = MOODS.find((m) => m.id === todayMood);

  const getSuggestion = () => {
    if (sleepTime < 6 && energyLevel < 5) return 'Your body needs rest. A 20-min nap and earlier bedtime will help restore balance.';
    if (sleepTime < 6) return "You're running low on sleep. Avoid screens 1 hour before bed tonight.";
    if (energyLevel < 5) return 'Low energy despite sleep can mean burnout. Hydrate and take short mental breaks.';
    if (sleepTime >= 7 && energyLevel >= 7) return "You're well-rested and energized — a great day for creative work or a workout.";
    return 'Listen to your body. Maintain your routine, hydrate, and take small breaks.';
  };

  const toggleTask = (id) => {
    setCompletedTasks(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      time: newTaskTime
    };
    setRoutineTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    setRoutineTasks(prev => prev.filter(t => t.id !== id));
    setCompletedTasks(prev => prev.filter(taskId => taskId !== id));
  };

  const metricCardClassName = "bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[160px]";

  const getTimeIcon = (time) => {
    if (time === 'Morning') return <Sun size={16} className="text-[var(--color-shakti-warning)]" />;
    if (time === 'Mid-day') return <Sunset size={16} className="text-[var(--color-shakti-secondary)]" />;
    return <MoonStar size={16} className="text-[var(--color-shakti-primary)]" />;
  };

  const progressPercentage = routineTasks.length === 0 ? 0 : Math.round((completedTasks.length / routineTasks.length) * 100);

  return (
    <div className="pb-36 lg:pb-24 max-w-[960px] mx-auto p-4 md:p-6 font-sans">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 mb-8 shadow-sm"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[var(--color-shakti-error)]/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--color-shakti-secondary)]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-[var(--color-shakti-error)] to-[var(--color-shakti-secondary)] flex items-center justify-center shadow-lg text-white flex-shrink-0">
              <Heart size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-[var(--color-text-primary)] mb-1">Health & Wellness</h1>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Holistic tracking for the modern woman.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-shakti-secondary)]/10 border border-[var(--color-shakti-secondary)]/20 text-xs font-bold text-[var(--color-shakti-secondary)] flex-shrink-0">
            <Flower2 size={14} /> 7-day streak
          </div>
        </div>
      </motion.div>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 md:mb-20">
        {/* Mood */}
        <div className={metricCardClassName}>
          <div className="absolute -top-5 -right-5 w-16 h-16 bg-[var(--color-shakti-warning)]/10 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-shakti-warning)]/10 flex items-center justify-center text-[var(--color-shakti-warning)]">
              <Heart size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Mood</span>
          </div>
          {todayMoodObj ? (
            <div className="text-center relative z-10">
              <span className="text-4xl block mb-1">{todayMoodObj.emoji}</span>
              <p className="text-sm font-bold text-[var(--color-text-primary)]">{todayMoodObj.label}</p>
            </div>
          ) : (
            <Link to="/health/mood" className="block p-3 rounded-xl bg-[var(--color-shakti-warning)]/10 text-[var(--color-shakti-warning)] text-xs font-bold text-center relative z-10 hover:shadow-md transition-all">
              Log today
            </Link>
          )}
        </div>

        {/* Cycle */}
        <div className={metricCardClassName}>
          <div className="absolute -top-5 -right-5 w-16 h-16 bg-[var(--color-shakti-secondary)]/10 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-shakti-secondary)]/10 flex items-center justify-center text-[var(--color-shakti-secondary)]">
              <Droplet size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Cycle</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] leading-none mb-1 relative z-10">Day 14</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-shakti-secondary)] mb-3 relative z-10">Ovulation</p>
          <div className="flex gap-1 relative z-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 2 ? 'bg-gradient-to-r from-[var(--color-shakti-secondary)] to-[var(--color-shakti-primary)]' : 'bg-[var(--color-surface-highlight)]'}`} />
            ))}
          </div>
        </div>

        {/* Sleep */}
        <div className={metricCardClassName}>
          <div className="absolute -top-5 -right-5 w-16 h-16 bg-[var(--color-shakti-primary)]/10 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-shakti-primary)]/10 flex items-center justify-center text-[var(--color-shakti-primary)]">
              <Moon size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Sleep</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] leading-none mb-3 relative z-10">
            {sleepTime}<span className="text-sm font-semibold text-[var(--color-text-secondary)]">h</span>
          </p>
          <input
            type="range" min="4" max="12" step="0.5"
            value={sleepTime} onChange={(e) => setSleepTime(parseFloat(e.target.value))}
            className="w-full accent-[var(--color-shakti-primary)] relative z-10"
          />
          <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] mt-1 relative z-10">Target: 8h</p>
        </div>

        {/* Energy */}
        <div className={metricCardClassName}>
          <div className="absolute -top-5 -right-5 w-16 h-16 bg-[var(--color-shakti-success)]/10 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-shakti-success)]/10 flex items-center justify-center text-[var(--color-shakti-success)]">
              <Battery size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Energy</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] leading-none mb-3 relative z-10">
            {energyLevel}<span className="text-sm font-semibold text-[var(--color-text-secondary)]">/10</span>
          </p>
          <input
            type="range" min="1" max="10" step="1"
            value={energyLevel} onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full accent-[var(--color-shakti-success)] relative z-10"
          />
          <p className="text-[10px] font-semibold text-[var(--color-text-secondary)] mt-1 relative z-10">
            {energyLevel >= 7 ? 'High' : energyLevel >= 4 ? 'Optimal' : 'Low'} battery
          </p>
        </div>
      </div>

      {/* TOOLS */}
      <div className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-4 ml-2">Wellness Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <Link key={t.to} to={t.to} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  className="bg-[var(--color-surface-lowest)] rounded-[1.5rem] p-4 shadow-sm group-hover:shadow-md transition-all relative overflow-hidden border border-white/50 h-full flex flex-col justify-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-inner" style={{ backgroundColor: t.bg, color: t.color }}>
                      <Icon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-0.5 truncate group-hover:text-[var(--color-text-primary)]">{t.title}</h3>
                      <p className="text-xs font-medium text-[var(--color-text-secondary)] truncate">{t.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[var(--color-text-primary)] transition-colors transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* INSIGHT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mt-12 mb-8 bg-[var(--color-surface-lowest)] rounded-[2rem] p-6 sm:p-8 shadow-md relative overflow-hidden border border-[var(--color-surface-highlight)] flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--color-shakti-primary)] via-[var(--color-shakti-secondary)] to-[var(--color-shakti-error)]" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[var(--color-shakti-primary)]/10 to-[var(--color-shakti-secondary)]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex-1 relative z-10 pl-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-[var(--color-shakti-primary)] to-[var(--color-shakti-secondary)] flex items-center justify-center shadow-md shadow-[var(--color-shakti-primary)]/20 text-white flex-shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight">Wellness Insight</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-shakti-primary)]">Personalized for you</p>
            </div>
          </div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] leading-relaxed md:max-w-xl">{getSuggestion()}</p>
        </div>
        
        <div className="flex-shrink-0 relative z-10 pl-2 md:pl-0">
          <button 
            onClick={() => setShowRoutine(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[var(--color-shakti-primary)] to-[var(--color-shakti-secondary)] text-white font-bold rounded-full text-sm shadow-md shadow-[var(--color-shakti-primary)]/20 hover:shadow-lg transform transition-all active:scale-95"
          >
            Plan my routine <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* ROUTINE MODAL */}
      <AnimatePresence>
        {showRoutine && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" onClick={() => setShowRoutine(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[var(--color-surface-lowest)] rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Decorative Ambient Backgrounds */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-bl from-[var(--color-shakti-primary)]/20 to-[var(--color-shakti-secondary)]/20 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-[var(--color-shakti-success)]/20 to-[var(--color-shakti-primary)]/20 blur-3xl rounded-full pointer-events-none" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-8 relative z-10 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[var(--color-surface-highlight)]" />
                      <circle 
                        cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - progressPercentage / 100)}
                        className="text-[var(--color-shakti-primary)] transition-all duration-1000 ease-out" 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-[10px] font-extrabold text-[var(--color-shakti-primary)]">{progressPercentage}%</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-[var(--color-text-primary)] tracking-tight mb-1">My Routine</h3>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">Your path to a balanced day.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRoutine(false)} 
                  className="p-2.5 rounded-full bg-[var(--color-surface-low)] text-[var(--color-text-muted)] hover:bg-[var(--color-shakti-error)]/10 hover:text-[var(--color-shakti-error)] transition-colors shadow-sm border border-[var(--color-surface-highlight)]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-6 relative z-10 overflow-y-auto pr-2 flex-1 scrollbar-hide pb-4 min-h-[40vh]">
                {['Morning', 'Mid-day', 'Evening'].map(timeBlock => (
                  <div key={timeBlock}>
                    <div className="flex items-center gap-2 mb-3 ml-2">
                      {getTimeIcon(timeBlock)}
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{timeBlock}</h4>
                    </div>
                    <div className="space-y-3">
                      {routineTasks.filter(t => t.time === timeBlock).map((task, idx) => {
                        const isDone = completedTasks.includes(task.id);
                        return (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={task.id} 
                            onClick={() => toggleTask(task.id)}
                            className={`group flex items-center justify-between p-4 rounded-[1.25rem] cursor-pointer transition-all duration-300 relative overflow-hidden ${
                              isDone 
                                ? 'bg-gradient-to-r from-[var(--color-shakti-success)]/10 to-[var(--color-shakti-success)]/20 shadow-inner' 
                                : 'bg-[var(--color-surface-lowest)] shadow-sm border border-[var(--color-surface-highlight)] hover:border-[var(--color-shakti-primary)]/30 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              {/* Strikethrough line animation */}
                              <div 
                                className={`absolute left-14 right-14 h-[2px] bg-[var(--color-shakti-success)]/30 rounded-full pointer-events-none transition-all duration-500 ease-out origin-left z-0 ${
                                  isDone ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                                }`} 
                              />
                              
                              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                isDone 
                                  ? 'bg-[var(--color-shakti-success)] text-[var(--color-shakti-dark-text)] shadow-md shadow-[var(--color-shakti-success)]/30 scale-110' 
                                  : 'bg-[var(--color-surface-low)] border-2 border-[var(--color-surface-highlight)] text-transparent group-hover:border-[var(--color-shakti-primary)]/50'
                              }`}>
                                <Check size={16} strokeWidth={3} />
                              </div>
                              
                              <span className={`relative z-10 text-[15px] font-bold transition-all duration-300 ${
                                isDone ? 'text-[var(--color-shakti-success)] opacity-60' : 'text-[var(--color-text-primary)]'
                              }`}>
                                {task.text}
                              </span>
                            </div>
                            
                            <button 
                              onClick={(e) => deleteTask(task.id, e)}
                              className="relative z-10 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-shakti-error)] hover:bg-[var(--color-shakti-error)]/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                              title="Delete task"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        );
                      })}
                      
                      {routineTasks.filter(t => t.time === timeBlock).length === 0 && (
                        <div className="text-sm font-medium text-[var(--color-text-muted)] italic pl-4 py-2">No tasks added for {timeBlock.toLowerCase()} yet.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Task Form */}
              <form onSubmit={addTask} className="mt-4 mb-2 flex items-center gap-2 relative z-10 bg-[var(--color-surface-lowest)] p-2 rounded-2xl shadow-sm border border-[var(--color-surface-highlight)]">
                <select 
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="bg-[var(--color-surface-low)] text-sm font-bold text-[var(--color-text-secondary)] rounded-xl px-3 py-2.5 border-none outline-none cursor-pointer focus:ring-2 focus:ring-[var(--color-shakti-primary)]/20"
                >
                  <option value="Morning">Morning</option>
                  <option value="Mid-day">Mid-day</option>
                  <option value="Evening">Evening</option>
                </select>
                <input 
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add new task..."
                  className="flex-1 bg-transparent text-sm font-medium px-2 py-2 outline-none placeholder-[var(--color-text-muted)] text-[var(--color-text-primary)]"
                />
                <button 
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="w-10 h-10 rounded-xl bg-[var(--color-shakti-primary)] text-white flex items-center justify-center shadow-md shadow-[var(--color-shakti-primary)]/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </form>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-[var(--color-surface-highlight)] relative z-10 flex items-center justify-between flex-shrink-0">
                <span className="text-sm font-bold text-[var(--color-text-secondary)] bg-[var(--color-surface-low)] px-4 py-2 rounded-full border border-[var(--color-surface-highlight)]">
                  <span className="text-[var(--color-shakti-primary)]">{completedTasks.length}</span> / {routineTasks.length} tasks done
                </span>
                
                <AnimatePresence>
                  {routineTasks.length > 0 && completedTasks.length === routineTasks.length && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       className="flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-[var(--color-shakti-success)] to-[var(--color-shakti-success)] px-4 py-2 rounded-full shadow-md shadow-[var(--color-shakti-success)]/20"
                     >
                       <CheckCircle2 size={16} /> All done!
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
