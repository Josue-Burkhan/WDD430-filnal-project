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
// Get Orders by Seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;

        // Get orders that contain products from this seller
        const [orders] = await pool.query<RowDataPacket[]>(`
            SELECT DISTINCT o.*, u.username as buyer_username
            FROM orders o
            JOIN users u ON o.buyer_id = u.id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.seller_id = ?
            ORDER BY o.created_at DESC
        `, [sellerId]);

        // For each order, fetch items but mark which ones belong to this seller
        for (const order of orders) {
            const [items] = await pool.query<RowDataPacket[]>(`
                SELECT oi.*, p.seller_id 
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);

            // Filter items to only show what's relevant to this seller, or show all but highlight theirs
            // The requirement says "only if it is their product". 
            // So we should probably only return the items that belong to the seller.
            order.items = items.filter((item: any) => item.seller_id === sellerId);
            order.shippingAddress = order.shipping_address_json;
        }

        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching seller orders', error: error.message });
    }
});

// Get Sales Stats for Chart
router.get('/stats/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        const range = req.query.range as string || '15d'; // '24h', '15d', '1y'

        let query = '';
        let params: any[] = [];

        if (range === '24h') {
            // Group by hour for the last 24 hours
            query = `
                SELECT 
                    DATE_FORMAT(o.created_at, '%H:00') as name, 
                    SUM(oi.price * oi.quantity) as revenue
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ? 
                AND o.created_at >= NOW() - INTERVAL 24 HOUR
                GROUP BY DATE_FORMAT(o.created_at, '%H:00'), HOUR(o.created_at)
                ORDER BY o.created_at ASC
            `;
            params = [sellerId];
        } else if (range === '1y') {
            // Group by month for the last year
            query = `
                SELECT 
                    DATE_FORMAT(o.created_at, '%b') as name, 
                    SUM(oi.price * oi.quantity) as revenue
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ? 
                AND o.created_at >= NOW() - INTERVAL 1 YEAR
                GROUP BY DATE_FORMAT(o.created_at, '%b'), MONTH(o.created_at)
                ORDER BY o.created_at ASC
            `;
            params = [sellerId];
        } else {
            // Default: Group by day for the last 15 days
            query = `
                SELECT 
                    DATE_FORMAT(o.created_at, '%b %d') as name, 
                    SUM(oi.price * oi.quantity) as revenue
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ? 
                AND o.created_at >= NOW() - INTERVAL 15 DAY
                GROUP BY DATE_FORMAT(o.created_at, '%b %d'), DATE(o.created_at)
                ORDER BY o.created_at ASC
            `;
            params = [sellerId];
        }

        const [rows] = await pool.query<RowDataPacket[]>(query, params);

        // Fill in missing gaps if needed (optional, but good for charts)
        // For now, we return what we have. Frontend can handle gaps or we can improve this later.

        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching sales stats', error: error.message });
    }
});

export default router;
