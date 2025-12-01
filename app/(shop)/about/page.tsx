
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Globe, Shield } from 'lucide-react';

export default function About() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button
                onClick={() => router.back()}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Our Story</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    GenialMarket was born from a simple idea: to connect the world's most talented artisans directly with people who appreciate unique, handcrafted treasures.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Heart size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Made with Love</h3>
                    <p className="text-slate-500">Every item on our platform has a story. Handcrafted with passion and care by independent creators.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Globe size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Global Community</h3>
                    <p className="text-slate-500">We bridge the gap between cultures, bringing artisanal traditions from around the globe to your doorstep.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Shield size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Trusted Quality</h3>
                    <p className="text-slate-500">We vet our sellers to ensure authenticity and quality. Your satisfaction is our top priority.</p>
                </div>
            </div>

            <div className="bg-brand-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
                    <p className="text-brand-100 max-w-2xl mx-auto mb-8 text-lg">
                        Whether you're a creator looking to share your work or a collector seeking something special, there's a place for you here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white text-brand-600 px-8 py-3 rounded-xl font-bold hover:bg-brand-50 transition-colors"
                        >
                            Start Exploring
                        </button>
                        <button
                            onClick={() => router.push('/become-seller')}
                            className="bg-brand-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-800 transition-colors border border-brand-500"
                        >
                            Become a Seller
                        </button>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>
        </div>
    );
}
