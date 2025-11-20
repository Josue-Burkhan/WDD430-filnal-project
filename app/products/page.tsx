'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import { FiFilter } from 'react-icons/fi';

// Define a clear type for the product structure coming from the API
interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  artisan: { name: string };
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return ['all', ...Array.from(categories)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    result = result.filter(p => p.price <= priceRange);

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

    return result;
  }, [category, priceRange, sortBy, products]);

  if (loading) {
    return <p className="text-center mt-12 text-lg text-gray-500">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center mt-12 text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800">Explore Our Collection</h1>
        <p className="mt-2 text-lg text-gray-600">Find the perfect handmade treasure.</p>
      </header>
      
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center text-lg font-semibold text-gray-700">
          <FiFilter className="mr-2"/> Filters
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center">
            <label htmlFor="category" className="mr-3 text-sm font-medium text-gray-700">Category:</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="price" className="mr-3 text-sm font-medium text-gray-700">Max Price:</label>
            <input type="range" id="price" min="0" max="1000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-40 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
            <span className="ml-3 font-semibold text-indigo-600">${priceRange}</span>
          </div>
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-3 text-sm font-medium text-gray-700">Sort by:</label>
            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map(product => (
            <ProductCard 
              key={product._id} 
              product={{
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '/placeholder.jpg', // Pass the first image, with a fallback
                artisanName: product.artisan?.name || 'Artisan', // Pass the artisan's name, with a fallback
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-12 text-lg text-gray-500">No products found matching your criteria.</p>
      )}
    </div>
  );
};

export default ProductsPage;
