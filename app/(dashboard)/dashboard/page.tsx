'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth';
import { Product, Sale, Order } from '../../../server/types';
import { MOCK_PRODUCTS, MOCK_SALES, SALES_STATS, MOCK_ORDERS } from '../../../marketplace/services/mockData';

// Sub-components
import { Overview } from '../../../components/dashboard/Overview';

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data states
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [sales] = useState<Sale[]>(MOCK_SALES);
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  // Fetch Data
  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        try {
          const endpoint = user.role === 'admin'
            ? 'http://localhost:5000/api/products'
            : `http://localhost:5000/api/products/seller/${user.id}`; // Assuming user.id matches seller_id

          const res = await fetch(endpoint);
          if (res.ok) {
            const data = await res.json();
            // Map backend data to frontend model if needed, or ensure types match
            // Backend returns snake_case, frontend uses camelCase?
            // Let's check types.ts. It seems types.ts uses camelCase.
            // We might need an adapter or update backend to return camelCase.
            // For now, let's assume we need to map or the types are loose.
            // Actually, let's check the backend response. It returns raw DB rows (snake_case).
            // We should probably map it here.
            const mappedProducts = data.map((p: any) => ({
              id: p.id,
              sellerId: p.seller_id,
              name: p.name,
              price: Number(p.price),
              description: p.description,
              image: p.image,
              category: 'General', // DB has category_id, we might need to fetch categories or just use a default
              stock: p.stock,
              rating: 0, // DB doesn't have rating on product table directly, it's in reviews. We could fetch or ignore.
              reviews: [],
              isActive: Boolean(p.is_active)
            }));
            setProducts(mappedProducts);
          }
        } catch (error) {
          console.error('Failed to fetch products', error);
        }
      };

      fetchProducts();
    }
  }, [user]);

  if (!user) return null;

  // Filter Data based on Role
  const dashboardProducts = user.role === 'admin'
    ? products
    : products.filter(p => String(p.sellerId) === String(user.id));

  const dashboardOrders = user.role === 'admin'
    ? orders
    : orders.filter(o => o.items.some(item =>
      products.find(p => p.id === item.productId)?.sellerId === String(user.id)
    ));

  return (
    <Overview
      sales={sales}
      salesStats={SALES_STATS}
      products={dashboardProducts}
      orders={dashboardOrders}
    />
  );
}