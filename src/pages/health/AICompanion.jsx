import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, Loader2, Trash2, Heart, Bot } from 'lucide-react';
import { chatWithCompanion } from '../../services/aiService';
import useHealthStore from '../../store/healthStore';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  'I\'m feeling overwhelmed today',
  'How do I deal with workplace stress?',
  'I need motivation',
  'Help me sleep better',
];

export default function AICompanion() {
  const { chatHistory, addChatMessage, clearChat } = useHealthStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [chatHistory, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: msg, ts: Date.now() };
    addChatMessage(userMsg);
    setLoading(true);
    try {
      const reply = await chatWithCompanion(msg, chatHistory);
      addChatMessage({ role: 'model', content: reply, ts: Date.now() });
    } catch {
      toast.error('SHAKTI is resting. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)',
      width: '100%', background: 'var(--color-surface)', position: 'relative',
      overflow: 'hidden', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(24,20,69,0.03)'
    }}>
      {/* Background gradients */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none', opacity: 0.15,
        background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0) 70%)'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px',
        borderRadius: '50%', filter: 'blur(150px)', pointerEvents: 'none', opacity: 0.15,
        background: 'radial-gradient(circle, rgba(236,72,153,0.8) 0%, rgba(236,72,153,0) 70%)'
      }} />

      <div style={{
        width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column',
        height: '100%', position: 'relative', zIndex: 10,
        background: 'var(--color-surface-lowest)', borderLeft: '1px solid rgba(24,20,69,0.05)', borderRight: '1px solid rgba(24,20,69,0.05)'
      }}>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            flexShrink: 0, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid rgba(24,20,69,0.05)', background: 'var(--color-surface-lowest)', zIndex: 20
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', boxShadow: '0 4px 12px rgba(236,72,153,0.3)'
            }}>
              <Sparkles size={20} color="white" />
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '14px', height: '14px', borderRadius: '50%', background: '#4ade80', border: '2px solid white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: 0 }}>SHAKTI Companion</h1>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#ec4899', margin: '2px 0 0' }}>Always here for you 💜</p>
            </div>
          </div>
          {chatHistory.length > 0 && (
            <button onClick={clearChat} style={{
              padding: '10px', borderRadius: '12px', background: '#fff1f2', color: '#f43f5e',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} onMouseEnter={(e) => e.currentTarget.style.background = '#ffe4e6'} onMouseLeave={(e) => e.currentTarget.style.background = '#fff1f2'}>
              <Trash2 size={18} />
            </button>
          )}
        </motion.div>

        {/* Chat Area */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '24px'
        }}>
          {chatHistory.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '100%', textAlign: 'center', gap: '24px', padding: '16px'
              }}>
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(236,72,153,0.3)', position: 'relative'
              }}>
                 <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(20px)' }} />
                 <Heart size={40} color="white" style={{ position: 'relative', zIndex: 10 }} />
              </div>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: '0 0 12px 0' }}>Hi, I'm SHAKTI</h2>
                <p style={{ fontSize: '15px', color: 'var(--color-outline)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
                  I'm here to listen, support, and help you through tough moments. No judgment, just care.
                </p>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '500px', marginTop: '32px'
              }}>
                {SUGGESTIONS.map((s, idx) => (
                  <motion.button key={s} 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    onClick={() => send(s)}
                    style={{
                      padding: '16px 20px', borderRadius: '16px', background: 'var(--color-surface-low)',
                      border: '1px solid rgba(24,20,69,0.05)', color: 'var(--color-shakti-dark-text)', fontSize: '14px',
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)', lineHeight: 1.4
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(236,72,153,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(24,20,69,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    "{s}"
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }}
                style={{
                  display: 'flex', width: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                {msg.role === 'model' && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginRight: '12px', marginTop: 'auto', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <Sparkles size={14} color="white" />
                  </div>
                )}
                <div style={{
                  maxWidth: '85%', padding: '16px 20px', borderRadius: '24px',
                  fontSize: '15px', lineHeight: 1.6, wordBreak: 'break-word',
                  ...(msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: 'white',
                    borderBottomRightRadius: '4px',
                    boxShadow: '0 4px 12px rgba(139,92,246,0.2)'
                  } : {
                    background: 'var(--color-surface-low)',
                    color: 'var(--color-shakti-dark-text)',
                    borderBottomLeftRadius: '4px',
                    border: '1px solid rgba(24,20,69,0.05)'
                  })
                }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: '12px', marginTop: 'auto', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Sparkles size={14} color="white" />
              </div>
              <div style={{
                padding: '16px 20px', borderRadius: '24px', borderBottomLeftRadius: '4px',
                background: 'var(--color-surface-low)', border: '1px solid rgba(24,20,69,0.05)',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '150ms' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          <div ref={endRef} style={{ height: '16px' }} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 24px', flexShrink: 0, zIndex: 20, background: 'var(--color-surface-lowest)', borderTop: '1px solid rgba(24,20,69,0.05)' }}>
          <div style={{
            display: 'flex', gap: '12px', alignItems: 'center', padding: '8px',
            borderRadius: '24px', background: 'var(--color-surface-low)',
            border: '1px solid rgba(24,20,69,0.05)', transition: 'border 0.2s',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = 'var(--color-surface-lowest)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(24,20,69,0.05)'; e.currentTarget.style.background = 'var(--color-surface-low)'; }}
          >
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Share what's on your mind..."
              disabled={loading}
              style={{
                flex: 1, padding: '12px 16px', background: 'transparent', color: 'var(--color-shakti-dark-text)',
                border: 'none', outline: 'none', fontSize: '15px', fontFamily: 'var(--font-sans)'
              }} />
            <button onClick={() => send()} disabled={loading || !input.trim()}
              style={{
                width: '44px', height: '44px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                opacity: (loading || !input.trim()) ? 0.5 : 1, transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(139,92,246,0.3)'
              }}
              onMouseEnter={(e) => { if(!(loading || !input.trim())) { e.currentTarget.style.transform = 'scale(1.05)'; } }}
              onMouseLeave={(e) => { if(!(loading || !input.trim())) { e.currentTarget.style.transform = 'none'; } }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
