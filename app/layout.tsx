import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../lib/auth';
import { CartProvider } from '../lib/cart';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Handcrafted Haven',
  description: 'A marketplace for artisans',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
