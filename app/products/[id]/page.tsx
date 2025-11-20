'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductById } from '../../../lib/api';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../../lib/cart'; // Import the cart hook
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Define a clear type for the product structure
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
  artisan: { _id: string; name: string };
}

const ProductDetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0); // Index of the currently displayed image
  
  const params = useParams();
  const { addToCart } = useCart(); // Get the addToCart function

  useEffect(() => {
    const fetchProduct = async () => {
      if (params && params.id) {
        try {
          setLoading(true);
          const response = await getProductById(params.id as string);
          setProduct(response.data);
        } catch (err) {
          console.error("Error fetching product:", err);
          setError('Could not load the product. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setError("Product ID not found.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params]);

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.jpg',
        quantity: 1, // Add quantity
      };
      addToCart(cartItem);
      alert(`${product.name} has been added to your cart!`);
    }
  };

  if (loading) {
    return <p className="text-center my-20 text-lg text-gray-500">Loading Product...</p>;
  }

  if (error) {
    return <p className="text-center my-20 text-lg text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-center my-20 text-lg text-gray-500">Product not found.</p>;
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="flex flex-col items-center">
            <div className="relative w-full h-[500px] rounded-lg shadow-xl overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 ease-in-out"
              />
               {product.images.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition"><FiChevronLeft size={24}/></button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition"><FiChevronRight size={24}/></button>
                </>
               )}
            </div>
            <div className="flex space-x-2">
              {product.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 rounded-md overflow-hidden border-2 transition ${selectedImage === index ? 'border-indigo-500' : 'border-transparent'}`}>
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    objectFit="cover"
                    className="transition-transform hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="pt-4">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 my-3">{product.name}</h1>
            <Link href={`/artisans/${product.artisan._id}`} className="text-lg text-gray-600 hover:text-indigo-600 transition">
              By {product.artisan.name}
            </Link>
            <p className="text-4xl font-bold text-gray-800 my-5">{`$${product.price.toFixed(2)}`}</p>
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed mb-8">{product.description}</p>
            
            <div className="flex items-center gap-6">
                <button 
                    onClick={handleAddToCart}
                    className="flex items-center justify-center w-full bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                    <FiShoppingCart className="mr-3" size={22}/>
                    Add to Cart
                </button>
            </div>
             <p className="mt-4 text-sm text-gray-500">{product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
