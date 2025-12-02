import pool from './config/db';

const seedCategories = async () => {
    try {
        const [rows]: any = await pool.query('SELECT * FROM categories WHERE id = 1');
        if (rows.length === 0) {
            await pool.query("INSERT INTO categories (id, name, description) VALUES (1, 'General', 'Default category')");
            console.log('✅ Default category created');
        } else {
            console.log('ℹ️ Default category already exists');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
