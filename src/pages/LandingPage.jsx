import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Target, Users, ArrowRight, Quote } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function LandingPage() {
  const { user, loading } = useAuthStore();

  // If user is already logged in and we finished checking, go to dashboard
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const features = [
    { icon: Shield, title: 'Smart Safety', desc: 'AI-powered incident analysis and real-time tracking.', color: '#a20017' },
    { icon: Sparkles, title: 'Health & Wellness', desc: 'Sync your cycle, track mood, and chat with AI.', color: '#B4136D' },
    { icon: Target, title: 'Career Growth', desc: 'Beat the ATS, find mentors, and win hackathons.', color: '#630ed4' },
    { icon: Users, title: 'Safe Community', desc: 'Connect with verified peers in trusted circles.', color: '#F59E0B' },
  ];

  const quotes = [
    { text: "A woman with a voice is, by definition, a strong woman.", author: "Melinda Gates" },
    { text: "The future is female — and it's powered by technology.", author: "Reshma Saujani" },
    { text: "There is no limit to what we, as women, can accomplish.", author: "Michelle Obama" },
    { text: "She believed she could, so she did.", author: "R.S. Grey" },
    { text: "Well-behaved women seldom make history.", author: "Laurel Thatcher Ulrich" },
    { text: "A woman is the full circle. Within her is the power to create, nurture, and transform.", author: "Diane Mariechild" },
  ];

  const [currentQuote, setCurrentQuote] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', color: 'var(--color-shakti-dark-text)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Background Image & Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(/landing-hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6) 0%, rgba(252, 245, 255, 0.95) 100%)',
        zIndex: 0
      }} />

      {/* Header */}
      <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #a20017, #B4136D)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>SHAKTI AI</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" style={{ padding: '10px 20px', borderRadius: '999px', fontWeight: 600, color: 'var(--color-shakti-dark-text)', textDecoration: 'none', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)' }}>
            Log In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '600px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '999px', color: '#B4136D', fontSize: '13px', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Sparkles size={16} /> Empowering Women Globally
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.1, margin: '0 0 24px' }}>
            Your Digital <br />
            <span style={{ background: 'linear-gradient(135deg, #a20017, #B4136D, #630ed4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Shield & Mentor
            </span>
          </h1>

          <p style={{ fontSize: '18px', color: '#3d2a50', lineHeight: 1.6, margin: '0 0 40px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', fontWeight: 500 }}>
            A comprehensive ecosystem leveraging artificial intelligence for your safety, career progression, holistic health, and community building.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', sm: { flexDirection: 'row' }, gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" style={{
              padding: '16px 32px', borderRadius: '999px', background: 'linear-gradient(135deg, #a20017, #B4136D)',
              color: 'white', fontWeight: 700, fontSize: '16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 32px rgba(180,19,109,0.3)', transition: 'transform 0.2s'
            }}>
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" style={{
              padding: '16px 32px', borderRadius: '999px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.8)',
              color: 'var(--color-shakti-dark-text)', fontWeight: 600, fontSize: '16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              I already have an account
            </Link>
          </div>

          {/* Inspiring Quote */}
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            style={{
              marginTop: '36px',
              padding: '20px 28px',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: '1.25rem',
              border: '1px solid rgba(180,19,109,0.15)',
              boxShadow: '0 4px 20px rgba(180,19,109,0.08)',
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
              position: 'relative'
            }}
          >
            <Quote size={20} style={{ color: '#B4136D', opacity: 0.4, position: 'absolute', top: '12px', left: '14px' }} />
            <p style={{ fontSize: '15px', fontStyle: 'italic', color: '#4a2c5e', lineHeight: 1.6, margin: '0 0 8px', fontWeight: 500 }}>
              "{quotes[currentQuote].text}"
            </p>
            <span style={{ fontSize: '13px', color: '#B4136D', fontWeight: 700 }}>
              — {quotes[currentQuote].author}
            </span>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', width: '100%', maxWidth: '1200px', marginTop: '80px', textAlign: 'left' }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', padding: '24px', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${feat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon size={24} style={{ color: feat.color }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>{feat.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-outline)', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            );
          })}
        </motion.div>

      </main>
    </div>
  );
}
