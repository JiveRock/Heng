import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';

export interface UserAuth {
  name: string;
  email: string;
  authenticated: boolean;
  avatar: string;
  provider: 'email' | 'google';
}

interface AuthScreenProps {
  onLoginSuccess: (user: UserAuth) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick simulation of Gmail Accounts
  const mockGoogleAccounts = [
    { name: 'សុខ ជា (Sok Chea)', email: 'sok.chea.student@gmail.com', avatar: '🧑‍🎓' },
    { name: 'ពិសិដ្ឋ វឌ្ឍនៈ (Piseth Vattanak)', email: 'piseth.math.pro@gmail.com', avatar: '👨‍💻' },
    { name: 'ស្រីណុច ម៉ៅ (Sreynoch Mao)', email: 'sreynoch.mao@gmail.com', avatar: '👩‍🏫' }
  ];

  const validateEmail = (val: string) => {
    return val.includes('@') && val.length > 5;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister && !name.trim()) {
      setError('សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក ដើម្បីបង្ហាញលើបណ្ណសរសើរ! (Please enter your name)');
      return;
    }
    if (!validateEmail(email)) {
      setError('សូមបញ្ចូលប្រអប់សំបុត្រអុីម៉ែលឱ្យបានត្រឹមត្រូវ! (Invalid email format)');
      return;
    }
    if (password.length < 4) {
      setError('លេខសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៤ ខ្ទង់! (Password must be at least 4 chars)');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const authUser: UserAuth = {
        name: isRegister ? name : (email.split('@')[0].toUpperCase().replace('.', ' ')),
        email: email,
        authenticated: true,
        avatar: isRegister ? '📖' : '🧠',
        provider: 'email'
      };
      
      localStorage.setItem('kh_math_user_auth', JSON.stringify(authUser));
      // Pre-fill student name in local storage for certificates
      localStorage.setItem('kh_student_name_cached', authUser.name);
      
      setLoading(false);
      onLoginSuccess(authUser);
    }, 1000);
  };

  const handleGoogleLogin = (mockUser: typeof mockGoogleAccounts[0]) => {
    setLoading(true);
    setTimeout(() => {
      const authUser: UserAuth = {
        name: mockUser.name,
        email: mockUser.email,
        authenticated: true,
        avatar: mockUser.avatar,
        provider: 'google'
      };
      localStorage.setItem('kh_math_user_auth', JSON.stringify(authUser));
      localStorage.setItem('kh_student_name_cached', authUser.name);
      setLoading(false);
      onLoginSuccess(authUser);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic star fields glowing inside background to resemble a Cosmic interface */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-10 text-white">
        
        {/* App Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/10 mb-2">
            <span className="text-3xl select-none font-bold italic text-white">UMA</span>
          </div>
          <h2 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            សាលាគណិតឆ្លាតវៃ (Universal Math)
          </h2>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">
            សូមចូលគណនី ដើម្បីទទួលបានការសិក្សាល្អបំផុត
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-[11px] font-bold flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ឈ្មោះពេញរបស់អ្នក (Full Name)</label>
                <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs">
                  <User size={14} className="text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ឧ. សុខ សាន្ត"
                    className="bg-transparent text-white focus:outline-none w-full font-semibold placeholder-slate-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">អុីម៉ែល ឬ Gmail គណនី (Email / Gmail)</label>
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs">
              <Mail size={14} className="text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yours@gmail.com"
                className="bg-transparent text-white focus:outline-none w-full font-semibold placeholder-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">លេខសម្ងាត់ (Password)</label>
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs">
              <Lock size={14} className="text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent text-white focus:outline-none w-full font-semibold placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/30 active:scale-95 transition-all mt-6 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isRegister ? 'ចុះឈ្មោះ និងចូលសិក្សា' : 'ចូលគណនីសិក្សា (Login)'}</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-transparent">
          <span>{isRegister ? 'មានគណនីរួចហើយ?' : 'មិនទាន់មានគណនី?'}</span>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 font-extrabold hover:underline"
          >
            {isRegister ? 'ចូលគណនី (Login)' : 'ចុះឈ្មោះរហ័ស (Sign Up)'}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[9px] text-slate-500 font-black uppercase tracking-widest">ឬចូលរហ័សជាមួយ Gmail (Gmail SSO)</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Quick Simulated Gmail Account Logins */}
        <div className="space-y-2">
          {mockGoogleAccounts.map((g, idx) => (
            <button
              key={idx}
              onClick={() => handleGoogleLogin(g)}
              disabled={loading}
              className="w-full flex items-center justify-between p-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl hover:border-slate-700 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg bg-slate-800 w-8 h-8 rounded-lg flex items-center justify-center select-none">{g.avatar}</span>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-200 leading-normal">{g.name}</p>
                  <p className="text-[9px] text-slate-500 font-semibold truncate leading-none">{g.email}</p>
                </div>
              </div>
              <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-black opacity-0 group-hover:opacity-100 transition-opacity">
                Link account
              </span>
            </button>
          ))}
        </div>

        <div className="text-[10px] text-slate-500 text-center select-text">
          🔐 រាល់ការសិក្សា និងពិន្ទុរបស់អ្នកនឹងរក្សាទុកដោយស្វ័យប្រវត្តិ។
        </div>

      </div>
    </div>
  );
}
