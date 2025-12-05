import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: Promise<{ sellerId: string }> }) {
    const { sellerId } = await params;
    try {
        // Get orders that contain products from this seller
        const [orders] = await pool.query<RowDataPacket[]>(`
            SELECT DISTINCT o.*, u.username as buyer_username
            FROM orders o
            JOIN users u ON o.buyer_id = u.id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.seller_id = ?
            ORDER BY o.created_at DESC
        `, [sellerId]);

        // For each order, fetch items but mark which ones belong to this seller
        for (const order of orders) {
            const [items] = await pool.query<RowDataPacket[]>(`
                SELECT oi.*, p.seller_id 
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);

            // Filter items to only show what's relevant to this seller
            order.items = items.filter((item: any) => item.seller_id === sellerId);
            order.shippingAddress = order.shipping_address_json;
        }

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching seller orders', error: error.message }, { status: 500 });
    }
}
