
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Lock, Globe, Check } from 'lucide-react';
import { CartItem, Order, Address } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  user: { username: string } | null;
  onPlaceOrder: (order: Order) => void;
  onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, user, onPlaceOrder, onBack }) => {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [address, setAddress] = useState<Address>({
    fullName: user?.username || '',
    addressLine: '',
    city: '',
    zipCode: '',
    country: 'USA'
  });
  
  // Payment state (visual only)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Costs
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shippingCost = address.country === 'USA' ? 0 : 25.00;
  const total = subtotal + tax + shippingCost;

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new Order object
    const newOrder: Order = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        buyerUsername: user?.username || 'guest',
        customerName: address.fullName,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.image,
            quantity: item.quantity,
            price: item.product.price
        })),
        shippingAddress: address,
        subtotal,
        tax,
        shippingCost,
        total
    };

    onPlaceOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4 sm:pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Cart
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-8 px-2 sm:px-4">
                    <button 
                        onClick={() => setStep('shipping')}
                        className={`flex items-center gap-2 ${step === 'shipping' ? 'text-brand-600 font-bold' : 'text-slate-500'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 'shipping' ? 'border-brand-600 bg-brand-50' : 'border-slate-300'}`}>1</div>
                        <span className="text-sm sm:text-base">Shipping</span>
                    </button>
                    <div className="h-px bg-slate-300 flex-1 mx-2 sm:mx-4"></div>
                    <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-brand-600 font-bold' : 'text-slate-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step === 'payment' ? 'border-brand-600 bg-brand-50' : 'border-slate-300'}`}>2</div>
                        <span className="text-sm sm:text-base">Payment</span>
                    </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
                    
                    {step === 'shipping' && (
                        <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Address</h2>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                    value={address.fullName}
                                    onChange={e => handleAddressChange('fullName', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Address Line</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                    value={address.addressLine}
                                    onChange={e => handleAddressChange('addressLine', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                        value={address.city}
                                        onChange={e => handleAddressChange('city', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Zip Code</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                        value={address.zipCode}
                                        onChange={e => handleAddressChange('zipCode', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select 
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                                        value={address.country}
                                        onChange={e => handleAddressChange('country', e.target.value)}
                                    >
                                        <option value="USA">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {address.country !== 'USA' && (
                                    <p className="text-sm text-yellow-600 mt-2 flex items-center gap-1">
                                        <Globe size={14} /> International shipping rate applies ($25.00)
                                    </p>
                                )}
                            </div>

                            <button 
                                type="button" 
                                onClick={() => setStep('payment')}
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    )}

                    {step === 'payment' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Details</h2>
                            
                            <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-200 mb-4">
                                <Lock className="text-brand-600 flex-shrink-0" size={20} />
                                <p className="text-sm text-slate-600">Transactions are secure and encrypted.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                        value={cardNumber}
                                        onChange={e => setCardNumber(e.target.value)}
                                        maxLength={19}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                        value={expiry}
                                        onChange={e => setExpiry(e.target.value)}
                                        maxLength={5}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">CVV</label>
                                    <input 
                                        required
                                        type="password" 
                                        placeholder="123"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value)}
                                        maxLength={3}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setStep('shipping')}
                                    className="flex-1 bg-white text-slate-600 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                                >
                                    <Check size={20} /> Place Order
                                </button>
                            </div>
                        </div>
                    )}

                </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1 order-first lg:order-last mb-8 lg:mb-0">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:sticky lg:top-8">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex gap-3">
                                <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-slate-600">
                            <span>Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-slate-600">
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? <span className="text-green-600 font-bold">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-4">
                         <div className="flex justify-between items-end">
                            <span className="font-bold text-slate-900">Total</span>
                            <span className="font-extrabold text-2xl text-slate-900">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
