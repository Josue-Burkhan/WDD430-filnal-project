import express from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { id, buyer_id, customer_name, subtotal, tax, shipping_cost, total, shipping_address, items } = req.body;

        // Insert Order
        await connection.query(
            'INSERT INTO orders (id, buyer_id, customer_name, subtotal, tax, shipping_cost, total, shipping_address_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, buyer_id, customer_name, subtotal, tax, shipping_cost, total, JSON.stringify(shipping_address)]
        );

        // Insert Order Items
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
                [id, item.productId, item.productName, item.productImage, item.quantity, item.price]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId: id });
    } catch (error: any) {
        await connection.rollback();
        res.status(500).json({ message: 'Error placing order', error: error.message });
    } finally {
        connection.release();
    }
});

// Get Orders by User (Buyer)
router.get('/user/:userId', async (req, res) => {
    try {
        const [orders] = await pool.query<RowDataPacket[]>('SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC', [req.params.userId]);

        // Fetch items for each order
        for (const order of orders) {
            const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            order.items = items;
            order.shippingAddress = order.shipping_address_json; // Parse JSON if needed by frontend, but mysql2 might handle it or send as string
        }

        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

export default router;
