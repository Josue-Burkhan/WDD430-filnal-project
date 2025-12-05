import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        // Optional: Verify order status before cancelling (e.g., can only cancel Pending)
        // For now, straightforward update

        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating order', error: error.message }, { status: 500 });
    }
}
