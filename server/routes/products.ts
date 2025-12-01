
import express from 'express';
import { MOCK_PRODUCTS } from '../data';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
    res.json(MOCK_PRODUCTS);
});

// Get product by ID
router.get('/:id', (req, res) => {
    const product = MOCK_PRODUCTS.find(p => p.id === req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Create product (Mock)
router.post('/', (req, res) => {
    const newProduct = { ...req.body, id: Date.now().toString() };
    MOCK_PRODUCTS.unshift(newProduct); // Add to in-memory array
    res.status(201).json(newProduct);
});

// Delete product (Mock)
router.delete('/:id', (req, res) => {
    const index = MOCK_PRODUCTS.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        MOCK_PRODUCTS.splice(index, 1);
        res.status(200).json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

export default router;
