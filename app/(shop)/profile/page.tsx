
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Edit, Settings } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { BuyerProfile, Order } from '../../../server/types';

export default function BuyerProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState<BuyerProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch Profile
                const profileRes = await fetch(`http://localhost:5000/api/profiles/buyer/${user.id}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // Fetch Orders
                const ordersRes = await fetch(`http://localhost:5000/api/orders/user/${user.id}`);
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }
            } catch (error) {
                console.error('Error fetching profile data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (!user) {
        router.push('/login');
        return null;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-700"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
                                <img src={profile.avatar || 'https://via.placeholder.com/150'} alt={profile.username} className="w-full h-full object-cover" />
                            </div>
                            <div className="mb-1">
                                <h1 className="text-2xl font-bold text-slate-900">{profile.username}</h1>
                                <p className="text-slate-500 text-sm">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            <Edit size={16} /> Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h2 className="font-bold text-slate-900 mb-2">Bio</h2>
                                <p className="text-slate-600 leading-relaxed">{profile.bio || 'No bio yet.'}</p>
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Package size={20} className="text-brand-500" /> Recent Orders
                                </h2>
                                <div className="space-y-4">
                                    {orders.length === 0 ? (
                                        <p className="text-slate-500 italic">No orders yet.</p>
                                    ) : (
                                        orders.map(order => (
                                            <div key={order.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand-600 font-bold border border-slate-100">
                                                        #{order.id.slice(-4)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{order.items.length} items</p>
                                                        <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-slate-900">${order.total.toFixed(2)}</p>
                                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">{order.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-slate-400" /> Shipping Address
                                </h3>
                                {profile.shippingAddress ? (
                                    <div className="text-sm text-slate-600 space-y-1">
                                        <p className="font-bold text-slate-900">{profile.shippingAddress.fullName}</p>
                                        <p>{profile.shippingAddress.addressLine}</p>
                                        <p>{profile.shippingAddress.city}, {profile.shippingAddress.zipCode}</p>
                                        <p>{profile.shippingAddress.country}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No address saved</p>
                                )}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Settings size={18} className="text-slate-400" /> Account Settings
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="text-slate-600 hover:text-brand-600 hover:underline">Notifications</a></li>
                                    <li><a href="#" className="text-slate-600 hover:text-brand-600 hover:underline">Privacy & Security</a></li>
                                    <li><a href="#" className="text-slate-600 hover:text-brand-600 hover:underline">Payment Methods</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
