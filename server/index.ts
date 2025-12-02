
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import productRoutes from './routes/products';
import userRoutes from './routes/users';
import reviewRoutes from './routes/reviews';
import orderRoutes from './routes/orders';
import profileRoutes from './routes/profiles';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/', (req, res) => {
    res.send('Marketplace API is running');
});

import pool from './config/db';

// Test DB Connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
