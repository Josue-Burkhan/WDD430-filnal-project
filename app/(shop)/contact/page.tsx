
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, MapPin, Phone, Send } from 'lucide-react';

export default function Contact() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Message sent! We'll get back to you shortly.");
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <button
                onClick={() => router.back()}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Get in Touch</h1>
                    <p className="text-lg text-slate-600 mb-12 leading-relaxed">
                        Have a question about an order, a product, or just want to say hello? We'd love to hear from you.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">Email Us</h3>
                                <p className="text-slate-500 mb-1">Our friendly team is here to help.</p>
                                <a href="mailto:support@genialmarket.com" className="text-brand-600 font-bold hover:underline">support@genialmarket.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">Visit Us</h3>
                                <p className="text-slate-500 mb-1">Come say hello at our office headquarters.</p>
                                <p className="text-slate-900 font-medium">123 Artisan Way, Portland, OR 97201</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">Call Us</h3>
                                <p className="text-slate-500 mb-1">Mon-Fri from 8am to 5pm.</p>
                                <a href="tel:+15551234567" className="text-brand-600 font-bold hover:underline">+1 (555) 123-4567</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Subject</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all"
                                placeholder="How can we help?"
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Message</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all resize-none"
                                placeholder="Tell us more..."
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                        >
                            <Send size={18} /> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
