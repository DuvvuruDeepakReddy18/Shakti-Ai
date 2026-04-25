import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, MicOff, Volume2, Hash, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useUiStore from '../store/uiStore';

export default function FakeCallOverlay() {
  const { fakeCallActive, endFakeCall } = useUiStore();
  
  const [callState, setCallState] = useState('hidden'); // hidden, countdown, incoming, active
  const [countdown, setCountdown] = useState(5);
  const [timer, setTimer] = useState(0);
  const synth = window.speechSynthesis;
  const timerInterval = useRef(null);

  // Handle triggering
  useEffect(() => {
    if (fakeCallActive) {
      setCallState('countdown');
      setCountdown(5);
    } else {
      setCallState('hidden');
      if (synth.speaking) synth.cancel();
      clearInterval(timerInterval.current);
    }
  }, [fakeCallActive]);

  // Handle countdown
  useEffect(() => {
    if (callState === 'countdown') {
      if (countdown > 0) {
        const to = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(to);
      } else {
        setCallState('incoming');
        // Play ringtone or vibrate here if possible
        if (navigator.vibrate) {
          navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
        }
      }
    }
  }, [callState, countdown]);

  // Handle active call timer
  useEffect(() => {
    if (callState === 'active') {
      timerInterval.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
      
      return () => clearInterval(timerInterval.current);
    }
  }, [callState]);

  const handleAccept = () => {
    setCallState('active');
    setTimer(0);
    if (navigator.vibrate) navigator.vibrate(0);
    
    // Play voice
    setTimeout(() => {
      if (synth) {
        synth.cancel(); // clear queue
        const utterance = new SpeechSynthesisUtterance("Hey, I'm waiting outside your building, come down now. I've been waiting for a while.");
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // slightly higher pitch for "mom" or generic female voice
        
        // Try to find a female voice
        const voices = synth.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
        if (femaleVoice) utterance.voice = femaleVoice;
        
        synth.speak(utterance);
      }
    }, 1000); // 1 sec delay before speaking
  };

  const handleDecline = () => {
    if (navigator.vibrate) navigator.vibrate(0);
    if (synth.speaking) synth.cancel();
    endFakeCall();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (callState === 'hidden') return null;

  if (callState === 'countdown') {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: 'white',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '20px' }}>Simulated Call starting in...</h2>
        <motion.div
          key={countdown}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '48px', fontWeight: 'bold', boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)'
          }}
        >
          {countdown}
        </motion.div>
        <button 
          onClick={handleDecline}
          style={{
            marginTop: '40px', padding: '12px 24px', borderRadius: '30px',
            background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none',
            fontSize: '16px', cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          color: 'white', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'space-between', padding: '60px 20px 40px'
        }}
      >
        {/* Top Info */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 400, margin: '0 0 10px', letterSpacing: '1px' }}>
            Mom
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            {callState === 'incoming' ? 'mobile...' : formatTime(timer)}
          </p>
        </div>

        {/* Middle Actions (only visible when active) */}
        {callState === 'active' && (
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '30px', width: '100%', maxWidth: '300px', margin: '40px auto 0' 
          }}>
            {[
              { icon: <MicOff size={28} />, label: 'mute' },
              { icon: <Hash size={28} />, label: 'keypad' },
              { icon: <Volume2 size={28} />, label: 'speaker' },
              { icon: <Plus size={28} />, label: 'add call' },
              { icon: <Phone size={28} />, label: 'FaceTime' },
              { icon: <Phone size={28} />, label: 'contacts' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '65px', height: '65px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Call Controls */}
        <div style={{ 
          display: 'flex', width: '100%', maxWidth: '300px', 
          justifyContent: callState === 'incoming' ? 'space-between' : 'center',
          marginBottom: '20px'
        }}>
          
          {callState === 'incoming' ? (
            <>
              {/* Decline */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={handleDecline}
                  style={{
                    width: '75px', height: '75px', borderRadius: '50%', border: 'none',
                    background: '#EF4444', color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  <PhoneOff size={32} />
                </button>
                <span style={{ fontSize: '16px' }}>Decline</span>
              </div>

              {/* Accept */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <motion.button 
                  onClick={handleAccept}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    width: '75px', height: '75px', borderRadius: '50%', border: 'none',
                    background: '#10B981', color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <Phone size={32} />
                </motion.button>
                <span style={{ fontSize: '16px' }}>Accept</span>
              </div>
            </>
          ) : (
            /* End Call */
            <button 
              onClick={handleDecline}
              style={{
                width: '75px', height: '75px', borderRadius: '50%', border: 'none',
                background: '#EF4444', color: 'white', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
              }}
            >
              <PhoneOff size={32} />
            </button>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
