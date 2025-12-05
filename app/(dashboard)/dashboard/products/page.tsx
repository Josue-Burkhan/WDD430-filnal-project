'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../lib/auth';
import { Product } from '../../../../server/types';
import { Inventory } from '../../../../components/dashboard/Inventory';
import { API_URL } from '../../../../lib/config';

export default function InventoryPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (user) {
            const fetchProducts = async () => {
                try {
                    const endpoint = user.role === 'admin'
                        ? `${API_URL}/api/products`
                        : `${API_URL}/api/products/seller/${user.id}`;

                    const res = await fetch(endpoint);
                    if (res.ok) {
                        const data = await res.json();
                        const mappedProducts = data.map((p: any) => ({
                            id: String(p.id),
                            sellerId: String(p.seller_id),
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
                        setProducts(mappedProducts);
                    }
                } catch (error) {
                    console.error('Failed to fetch products', error);
                }
            };

            fetchProducts();
        }
    }, [user]);

    const handleDeleteProduct = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setProducts(prev => prev.filter(p => p.id !== id));
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    const handleToggleStatus = async (id: string) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        try {
            const payload = {
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                stock: product.stock,
                is_active: !product.isActive
            };

            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
            }
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    if (!user) return null;

    const dashboardProducts = user.role === 'admin'
        ? products
        : products.filter(p => String(p.sellerId) === String(user.id));

    return (
        <Inventory
            products={dashboardProducts}
            user={user}
            onEdit={(product) => router.push(`/dashboard/products/${product.id}`)}
            onDelete={handleDeleteProduct}
            onToggleStatus={handleToggleStatus}
        />
    );
}
