
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, Mail, Lock, User as UserIcon, ArrowRight, MapPin } from 'lucide-react';
import { User, SellerProfile } from '../../../server/types';
import { useAuth } from '../../../lib/auth';
import { useToast } from '../../../components/ui/Toast';

export default function BecomeSeller() {
    const router = useRouter();
    const { register } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        shopName: '',
        location: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showToast("Passwords do not match!", 'error');
            return;
        }

        try {
            await register(formData.username, formData.email, formData.password, 'seller', { location: formData.location });
            showToast(`Welcome to your new shop, ${formData.username}!`, 'success');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Registration error:', error);
            showToast(error.message + (error.received ? ' Received: ' + JSON.stringify(error.received) : ''), 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 py-12">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">

                {/* Left Side - Info */}
                <div className="bg-slate-900 text-white p-8 md:p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Store size={24} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
                        <p className="text-slate-300 leading-relaxed mb-8">
                            Join thousands of artisans turning their passion into a thriving business.
                        </p>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">✓</div>
                                Zero listing fees
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">✓</div>
                                Secure payments
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">✓</div>
                                Global audience
                            </li>
                        </ul>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 md:w-3/5">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Seller Account</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Username</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                    placeholder="ArtisanName"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Location</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                    placeholder="City, Country"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1 uppercase">Confirm</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group mt-4"
                        >
                            Open Your Shop <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="text-center mt-6 text-slate-600 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-brand-600 font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}