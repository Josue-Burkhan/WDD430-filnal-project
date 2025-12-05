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

import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { ResultSetHeader } from 'mysql2';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    try {
        const formData = await req.formData();
        const bio = formData.get('bio') as string;
        const file = formData.get('image') as File | null;

        let avatarPath = formData.get('imageUrl') as string; // Current or manual URL

        if (file && typeof file === 'object' && file.name) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = uniqueSuffix + path.extname(file.name);
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'users');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            avatarPath = '/uploads/users/' + filename;
        }

        // Check if profile exists
        const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM buyer_profiles WHERE user_id = ?', [userId]);

        if (existing.length > 0) {
            await pool.query(
                'UPDATE buyer_profiles SET bio = ?, avatar = ? WHERE user_id = ?',
                [bio, avatarPath, userId]
            );
        } else {
            await pool.query(
                'INSERT INTO buyer_profiles (user_id, bio, avatar) VALUES (?, ?, ?)',
                [userId, bio, avatarPath]
            );
        }

        return NextResponse.json({ message: 'Profile updated successfully', avatar: avatarPath });

    } catch (error: any) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'Error updating profile', error: error.message }, { status: 500 });
    }
}
