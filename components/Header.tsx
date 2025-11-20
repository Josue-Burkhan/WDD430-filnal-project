'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart'; // Import useCart
import { FiUser, FiLogOut, FiGrid, FiShoppingCart } from 'react-icons/fi'; // Import FiShoppingCart

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); // Get cart count
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="text-3xl font-bold text-indigo-600 cursor-pointer">Handcrafted Haven</div>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products">
            <div className="text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">Products</div>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart">
            <div className="relative text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                <FiUser className="mr-2" />
                <span>{user.name}</span>
              </button>
              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  onMouseLeave={() => setIsMenuOpen(false)} // Close on mouse leave
                >
                  <Link href="/dashboard">
                    <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer">
                      <FiGrid className="mr-2" />
                      Dashboard
                    </div>
                  </Link>
                  <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login">
                <div className="text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">Login</div>
              </Link>
              <Link href="/register">
                <div className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer">Register</div>
              </Link>
            </div>
          )}
        </nav>
        {/* Mobile menu with cart icon */}
        <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart">
                <div className="relative text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">
                <FiShoppingCart size={24} />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cartCount}
                    </span>
                )}
                </div>
            </Link>
          {/* A proper mobile menu button would go here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
