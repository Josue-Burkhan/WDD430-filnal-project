
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
    onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Genial<span className="text-brand-500">Market</span></h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              The premier marketplace for handcrafted, unique, and artisan goods. We connect makers with appreciators of quality craftsmanship.
            </p>
            <div className="flex gap-4 pt-2">
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 hover:text-white transition-colors"><Facebook size={18} /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 hover:text-white transition-colors"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-600 hover:text-white transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
                <li><button onClick={() => onNavigate('home')} className="hover:text-brand-500 transition-colors">Home</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-brand-500 transition-colors">About Us</button></li>
                <li><button onClick={() => onNavigate('become-seller')} className="hover:text-brand-500 transition-colors text-brand-400 font-bold">Sell on GenialMarket</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-brand-500 transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white font-bold mb-6">Customer Care</h3>
            <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-brand-500 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-500 mt-0.5" />
                    <span>123 Artisan Way,<br/>Portland, OR 97201</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-500" />
                    <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail size={18} className="text-brand-500" />
                    <span>support@genialmarket.com</span>
                </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} GenialMarket. All rights reserved.</p>
            <div className="flex gap-6">
                <span>Made with <span className="text-red-500">♥</span> by Artisans</span>
            </div>
        </div>
      </div>
    </footer>
  );
};
