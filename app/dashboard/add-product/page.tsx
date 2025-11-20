'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import withAuth from '../../../lib/withAuth';
import { useAuth } from '../../../lib/auth';
import { createProduct } from '../../../lib/api';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

const AddProductPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>();
  const { token } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ProductFormData) => {
    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createProduct(data, token);
      alert("Product created successfully!");
      router.push('/dashboard');
    } catch (err) {
      console.error("Failed to create product:", err);
      setError("Failed to create product. Please check the details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Add a New Product</h1>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Product name is required" })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Product Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows={4}
                {...register("description", { required: "Description is required" })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              ></textarea>
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Price, Category, and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  {...register("price", { required: "Price is required", valueAsNumber: true, min: { value: 0.01, message: "Price must be positive" } })}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  id="category"
                  {...register("category", { required: "Category is required" })}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  id="stock"
                  {...register("stock", { required: "Stock is required", valueAsNumber: true, min: { value: 0, message: "Stock can't be negative" } })}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                {errors.stock && <p className="mt-2 text-sm text-red-600">{errors.stock.message}</p>}
              </div>
            </div>
            
            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                id="image"
                {...register("image", { required: "Image URL is required" })}
                className={`mt-1 block w-full px-3 py-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-600 text-center font-semibold">{error}</p>}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition"
              >
                {isSubmitting ? 'Creating Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AddProductPage);
