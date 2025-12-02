import express from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Get Seller Profile
router.get('/seller/:username', async (req, res) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT sp.*, u.username, u.email 
             FROM seller_profiles sp 
             JOIN users u ON sp.user_id = u.id 
             WHERE u.username = ?`,
            [req.params.username]
        );

        if (rows.length > 0) {
            const profile = rows[0];
            // Fetch tags
            const [tags] = await pool.query<RowDataPacket[]>(
                `SELECT t.name FROM tags t 
                 JOIN seller_tags st ON t.id = st.tag_id 
                 WHERE st.seller_id = ?`,
                [profile.user_id]
            );
            profile.tags = tags.map((t: any) => t.name);
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Seller not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching seller profile', error: error.message });
    }
});

// Update Seller Profile
router.put('/seller/:userId', async (req, res) => {
    try {
        const { bio, avatar, banner_image, location } = req.body;
        await pool.query(
            'UPDATE seller_profiles SET bio = ?, avatar = ?, banner_image = ?, location = ? WHERE user_id = ?',
            [bio, avatar, banner_image, location, req.params.userId]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

export default router;
