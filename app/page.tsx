import React from 'react';
import Link from 'next/link';
import { getFeaturedProducts } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { FiAward, FiHeart, FiShield } from 'react-icons/fi';

// Define a clear type for the product structure from the API
interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  artisan: { name: string };
}

const HomePage = async () => {
  let featuredProducts: ApiProduct[] = [];
  try {
    const response = await getFeaturedProducts();
    featuredProducts = response.data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    // In a real app, you might show a fallback UI or log this error to a service
  }

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Discover the Art of Handcrafted Goods
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Explore a curated marketplace of unique, handcrafted products from artisans around the world. Find something special, support creativity.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="inline-block px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition transform hover:scale-105">
                Shop Now
            </Link>
            <Link href="/register" className="inline-block px-8 py-4 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition transform hover:scale-105">
                Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center p-4">
              <FiAward className="text-indigo-500 text-5xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Quality & Authenticity</h3>
              <p className="text-gray-600">Every item is a piece of art, vetted for quality and lovingly handmade.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <FiHeart className="text-indigo-500 text-5xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Support Artisans</h3>
              <p className="text-gray-600">Your purchase directly supports independent creators and their craft.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <FiShield className="text-indigo-500 text-5xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure & Easy Shopping</h3>
              <p className="text-gray-600">A seamless and secure checkout experience you can trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-800">Our Featured Products</h2>
                <p className="mt-2 text-lg text-gray-600">Handpicked just for you.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={{
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0] || '/placeholder.jpg', // Pass the first image with a fallback
                    artisanName: product.artisan?.name || 'Artisan', // Pass the artisan's name with a fallback
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default HomePage;
