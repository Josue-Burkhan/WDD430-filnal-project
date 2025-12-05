'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../lib/auth';
import { Order } from '../../../../server/types';
import { Orders } from '../../../../components/dashboard/Orders';
import { API_URL } from '../../../../lib/config';

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const res = await fetch(`${API_URL}/api/orders/seller/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    const fetchedOrders = data.map((o: any) => {
                        // Parse shipping address if it's a string (JSON)
                        let parsedAddress = o.shippingAddress || o.shipping_address_json;
                        if (typeof parsedAddress === 'string') {
                            try {
                                parsedAddress = JSON.parse(parsedAddress);
                            } catch (e) {
                                console.error('Error parsing shipping address', e);
                                parsedAddress = null;
                            }
                        }

                        // Calculate seller-specific total
                        const sellerItems = o.items.map((i: any) => ({
                            ...i,
                            productName: i.product_name || i.productName,
                            productImage: i.product_image || i.productImage,
                            price: Number(i.price)
                        }));

                        const sellerTotal = sellerItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

                        return {
                            ...o,
                            buyerUsername: o.buyer_username || o.buyerUsername,
                            customerName: o.customer_name || o.customerName, // Map snake_case to camelCase
                            shippingAddress: parsedAddress,
                            subtotal: Number(o.subtotal),
                            tax: Number(o.tax),
                            shippingCost: Number(o.shipping_cost),
                            total: sellerTotal, // Use calculated seller total
                            date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : o.date, // Ensure date format
                            items: sellerItems
                        };
                    });
                    setOrders(fetchedOrders);
                }
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) return null;
    if (loading) return <div>Loading orders...</div>;

    return (
        <Orders orders={orders} />
    );
}
