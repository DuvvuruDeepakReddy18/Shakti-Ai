import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, ArrowLeft, Sparkles, Target, Clock, Layers, Star, Check, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateProjectIdeas } from '../../services/aiService';

const ACCENT = '#6366f1';
const ACCENT_LIGHT = '#a855f7';

const PROJECT_COLORS = ['#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'];

const skillOptions = ['Python', 'JavaScript', 'React', 'AI/ML', 'Mobile', 'DevOps', 'Cloud', 'Design'];
const interestOptions = ['Health', 'Finance', 'Education', 'Climate', 'Safety', 'Productivity', 'Gaming', 'Art'];

export default function ProjectGenerator() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(['Python']);
  const [interests, setInterests] = useState(['Health']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState(null);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const handleGenerate = async () => {
    if (skills.length === 0 || interests.length === 0) {
      toast.error('Pick at least one skill and interest');
      return;
    }
    setIsGenerating(true);
    setProjects(null);
    try {
      const ideas = await generateProjectIdeas(skills.join(', '), interests.join(', '));
      if (!ideas || ideas.length === 0) {
        toast.error('No ideas generated. Try different skills.');
        setIsGenerating(false);
        return;
      }
      // Normalize the LLM response into the shape this page expects
      const normalized = ideas.slice(0, 5).map((idea, i) => ({
        title: idea.title || 'Untitled project',
        desc: idea.description || idea.desc || '',
        stack: Array.isArray(idea.techStack)
          ? idea.techStack
          : Array.isArray(idea.stack) ? idea.stack : [],
        difficulty: idea.difficulty || 'Intermediate',
        time: idea.timeEstimate || idea.time || '2-3 weeks',
        impact: idea.impact || (Array.isArray(idea.learningOutcomes) ? idea.learningOutcomes.join(' · ') : 'Builds practical skills'),
        color: PROJECT_COLORS[i % PROJECT_COLORS.length],
      }));
      setProjects(normalized);
      toast.success(`${normalized.length} ideas generated`);
    } catch (err) {
      console.error('Project generation failed:', err);
      toast.error('AI models are busy — please try again in a moment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const cardStyle = {
    background: 'var(--color-surface-lowest)',
    borderRadius: '1.25rem',
    boxShadow: '0 1px 6px rgba(24,20,69,0.03)',
  };

  const difficultyMeta = (d) => {
    if (d === 'Beginner') return { bg: '#ecfdf5', text: '#047857', border: 'rgba(16,185,129,0.22)' };
    if (d === 'Intermediate') return { bg: '#eff6ff', text: '#1d4ed8', border: 'rgba(59,130,246,0.22)' };
    return { bg: '#fdf4ff', text: '#a21caf', border: 'rgba(168,85,247,0.22)' };
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '13px', color: 'var(--color-outline)', background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '16px', fontFamily: 'var(--font-sans)',
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'relative', borderRadius: '1.5rem', padding: '28px 24px',
          marginBottom: '18px', overflow: 'hidden',
          background: 'var(--color-surface-lowest)',
          boxShadow: '0 2px 16px rgba(24,20,69,0.04)',
        }}
      >
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '200px', height: '200px', background: `${ACCENT}14`, borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 20px ${ACCENT}40`,
          }}>
            <Code size={24} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.2 }}>Project Generator</h1>
            <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: '3px 0 0' }}>Discover your next big idea. Tailored to your unique skills and passions.</p>
          </div>
        </div>
      </motion.div>

      {/* Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ ...cardStyle, padding: '22px', marginBottom: '18px' }}
      >
        {/* Skills */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: '#fffbeb', color: '#d97706',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Star size={14} />
            </div>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Your Arsenal (Skills)</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skillOptions.map((s) => {
              const isSelected = skills.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(skills, setSkills, s)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '7px 12px', borderRadius: '10px',
                    fontSize: '12px', fontWeight: 700,
                    background: isSelected ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})` : 'var(--color-surface-low)',
                    color: isSelected ? 'white' : 'var(--color-outline)',
                    border: isSelected ? 'none' : '1px solid rgba(24,20,69,0.05)',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    boxShadow: isSelected ? `0 4px 10px ${ACCENT}33` : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {isSelected && <Check size={12} />} {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: '#fef2f2', color: '#e11d48',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Target size={14} />
            </div>
            <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Your Focus (Interests)</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {interestOptions.map((i) => {
              const isSelected = interests.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => toggle(interests, setInterests, i)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '7px 12px', borderRadius: '10px',
                    fontSize: '12px', fontWeight: 700,
                    background: isSelected ? 'linear-gradient(135deg, #e11d48, #ec4899)' : 'var(--color-surface-low)',
                    color: isSelected ? 'white' : 'var(--color-outline)',
                    border: isSelected ? 'none' : '1px solid rgba(24,20,69,0.05)',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    boxShadow: isSelected ? '0 4px 10px rgba(225,29,72,0.25)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {isSelected && <Check size={12} />} {i}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action */}
        <button
          disabled={isGenerating || skills.length === 0 || interests.length === 0}
          onClick={handleGenerate}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: (isGenerating || skills.length === 0 || interests.length === 0) ? '#94a3b8' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT})`,
            color: 'white', border: 'none', fontSize: '14px', fontWeight: 700,
            cursor: (isGenerating || skills.length === 0 || interests.length === 0) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: (isGenerating || skills.length === 0 || interests.length === 0) ? 'none' : `0 4px 12px ${ACCENT}33`,
            fontFamily: 'var(--font-sans)', transition: 'all 0.2s'
          }}
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {isGenerating ? 'AI is generating…' : 'Generate Project Ideas'}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {projects && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 4px 4px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={16} style={{ color: ACCENT }} /> Your Personalized Roadmap
              </h2>
              <span style={{
                fontSize: '11px', fontWeight: 700, color: '#047857',
                background: '#ecfdf5', padding: '4px 10px', borderRadius: '999px',
                border: '1px solid rgba(16,185,129,0.22)',
                display: 'inline-flex', alignItems: 'center', gap: '4px'
              }}>
                <CheckCircle2 size={12} /> {projects.length} Match{projects.length === 1 ? '' : 'es'} Found
              </span>
            </div>

            {projects.map((p, i) => {
              const dm = difficultyMeta(p.difficulty);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ ...cardStyle, padding: '20px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)`,
                      color: 'white', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 12px ${p.color}33`
                    }}>
                      <Code size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-shakti-dark-text)', margin: 0, lineHeight: 1.3 }}>{p.title}</h3>
                        <span style={{
                          padding: '3px 10px', borderRadius: '999px',
                          fontSize: '10px', fontWeight: 700,
                          background: dm.bg, color: dm.text, border: `1px solid ${dm.border}`,
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                          <Target size={11} /> {p.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-outline)', margin: 0, lineHeight: 1.55 }}>{p.desc}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 12px', borderRadius: '10px',
                      background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.04)',
                      fontSize: '12px', color: 'var(--color-shakti-dark-text)'
                    }}>
                      <Layers size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.stack.join(' · ')}</span>
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 12px', borderRadius: '10px',
                      background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.04)',
                      fontSize: '12px', color: 'var(--color-shakti-dark-text)'
                    }}>
                      <Clock size={13} style={{ color: '#e11d48', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{p.time} estimated</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px', borderRadius: '12px',
                    background: '#ecfdf5', border: '1px solid rgba(16,185,129,0.18)'
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: 'rgba(16,185,129,0.18)', color: '#047857',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <Sparkles size={14} />
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#065f46', margin: 0, lineHeight: 1.4 }}>
                      {p.impact}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
