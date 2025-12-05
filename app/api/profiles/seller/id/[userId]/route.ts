import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT sp.*, u.username, u.email 
             FROM seller_profiles sp 
             JOIN users u ON sp.user_id = u.id 
             WHERE u.id = ?`,
            [userId]
        );

        if (rows.length > 0) {
            const profile = rows[0];
            const [tags] = await pool.query<RowDataPacket[]>(
                `SELECT t.name FROM tags t 
                 JOIN seller_tags st ON t.id = st.tag_id 
                 WHERE st.seller_id = ?`,
                [profile.user_id]
            );
            profile.tags = tags.map((t: any) => t.name);
            return NextResponse.json(profile);
        } else {
            return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching seller profile', error: error.message }, { status: 500 });
    }
}
