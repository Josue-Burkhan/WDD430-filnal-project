import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Check if input is email or username
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ? OR username = ?', [email, email]);

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        return NextResponse.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Error logging in', error: error.message }, { status: 500 });
    }
}
