'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, ArrowLeft, Heart, Share2, Truck, ShieldCheck, MessageCircle, User as UserIcon } from 'lucide-react';
import { Product, SellerProfile } from '../../../../server/types';
import { useCart } from '../../../../lib/cart';
import { useAuth } from '../../../../lib/auth';

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  // Zoom State
  const [showZoom, setShowZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: '0% 0%' });
  const [lensStyle, setLensStyle] = useState({ left: 0, top: 0, display: 'none' });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (params.id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${params.id}`);
          if (res.ok) {
            const data = await res.json();
            // Store actual UUID in sellerId for comparison, use sellerName for display
            const mappedProduct: Product = {
              id: String(data.id),
              name: data.name,
              price: Number(data.price),
              description: data.description,
              image: data.image,
              category: 'General',
              sellerId: data.seller_id, // Use UUID here
              stock: data.stock,
              reviews: [],
              isActive: Boolean(data.is_active)
            };
            setProduct(mappedProduct);

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

            const reviewsRes = await fetch(`http://localhost:5000/api/reviews/product/${params.id}`);
            if (reviewsRes.ok) {
              const reviewsData = await reviewsRes.json();
              setReviews(reviewsData);
            }
          }
        } catch (error) {
          console.error('Failed to fetch product', error);
        }
      };

      fetchProduct();
    }
  }, [params.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;

    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Lens size (e.g., 100x100)
    const lensSize = 100;
    const halfLens = lensSize / 2;

    // Calculate lens position (clamped)
    let lensX = x - halfLens;
    let lensY = y - halfLens;

    if (lensX < 0) lensX = 0;
    if (lensX > width - lensSize) lensX = width - lensSize;
    if (lensY < 0) lensY = 0;
    if (lensY > height - lensSize) lensY = height - lensSize;

    setLensStyle({ left: lensX, top: lensY, display: 'block' });

    // Calculate zoom background position
    // Ratio of lens position to container size
    const xPercent = (lensX / (width - lensSize)) * 100;
    const yPercent = (lensY / (height - lensSize)) * 100;

    setZoomStyle({ backgroundPosition: `${xPercent}% ${yPercent}%` });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now().toString(),
          product_id: product?.id,
          user_id: user.id,
          rating,
          title: 'Review',
          comment
        })
      });

      if (res.ok) {
        alert('Review submitted!');
        const reviewsRes = await fetch(`http://localhost:5000/api/reviews/product/${product?.id}`);
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData);
        }
        setComment('');
        setRating(5);
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review', error);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 relative">
          {/* Zoomable Image Container */}
          <div className="relative z-10">
            <div
              ref={imgContainerRef}
              className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-sm cursor-crosshair relative"
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => { setShowZoom(false); setLensStyle(prev => ({ ...prev, display: 'none' })); }}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* The Lens */}
              {showZoom && (
                <div
                  className="absolute border-2 border-brand-500 bg-brand-500/10 pointer-events-none"
                  style={{
                    width: '100px',
                    height: '100px',
                    left: lensStyle.left,
                    top: lensStyle.top,
                    display: lensStyle.display
                  }}
                />
              )}
            </div>

            {/* Zoom Result Window (Absolute positioned next to image) */}
            {showZoom && (
              <div
                className="absolute top-0 left-[105%] w-[500px] h-[500px] bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden hidden lg:block z-50"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: '250%', // Magnification level
                  backgroundPosition: zoomStyle.backgroundPosition,
                  backgroundRepeat: 'no-repeat'
                }}
              />
            )}
            <p className="text-center text-slate-400 text-sm mt-4 lg:hidden">Tap image to view details</p>
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
                  <span className="text-slate-700 font-bold ml-1">{averageRating}</span>
                  <span className="text-slate-400 ml-1">({reviews.length} reviews)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> In Stock
                </span>
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
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
              {reviews.length > 0 ? (
                reviews.map((review) => {
                  const isSeller = String(review.user_id) === String(product.sellerId);
                  return (
                    <div key={review.id} className={`p-6 rounded-2xl border ${isSeller ? 'bg-brand-50 border-brand-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isSeller ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={`font-bold ${isSeller ? 'text-brand-700' : 'text-slate-900'}`}>
                                {review.userName || 'Anonymous'}
                              </h4>
                              {isSeller && (
                                <span className="text-xs bg-brand-200 text-brand-800 px-2 py-0.5 rounded-full font-bold">
                                  Seller
                                </span>
                              )}
                            </div>
                            <div className="flex text-yellow-400 text-sm">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300"} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 h-fit sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Write a Review</h3>
              {!user ? (
                <div className="text-center">
                  <p className="text-slate-500 mb-4">Please login to write a review.</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-brand-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {/* Commenting As */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Commenting as</p>
                      <p className="text-sm font-bold text-slate-900">{user.username}</p>
                    </div>
                  </div>

                  {/* Interactive Star Rating */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110 focus:outline-none"
                        >
                          <Star
                            size={32}
                            fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                            className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-slate-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
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
              )}
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