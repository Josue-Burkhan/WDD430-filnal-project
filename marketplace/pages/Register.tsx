
import React, { useState } from 'react';
import { User as UserIcon, Lock, Mail, ArrowRight, Store, ArrowLeft } from 'lucide-react';
import { User, BuyerProfile } from '../types';

interface RegisterProps {
  onRegister: (user: User, profileData: Partial<BuyerProfile>) => void;
  onNavigate: (page: string) => void;
  existingUsers: User[];
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigate, existingUsers }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        setError('Username is already taken.');
        return;
    }
    if (existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('Email is already registered.');
        return;
    }

    const newUser: User = {
        username,
        email,
        password,
        role: 'user'
    };

    const newProfile: Partial<BuyerProfile> = {
        username,
        email,
        joinDate: new Date().getFullYear().toString(),
        shippingAddress: {
            fullName: fullName,
            addressLine: '',
            city: '',
            zipCode: '',
            country: 'USA'
        }
    };

    onRegister(newUser, newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <button 
            onClick={() => onNavigate('home')}
            className="flex items-center text-slate-400 hover:text-slate-600 mb-6 text-sm font-bold"
        >
            <ArrowLeft size={16} className="mr-1" /> Back to Home
        </button>

        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
            <p className="text-slate-500 text-sm">Join the community of unique finds.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-brand-500 transition-all outline-none"
                    placeholder="Jane Doe"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-brand-500 transition-all outline-none"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-brand-500 transition-all outline-none"
                        placeholder="janedoe123"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-brand-500 transition-all outline-none"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg text-center">{error}</p>}

            <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 group"
            >
                Register
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </form>

        <div className="mt-6 space-y-4 text-center">
            <p className="text-sm text-slate-500">
                Already have an account? <button onClick={() => onNavigate('login')} className="text-brand-600 font-bold hover:underline">Login</button>
            </p>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button 
                onClick={() => onNavigate('become-seller')}
                className="w-full border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
                <Store size={18} />
                Become a Seller
            </button>
        </div>

      </div>
    </div>
  );
};
