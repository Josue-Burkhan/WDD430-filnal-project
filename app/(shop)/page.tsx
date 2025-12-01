
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '../../components/ProductCard';
import { Product } from '../../server/types';
import { Search, Filter, ArrowUpDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../lib/cart';

// Mock data for initial load if API fails or for static generation
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Handcrafted Ceramic Vase',
    price: 45.00,
    description: 'Beautifully glazed ceramic vase, perfect for wildflowers.',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=400',
    category: 'Ceramics',
    sellerId: 'artisan_anna',
    stock: 5,
    reviews: [],
    isActive: true
  },
  {
    id: '2',
    name: 'Woven Wall Hanging',
    price: 120.00,
    description: 'Intricate macrame wall hanging made with natural cotton fibers.',
    image: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?auto=format&fit=crop&q=80&w=400',
    category: 'Art',
    sellerId: 'weaver_will',
    stock: 2,
    reviews: [],
    isActive: true
  },
  // Add more mock data as needed or fetch from API
];

interface HomeProps {
  products?: Product[];
}

const ITEMS_PER_PAGE = 8;

export default function Home({ products: initialProducts = MOCK_PRODUCTS }: HomeProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Calculate price bounds based on actual data
  const maxProductPrice = Math.max(...products.map(p => p.price), 1000);

  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxProductPrice]);
  const [sortOrder, setSortOrder] = useState<'featured' | 'lowToHigh' | 'highToLow'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 1);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], value]);
  };

  // Calculate percentage for slider track background
  const minPercent = (priceRange[0] / maxProductPrice) * 100;
  const maxPercent = (priceRange[1] / maxProductPrice) * 100;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    const price = product.price;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortOrder === 'lowToHigh') return a.price - b.price;
    if (sortOrder === 'highToLow') return b.price - a.price;
    return 0; // featured (default order)
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-brand-600 text-white py-12 md:py-16 px-4 mb-8 shadow-xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            Unique & <span className="text-brand-200">Handcrafted</span> Treasures
          </h1>
          <p className="text-brand-100 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Support independent artisans and find one-of-a-kind items made with love.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-200" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search ceramics, jewelry, art..."
              className="w-full pl-11 pr-4 py-3 md:py-4 rounded-2xl text-slate-800 shadow-lg 
             focus:outline-none focus:ring-4 focus:ring-brand-500/50 
             placeholder-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Controls Bar */}
        <div className="flex flex-col gap-6 mb-8">

          {/* Categories (Flex Wrap for better mobile/desktop view without scroll) */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Toggle & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <div className="text-slate-500 text-sm hidden sm:block">
              Showing {filteredProducts.length} results
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${showFilters ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                {showFilters ? <X size={16} /> : <Filter size={16} />}
                {showFilters ? 'Hide Filters' : 'Filter'}
              </button>

              <div className="relative group flex-1 sm:flex-none w-full sm:w-48">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-600 py-2 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
                <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in slide-in-from-top-2">
            <div className="max-w-lg mx-auto sm:mx-0">
              <div className="flex justify-between items-center mb-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Price Range</label>
                <span className="text-sm font-medium text-brand-600">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>

              {/* Dual Range Slider Visuals */}
              <div className="relative h-2 bg-slate-100 rounded-full mb-6">
                {/* The selected range track */}
                <div
                  className="absolute h-full bg-brand-500 rounded-full"
                  style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                ></div>

                {/* Range Inputs */}
                <input
                  type="range"
                  min={0}
                  max={maxProductPrice}
                  value={priceRange[0]}
                  onChange={handleMinChange}
                  className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none cursor-pointer z-10"
                />
                <input
                  type="range"
                  min={0}
                  max={maxProductPrice}
                  value={priceRange[1]}
                  onChange={handleMaxChange}
                  className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none cursor-pointer z-20"
                />
              </div>

              {/* Number Inputs for Fine Tuning */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 outline-none"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), priceRange[1]);
                      setPriceRange([val, priceRange[1]]);
                    }}
                  />
                </div>
                <span className="text-slate-300">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={maxProductPrice}
                    className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 outline-none"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), priceRange[0]);
                      setPriceRange([priceRange[0], val]);
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="sm:hidden mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Results</h2>
          <span className="text-sm text-slate-500">{filteredProducts.length} items</span>
        </div>

        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onClick={handleProductClick}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${currentPage === i + 1
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No artisans found</h3>
            <p className="text-slate-500">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
