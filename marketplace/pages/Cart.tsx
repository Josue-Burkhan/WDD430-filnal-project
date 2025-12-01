
import React from 'react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onCheckout,
  onContinueShopping 
}) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4 sm:pt-0">
      <div className="bg-white border-b border-slate-200 py-6 sm:py-8 mb-4 sm:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Shopping Cart</h1>
            <p className="text-slate-500 text-sm sm:text-base">Review your unique finds before checkout.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {cart.length === 0 ? (
          <div className="text-center py-20">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={48} className="text-slate-300" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
             <p className="text-slate-500 mb-8">Looks like you haven't discovered your favorite piece yet.</p>
             <button 
               onClick={onContinueShopping}
               className="bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
             >
               Start Shopping
             </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
               {cart.map((item) => (
                 <div key={item.product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-full sm:w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                       <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 w-full">
                       <div className="flex justify-between items-start mb-1">
                           <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{item.product.name}</h3>
                           <p className="font-bold text-brand-600 ml-2">${item.product.price.toFixed(2)}</p>
                       </div>
                       <p className="text-slate-500 text-sm mb-4">{item.product.category}</p>
                       
                       <div className="flex items-center justify-between">
                            <div className="flex items-center bg-slate-100 rounded-lg">
                                <button 
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                    className="p-2 text-slate-500 hover:text-slate-900 transition-colors w-9 h-9 flex items-center justify-center"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="font-bold text-slate-900 w-8 text-center text-sm">{item.quantity}</span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    className="p-2 text-slate-500 hover:text-slate-900 transition-colors w-9 h-9 flex items-center justify-center"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button 
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                            title="Remove"
                            >
                            <Trash2 size={20} />
                            </button>
                       </div>
                    </div>
                 </div>
               ))}
               
               <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
                  <button 
                    onClick={onContinueShopping}
                    className="text-slate-500 font-medium hover:text-brand-600 transition-colors text-center sm:text-left py-2"
                  >
                    ← Continue Shopping
                  </button>
                  <button 
                    onClick={onClearCart}
                    className="text-red-400 font-medium hover:text-red-600 transition-colors text-sm text-center sm:text-right py-2"
                  >
                    Clear Cart
                  </button>
               </div>
            </div>

            {/* Summary */}
            <div className="w-full lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:sticky lg:top-24">
                   <h3 className="font-bold text-xl text-slate-900 mb-6">Order Summary</h3>
                   
                   <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-slate-600 text-sm">
                         <span>Subtotal</span>
                         <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-sm">
                         <span>Estimated Tax (8%)</span>
                         <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-sm">
                         <span>Shipping</span>
                         <span className="text-slate-400 italic">Calculated at checkout</span>
                      </div>
                   </div>
                   
                   <div className="border-t border-slate-100 pt-4 mb-6">
                      <div className="flex justify-between items-end">
                         <span className="font-bold text-slate-900 text-lg">Total</span>
                         <span className="font-extrabold text-2xl text-slate-900">${total.toFixed(2)}</span>
                      </div>
                   </div>

                   <button 
                     onClick={onCheckout}
                     className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-brand-600 transition-all shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2 active:scale-95 transform duration-200"
                   >
                     Checkout
                     <ArrowRight size={20} />
                   </button>
                   <p className="text-center text-xs text-slate-400 mt-4">Secure checkout powered by GenialMarket</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
