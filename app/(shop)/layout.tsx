import React from 'react';
import { AuthProvider } from '../../lib/auth';
import { ToastProvider } from '../../components/ui/Toast';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow pt-20">
                        {children}
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </ToastProvider>
    );
}
