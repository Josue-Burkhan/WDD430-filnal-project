
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, Plus, X } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { Product, Sale, SalesStat, SellerProfile, Order } from '../../../server/types';
import { MOCK_PRODUCTS, MOCK_SALES, SALES_STATS, MOCK_ORDERS, MOCK_SELLER_PROFILE } from '../../../marketplace/services/mockData';

// Sub-components
import { Sidebar } from '../../../components/dashboard/Sidebar';
import { Overview } from '../../../components/dashboard/Overview';
import { Orders } from '../../../components/dashboard/Orders';
import { Inventory } from '../../../components/dashboard/Inventory';
import { ProductForm } from '../../../components/dashboard/ProductForm';
import { ProfileSettings } from '../../../components/dashboard/ProfileSettings';

type ViewState = 'overview' | 'products' | 'form' | 'orders' | 'profile';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ViewState>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data states
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales] = useState<Sale[]>(MOCK_SALES);
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>(MOCK_SELLER_PROFILE);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
    // Ideally this should be handled by middleware or a higher-level guard
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  // Filter Data based on Role
  const dashboardProducts = user.role === 'admin'
    ? products
    : products.filter(p => p.sellerId === user.username);

  const dashboardOrders = user.role === 'admin'
    ? orders
    : orders.filter(o => o.items.some(item =>
      products.find(p => p.id === item.productId)?.sellerId === user.username
    ));

  const openAddForm = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setActiveView('form');
  };

  const openEditForm = (product: Product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setActiveView('form');
  };

  const handleFormSave = (productData: Partial<Product>) => {
    if (isEditing && editingProduct) {
      setProducts(prev => prev.map(p => p.id === productData.id ? { ...p, ...productData } as Product : p));
    } else {
      setProducts(prev => [...prev, productData as Product]);
    }
    setActiveView('products');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleUpdateProfile = (profile: SellerProfile) => {
    setSellerProfile(profile);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onNavigateHome={() => router.push('/')}
          onLogout={() => { logout(); router.push('/'); }}
          user={user}
          sellerProfile={sellerProfile}
          onAddNew={openAddForm}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0" onClick={e => e.stopPropagation()}>
            <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              onNavigateHome={() => router.push('/')}
              onLogout={() => { logout(); router.push('/'); }}
              user={user}
              sellerProfile={sellerProfile}
              onAddNew={openAddForm}
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-800" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeView === 'form' ? (isEditing ? 'Edit Product' : 'New Product') : activeView}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Search size={20} />
            </button>
            {activeView === 'products' && (
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-brand-500/30"
              >
                <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">

            {activeView === 'overview' && (
              <Overview
                sales={sales}
                salesStats={SALES_STATS}
                products={dashboardProducts}
                orders={dashboardOrders}
              />
            )}

            {activeView === 'orders' && (
              <Orders orders={dashboardOrders} />
            )}

            {activeView === 'products' && (
              <Inventory
                products={dashboardProducts}
                user={user}
                onEdit={openEditForm}
                onDelete={handleDeleteProduct}
                onToggleStatus={handleToggleStatus}
              />
            )}

            {activeView === 'form' && (
              <ProductForm
                initialData={editingProduct}
                isEditing={isEditing}
                onSave={handleFormSave}
                onCancel={() => setActiveView('products')}
                user={user}
              />
            )}

            {activeView === 'profile' && (
              <ProfileSettings
                sellerProfile={sellerProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}