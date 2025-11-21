
import React, { useState, useMemo } from 'react';
import { Search, RefreshCcw, AlertOctagon } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products = [], onProductClick, isLoading, error, onRetry }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = useMemo(() => {
    if (!products || !Array.isArray(products)) return ['All'];
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    
    return products.filter(p => {
      const name = p.name || '';
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 flex-col gap-4 text-stone-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-500"></div>
        <p className="font-bold text-lg">Loading Artisan Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] px-4">
        <div className="text-center max-w-lg p-8 bg-white rounded-3xl border border-red-100 shadow-2xl">
           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <AlertOctagon className="w-8 h-8 text-red-600" />
           </div>
           <h3 className="text-xl font-bold text-stone-900 mb-2">Marketplace Unavailable</h3>
           <p className="text-stone-500 mb-6 text-sm">
             The connection to the artisan server timed out. Please try again.
           </p>
           <button onClick={onRetry} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 mx-auto shadow-lg">
             <RefreshCcw size={18} />
             Retry
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-4">
          Artisan <span className="text-brand-600">Marketplace</span>
        </h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto">
          Discover unique handcrafted treasures directly from the creators.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-stone-100 sticky top-24 z-30">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:border-brand-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  categoryFilter === cat 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-stone-400 font-light">No products found.</p>
          <button 
             onClick={() => {setSearch(''); setCategoryFilter('All');}}
             className="mt-4 text-brand-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => onProductClick(product)}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-stone-100 flex flex-col h-full"
            >
              <div className="aspect-square overflow-hidden bg-stone-200 relative">
                <img
                  src={product.image_url || `https://source.unsplash.com/random/500x500/?${product.category},${product.name.split(' ')[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/e5e7eb/1f2937?text=No+Image';
                  }}
                />
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-sm font-extrabold text-stone-900 shadow-sm border border-stone-100">
                  ${Number(product.price).toFixed(2)}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-brand-600 uppercase bg-brand-50 px-2 py-1 rounded-md">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-stone-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-stone-50 text-xs text-stone-400">
                   <span>Stock: {product.stock}</span>
                   <span>Seller ID: {product.user_id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
