
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import productRoutes from './routes/products';
import userRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Marketplace API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
