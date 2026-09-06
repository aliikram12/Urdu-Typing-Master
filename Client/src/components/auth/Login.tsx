import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../../core/api';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.token, res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-700/60 shadow-2xl relative overflow-hidden"
    >
      {/* Subtle Glow Behind Card */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-xl shadow-blue-500/30 mb-4 border border-blue-400/30">
          <span className="font-urdu font-black text-3xl leading-none -translate-y-0.5">ٹ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 flex items-center justify-center gap-1.5 font-urdu text-amber-300/90 text-base">
          اپنے اکاؤنٹ میں لاگ ان کریں اور مشق جاری رکھیں
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 mb-6 text-xs text-rose-200 bg-rose-950/60 rounded-xl border border-rose-800/80 flex items-start gap-2 shadow-inner"
        >
          <span className="text-rose-400 font-bold shrink-0">⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500 text-sm transition-all duration-200 shadow-inner"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-11 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-slate-500 text-sm transition-all duration-200 shadow-inner"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transform transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <span>Log In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/80 text-center relative z-10">
        <p className="text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-400 hover:text-cyan-300 font-bold transition cursor-pointer hover:underline inline-flex items-center gap-1"
          >
            <span>Create new account</span>
          </button>
        </p>
      </div>
    </motion.div>
  );
};
