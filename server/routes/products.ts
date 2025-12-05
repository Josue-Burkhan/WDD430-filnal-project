import express from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'products');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper to delete file
const deleteFile = (filePath: string) => {
    if (!filePath) return;
    // Check if it's a local file (starts with /uploads)
    if (filePath.startsWith('/uploads')) {
        const absolutePath = path.join(process.cwd(), 'public', filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    }
};

// Get All Products
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username as sellerName 
            FROM products p 
            JOIN users u ON p.seller_id = u.id 
            WHERE p.is_active = TRUE
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Get Product by ID
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username as sellerName, sp.avatar as sellerAvatar
            FROM products p 
            JOIN users u ON p.seller_id = u.id 
            LEFT JOIN seller_profiles sp ON u.id = sp.user_id
            WHERE p.id = ?
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query, [req.params.id]);

        if (rows.length > 0) {
            const [reviews] = await pool.query('SELECT * FROM reviews WHERE product_id = ?', [req.params.id]);
            const product = { ...rows[0], reviews };
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

// Create Product (Seller only)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { id, seller_id, name, price, description, category_id, stock } = req.body;

        let imagePath = '';
        if (req.file) {
            imagePath = '/uploads/products/' + req.file.filename;
        } else if (req.body.image) {
            imagePath = req.body.image; // Fallback if URL provided directly
        }

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO products (id, seller_id, name, price, description, image, category_id, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, seller_id, name, price, description, imagePath, category_id, stock]
        );
        res.status(201).json({ message: 'Product created successfully', productId: id, image: imagePath });
    } catch (error: any) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

// Update Product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, stock, is_active } = req.body;
        let imagePath = req.body.image; // Default to existing image URL if sent

        // If new file uploaded
        if (req.file) {
            imagePath = '/uploads/products/' + req.file.filename;

            // Fetch old product to delete old image
            const [rows] = await pool.query<RowDataPacket[]>('SELECT image FROM products WHERE id = ?', [req.params.id]);
            if (rows.length > 0 && rows[0].image) {
                deleteFile(rows[0].image);
            }
        }

        await pool.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image = ?, stock = ?, is_active = ? WHERE id = ?',
            [name, price, description, imagePath, stock, is_active, req.params.id]
        );
        res.json({ message: 'Product updated successfully', image: imagePath });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// Delete Product
router.delete('/:id', async (req, res) => {
    try {
        // Fetch product to delete image
        const [rows] = await pool.query<RowDataPacket[]>('SELECT image FROM products WHERE id = ?', [req.params.id]);
        if (rows.length > 0 && rows[0].image) {
            deleteFile(rows[0].image);
        }

        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Get Products by Seller
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE seller_id = ?', [req.params.sellerId]);
        res.json(rows);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching seller products', error: error.message });
    }
});

export default router;
