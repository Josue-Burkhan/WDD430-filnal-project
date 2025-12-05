import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const { rating, title, comment } = await req.json();
        await pool.query(
            'UPDATE reviews SET rating = ?, title = ?, comment = ? WHERE id = ?',
            [rating, title, comment, id]
        );
        return NextResponse.json({ message: 'Review updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating review', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting review', error: error.message }, { status: 500 });
    }
}
