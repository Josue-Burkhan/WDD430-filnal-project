import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
    try {
        const { id, product_id, user_id, rating, title, comment } = await req.json();
        await pool.query<ResultSetHeader>(
            'INSERT INTO reviews (id, product_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?, ?)',
            [id, product_id, user_id, rating, title, comment]
        );
        return NextResponse.json({ message: 'Review added successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error adding review', error: error.message }, { status: 500 });
    }
}
