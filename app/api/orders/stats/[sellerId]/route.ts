import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: Promise<{ sellerId: string }> }) {
    const { sellerId } = await params;
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '15d';

    try {
        let query = '';
        let queryParams: any[] = [];

        if (range === '24h') {
            query = `
                SELECT 
                    DATE_FORMAT(o.created_at, '%H:00') as name, 
                    SUM(oi.price * oi.quantity) as revenue
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ? 
                AND o.created_at >= NOW() - INTERVAL 24 HOUR
                GROUP BY DATE_FORMAT(o.created_at, '%H:00'), HOUR(o.created_at)
                ORDER BY o.created_at ASC
            `;
            queryParams = [sellerId];
        } else if (range === '1y') {
            query = `
                SELECT 
                    DATE_FORMAT(o.created_at, '%b') as name, 
                    SUM(oi.price * oi.quantity) as revenue
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ? 
                AND o.created_at >= NOW() - INTERVAL 1 YEAR
                GROUP BY DATE_FORMAT(o.created_at, '%b'), MONTH(o.created_at)
                ORDER BY o.created_at ASC
            `;
            queryParams = [sellerId];
        } else {
            // Default 15d
            query = `
                SELECT 
                    DATE_FORMAT(o.created_at, '%b %d') as name, 
                    SUM(oi.price * oi.quantity) as revenue
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ? 
                AND o.created_at >= NOW() - INTERVAL 15 DAY
                GROUP BY DATE_FORMAT(o.created_at, '%b %d'), DATE(o.created_at)
                ORDER BY o.created_at ASC
            `;
            queryParams = [sellerId];
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching sales stats', error: error.message }, { status: 500 });
    }
}
