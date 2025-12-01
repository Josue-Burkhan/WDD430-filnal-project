
import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../lib/auth';
import { CartProvider } from '../lib/cart';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'GenialMarket - Handcrafted Treasures',
    description: 'A marketplace for artisans',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50`}>
                <AuthProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
