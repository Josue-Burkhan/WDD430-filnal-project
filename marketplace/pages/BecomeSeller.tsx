

import React, { useState } from 'react';
import { Store, ShoppingBag, Globe, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import { User, SellerProfile } from '../types';

interface BecomeSellerProps {
  onRegisterSeller: (user: User, profile: SellerProfile) => void;
  onNavigate: (page: string) => void;
  existingUsers: User[];
}

export const BecomeSeller: React.FC<BecomeSellerProps> = ({ onRegisterSeller, onNavigate, existingUsers }) => {
  const [step, setStep] = useState<'intro' | 'form'>('intro');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (existingUsers.some(u => u.username.toLowerCase() === shopName.toLowerCase())) {
        setError('Shop Name (Username) is already taken.');
        return;
    }

    const newUser: User = {
        username: shopName,
        email,
        password,
        role: 'seller' // Correct role for new sellers
    };

    const newProfile: SellerProfile = {
        username: shopName,
        email,
        bio: bio || `Welcome to ${shopName}! We sell amazing handcrafted items.`,
        location: location || 'Online',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', // Default
        bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200', // Default
        joinDate: new Date().getFullYear().toString(),
        rating: 5.0, // Start with 5 stars (New)
        totalSalesCount: 0,
        tags: ['Handmade', 'New Seller']
    };

    onRegisterSeller(newUser, newProfile);
  };

  if (step === 'intro') {
      return (
        <div className="min-h-screen bg-slate-50">
             <div className="bg-slate-900 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => onNavigate('home')} className="flex items-center text-slate-400 hover:text-white mb-8">
                        <ArrowLeft size={20} className="mr-2" /> Back to Home
                    </button>
                    <div className="text-center space-y-6">
                         <div className="inline-block p-4 bg-brand-600 rounded-2xl mb-4">
                            <Store size={48} />
                         </div>
                         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Sell on Genial<span className="text-brand-500">Market</span></h1>
                         <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Join thousands of artisans turning their passion into profit. 
                            Build your brand, reach millions, and manage your business with powerful tools.
                         </p>
                         <button 
                            onClick={() => setStep('form')}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-1 inline-flex items-center gap-2"
                         >
                            Open Your Shop <ArrowRight />
                         </button>
                    </div>
                </div>
             </div>

             <div className="max-w-6xl mx-auto px-4 py-16">
                 <div className="grid md:grid-cols-3 gap-8">
                     <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                         <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                             <Globe size={32} />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-3">Global Reach</h3>
                         <p className="text-slate-500">We put your products in front of buyers from around the world looking for unique items.</p>
                     </div>
                     <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                             <DollarSign size={32} />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-3">Low Fees</h3>
                         <p className="text-slate-500">Keep more of what you earn with our transparent, low-commission fee structure.</p>
                     </div>
                     <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                         <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                             <ShoppingBag size={32} />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-3">Powerful Tools</h3>
                         <p className="text-slate-500">Access a dedicated dashboard with analytics, inventory management, and AI assistance.</p>
                     </div>
                 </div>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-slate-100">
        <button 
            onClick={() => setStep('intro')}
            className="flex items-center text-slate-400 hover:text-slate-600 mb-6 text-sm font-bold"
        >
            <ArrowLeft size={16} className="mr-1" /> Back to Intro
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Set up your Shop</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Shop Name (Username)</label>
                <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    placeholder="MyAwesomeCrafts"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    placeholder="shop@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    placeholder="••••••••"
                />
            </div>
            
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none"
                    placeholder="City, Country"
                />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Shop Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none h-24"
                    placeholder="Tell us about what you sell..."
                />
            </div>

            {error && <p className="md:col-span-2 text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg text-center">{error}</p>}

            <div className="md:col-span-2 pt-4">
                <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    Create Shop & Start Selling
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};