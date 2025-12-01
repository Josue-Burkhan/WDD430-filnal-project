
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../lib/cart';

export default function Cart() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center">
          Looks like you haven't discovered our handcrafted treasures yet.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
        Your Cart <span className="text-lg font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{cart.length} items</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 sm:gap-6 items-center">
              <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900 truncate pr-4">{item.product.name}</h3>
                  <p className="font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <p className="text-sm text-slate-500 mb-4">{item.product.category}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1 hover:bg-slate-100 rounded"
                    >
                      <Minus size={16} className="text-slate-600" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1 hover:bg-slate-100 rounded"
                    >
                      <Plus size={16} className="text-slate-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={clearCart}
              className="text-slate-500 hover:text-red-500 text-sm font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <div className="text-xs text-brand-600 bg-brand-50 p-2 rounded-lg">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
            >
              Checkout <ArrowRight size={20} />
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full mt-4 py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
