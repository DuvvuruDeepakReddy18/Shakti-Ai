import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import useSafetyStore from '../store/safetyStore';

export default function FloatingSOSButton() {
  const { 
    startSOSCountdown, 
    cancelSOSCountdown, 
    sosProgress, 
    sosActive,
    sosStatus
  } = useSafetyStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef(null);

  const handlePressStart = (e) => {
    // Prevent default to avoid selection issues on mobile
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    setIsPressing(true);
    startSOSCountdown();
  };

  const handlePressEnd = () => {
    setIsPressing(false);
    // If we didn't reach 100, cancel it.
    // If we reached 100, useSafetyStore already handles activateSOS
    if (sosProgress < 100 && sosStatus === 'idle') {
      cancelSOSCountdown();
    }
  };

  useEffect(() => {
    if (sosStatus === 'notifying') {
      navigate('/safety/active');
    }
  }, [sosStatus, navigate]);

  if (location.pathname === '/safety/active') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px', // Above bottom nav
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    }}>
      {/* Progress Ring and Button */}
      <div 
        style={{ position: 'relative', width: '70px', height: '70px' }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {/* SVG Progress Ring */}
        <svg 
          width="70" height="70" 
          viewBox="0 0 100 100" 
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
        >
          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke={sosActive ? "#ff1a1a" : "rgba(255, 26, 26, 0.2)"} 
            strokeWidth="8" 
          />
          {!sosActive && (
            <circle 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke="#ff1a1a" 
              strokeWidth="8" 
              strokeDasharray="289.02" // 2 * PI * 46
              strokeDashoffset={289.02 - (289.02 * (sosProgress / 100))}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          )}
        </svg>

        {/* Inner Button */}
        <button
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: sosActive ? '#ff1a1a' : 'linear-gradient(135deg, #ff4b4b, #ff1a1a)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: sosActive 
              ? '0 0 20px 10px rgba(255, 26, 26, 0.5)' 
              : '0 4px 15px rgba(255, 26, 26, 0.4)',
            transition: 'all 0.2s',
            animation: sosActive ? 'pulse 1s infinite' : isPressing ? 'vibrate 0.1s infinite' : 'none'
          }}
          aria-label="SOS Button"
        >
          <AlertCircle size={32} />
        </button>
      </div>
      
      {/* Label */}
      <span style={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#ff1a1a',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '4px 10px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        opacity: isPressing || sosActive ? 1 : 0.8,
        transition: 'opacity 0.2s'
      }}>
        {sosActive ? 'SOS ACTIVE' : 'HOLD FOR SOS'}
      </span>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 26, 26, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(255, 26, 26, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 26, 26, 0); }
        }
        @keyframes vibrate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-52%, -48%) rotate(2deg); }
          50% { transform: translate(-48%, -52%) rotate(-2deg); }
          75% { transform: translate(-52%, -52%) rotate(2deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
