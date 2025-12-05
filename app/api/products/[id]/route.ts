import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import path from 'path';
import fs from 'fs';
import { writeFile, unlink } from 'fs/promises';

// Helper to delete file
const deleteFile = async (filePath: string) => {
    if (!filePath) return;
    if (filePath.startsWith('/uploads')) {
        const absolutePath = path.join(process.cwd(), 'public', filePath);
        if (fs.existsSync(absolutePath)) {
            try {
                await unlink(absolutePath);
            } catch (e) {
                console.error('Error deleting file:', e);
            }
        }
    }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // Unwrap params
    const { id } = await params;
    try {
        const query = `
            SELECT p.*, u.username as sellerName, sp.avatar as sellerAvatar
            FROM products p 
            JOIN users u ON p.seller_id = u.id 
            LEFT JOIN seller_profiles sp ON u.id = sp.user_id
            WHERE p.id = ?
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

        if (rows.length > 0) {
            const [reviews] = await pool.query('SELECT * FROM reviews WHERE product_id = ?', [id]);
            const product = { ...rows[0], reviews };
            return NextResponse.json(product);
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching product', error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;
        const stock = formData.get('stock') as string;
        const is_active = formData.get('is_active') === 'true' || formData.get('is_active') === '1' ? 1 : 0;
        let imagePath = formData.get('image') as string; // Could be existing URL string or empty

        const file = formData.get('image') instanceof File ? formData.get('image') as File : null;

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

            // Delete old image
            const [rows] = await pool.query<RowDataPacket[]>('SELECT image FROM products WHERE id = ?', [id]);
            if (rows.length > 0 && rows[0].image && rows[0].image !== imagePath) {
                await deleteFile(rows[0].image);
            }
        }

        await pool.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image = ?, stock = ?, is_active = ? WHERE id = ?',
            [name, price, description, imagePath, stock, is_active, id]
        );
        return NextResponse.json({ message: 'Product updated successfully', image: imagePath });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating product', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT image FROM products WHERE id = ?', [id]);
        if (rows.length > 0 && rows[0].image) {
            await deleteFile(rows[0].image);
        }

        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting product', error: error.message }, { status: 500 });
    }
}
