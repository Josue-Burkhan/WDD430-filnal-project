

import React, { useState } from 'react';
import { ShoppingBag, LayoutDashboard, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout, cartCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => handleNav('home')}
          >
            <div className="bg-brand-600 text-white p-1.5 rounded-lg mr-2">
              <ShoppingBag size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Genial<span className="text-brand-600">Market</span></span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'seller') ? (
                    <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium text-sm"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </button>
                ) : (
                    <button
                    onClick={() => onNavigate('buyer-profile')}
                    className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors font-medium text-sm"
                    >
                        <UserIcon size={18} />
                        My Profile
                    </button>
                )}
                
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {user.username}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 text-slate-600 hover:text-brand-600 font-medium transition-colors"
              >
                <UserIcon size={18} />
                Login
              </button>
            )}
            
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-2"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions (Cart + Menu Toggle) */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-6 space-y-4">
            {user ? (
              <>
                 <div className="flex items-center gap-3 px-2 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.username}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                 </div>

                {(user.role === 'admin' || user.role === 'seller') ? (
                    <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-700 font-bold"
                    >
                        <LayoutDashboard size={20} />
                        Seller Dashboard
                    </button>
                ) : (
                    <button
                    onClick={() => handleNav('buyer-profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-700 font-bold"
                    >
                        <UserIcon size={20} />
                        My Profile
                    </button>
                )}
                
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-3 rounded-xl"
              >
                <UserIcon size={20} />
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};