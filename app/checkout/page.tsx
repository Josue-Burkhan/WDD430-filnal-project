'use client';

import React, { useState } from 'react';
import { useCart } from '../../lib/cart';
import withAuth from '../../lib/withAuth';
import { useRouter } from 'next/navigation';
import { FiCreditCard, FiHome, FiCheckCircle } from 'react-icons/fi';

const CheckoutPage = () => {
  const { cartItems, totalPrice, cartCount, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 for shipping, 2 for payment

  // Simple state for form inputs
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', zip: '' });
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '' });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (shippingInfo.name && shippingInfo.address && shippingInfo.city && shippingInfo.zip) {
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (paymentInfo.cardNumber && paymentInfo.expiry && paymentInfo.cvv) {
      // In a real app, you would process the payment here
      console.log('Order placed!', { shippingInfo, paymentInfo, cartItems });
      clearCart();
      router.push('/order-success');
    }
  };

  if (cartCount === 0 && step !== 2) {
    router.push('/products');
    return null; // Or a loading spinner
  }
  
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Steps & Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            {/* Stepper UI */}
            <div className="flex justify-center items-center mb-8">
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}><FiHome/></div>
                    <p className={`ml-3 font-semibold ${step >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>Shipping</p>
                </div>
                <div className={`flex-auto border-t-2 mx-4 ${step > 1 ? 'border-indigo-600' : 'border-gray-300'}`}></div>
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${step === 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}><FiCreditCard/></div>
                    <p className={`ml-3 font-semibold ${step === 2 ? 'text-indigo-600' : 'text-gray-500'}`}>Payment</p>
                </div>
            </div>

            {/* Shipping Form */}
            {step === 1 && (
              <form onSubmit={handleShippingSubmit}>
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  <input type="text" placeholder="Full Name" value={shippingInfo.name} onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} className="p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  <input type="text" placeholder="Address" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} className="p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} className="p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                    <input type="text" placeholder="ZIP Code" value={shippingInfo.zip} onChange={e => setShippingInfo({...shippingInfo, zip: e.target.value})} className="p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                </div>
                <button type="submit" className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition">Continue to Payment</button>
              </form>
            )}

            {/* Payment Form */}
            {step === 2 && (
              <form onSubmit={handlePaymentSubmit}>
                <h2 className="text-2xl font-bold text-gray-700 mb-6">Payment Details</h2>
                <div className="grid grid-cols-1 gap-6">
                  <input type="text" placeholder="Card Number" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})} className="p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" value={paymentInfo.expiry} onChange={e => setPaymentInfo({...paymentInfo, expiry: e.target.value})} className="p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                    <input type="text" placeholder="CVV" value={paymentInfo.cvv} onChange={e => setPaymentInfo({...paymentInfo, cvv: e.target.value})} className="p-3 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(1)} className="bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-md hover:bg-gray-400 transition">Back to Shipping</button>
                  <button type="submit" className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition">Place Order</button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Your Order</h2>
                {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4"/>
                            <div>
                                <p className="font-bold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between font-bold text-xl text-gray-800">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(CheckoutPage);
