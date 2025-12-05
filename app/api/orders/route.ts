import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const body = await req.json();
        const { id, buyer_id, customer_name, subtotal, tax, shipping_cost, total, shipping_address, items } = body;

        // Insert Order
        await connection.query(
            'INSERT INTO orders (id, buyer_id, customer_name, subtotal, tax, shipping_cost, total, shipping_address_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, buyer_id, customer_name, subtotal, tax, shipping_cost, total, JSON.stringify(shipping_address)]
        );

        // Insert Order Items and Update Stock
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
                [id, item.productId, item.productName, item.productImage, item.quantity, item.price]
            );

            // Decrement stock
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.productId]
            );
        }

        await connection.commit();
        return NextResponse.json({ message: 'Order placed successfully', orderId: id }, { status: 201 });
    } catch (error: any) {
        await connection.rollback();
        return NextResponse.json({ message: 'Error placing order', error: error.message }, { status: 500 });
    } finally {
        connection.release();
    }
}
