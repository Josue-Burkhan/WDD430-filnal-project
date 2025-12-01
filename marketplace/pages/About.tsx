
import React from 'react';
import { ArrowLeft, Users, Heart, ShieldCheck } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-8">
            <ArrowLeft size={20} className="mr-2" /> Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-brand-600 py-16 px-8 text-center text-white">
                <h1 className="text-4xl font-extrabold mb-4">Crafting Connections</h1>
                <p className="text-lg text-brand-100 max-w-2xl mx-auto">
                    We are more than just a marketplace. We are a community dedicated to preserving the art of handmade goods in a digital world.
                </p>
            </div>
            
            <div className="p-8 md:p-12 space-y-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            At GenialMarket, we believe that every object tells a story. In an era of mass production, we champion the slow, the deliberate, and the unique. Our mission is to empower independent artisans by providing them with a platform to share their craft with the world, while offering buyers access to goods that possess soul and character.
                        </p>
                    </div>
                    <div className="h-64 rounded-2xl bg-slate-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800" alt="Artisan working" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6 bg-slate-50 rounded-2xl">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Community First</h3>
                        <p className="text-sm text-slate-500">We prioritize people over profits, fostering a supportive network of creators and collectors.</p>
                    </div>
                    <div className="text-center p-6 bg-slate-50 rounded-2xl">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Handmade with Love</h3>
                        <p className="text-sm text-slate-500">Every item on our platform is verified to be handcrafted, ensuring authenticity in every purchase.</p>
                    </div>
                    <div className="text-center p-6 bg-slate-50 rounded-2xl">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Sustainable Future</h3>
                        <p className="text-sm text-slate-500">We encourage eco-friendly practices and sustainable sourcing among our artisan partners.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
