
import { Product, Sale, SalesStat, SellerProfile, Order, Review, BuyerProfile, User } from './types';

export const MOCK_SELLERS: SellerProfile[] = [
    {
        username: 'admin',
        bio: 'Passionate artisan specializing in sustainable, handcrafted goods. I believe in quality over quantity and putting a piece of my soul into every creation.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
        bannerImage: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=1200',
        location: 'Portland, OR',
        email: 'contact@artisanstudio.com',
        rating: 4.9,
        totalSalesCount: 145,
        joinDate: '2022',
        tags: ['Sustainable', 'Handmade', 'Eco-Friendly']
    },
    {
        username: 'SarahCrafts',
        bio: 'Weaving dreams into reality. Specializing in high-quality textiles and knitwear using locally sourced wool.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        bannerImage: 'https://images.unsplash.com/photo-1520013577616-a4c896934449?auto=format&fit=crop&q=80&w=1200',
        location: 'Austin, TX',
        email: 'sarah@crafts.com',
        rating: 4.7,
        totalSalesCount: 82,
        joinDate: '2023',
        tags: ['Knitted', 'Wool', 'Cozy']
    },
    {
        username: 'WoodWorks',
        bio: 'Reclaiming history one piece of wood at a time. Custom furniture and home decor from reclaimed barn wood.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        bannerImage: 'https://images.unsplash.com/photo-1542662565-7e4b66b5adaa?auto=format&fit=crop&q=80&w=1200',
        location: 'Denver, CO',
        email: 'info@woodworks.co',
        rating: 4.8,
        totalSalesCount: 56,
        joinDate: '2021',
        tags: ['Reclaimed', 'Furniture', 'Rustic']
    }
];

export const MOCK_BUYER_PROFILE: BuyerProfile = {
    username: 'buyer',
    email: 'buyer@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
    bio: 'Lover of all things handmade and unique. Always hunting for the perfect gift.',
    joinDate: '2023',
    shippingAddress: {
        fullName: 'Buyer Doe',
        addressLine: '123 Buyer St',
        city: 'New York',
        zipCode: '10001',
        country: 'USA'
    }
};

const REVIEWS: Review[] = [
    { id: 'r1', userName: 'Jane Doe', rating: 5, comment: 'Absolutely stunning quality! Arrived fast.', date: '2023-10-15' },
    { id: 'r2', userName: 'Mark Smith', rating: 4, comment: 'Very nice, but smaller than expected.', date: '2023-10-10' },
    { id: 'r3', userName: 'Emily R.', rating: 5, comment: 'The best purchase I have made this year.', date: '2023-09-28' },
];

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Hand-Knitted Merino Wool Scarf',
        price: 85.00,
        description: 'Luxuriously soft, chunky knit scarf made from 100% merino wool. Perfect for keeping warm in style.',
        image: 'https://images.unsplash.com/photo-1629026815348-18c393796d40?auto=format&fit=crop&q=80&w=800',
        category: 'Textiles',
        sellerId: 'SarahCrafts',
        stock: 12,
        reviews: [REVIEWS[0], REVIEWS[1]],
        isActive: true
    },
    {
        id: '2',
        name: 'Ceramic Speckled Mug Set',
        price: 45.00,
        description: 'Set of 2 hand-thrown stoneware mugs with a natural speckled glaze. Microwave and dishwasher safe.',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
        category: 'Ceramics',
        sellerId: 'admin',
        stock: 3,
        reviews: [REVIEWS[2]],
        isActive: true
    },
    {
        id: '3',
        name: 'Reclaimed Wood Wall Clock',
        price: 120.00,
        description: 'Minimalist wall clock crafted from reclaimed barn wood with brass hands. Each piece has unique grain.',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
        category: 'Woodwork',
        sellerId: 'WoodWorks',
        stock: 5,
        reviews: [],
        isActive: true
    },
    {
        id: '4',
        name: 'Silver Leaf Resin Earrings',
        price: 32.00,
        description: 'Botanical jewelry featuring real fern leaves preserved in crystal clear eco-resin with sterling silver hooks.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
        category: 'Jewelry',
        sellerId: 'admin',
        stock: 25,
        reviews: [REVIEWS[0], REVIEWS[2]],
        isActive: true
    }
];

