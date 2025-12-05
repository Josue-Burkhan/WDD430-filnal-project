import express from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Get Seller Profile by Username
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

// Get Seller Profile by ID
router.get('/seller/id/:userId', async (req, res) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT sp.*, u.username, u.email 
             FROM seller_profiles sp 
             JOIN users u ON sp.user_id = u.id 
             WHERE u.id = ?`,
            [req.params.userId]
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

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/uploads/sellers');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'seller-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Update Seller Profile
router.put('/seller/:userId', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }]), async (req, res) => {
    try {
        const userId = req.params.userId;
        const { bio, location } = req.body;

        // Get existing profile to check for old images
        const [rows] = await pool.query<RowDataPacket[]>('SELECT avatar, banner_image FROM seller_profiles WHERE user_id = ?', [userId]);
        const currentProfile = rows[0] || {};

        let avatarPath = req.body.avatar || currentProfile.avatar;
        let bannerPath = req.body.bannerImage || currentProfile.banner_image;

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Handle Avatar
        if (files && files.avatar) {
            avatarPath = `/uploads/sellers/${files.avatar[0].filename}`;
            // Delete old avatar
            if (currentProfile.avatar && currentProfile.avatar.startsWith('/uploads/sellers/')) {
                const oldPath = path.join(__dirname, '../../public', currentProfile.avatar);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        // Handle Banner
        if (files && files.bannerImage) {
            bannerPath = `/uploads/sellers/${files.bannerImage[0].filename}`;
            // Delete old banner
            if (currentProfile.banner_image && currentProfile.banner_image.startsWith('/uploads/sellers/')) {
                const oldPath = path.join(__dirname, '../../public', currentProfile.banner_image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        // Update DB
        await pool.query(
            'UPDATE seller_profiles SET bio = ?, avatar = ?, banner_image = ?, location = ? WHERE user_id = ?',
            [bio, avatarPath, bannerPath, location, userId]
        );

        res.json({
            message: 'Profile updated successfully',
            avatar: avatarPath,
            bannerImage: bannerPath
        });
    } catch (error: any) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

// Get Buyer Profile
router.get('/buyer/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch basic profile and user info
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT bp.*, u.username, u.email 
             FROM buyer_profiles bp 
             JOIN users u ON bp.user_id = u.id 
             WHERE u.id = ?`,
            [userId]
        );

        if (rows.length > 0) {
            const profile = rows[0];

            // Fetch default address
            const [addresses] = await pool.query<RowDataPacket[]>(
                'SELECT * FROM addresses WHERE user_id = ? AND is_default = TRUE',
                [userId]
            );

            if (addresses.length > 0) {
                profile.shippingAddress = {
                    fullName: addresses[0].full_name,
                    addressLine: addresses[0].address_line,
                    city: addresses[0].city,
                    zipCode: addresses[0].zip_code,
                    country: addresses[0].country
                };
            }

            res.json(profile);
        } else {
            // If no buyer profile exists, return basic user info
            const [users] = await pool.query<RowDataPacket[]>('SELECT id, username, email, created_at as join_date FROM users WHERE id = ?', [userId]);
            if (users.length > 0) {
                res.json({
                    user_id: users[0].id,
                    username: users[0].username,
                    email: users[0].email,
                    joinDate: users[0].join_date,
                    avatar: 'https://via.placeholder.com/150', // Default avatar
                    bio: 'New member'
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching buyer profile', error: error.message });
    }
});

export default router;
