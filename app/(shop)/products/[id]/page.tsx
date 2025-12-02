
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, ArrowLeft, Heart, Share2, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { Product, SellerProfile } from '../../../../server/types';
import { MOCK_PRODUCTS, MOCK_SELLERS } from '../../../../marketplace/services/mockData';
import { useCart } from '../../../../lib/cart';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${params.id}`);
          if (res.ok) {
            const data = await res.json();
            const mappedProduct: Product = {
              id: String(data.id),
              name: data.name,
              price: Number(data.price),
              description: data.description,
              image: data.image,
              category: 'General',
              sellerId: data.sellerName || 'Unknown',
              stock: data.stock,
              reviews: data.reviews || [],
              isActive: Boolean(data.is_active)
            };
            setProduct(mappedProduct);

            // Mock seller profile with real name
            setSeller({
              username: data.sellerName || 'Unknown',
              bio: 'Passionate artisan creating unique handcrafted items.',
              avatar: data.sellerAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
              bannerImage: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800',
              location: 'Global',
              email: 'contact@example.com',
              rating: 4.8,
              totalSalesCount: 150,
              joinDate: '2023',
              tags: ['Handmade', 'Artisan']
            });
          }
        } catch (error) {
          console.error('Failed to fetch product', error);
        }
      };

      fetchProduct();
    }
  }, [params.id]);

  if (!product || !seller) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-500 hover:text-slate-800 mb-8 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[product.image, product.image, product.image, product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-transparent hover:border-slate-200'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="text-brand-600 font-bold text-sm tracking-wide uppercase bg-brand-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-yellow-400">
                  <Star size={18} fill="currentColor" />
                  <span className="text-slate-700 font-bold ml-1">4.8</span>
                  <span className="text-slate-400 ml-1">(124 reviews)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> In Stock
                </span>
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              {product.price > 100 && (
                <span className="text-lg text-slate-400 line-through mb-1.5">${(product.price * 1.2).toFixed(2)}</span>
              )}
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Seller Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between mb-8 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => router.push(`/seller/${seller.username}`)}>
              <div className="flex items-center gap-3">
                <img src={seller.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Crafted by</p>
                  <p className="font-bold text-slate-900">{seller.username}</p>
                </div>
              </div>
              <button className="text-brand-600 font-bold text-sm hover:underline">View Profile</button>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <button className="p-4 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Heart size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <Truck className="text-brand-500 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Free Shipping</h4>
                  <p className="text-xs text-slate-500">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-brand-500 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Buyer Protection</h4>
                  <p className="text-xs text-slate-500">Guaranteed quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <MessageCircle className="text-brand-500" /> Customer Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              {product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{review.userName}</h4>
                          <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">{review.date}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 h-fit sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Write a Review</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert("Review submitted! (This is a demo)");
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-yellow-400 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star size={24} fill="none" className="text-slate-300 hover:text-yellow-400" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                  <textarea
                    rows={4}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none transition-all resize-none"
                    placeholder="Share your experience..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size, className }: { size?: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}