import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    try {
        const [rows] = await pool.query(
            `SELECT r.*, u.username as userName 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC`,
            [productId]
        );
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching reviews', error: error.message }, { status: 500 });
    }
}
