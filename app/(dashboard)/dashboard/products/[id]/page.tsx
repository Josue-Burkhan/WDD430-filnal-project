'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../lib/auth';
import { ProductForm } from '../../../../../components/dashboard/ProductForm';
import { Product } from '../../../../../server/types';
import { API_URL } from '../../../../../lib/config';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { user } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Unwrap params
    const { id } = React.use(params);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Map data
                    const mappedProduct: Product = {
                        id: data.id,
                        sellerId: data.seller_id,
                        name: data.name,
                        price: Number(data.price),
                        description: data.description,
                        image: data.image,
                        category: 'General',
                        stock: data.stock,
                        reviews: data.reviews || [],
                        isActive: Boolean(data.is_active)
                    };
                    setProduct(mappedProduct);
                } else {
                    alert("Product not found");
                    router.push('/dashboard/products');
                }
            } catch (error) {
                console.error('Error fetching product', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, router]);

    const handleSave = async (productData: any) => {
        try {
            const formDataId = productData.get('id');
            const res = await fetch(`${API_URL}/api/products/${formDataId}`, {
                method: 'PUT',
                body: productData
            });

            if (!res.ok) throw new Error('Failed to update product');

            router.push('/dashboard/products');
        } catch (error) {
            console.error(error);
            alert('Error updating product');
        }
    };

    if (!user || loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <ProductForm
                initialData={product}
                isEditing={true}
                onSave={handleSave}
                onCancel={() => router.push('/dashboard/products')}
                user={user}
            />
        </div>
    );
}
