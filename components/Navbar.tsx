
import React from 'react';
import { ShoppingBag, User, LogOut, Menu, Store } from 'lucide-react';
import { ViewState, User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout, cartCount }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const isSeller = user?.role === 'seller' || user?.role === 'admin';

  return (
    <nav className="bg-stone-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('HOME')}>
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-brand-500/20">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              Handcrafted<span className="text-brand-500">Haven</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('HOME')} className="text-stone-300 hover:text-brand-400 font-medium transition-colors">
              Marketplace
            </button>
            <div className="h-6 w-px bg-stone-700"></div>
            
            {user ? (
              <>
                {isSeller && (
                  <button 
                    onClick={() => onNavigate('DASHBOARD')}
                    className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-brand-500/20"
                  >
                    <span>Seller Dashboard</span>
                  </button>
                )}
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">{user.username || 'Artisan'}</span>
                    <span className="text-xs text-stone-400">{isSeller ? 'Seller' : 'Customer'}</span>
                  </div>
                  <button onClick={onLogout} className="p-2 hover:bg-stone-800 rounded-full transition-colors text-stone-400 hover:text-red-400">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => onNavigate('LOGIN')} className="text-stone-300 hover:text-white font-medium">
                  Log in
                </button>
                <button 
                  onClick={() => onNavigate('REGISTER')}
                  className="bg-white text-stone-900 hover:bg-stone-100 px-5 py-2.5 rounded-full font-bold transition-colors"
                >
                  Start Selling
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-stone-300 hover:text-white p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-stone-800 border-t border-stone-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => { onNavigate('HOME'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-300 hover:bg-stone-700 rounded-md">
              Marketplace
            </button>
            {user ? (
              <>
                {isSeller && (
                  <button onClick={() => { onNavigate('DASHBOARD'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-brand-400 font-bold hover:bg-stone-700 rounded-md">
                    Dashboard
                  </button>
                )}
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-red-400 hover:bg-stone-700 rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { onNavigate('LOGIN'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-300 hover:bg-stone-700 rounded-md">
                  Login
                </button>
                <button onClick={() => { onNavigate('REGISTER'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-stone-300 hover:bg-stone-700 rounded-md">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
