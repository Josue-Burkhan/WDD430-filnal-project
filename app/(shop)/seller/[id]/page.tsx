
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Calendar, Share2, MessageCircle } from 'lucide-react';
import { ProductCard } from '../../../../components/ProductCard';
import { SellerProfile, Product } from '../../../../server/types';
import { MOCK_SELLERS, MOCK_PRODUCTS } from '../../../../marketplace/services/mockData';
import { useCart } from '../../../../lib/cart';

export default function SellerPublicProfile() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [sellerProducts, setSellerProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (params.id) {
            const foundSeller = MOCK_SELLERS.find(s => s.username === params.id);
            if (foundSeller) {
                setSeller(foundSeller);
                const products = MOCK_PRODUCTS.filter(p => p.sellerId === foundSeller.username && p.isActive);
                setSellerProducts(products);
            }
        }
    }, [params.id]);

    if (!seller) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Banner */}
            <div className="h-64 md:h-80 bg-slate-200 relative">
                <img src={seller.bannerImage} alt="Shop Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                        <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white flex-shrink-0 mx-auto md:mx-0">
                            <img src={seller.avatar} alt={seller.username} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{seller.username}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {seller.location}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> Joined {seller.joinDate}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-center md:justify-end">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                                        <MessageCircle size={18} /> Contact
                                    </button>
                                    <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl">{seller.bio}</p>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {seller.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-4 md:gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 justify-center md:justify-start">
                            <div className="text-center md:text-left">
                                <p className="text-xs text-slate-400 font-bold uppercase">Rating</p>
                                <div className="flex items-center gap-1 text-yellow-400 font-bold text-xl">
                                    <Star fill="currentColor" size={20} /> {seller.rating}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-xs text-slate-400 font-bold uppercase">Sales</p>
                                <p className="font-bold text-xl text-slate-900">{seller.totalSalesCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Shop Items</h2>

                {sellerProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {sellerProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                onClick={(p) => router.push(`/products/${p.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No active listings found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}