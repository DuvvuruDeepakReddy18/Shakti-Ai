import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch {
      toast.error('Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[var(--color-shakti-dark)]">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="card-static p-8">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[var(--color-shakti-dark-muted)] hover:text-[var(--color-shakti-dark-text)] mb-6">
            <ArrowLeft size={16} /> Back to login
          </Link>
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 mx-auto mb-4 flex items-center justify-center">
                <Send size={28} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-shakti-dark-text)] mb-2">Check your email</h2>
              <p className="text-sm text-[var(--color-shakti-dark-muted)]">We've sent a password reset link to <strong className="text-[var(--color-shakti-dark-text)]">{email}</strong></p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[var(--color-shakti-dark-text)] mb-1">Reset Password</h2>
              <p className="text-sm text-[var(--color-shakti-dark-muted)] mb-6">Enter your email and we'll send you a reset link</p>
              <form onSubmit={handleSubmit}>
                <div className="relative mb-4">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-shakti-dark-muted)]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--color-shakti-dark-surface)] border border-[var(--color-shakti-dark-border)] text-[var(--color-shakti-dark-text)] placeholder-[var(--color-shakti-dark-muted)] focus:outline-none focus:border-[var(--color-shakti-primary)] text-sm" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20">
                  Send Reset Link
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
