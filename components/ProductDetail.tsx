
import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingBag, Star, User as UserIcon, MessageCircle, Send } from 'lucide-react';
import { Product, Review, User } from '../types';
import { ApiService } from '../services/api';

interface ProductDetailProps {
  product: Product;
  currentUser: User | null;
  onBack: () => void;
  onLoginReq: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, currentUser, onBack, onLoginReq }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [product.id]);

  const loadReviews = async () => {
    try {
      const data = await ApiService.getProductReviews(product.id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading reviews", e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onLoginReq();
      return;
    }

    setSubmitting(true);
    try {
      const review = await ApiService.createReview({
        product_id: product.id,
        user_id: currentUser.id,
        rating: newRating,
        comment: newComment
      });
      setReviews(prev => [review, ...prev]);
      setNewComment('');
      setNewRating(5);
    } catch (e) {
      alert('Could not post review. Backend might check for previous purchases.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback image logic
  const imageUrl = `https://source.unsplash.com/random/800x600/?${product.category},${product.name.split(' ')[0]}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-brand-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Section */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-100 relative group h-[500px]">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/800x600?text=No+Image'}
          />
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
            <span className="text-brand-600 font-bold text-sm tracking-wider uppercase">{product.category}</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8 text-stone-500">
             <div className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-lg">
               <UserIcon size={16} />
               <span className="text-sm font-semibold">Seller ID: #{product.user_id}</span>
             </div>
             <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
             <span className="text-sm">{product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}</span>
          </div>

          <p className="text-lg text-stone-600 leading-relaxed mb-8 border-l-4 border-brand-200 pl-6">
            {product.description}
          </p>

          <div className="flex items-center justify-between bg-stone-900 text-white p-6 rounded-2xl shadow-xl mb-8">
            <div>
              <p className="text-stone-400 text-sm font-medium uppercase">Price</p>
              <p className="text-3xl font-bold text-white">${Number(product.price).toFixed(2)}</p>
            </div>
            <button className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/20 transition-all transform hover:-translate-y-1 flex items-center gap-3">
              <ShoppingBag /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-12">
        <h3 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <MessageCircle className="text-brand-500" /> Customer Reviews
        </h3>

        {/* Form */}
        {currentUser ? (
          <form onSubmit={handlePostReview} className="bg-stone-50 p-6 rounded-2xl mb-10 border border-stone-200">
            <h4 className="font-bold text-stone-700 mb-4">Leave a Review</h4>
            <div className="flex gap-4 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`${newRating >= star ? 'text-yellow-400' : 'text-stone-300'} transition-colors`}
                >
                  <Star fill={newRating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write your thoughts..."
                className="flex-1 bg-white border border-stone-200 rounded-xl px-4 focus:border-brand-500 outline-none"
                required
              />
              <button disabled={submitting} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-brand-50 p-6 rounded-2xl mb-10 text-center text-brand-800 border border-brand-100">
            Please <button onClick={onLoginReq} className="font-bold underline">log in</button> to leave a review.
          </div>
        )}

        {/* List */}
        <div className="space-y-6">
          {loadingReviews ? (
            <p className="text-stone-400">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-stone-400 italic">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-stone-100 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold text-stone-600">
                       U{review.user_id}
                     </div>
                     <div className="flex text-yellow-400 text-sm">
                       {Array.from({length: 5}).map((_, i) => (
                         <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-stone-200"} />
                       ))}
                     </div>
                  </div>
                  <span className="text-xs text-stone-400">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-stone-600">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