export const MOCK_SALES: Sale[] = [
    { id: 's1', productId: '1', productName: 'Merino Wool Scarf', amount: 85.00, date: '2023-10-01', buyerName: 'Alice Green' },
    { id: 's2', productId: '2', productName: 'Ceramic Mug Set', amount: 45.00, date: '2023-10-02', buyerName: 'Tom Baker' },
    { id: 's3', productId: '1', productName: 'Merino Wool Scarf', amount: 85.00, date: '2023-10-03', buyerName: 'Sarah Jenkins' },
    { id: 's4', productId: '4', productName: 'Resin Earrings', amount: 32.00, date: '2023-10-05', buyerName: 'Emily White' },
];

export const SALES_STATS: SalesStat[] = [
    { name: 'Jan', sales: 12, revenue: 600 },
    { name: 'Feb', sales: 19, revenue: 1100 },
    { name: 'Mar', sales: 15, revenue: 850 },
    { name: 'Apr', sales: 25, revenue: 1800 },
    { name: 'May', sales: 32, revenue: 2400 },
    { name: 'Jun', sales: 28, revenue: 1950 },
];

export const MOCK_SELLER_PROFILE: SellerProfile = MOCK_SELLERS[0]; // Default admin profile

// Simplified logic for mock orders compatible with new structure
export const MOCK_ORDERS: Order[] = [
    {
        id: 'ord-001',
        buyerUsername: 'buyer',
        customerName: 'Alice Green',
        date: '2023-10-12',
        status: 'Delivered',
        subtotal: 85.00,
        tax: 6.80,
        shippingCost: 0,
        total: 91.80,
        items: [
            { productId: '1', productName: 'Merino Wool Scarf', quantity: 1, price: 85.00, productImage: MOCK_PRODUCTS[0].image }
        ],
        shippingAddress: { fullName: 'Alice Green', addressLine: '123 Maple St', city: 'Portland', zipCode: '97201', country: 'USA' }
    },
    {
        id: 'ord-002',
        buyerUsername: 'otherUser',
        customerName: 'Tom Baker',
        date: '2023-10-14',
        status: 'Shipped',
        subtotal: 45.00,
        tax: 3.60,
        shippingCost: 0,
        total: 48.60,
        items: [
            { productId: '2', productName: 'Ceramic Speckled Mug Set', quantity: 1, price: 45.00, productImage: MOCK_PRODUCTS[1].image }
        ],
        shippingAddress: { fullName: 'Tom Baker', addressLine: '456 Oak Ave', city: 'Seattle', zipCode: '98101', country: 'USA' }
    },
    {
        id: 'ord-003',
        buyerUsername: 'buyer',
        customerName: 'Sophie Turner',
        date: '2023-10-25',
        status: 'Pending',
        subtotal: 117.00,
        tax: 9.36,
        shippingCost: 25.00,
        total: 151.36,
        items: [
            { productId: '1', productName: 'Merino Wool Scarf', quantity: 1, price: 85.00, productImage: MOCK_PRODUCTS[0].image },
            { productId: '4', productName: 'Resin Earrings', quantity: 1, price: 32.00, productImage: MOCK_PRODUCTS[3].image }
        ],
        shippingAddress: { fullName: 'Sophie Turner', addressLine: '789 High St', city: 'London', zipCode: 'SW1A 1AA', country: 'UK' }
    }
];

export const MOCK_USERS: User[] = [
    { username: 'admin', email: 'admin@market.com', password: 'admin', role: 'admin', id: '1' },
    { username: 'buyer', email: 'buyer@market.com', password: 'buyer', role: 'user', id: '2' }
];
