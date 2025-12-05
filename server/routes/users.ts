import express from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Register User
router.post('/register', async (req, res) => {
    try {
        console.log('Register Request Body:', req.body);
        const { id, username, email, password, role } = req.body;

        if (!id || !username || !email || !password || !role) {
            console.log('Missing fields:', { id, username, email, password, role });
            res.status(400).json({
                message: 'All fields are required',
                received: req.body,
                missing: { id: !id, username: !username, email: !email, password: !password, role: !role }
            });
            return;
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
            const { location } = req.body;
            await pool.query('INSERT INTO seller_profiles (user_id, location) VALUES (?, ?)', [id, location || null]);
        } else {
            await pool.query('INSERT INTO buyer_profiles (user_id) VALUES (?)', [id]);
        }

        // Generate Token
        const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id, username, email, role }
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if input is email or username
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ? OR username = ?', [email, email]);

        if (rows.length === 0) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Verify Token / Get Current User
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// Delete User
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

export default router;
