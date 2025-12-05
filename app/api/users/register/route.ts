import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, username, email, password, role } = body;

        if (!id || !username || !email || !password || !role) {
            return NextResponse.json({
                message: 'All fields are required',
                missing: { id: !id, username: !username, email: !email, password: !password, role: !role }
            }, { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [id, username, email, password_hash, role]
        );

        // Create profile based on role
        if (role === 'seller') {
            const { location } = body;
            await pool.query('INSERT INTO seller_profiles (user_id, location) VALUES (?, ?)', [id, location || null]);
        } else {
            await pool.query('INSERT INTO buyer_profiles (user_id) VALUES (?)', [id]);
        }

        // Generate Token
        const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });

        return NextResponse.json({
            message: 'User registered successfully',
            token,
            user: { id, username, email, role }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Error registering user', error: error.message }, { status: 500 });
    }
}
