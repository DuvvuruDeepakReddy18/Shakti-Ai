import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuthStore();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { 
      await signIn(email, password); 
      toast.success('Welcome back! 💜'); 
      navigate('/'); 
    } catch { 
      toast.error('Invalid email or password'); 
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try { 
      await signInWithGoogle(); 
      toast.success('Welcome! 💜'); 
      navigate('/'); 
    } catch (err) { 
      console.error("Google sign-in error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled.');
      } else {
        toast.error(err.message || 'Google sign-in failed. Check console for details.'); 
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Force demo mode: bypass Firebase, use local storage directly
      const demoUser = { uid: 'demo-user-001', email: 'demo@shakti.ai', displayName: 'Shakti Warrior', photoURL: null };
      const demoProfile = {
        uid: 'demo-user-001', name: 'Shakti Warrior', email: 'demo@shakti.ai',
        phone: '+91 9876543210', photoURL: '', mode: 'student',
        emergencyContacts: [{ name: 'Mom', phone: '+91 9000000001', relation: 'Mother' }],
        location: { lat: 12.9716, lng: 77.5946 }, isVolunteer: false,
        skills: ['Coding', 'Design'], interests: ['AI', 'Web Dev'],
        safetyScore: 100, moodHistory: [], menstrualData: { lastPeriod: null, cycleLength: 28, periodLength: 5 },
        onboardingComplete: false, ageRange: '18-24', city: 'Bangalore', shePoints: 60, sheLevel: 'Beginner',
      };
      localStorage.setItem('shakti_demo_user', JSON.stringify(demoUser));
      localStorage.setItem('shakti_demo_profile_demo@shakti.ai', JSON.stringify(demoProfile));
      // Update zustand store directly
      useAuthStore.setState({ user: demoUser, userProfile: demoProfile, loading: false, isDemo: true });
      toast.success('Welcome to SHAKTI AI Demo! 💜');
      navigate('/');
    } catch (err) {
      console.error('Demo login error:', err);
      toast.error('Demo login failed.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '48px',
    background: 'var(--color-surface-low)', border: '2px solid transparent',
    borderRadius: '14px', fontSize: '14px', fontFamily: 'var(--font-sans)',
    color: 'var(--color-shakti-dark-text)', outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    color: 'var(--color-outline)', marginBottom: '6px', marginLeft: '2px',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', background: 'var(--color-surface-base)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background accents */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px',
        borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none', opacity: 0.15,
        background: 'radial-gradient(circle, rgba(99,14,212,0.4) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px',
        borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', opacity: 0.12,
        background: 'radial-gradient(circle, rgba(180,19,109,0.25) 0%, transparent 70%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', width: '100%', maxWidth: '480px', zIndex: 10,
          background: 'var(--color-surface-lowest)', padding: '40px 32px',
          borderRadius: '2rem', boxShadow: '0 20px 60px rgba(24,20,69,0.08)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'var(--color-surface-low)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <ShieldCheck size={24} style={{ color: 'var(--color-shakti-primary)' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: '0 0 8px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-outline)', lineHeight: 1.5, margin: 0 }}>
            Sign in to continue your journey with SHAKTI AI.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-shakti-primary)'; e.target.style.background = 'var(--color-surface-lowest)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--color-surface-low)'; }}
                />
                <Mail size={16} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)' }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-shakti-primary)'; e.target.style.background = 'var(--color-surface-lowest)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--color-surface-low)'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: 0 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-shakti-primary)', textDecoration: 'none' }}>
                Forgotten Password?
              </Link>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #630ed4, #B4136D)',
              color: 'white', fontWeight: 700, fontSize: '14px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 24px rgba(99,14,212,0.25)',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,14,212,0.35)'; }}}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,14,212,0.25)'; }}
          >
            {loading ? (
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.6s linear infinite' }} />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-surface-container)' }} />
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-outline)', fontWeight: 700 }}>Or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-surface-container)' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handleGoogleLogin} disabled={loading}
            style={{
              padding: '14px', borderRadius: '14px', border: '1px solid var(--color-surface-container)',
              background: 'var(--color-surface-lowest)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 600, color: 'var(--color-shakti-dark-text)',
              fontFamily: 'var(--font-sans)', transition: 'background 0.2s',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-low)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface-lowest)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button onClick={handleDemoLogin} disabled={loading}
            style={{
              padding: '14px', borderRadius: '14px', border: '1px solid var(--color-surface-container)',
              background: 'var(--color-surface-lowest)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 600, color: 'var(--color-shakti-dark-text)',
              fontFamily: 'var(--font-sans)', transition: 'background 0.2s',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-low)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface-lowest)'}
          >
            <Sparkles size={14} style={{ color: '#B4136D' }} /> Demo
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: 'var(--color-outline)' }}>
          New here?{' '}
          <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-shakti-primary)' }}>
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
