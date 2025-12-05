import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT bp.*, u.username, u.email 
             FROM buyer_profiles bp 
             JOIN users u ON bp.user_id = u.id 
             WHERE u.id = ?`,
            [userId]
        );

        if (rows.length > 0) {
            const profile = rows[0];
            const [addresses] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM addresses WHERE user_id = ? AND is_default = TRUE',
                [userId]
            );

            if (addresses.length > 0) {
                profile.shippingAddress = {
                    fullName: addresses[0].full_name,
                    addressLine: addresses[0].address_line,
                    city: addresses[0].city,
                    zipCode: addresses[0].zip_code,
                    country: addresses[0].country
                };
            }
            return NextResponse.json(profile);
        } else {
            const [users] = await pool.query<RowDataPacket[]>('SELECT id, username, email, created_at as join_date FROM users WHERE id = ?', [userId]);
            if (users.length > 0) {
                return NextResponse.json({
                    user_id: users[0].id,
                    username: users[0].username,
                    email: users[0].email,
                    joinDate: users[0].join_date,
                    avatar: 'https://via.placeholder.com/150',
                    bio: 'New member'
                });
            } else {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }
        }
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching buyer profile', error: error.message }, { status: 500 });
    }
}
