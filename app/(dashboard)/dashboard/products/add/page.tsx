'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth';
import { ProductForm } from '../../../../../components/dashboard/ProductForm';

export default function AddProductPage() {
    const router = useRouter();
    const { user } = useAuth();

    const handleSave = async (productData: any) => {
        try {
            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: productData
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create product');
            }

            router.push('/dashboard/products');
        } catch (error) {
            console.error(error);
            alert('Error saving product');
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            <ProductForm
                isEditing={false}
                onSave={handleSave}
                onCancel={() => router.push('/dashboard/products')}
                user={user}
            />
        </div>
    );
}
