'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import withAuth from '../../lib/withAuth';
import { useAuth } from '../../lib/auth';
import { getProducts, deleteProduct } from '../../lib/api';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';

// Define the structure of a Product
interface Product {
  _id: string;
  name: string;
  price: number;
  artisan: string; // ID of the user who created the product
  // Add other product properties as needed
}

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!user || !token) return;

      try {
        setLoading(true);
        const response = await getProducts();
        // Filter products to show only those created by the current user
        const userProducts = response.data.filter((product: Product) => product.artisan === user.id);
        setProducts(userProducts);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load your products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [user, token]);

  const handleDelete = async (productId: string) => {
    if (!token || !confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(productId, token);
      // Refresh the list by filtering out the deleted product
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">My Products</h1>
          <p className="text-lg text-gray-600 mt-1">Manage your handcrafted goods.</p>
        </div>
        <Link href="/dashboard/add-product" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">
            <FiPlusCircle className="mr-2 -ml-1" />
            Add New Product
        </Link>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading your products...</p>
        ) : error ? (
          <p className="p-8 text-center text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{product.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">${product.price.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center space-x-4">
                      <Link href={`/dashboard/edit-product/${product._id}`} className="text-indigo-600 hover:text-indigo-900">
                        <FiEdit />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-gray-500">You haven't added any products yet. Get started by adding one!</p>
        )}
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);
