import express from 'express';
import pool from '../config/db';
import { ResultSetHeader } from 'mysql2';

const router = express.Router();

// Create Review
router.post('/', async (req, res) => {
    try {
        const { id, product_id, user_id, rating, title, comment } = req.body;
        await pool.query<ResultSetHeader>(
            'INSERT INTO reviews (id, product_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?, ?)',
            [id, product_id, user_id, rating, title, comment]
        );
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
});

// Get Reviews by Product
router.get('/product/:productId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT r.*, u.username as userName 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC`,
            [req.params.productId]
        );
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

// Update Review
router.put('/:id', async (req, res) => {
    try {
        const { rating, title, comment } = req.body;
        await pool.query(
            'UPDATE reviews SET rating = ?, title = ?, comment = ? WHERE id = ?',
            [rating, title, comment, req.params.id]
        );
        res.json({ message: 'Review updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
});

// Delete Review
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
        res.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
});

export default router;
