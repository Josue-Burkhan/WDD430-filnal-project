
export interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    sellerId: string;
    stock: number;
    reviews: Review[];
    isActive: boolean;
}

export interface Sale {
    id: string;
    productId: string;
    productName: string;
    amount: number;
    date: string;
    buyerName: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string; // Added for mock auth
    role: 'admin' | 'seller' | 'user';
}

export interface SalesStat {
    name: string;
    sales: number;
    revenue: number;
}

export interface SellerProfile {
    user_id: string;
    username: string;
    bio: string;
    avatar: string;
    bannerImage: string;
    location: string;
    email: string;
    rating: number;
    totalSalesCount: number;
    joinDate: string;
    tags: string[];
}

export interface BuyerProfile {
    username: string;
    email: string;
    avatar: string;
    bio: string;
    joinDate: string;
    shippingAddress?: Address;
}

export interface Address {
    fullName: string;
    addressLine: string;
    city: string;
    zipCode: string;
    country: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    buyerUsername: string; // Added to link order to account
    customerName: string;
    date: string; // ISO format YYYY-MM-DD
    status: 'Pending' | 'Shipped' | 'Delivered';
    items: OrderItem[];
    shippingAddress: Address;
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

// AI Feature Types
export interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: number;
    isError?: boolean;
}

export enum AppView {
    CHAT = 'CHAT',
    VISION = 'VISION',
    WRITER = 'WRITER'
}

export type ViewState = 'HOME' | 'DASHBOARD';

export interface VisionState {
    image: File | null;
    imagePreview: string | null;
    prompt: string;
    result: string | null;
    isLoading: boolean;
}

export interface WriterState {
    topic: string;
    tone: string;
    output: string;
    isLoading: boolean;
}
