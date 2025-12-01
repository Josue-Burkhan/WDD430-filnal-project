import React from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Plus, 
  Store, 
  LogOut, 
  LayoutDashboard 
} from 'lucide-react';
import { User, SellerProfile } from '../../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  user: User;
  sellerProfile: SellerProfile;
  onAddNew: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  setIsMobileMenuOpen,
  onNavigateHome,
  onLogout,
  user,
  sellerProfile,
  onAddNew
}) => {
  const handleNav = (view: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 flex-shrink-0 transition-all duration-300">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="bg-brand-500 text-white p-1.5 rounded-lg">
           <LayoutDashboard size={20} />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">Artisan<span className="text-brand-500">Hub</span></span>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <button 
          onClick={() => handleNav('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'overview' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <BarChart3 size={20} />
          <span className="font-medium">Overview</span>
        </button>
        <button 
          onClick={() => handleNav('orders')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'orders' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <ShoppingBag size={20} />
          <span className="font-medium">Orders</span>
        </button>
        <button 
          onClick={() => handleNav('products')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'products' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Package size={20} />
          <span className="font-medium">Inventory</span>
        </button>
        <button 
          onClick={() => {
            onAddNew();
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'form' ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Plus size={20} />
          <span className="font-medium">Add Product</span>
        </button>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button 
          onClick={onNavigateHome}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:bg-slate-800 hover:text-white text-slate-400"
        >
          <Store size={18} />
          <span className="font-medium text-sm">Marketplace</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-400 text-slate-400"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
        
        {/* Clickable User Footer */}
        <button 
          onClick={() => handleNav('profile')}
          className={`w-full mt-4 flex items-center gap-3 px-4 py-3 border-t border-slate-800 rounded-xl transition-all group ${activeView === 'profile' ? 'bg-slate-800 border-transparent' : 'hover:bg-slate-800 border-transparent'}`}
        >
          <div className="relative">
             <img src={sellerProfile.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-brand-700 group-hover:border-brand-500 transition-colors" />
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{user.username}</span>
            <span className="text-xs text-slate-500 group-hover:text-slate-400">View Profile</span>
          </div>
        </button>
      </div>
    </div>
  );
};