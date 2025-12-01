import React from 'react';
import { ArrowLeft, MapPin, Mail, Star, Calendar, ShoppingBag } from 'lucide-react';
import { Product, SellerProfile } from '../types';
import { ProductCard } from '../components/ProductCard';

interface SellerPublicProfileProps {
  sellerProfile: SellerProfile;
  products: Product[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export const SellerPublicProfile: React.FC<SellerPublicProfileProps> = ({
  sellerProfile,
  products,
  onBack,
  onAddToCart,
  onProductClick
}) => {
  // Filter products belonging to this seller (in mock data, assuming 'admin' is the seller for demonstration)
  // In a real app, this would filter by the sellerProfile.username
  const sellerProducts = products.filter(p => p.sellerId === sellerProfile.username);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner */}
      <div className="h-64 md:h-80 w-full relative">
        <img 
          src={sellerProfile.bannerImage || 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=1200'} 
          alt="Shop Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button 
            onClick={onBack}
            className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-100">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="relative -mt-20 md:-mt-24 flex-shrink-0">
                    <img 
                        src={sellerProfile.avatar} 
                        alt={sellerProfile.username} 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white" 
                    />
                    <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white" title="Verified Artisan">
                        <Star size={12} fill="currentColor" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{sellerProfile.username}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {sellerProfile.location}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {sellerProfile.joinDate}</span>
                            </div>
                        </div>
                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/10 flex items-center gap-2">
                            <Mail size={18} />
                            Contact Artisan
                        </button>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl">
                        {sellerProfile.bio}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {sellerProfile.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold text-slate-900">{sellerProfile.totalSalesCount}</span>
                    <span className="text-sm text-slate-500">Total Sales</span>
                </div>
                <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold text-slate-900">{sellerProfile.rating}</span>
                    <span className="text-sm text-slate-500">Average Rating</span>
                </div>
                <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold text-slate-900">{sellerProducts.length}</span>
                    <span className="text-sm text-slate-500">Active Listings</span>
                </div>
                <div className="text-center md:text-left">
                    <span className="block text-2xl font-bold text-slate-900">100%</span>
                    <span className="text-sm text-slate-500">Response Rate</span>
                </div>
            </div>
        </div>

        {/* Shop Grid */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="text-brand-600" />
                Shop Collection
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {sellerProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={onAddToCart}
                        onClick={onProductClick}
                    />
                ))}
            </div>
            {sellerProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-500">This artisan has no products listed currently.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};