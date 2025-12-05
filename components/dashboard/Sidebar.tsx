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
import { User, SellerProfile } from '../../server/types';
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface SidebarProps {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onNavigateHome: () => void;
  onLogout: () => void;
  user: User;
  sellerProfile: SellerProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  setIsMobileMenuOpen,
  onNavigateHome,
  onLogout,
  user,
  sellerProfile
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 flex-shrink-0 transition-all duration-300">
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-brand-500 text-white p-1.5 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            GenialMarket<span className="text-brand-500">Hub</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/dashboard') ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <BarChart3 size={20} />
          <span className="font-medium">Overview</span>
        </Link>
        <Link
          href="/dashboard/orders"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/dashboard/orders') ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <ShoppingBag size={20} />
          <span className="font-medium">Orders</span>
        </Link>
        <Link
          href="/dashboard/products"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/dashboard/products') ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Package size={20} />
          <span className="font-medium">Inventory</span>
        </Link>
        <Link
          href="/dashboard/products/add"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/dashboard/products/add') ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
        >
          <Plus size={20} />
          <span className="font-medium">Add Product</span>
        </Link>
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
        <Link
          href="/dashboard/profile"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`w-full mt-4 flex items-center gap-3 px-4 py-3 border-t border-slate-800 rounded-xl transition-all group ${isActive('/dashboard/profile') ? 'bg-slate-800 border-transparent' : 'hover:bg-slate-800 border-transparent'}`}
        >
          <div className="relative">
            <img
              src={sellerProfile.avatar || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-brand-700 group-hover:border-brand-500 transition-colors"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{user.username}</span>
            <span className="text-xs text-slate-500 group-hover:text-slate-400">View Profile</span>
          </div>
        </Link>
      </div>
    </div>
  );
};