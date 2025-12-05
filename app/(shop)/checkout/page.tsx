
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, Truck, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../../../lib/cart';
import { useAuth } from '../../../lib/auth';
import { Order, Address } from '../../../server/types';
import { API_URL } from '../../../lib/config';
import { useToast } from '../../../components/ui/Toast';

export default function Checkout() {
    const router = useRouter();
    const { cart, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');

    const [address, setAddress] = useState<Address>({
        fullName: '',
        addressLine: '',
        city: '',
        zipCode: '',
        country: ''
    });

    // Load saved payment details
    useEffect(() => {
        const savedCard = localStorage.getItem('temp_card_number');
        const savedExpiry = localStorage.getItem('temp_card_expiry');
        const savedCvc = localStorage.getItem('temp_card_cvc');
        if (savedCard) setCardNumber(savedCard);
        if (savedExpiry) setCardExpiry(savedExpiry);
        if (savedCvc) setCardCvc(savedCvc);
    }, []);

    // Fetch saved address
    useEffect(() => {
        const fetchAddress = async () => {
            if (user) {
                try {
                    const res = await fetch(`${API_URL}/api/profiles/buyer/${user.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.shippingAddress) {
                            setAddress(data.shippingAddress);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch address', error);
                }
            }
        };
        fetchAddress();
    }, [user]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (!authLoading && user && cart.length === 0) {
            router.push('/cart');
        }
    }, [cart, router, authLoading, user]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    if (cart.length === 0) {
        return null;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        setLoading(true);

        try {
            const orderData = {
                id: Date.now().toString(),
                buyer_id: user?.id,
                customer_name: address.fullName,
                subtotal,
                tax,
                shipping_cost: shipping,
                total,
                shipping_address: address,
                items: cart.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    productImage: item.product.image,
                    quantity: item.quantity,
                    price: item.product.price
                }))
            };

            const res = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to place order');
            }

            clearCart();
            setLoading(false);
            showToast("Success! Your order has been placed.", 'success');
            router.push('/');
        } catch (error: any) {
            setLoading(false);
            showToast(`Error: ${error.message}`, 'error');
        }
    };

    if (cart.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-slate-800 mb-8 font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back to Cart
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Checkout Flow */}
                <div className="md:col-span-2 space-y-6">

                    {/* Steps Indicator */}
                    <div className="flex items-center justify-between mb-8 px-4">
                        <div className={`flex flex-col items-center ${step >= 1 ? 'text-brand-600' : 'text-slate-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>1</div>
                            <span className="text-xs font-bold uppercase">Shipping</span>
                        </div>
                        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-brand-600' : 'bg-slate-100'}`}></div>
                        <div className={`flex flex-col items-center ${step >= 2 ? 'text-brand-600' : 'text-slate-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>2</div>
                            <span className="text-xs font-bold uppercase">Payment</span>
                        </div>
                        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 3 ? 'bg-brand-600' : 'bg-slate-100'}`}></div>
                        <div className={`flex flex-col items-center ${step >= 3 ? 'text-brand-600' : 'text-slate-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>3</div>
                            <span className="text-xs font-bold uppercase">Review</span>
                        </div>
                    </div>

                    {/* Step 1: Shipping */}
                    {step === 1 && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-left-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <MapPin className="text-brand-500" /> Shipping Address
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                                        value={address.fullName}
                                        onChange={e => setAddress({ ...address, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Address Line</label>
                                    <input
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                                        value={address.addressLine}
                                        onChange={e => setAddress({ ...address, addressLine: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                                        <input
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                                            value={address.city}
                                            onChange={e => setAddress({ ...address, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Zip Code</label>
                                        <input
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                                            value={address.zipCode}
                                            onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                                    <input
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 outline-none"
                                        value={address.country}
                                        onChange={e => setAddress({ ...address, country: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-4 hover:bg-black transition-colors"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {step === 2 && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <CreditCard className="text-brand-500" /> Payment Method
                            </h2>

                            <div className="p-4 border-2 border-brand-500 bg-brand-50 rounded-xl mb-6 flex items-center gap-4 cursor-pointer">
                                <div className="w-5 h-5 rounded-full border-4 border-brand-500 bg-white"></div>
                                <CreditCard className="text-brand-600" />
                                <span className="font-bold text-brand-900">Credit / Debit Card</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
                                    <input
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            setCardNumber(e.target.value);
                                            localStorage.setItem('temp_card_number', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Expiry</label>
                                        <input
                                            placeholder="MM/YY"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                                            value={cardExpiry}
                                            onChange={(e) => {
                                                setCardExpiry(e.target.value);
                                                localStorage.setItem('temp_card_expiry', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">CVC</label>
                                        <input
                                            placeholder="123"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                                            value={cardCvc}
                                            onChange={(e) => {
                                                setCardCvc(e.target.value);
                                                localStorage.setItem('temp_card_cvc', e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                                    Note: This is a demo. Payment details are only saved to your browser's local storage and are not processed.
                                </p>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Back</button>
                                <button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors">Review Order</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <CheckCircle className="text-brand-500" /> Review Order
                            </h2>

                            <div className="space-y-4 mb-8">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                                            <img src={item.product.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900">{item.product.name}</h4>
                                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl mb-8 space-y-2 text-sm">
                                <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-slate-600"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                                <div className="flex justify-between text-slate-600"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg text-slate-900">
                                    <span>Total</span><span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Back</button>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="flex-[2] bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Order Summary Sidebar */}
                <div className="hidden md:block">
                    <div className="bg-slate-50 p-6 rounded-3xl sticky top-24">
                        <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between text-slate-500"><span>Items ({cart.length})</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-slate-500"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                            <div className="flex justify-between text-slate-500"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                        </div>
                        <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-slate-900">
                            <span>Total</span><span>${total.toFixed(2)}</span>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 justify-center">
                            <Lock size={12} /> Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
