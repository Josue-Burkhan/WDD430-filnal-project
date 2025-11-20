'use client';

import React from 'react';
import Link from 'next/link';
import { useCart, CartItem } from '../../lib/cart';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Your Shopping Cart</h1>
        
        {cartCount > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Cart Items List */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {cartItems.map((item: CartItem) => (
                  <div key={item._id} className="flex items-center p-4 border-b border-gray-200">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow ml-4">
                      <Link href={`/products/${item._id}`}>
                        <div className="font-bold text-lg text-gray-800 hover:text-indigo-600 cursor-pointer">{item.name}</div>
                      </Link>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
                        <FiMinus />
                      </button>
                      <span className="font-bold text-lg">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="ml-6 text-right">
                      <p className="font-bold text-lg text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="ml-4 text-red-500 hover:text-red-700 transition">
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={clearCart} className="mt-4 text-sm font-semibold text-red-500 hover:underline">
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold text-gray-800">FREE</span>
                </div>
                <div className="flex justify-between font-extrabold text-xl text-gray-800 border-t pt-4 mt-4">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Link href="/checkout">
                  <button className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white rounded-lg shadow-lg p-12">
            <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty.</h2>
            <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products">
              <div className="mt-6 inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg">
                Start Shopping
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
