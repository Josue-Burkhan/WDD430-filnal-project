'use client';

import React from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';

const OrderSuccessPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg">
        
        <div>
          <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">Thank You for Your Order!</h2>
          <p className="mt-2 text-lg text-gray-600">
            Your purchase has been successful and is on its way.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
                <FiPackage className="text-indigo-600 mr-3" size={24}/>
                <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
            </div>
            <p className="text-gray-600">We've sent a confirmation and receipt to your email address.</p>
            <p className="text-gray-600 mt-2">You can also view your order details in your dashboard.</p>
        </div>

        <div>
          <Link href="/products">
            <div className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
              Continue Shopping
              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1"/>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
