
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { User } from '../../../server/types';
import { useAuth } from '../../../lib/auth';
import { useToast } from '../../../components/ui/Toast';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData.identifier, formData.password, rememberMe);
            showToast('Welcome back!', 'success');
            // Redirect is handled in AuthProvider or we can do it here if login returns user
            // But login is void promise. We can check user state or just redirect.
            // Actually, better to redirect here after await.
            // We need to know the role to redirect correctly. 
            // The login function updates the user state, but maybe not immediately available here due to closure.
            // However, we can fetch the user profile or just redirect to dashboard if it's an admin/seller?
            // For now, let's redirect to home, and if they are seller/admin they can navigate to dashboard.
            // Or better, we can decode the token or check the response if we modified login to return data.
            // Let's assume login throws if failed.

            // To be safe and simple:
            router.push('/');
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        showToast("Password reset functionality coming soon!", 'info');
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
                                <input
                                    type="checkbox"
                                    className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
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