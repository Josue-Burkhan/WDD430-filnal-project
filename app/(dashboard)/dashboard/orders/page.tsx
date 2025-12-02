'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../lib/auth';
import { Order, Product } from '../../../../server/types';
import { Orders } from '../../../../components/dashboard/Orders';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../../../marketplace/services/mockData';

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders] = useState<Order[]>(MOCK_ORDERS);
    const [products] = useState<Product[]>(MOCK_PRODUCTS); // Ideally fetch products to map names if needed

    if (!user) return null;

    const dashboardOrders = user.role === 'admin'
        ? orders
        : orders.filter(o => o.items.some(item =>
            // This logic relies on having all products loaded. 
            // In a real app, backend should filter orders by seller.
            // For now, using mock logic is fine as we migrate.
            true // Placeholder: backend should handle filtering
        ));

    return (
        <Orders orders={dashboardOrders} />
    );
}
