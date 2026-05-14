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
    <div className="min-h-screen bg-[#ff1a1a] flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Pulsing background effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[150vw] h-[150vw] bg-white opacity-10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md text-center">
        <motion.div 
          key={step}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white text-[#ff1a1a] p-8 rounded-full mb-8 shadow-2xl"
        >
          <CurrentIcon size={80} strokeWidth={1.5} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1 
            key={step}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-3xl font-bold mb-4"
          >
            {steps[step]?.text}
          </motion.h1>
        </AnimatePresence>

        <p className="text-white/80 mb-12 h-12">
          {step < 3 
            ? "Stay calm. We are processing your emergency request." 
            : "Your live location is being shared with responders."}
        </p>

        {step < 3 && (
          <div className="w-full bg-black/20 rounded-full h-3 mb-12 overflow-hidden">
            <motion.div 
              className="bg-white h-full"
              initial={{ width: `${(step / 3) * 100}%` }}
              animate={{ width: `${((step + 1) / 3) * 100}%` }}
              transition={{ duration: step === 0 ? 2 : 3, ease: "linear" }}
            />
          </div>
        )}

        <button 
          onClick={handleCancel}
          className="mt-auto w-full py-4 bg-white text-[#ff1a1a] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg active:scale-95"
        >
          <XCircle size={24} />
          I'm Safe (Cancel SOS)
        </button>
      </div>
    </div>
  );
}
