import React, { useState } from 'react';
import { ShoppingBag, Star, ShieldCheck, Truck, ArrowLeft, Store, Send } from 'lucide-react';
import { Product, SellerProfile, Review } from '../types';

interface ProductDetailsProps {
  product: Product;
  sellerProfile: SellerProfile;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  onViewSellerProfile?: () => void;
  onSubmitReview?: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
    product, 
    sellerProfile, 
    onAddToCart, 
    onBack,
    onViewSellerProfile,
    onSubmitReview
}) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  // Calculate dynamic rating
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitReview && reviewerName && reviewComment) {
        onSubmitReview(product.id, {
            userName: reviewerName,
            rating: reviewRating,
            comment: reviewComment
        });
        setReviewComment('');
        setReviewerName('');
        setReviewRating(5);
        alert('Review submitted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center text-slate-500 hover:text-brand-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-1" />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Mock thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer hover:border-brand-500 transition-colors">
                  <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover opacity-70 hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Column */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-brand-600 font-bold text-sm tracking-wide uppercase bg-brand-50 px-2 py-1 rounded-md">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                <Star size={20} fill="currentColor" />
                <span className="text-slate-900 font-bold text-lg ml-2">{averageRating}</span>
              </div>
              <span className="text-slate-500 text-sm">({reviews.length} reviews)</span>
            </div>

            <div className="border-t border-b border-slate-100 py-6 mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${product.stock && product.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.stock && product.stock > 0 ? (
                        product.stock < 5 ? `Only ${product.stock} left!` : 'In Stock'
                    ) : 'Out of Stock'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 text-sm">Ready to ship</span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">About this item</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-brand-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Authenticity Guarantee</h4>
                    <p className="text-slate-500 text-xs">Verified handmade by our artisan team.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="text-brand-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Eco-Friendly Shipping</h4>
                    <p className="text-slate-500 text-xs">Packaged with 100% recycled materials.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-10">
              <button 
                onClick={() => onAddToCart(product)}
                disabled={!product.stock || product.stock === 0}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <ShoppingBag />
                {(!product.stock || product.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Seller Profile Card */}
            <div 
                className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm cursor-pointer hover:border-brand-500 transition-colors group"
                onClick={onViewSellerProfile}
            >
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Meet the Maker</h3>
                     <span className="text-brand-600 text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Visit Profile <Store size={14}/>
                     </span>
                </div>
               
                <div className="flex items-start gap-4">
                    <img src={sellerProfile.avatar} alt={sellerProfile.username} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">{sellerProfile.username}</h4>
                            <span className="flex items-center text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                <Star size={12} fill="currentColor" className="mr-1"/> {sellerProfile.rating}
                            </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{sellerProfile.bio}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                             <span>{sellerProfile.totalSalesCount} Sales</span>
                             <span>•</span>
                             <span>{sellerProfile.location}</span>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-slate-100 pt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Write a Review */}
                <div className="bg-slate-50 p-6 rounded-2xl h-fit">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                            <input 
                                type="text" 
                                required
                                value={reviewerName}
                                onChange={e => setReviewerName(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className={`p-1 transition-colors ${reviewRating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                                    >
                                        <Star fill="currentColor" size={24} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                            <textarea 
                                required
                                value={reviewComment}
                                onChange={e => setReviewComment(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20 h-24"
                                placeholder="Share your thoughts..."
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Send size={16} /> Submit Review
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-slate-500 italic">No reviews yet. Be the first to review this artwork!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{review.userName}</h4>
                                        <div className="flex text-yellow-400 text-xs mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-300"} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">{review.date}</span>
                                </div>
                                <p className="text-slate-600">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};