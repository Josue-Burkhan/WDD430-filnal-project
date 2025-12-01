
import React from 'react';
import { ArrowLeft, Send, MapPin, Phone, Mail } from 'lucide-react';

interface ContactProps {
  onBack: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-8">
            <ArrowLeft size={20} className="mr-2" /> Back to Home
        </button>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h1 className="text-4xl font-extrabold text-slate-900">Get in Touch</h1>
                <p className="text-slate-600 text-lg">
                    Have a question about an order, a product, or just want to say hello? We'd love to hear from you.
                </p>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Our Office</h3>
                            <p className="text-slate-500">123 Artisan Way, Suite 100<br/>Portland, OR 97201</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Phone</h3>
                            <p className="text-slate-500">+1 (555) 123-4567</p>
                            <p className="text-xs text-slate-400">Mon-Fri, 9am - 5pm PST</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                         <div className="bg-brand-50 p-3 rounded-lg text-brand-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Email</h3>
                            <p className="text-slate-500">support@genialmarket.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <form className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none" placeholder="john@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                    <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 outline-none h-32" placeholder="How can we help you today?"></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
                    <Send size={18} /> Send Message
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};
