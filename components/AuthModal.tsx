
import React, { useState } from 'react';
import { ApiService } from '../services/api';
import { User } from '../types';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
  type: 'LOGIN' | 'REGISTER';
  onSuccess: (user: User, token: string) => void;
  onSwitch: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ type, onSuccess, onSwitch }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'LOGIN') {
        // In login mode, we use the 'email' field as the identifier (username or email)
        const response = await ApiService.login(formData.email, formData.password);
        onSuccess(response.user, response.token);
      } else {
        const response = await ApiService.register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: 'seller' // FORCE SELLER ROLE SO USER CAN ADD PRODUCTS
        });
        onSuccess(response.user, response.token);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Header */}
        <div className="h-32 bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <h2 className="text-3xl font-black text-white tracking-tight z-10">
             {type === 'LOGIN' ? 'Welcome Back' : 'Start Selling'}
           </h2>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100 flex items-start gap-2">
              <span>•</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {type === 'REGISTER' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500 uppercase ml-1">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    name="username"
                    type="text"
                    required
                    placeholder="ArtisanName"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase ml-1">
                {type === 'LOGIN' ? 'Email or Username' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  name="email"
                  type={type === 'REGISTER' ? "email" : "text"}
                  required
                  placeholder={type === 'LOGIN' ? "user@example.com" : "you@example.com"}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 hover:bg-brand-500 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {type === 'LOGIN' ? 'Log In' : 'Create Seller Account'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-stone-500 font-medium">
              {type === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={onSwitch}
                className="ml-2 text-brand-600 font-bold hover:underline"
              >
                {type === 'LOGIN' ? 'Register' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
