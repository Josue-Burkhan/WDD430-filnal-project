import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { seller_id, user_id, rating } = await req.json();

        // Upsert Review
        await pool.query(
            `INSERT INTO seller_reviews (seller_id, user_id, rating) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
            [seller_id, user_id, rating]
        );

        // Recalculate Average
        const [rows] = await pool.query<any[]>(
            'SELECT AVG(rating) as avgRating FROM seller_reviews WHERE seller_id = ?',
            [seller_id]
        );
        const avgRating = rows[0].avgRating || 0;

        // Update Profile
        await pool.query(
            'UPDATE seller_profiles SET rating = ? WHERE user_id = ?',
            [avgRating, seller_id]
        );

        return NextResponse.json({ message: 'Seller rated successfully', newRating: avgRating });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error rating seller', error: error.message }, { status: 500 });
    }
}
