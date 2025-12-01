
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { User } from '../../../server/types';
import { useAuth } from '../../../lib/auth';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let role: 'admin' | 'seller' | 'user' = 'user';
        let username = formData.identifier;

        // Mock role assignment based on credentials
        if (formData.identifier === 'admin' && formData.password === 'admin') {
            role = 'admin';
            username = 'AdminUser';
        } else if (formData.identifier === 'seller' && formData.password === 'seller') {
            role = 'seller';
            username = 'SellerUser';
        } else if (formData.identifier === 'buyer' && formData.password === 'buyer') {
            role = 'user';
            username = 'BuyerUser';
        } else {
            // Default behavior for other inputs (simulating a normal user login)
            username = formData.identifier.includes('@') ? formData.identifier.split('@')[0] : formData.identifier;
        }

        const mockUser: User = {
            id: 'mock-user-id-' + Date.now(),
            username: username,
            email: formData.identifier.includes('@') ? formData.identifier : `${username.toLowerCase()}@example.com`,
            role: role
        };

        login(mockUser);

        // Redirect based on role
        if (role === 'admin' || role === 'seller') {
            router.push('/dashboard');
        } else {
            router.push('/');
        }
    };

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        alert("Password reset functionality coming soon!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3">
                            <LogIn size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username or Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="text-slate-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium"
                                    placeholder="Username or email"
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-slate-400" size={20} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                                <span className="text-slate-600 font-medium">Remember me</span>
                            </label>
                            <button onClick={handleForgotPassword} className="text-brand-600 font-bold hover:underline">Forgot password?</button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 group"
                        >
                            Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-brand-600 font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                    Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
                </div>
            </div>
        </div>
    );
}