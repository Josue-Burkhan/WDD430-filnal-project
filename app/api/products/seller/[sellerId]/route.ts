import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ sellerId: string }> }) {
    const { sellerId } = await params;
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE seller_id = ?', [sellerId]);
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching seller products', error: error.message }, { status: 500 });
    }
}
