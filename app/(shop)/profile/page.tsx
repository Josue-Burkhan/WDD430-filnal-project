
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Edit, Settings } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { BuyerProfile, Order } from '../../../server/types';
import { API_URL } from '../../../lib/config';

export default function BuyerProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [profile, setProfile] = useState<BuyerProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editImage, setEditImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch Profile
                const profileRes = await fetch(`${API_URL}/api/profiles/buyer/${user.id}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // Fetch Orders
                const ordersRes = await fetch(`${API_URL}/api/orders/user/${user.id}`);
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

        if (user) {
            fetchData();
        } else {
            // If no user initially, stop loading to trigger redirect effect
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user && !loading) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (profile) {
            setEditBio(profile.bio || '');
            setPreviewImage(profile.avatar || 'https://via.placeholder.com/150');
        }
    }, [profile]);

    const toggleOrder = (orderId: string) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId);
    };

    const handleCancelOrder = async (orderId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Cancelled' }),
            });

            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
                alert('Order cancelled successfully');
            } else {
                alert('Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order', error);
            alert('Error cancelling order');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setEditImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        const formData = new FormData();
        formData.append('bio', editBio);
        if (editImage) {
            formData.append('image', editImage);
        } else {
            formData.append('imageUrl', profile?.avatar || '');
        }

        try {
            const res = await fetch(`${API_URL}/api/profiles/buyer/${user.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(prev => prev ? { ...prev, bio: editBio, avatar: data.avatar } : null);
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Error updating profile');
        }
    };

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
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
                                    <img src={previewImage} alt={profile.username} className="w-full h-full object-cover" />
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer border border-slate-200 hover:bg-slate-50">
                                        <Edit size={14} className="text-slate-600" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                            <div className="mb-1">
                                <h1 className="text-2xl font-bold text-slate-900">{profile.username}</h1>
                                <p className="text-slate-500 text-sm">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <Edit size={16} /> Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h2 className="font-bold text-slate-900 mb-2">Bio</h2>
                                {isEditing ? (
                                    <textarea
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                        rows={4}
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-slate-600 leading-relaxed">{profile.bio || 'No bio yet.'}</p>
                                )}
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
                                            <div
                                                key={order.id}
                                                className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() => toggleOrder(order.id)}
                                            >
                                                <div className="p-4 flex items-center justify-between">
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
                                                        <p className="font-bold text-slate-900">${Number(order.total).toFixed(2)}</p>
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'text-green-600 bg-green-100' : order.status === 'Cancelled' ? 'text-red-600 bg-red-100' : 'text-slate-600 bg-slate-200'}`}>{order.status}</span>
                                                    </div>
                                                </div>

                                                {expandedOrderId === order.id && (
                                                    <div className="bg-white p-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                                        <h4 className="font-bold text-sm text-slate-700 mb-3">Order Items</h4>
                                                        <div className="space-y-3 mb-4">
                                                            {order.items.map((item: any) => (
                                                                <div key={item.id} className="flex justify-between items-center text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-medium text-slate-800">{item.quantity}x</span>
                                                                        <span className="text-slate-600">{item.name || `Product #${item.product_id}`}</span>
                                                                    </div>
                                                                    <span className="text-slate-900 font-medium">${Number(item.price).toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {order.status === 'Pending' && (
                                                            <div className="flex justify-end pt-2 border-t border-slate-100">
                                                                <button
                                                                    onClick={(e) => handleCancelOrder(order.id, e)}
                                                                    className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-200"
                                                                >
                                                                    Cancel Order
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
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
