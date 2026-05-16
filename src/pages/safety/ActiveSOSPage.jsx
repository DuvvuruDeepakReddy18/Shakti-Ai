import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSafetyStore from '../../store/safetyStore';
import { ShieldAlert, MapPin, Phone, ShieldCheck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActiveSOSPage() {
  const { sosStatus, deactivateSOS, activateSOS } = useSafetyStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // If not in notifying or active state, redirect home
    if (sosStatus === 'idle') {
      navigate('/');
    }
  }, [sosStatus, navigate]);

  useEffect(() => {
    let timers = [];
    if (sosStatus === 'notifying') {
      // Step 0: Locating (0-2s)
      timers.push(setTimeout(() => setStep(1), 2000)); // Alerting Contacts
      timers.push(setTimeout(() => setStep(2), 5000)); // Alerting Police
      timers.push(setTimeout(() => {
        setStep(3); // Help is on the way
        activateSOS(); // Officially trigger the real SOS in the store
      }, 8000));
    }
    
    // If it's already active (e.g., from an immediate trigger elsewhere), jump to end
    if (sosStatus === 'active') {
      setStep(3);
    }

    return () => timers.forEach(clearTimeout);
  }, [sosStatus, activateSOS]);

  const handleCancel = () => {
    deactivateSOS();
    navigate('/');
  };

  const steps = [
    { text: "Locating your position...", icon: MapPin },
    { text: "Alerting Emergency Contacts...", icon: Phone },
    { text: "Contacting Local Authorities...", icon: ShieldAlert },
    { text: "Help is on the way!", icon: ShieldCheck }
  ];

  const CurrentIcon = steps[step]?.icon || ShieldAlert;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-shakti-safety)] to-rose-950 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden font-sans">
      {/* Premium Pulsing background effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[120vw] h-[120vw] bg-[var(--color-shakti-safety-light)] opacity-5 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute w-[80vw] h-[80vw] bg-rose-500 opacity-10 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md text-center relative">
        <motion.div 
          key={step}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md text-white p-6 rounded-full mb-8 shadow-[0_0_60px_rgba(255,255,255,0.15)] flex items-center justify-center border border-white/20 relative"
        >
          <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse"></div>
          <CurrentIcon size={64} strokeWidth={1.5} className="relative z-10" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1 
            key={step}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight"
          >
            {steps[step]?.text}
          </motion.h1>
        </AnimatePresence>

        <p className="text-white/80 text-sm md:text-base font-medium mb-12 h-12 px-4 leading-relaxed">
          {step < 3 
            ? "Stay calm. We are processing your emergency request and alerting nearby responders." 
            : "Your live location is actively being shared with authorities and emergency contacts."}
        </p>

        {step < 3 && (
          <div className="w-full bg-black/20 backdrop-blur-sm rounded-full h-2 mb-12 overflow-hidden border border-white/10">
            <motion.div 
              className="bg-white/90 h-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              initial={{ width: `${(step / 3) * 100}%` }}
              animate={{ width: `${((step + 1) / 3) * 100}%` }}
              transition={{ duration: step === 0 ? 2 : 3, ease: "linear" }}
            />
          </div>
        )}

        <button 
          onClick={handleCancel}
          className="mt-8 w-full py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/20 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.2)] active:scale-95 border border-white/20 hover:border-white/40"
        >
          <XCircle size={24} />
          I'm Safe (Cancel SOS)
        </button>
      </div>
    </div>
  );
}
