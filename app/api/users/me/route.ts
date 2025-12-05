import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id]);

        if (rows.length > 0) {
            return NextResponse.json(rows[0]);
        } else {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}
