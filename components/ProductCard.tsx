'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/cart'; // Import the useCart hook
import { FiShoppingCart } from 'react-icons/fi';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string; // The product card now expects a single image URL
    artisanName: string; // Flattened artisan name
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart(); // Get the addToCart function

  // Prepare the item for the cart. Note that quantity is not needed here.
  const cartItem = {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1, // Add quantity
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation(); // Stop the event from bubbling up to the Link
    addToCart(cartItem);
    // Optional: Add some visual feedback, like a toast notification
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative h-56 w-full">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">By {product.artisanName}</p>
          <div className="flex justify-between items-center">
            <p className="text-xl font-extrabold text-indigo-600">{`$${product.price.toFixed(2)}`}</p>
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center p-2 bg-indigo-500 text-white rounded-full transform transition-transform duration-300 scale-0 group-hover:scale-100 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              aria-label="Add to cart"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
