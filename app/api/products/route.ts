import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';

export async function GET(req: NextRequest) {
    try {
        const query = `
            SELECT p.*, u.username as sellerName 
            FROM products p 
            JOIN users u ON p.seller_id = u.id 
            WHERE p.is_active = TRUE
        `;
        const [rows] = await pool.query(query);
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching products', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const id = formData.get('id') as string;
        const seller_id = formData.get('seller_id') as string;
        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;
        const category_id = formData.get('category_id') as string;
        const stock = formData.get('stock') as string;
        const file = formData.get('image') as File | null;
        let imagePath = formData.get('imageUrl') as string || ''; // Fallback/Manual URL

        if (file && typeof file === 'object' && file.name) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = uniqueSuffix + path.extname(file.name);
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            imagePath = '/uploads/products/' + filename;
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO products (id, seller_id, name, price, description, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, seller_id, name, price, description, imagePath, category_id, stock]
        );

        return NextResponse.json({ message: 'Product created successfully', productId: id, image: imagePath }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Error creating product', error: error.message }, { status: 500 });
    }
}
