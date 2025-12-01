import React, { useState } from 'react';
import { User as UserIcon, Lock, ArrowRight, Mail, ChevronLeft } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (username: string, role: 'admin' | 'seller' | 'user') => void;
  onNavigate: (page: string) => void;
  users: User[]; // Received from App
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigate, users }) => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  // Login State
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check against the mock database (users prop)
    const foundUser = users.find(u => 
        (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
         u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && 
        u.password === password
    );

    if (foundUser) {
        onLogin(foundUser.username, foundUser.role);
    } else {
        setError('Invalid credentials.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setTimeout(() => {
        setResetStatus('success');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-100 transition-all">
        
        {view === 'login' ? (
            <>
                <button 
                    onClick={() => onNavigate('home')}
                    className="flex items-center text-slate-400 hover:text-slate-600 mb-6 text-sm font-bold"
                >
                    <ChevronLeft size={16} className="mr-1" /> Back to Home
                </button>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <UserIcon size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 text-sm">Log in to your account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username or Email</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                        type="text"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-brand-500 transition-all outline-none"
                        placeholder="username or email"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-brand-500 transition-all outline-none"
                        placeholder="••••••••"
                        />
                    </div>
                    <div className="text-right mt-2">
                        <button 
                            type="button"
                            onClick={() => setView('forgot')}
                            className="text-xs text-brand-600 font-bold hover:text-brand-700"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg text-center">{error}</p>}
                
                <button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 group"
                >
                    Login
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">Don't have an account?</p>
                    <button 
                        onClick={() => onNavigate('register')}
                        className="text-brand-600 font-bold hover:underline mt-1"
                    >
                        Register
                    </button>
                </div>
                
                <p className="mt-4 text-center text-xs text-slate-400">
                    Demo: Use <strong>admin/admin</strong> or <strong>buyer/buyer</strong>
                </p>
            </>
        ) : (
            <>
                <button 
                    onClick={() => {
                        setView('login');
                        setResetStatus('idle');
                        setResetEmail('');
                    }}
                    className="flex items-center text-slate-400 hover:text-slate-600 mb-6 text-sm font-bold"
                >
                    <ChevronLeft size={16} className="mr-1" /> Back to Login
                </button>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-slate-500 text-sm">Enter your email to receive recovery instructions.</p>
                </div>

                {resetStatus === 'success' ? (
                    <div className="text-center bg-green-50 p-6 rounded-2xl border border-green-100">
                        <p className="text-green-700 font-bold mb-2">Check your inbox!</p>
                        <p className="text-green-600 text-sm">We have sent a password recovery link to {resetEmail}</p>
                    </div>
                ) : (
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                type="email"
                                required
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-brand-500 transition-all outline-none"
                                placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Send Recovery Link
                        </button>
                    </form>
                )}
            </>
        )}
      </div>
    </div>
  );
};