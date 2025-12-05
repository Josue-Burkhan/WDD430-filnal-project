'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, Star, Package, Mail, Share2 } from 'lucide-react';
import { SellerProfile, Product } from '../../../../server/types';
import { ProductCard } from '../../../../components/ProductCard';

import { useAuth } from '../../../../lib/auth';
import { useToast } from '../../../../components/ui/Toast';
import { API_URL } from '../../../../lib/config';

export default function SellerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        if (params.username) {
            const fetchData = async () => {
                try {
                    // Fetch Profile
                    const profileRes = await fetch(`${API_URL}/api/profiles/seller/${params.username}`);
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        setProfile({
                            user_id: profileData.user_id, // Ensure user_id is captured
                            username: profileData.username,
                            bio: profileData.bio || 'No bio available.',
                            avatar: profileData.avatar || 'https://via.placeholder.com/150',
                            bannerImage: profileData.banner_image || 'https://via.placeholder.com/1200x300',
                            location: profileData.location || 'Unknown',
                            email: profileData.email,
                            rating: Number(profileData.rating) || 0,
                            totalSalesCount: profileData.total_sales_count || 0,
                            joinDate: new Date(profileData.join_date).getFullYear().toString(),
                            tags: profileData.tags || []
                        });

                        // Fetch Seller Products
                        const productsRes = await fetch(`${API_URL}/api/products/seller/${profileData.user_id}`);
                        if (productsRes.ok) {
                            const productsData = await productsRes.json();
                            // Map to Product interface
                            const mappedProducts = productsData.map((p: any) => ({
                                id: String(p.id),
                                name: p.name,
                                price: Number(p.price),
                                description: p.description,
                                image: p.image,
                                category: 'General',
                                sellerId: p.seller_id,
                                stock: p.stock,
                                reviews: [],
                                isActive: Boolean(p.is_active)
                            }));
                            setProducts(mappedProducts);
                        }
                    } else {
                        console.error('Seller not found');
                    }
                } catch (error) {
                    console.error('Error fetching seller data', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [params.username]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('Profile link copied to clipboard!', 'success');
    };

    const handleRate = async (rating: number) => {
        if (!user) {
            showToast('Please login to rate this seller', 'info');
            return;
        }
        if (!profile) return;

        try {
            const res = await fetch(`${API_URL}/api/reviews/seller`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    seller_id: profile.user_id,
                    user_id: user.id,
                    rating: rating
                })
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(prev => prev ? { ...prev, rating: Number(data.newRating) } : null);
                showToast('Rating submitted successfully', 'success');
            } else {
                showToast('Failed to submit rating', 'error');
            }
        } catch (error) {
            console.error('Error rating seller', error);
            showToast('Error submitting rating', 'error');
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Seller Not Found</h1>
                <button onClick={() => router.back()} className="text-brand-600 hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Banner */}
            <div className="h-64 md:h-80 w-full relative">
                <img
                    src={profile.bannerImage}
                    alt="Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src={profile.avatar}
                                alt={profile.username}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                            />
                            <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 mb-1">{profile.username}</h1>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><MapPin size={16} /> {profile.location}</span>
                                        <span className="flex items-center gap-1"><Calendar size={16} /> Joined {profile.joinDate}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-6 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30">
                                        Follow
                                    </button>
                                    <button onClick={handleShare} className="p-2 border-2 border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 py-6 border-y border-slate-100 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Rating</p>
                                        <div className="flex items-center gap-1">
                                            <p className="font-bold text-slate-900">{Number(profile.rating).toFixed(1)} / 5.0</p>
                                            <div className="flex ml-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleRate(star)}
                                                        className="text-yellow-400 hover:scale-110 transition-transform"
                                                        disabled={!user}
                                                        title={user ? "Rate this seller" : "Login to rate"}
                                                    >
                                                        <Star
                                                            size={16}
                                                            fill={star <= Math.round(Number(profile.rating)) ? "currentColor" : "none"}
                                                            className={star <= Math.round(Number(profile.rating)) ? "text-yellow-400" : "text-slate-300"}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Sales</p>
                                        <p className="font-bold text-slate-900">{profile.totalSalesCount}+</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Contact</p>
                                        <p className="font-bold text-slate-900">{profile.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bio & Tags */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900">About</h3>
                                <p className="text-slate-600 leading-relaxed max-w-3xl">
                                    {profile.bio}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <Package className="text-brand-600" /> Shop Products ({products.length})
                    </h2>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={(p) => {
                                        showToast(`Added ${p.name} to cart`, 'success');
                                        // Implement actual cart logic here if available
                                    }}
                                    onClick={(p) => router.push(`/products/${p.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-lg">No products listed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
