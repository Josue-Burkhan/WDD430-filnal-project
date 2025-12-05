import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    try {
        const [orders] = await pool.query<RowDataPacket[]>('SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC', [userId]);

        for (const order of orders) {
            const [items] = await pool.query<RowDataPacket[]>('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            order.items = items;
            order.shippingAddress = order.shipping_address_json;
        }

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
    }
}
