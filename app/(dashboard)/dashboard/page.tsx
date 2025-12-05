'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth';
import { Product, Sale, Order, SalesStat } from '../../../server/types';
import { Overview } from '../../../components/dashboard/Overview';
import { API_URL } from '../../../lib/config';

export default function Dashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesStats, setSalesStats] = useState<SalesStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // 1. Fetch Products
        const productsEndpoint = user.role === 'admin'
          ? `${API_URL}/api/products`
          : `${API_URL}/api/products/seller/${user.id}`;

        const productsRes = await fetch(productsEndpoint);
        let fetchedProducts: Product[] = [];
        if (productsRes.ok) {
          const data = await productsRes.json();
          fetchedProducts = data.map((p: any) => ({
            id: p.id,
            sellerId: p.seller_id,
            name: p.name,
            price: Number(p.price),
            description: p.description,
            image: p.image,
            category: 'General',
            stock: p.stock,
            rating: 0,
            reviews: [],
            isActive: Boolean(p.is_active)
          }));
          setProducts(fetchedProducts);
        }

        const ordersEndpoint = user.role === 'admin'
          ? `${API_URL}/api/orders/seller/${user.id}`
          : `${API_URL}/api/orders/seller/${user.id}`;

        const ordersRes = await fetch(ordersEndpoint);
        let fetchedOrders: Order[] = [];
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          fetchedOrders = data.map((o: any) => {
            let parsedAddress = o.shippingAddress || o.shipping_address_json;
            if (typeof parsedAddress === 'string') {
              try {
                parsedAddress = JSON.parse(parsedAddress);
              } catch (e) {
                console.error('Error parsing shipping address', e);
                parsedAddress = null;
              }
            }

            const sellerItems = o.items.map((i: any) => ({
              ...i,
              productName: i.product_name || i.productName,
              productImage: i.product_image || i.productImage,
              price: Number(i.price)
            }));

            const sellerTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

            return {
              ...o,
              customerName: o.customer_name || o.customerName,
              shippingAddress: parsedAddress,
              subtotal: Number(o.subtotal),
              tax: Number(o.tax),
              shipping_cost: Number(o.shipping_cost),
              total: sellerTotal,
              date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : o.date,
              items: sellerItems
            };
          });
          setOrders(fetchedOrders);
        }

        const allSales: Sale[] = [];
        let totalRevenue = 0;
        let totalSalesCount = 0;

        fetchedOrders.forEach(order => {
          order.items.forEach(item => {
            allSales.push({
              id: `${order.id}-${item.productId}`,
              productId: item.productId,
              productName: item.productName,
              amount: item.price * item.quantity,
              date: order.date || new Date().toISOString().split('T')[0],
              buyerName: order.customerName
            });
            totalRevenue += item.price * item.quantity;
            totalSalesCount += item.quantity;
          });
        });

        allSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSales(allSales);

        const stats: SalesStat[] = [
          { name: 'Total', sales: totalSalesCount, revenue: totalRevenue },
        ];
        setSalesStats(stats);

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return null;
  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <Overview
      sales={sales}
      salesStats={salesStats}
      products={products}
      orders={orders}
      user={user}
    />
  );
}