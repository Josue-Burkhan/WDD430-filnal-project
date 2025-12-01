
import express from 'express';
import { MOCK_USERS, MOCK_BUYER_PROFILE, MOCK_SELLERS } from '../data';

const router = express.Router();

// Login
router.post('/login', (req, res) => {
    const { email, username, password } = req.body;
    const identifier = email || username;

    const user = MOCK_USERS.find(u => (u.email === identifier || u.username === identifier) && u.password === password);

    if (user) {
        // Return mock token and user info
        res.json({
            user: user,
            token: 'mock-jwt-token-123456'
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Register
router.post('/register', (req, res) => {
    const newUser = { ...req.body, id: Date.now() };
    MOCK_USERS.push(newUser);
    res.status(201).json({
        user: newUser,
        token: 'mock-jwt-token-new-user'
    });
});

// Get Profile (Mock)
router.get('/profile', (req, res) => {
    // In a real app, we'd verify the token. Here we just return a default profile or based on query
    // For simplicity, returning the default buyer profile
    res.json(MOCK_BUYER_PROFILE);
});

export default router;
