import React from 'react';
import { AuthProvider } from '../../lib/auth';
import { ToastProvider } from '../../components/ui/Toast';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToastProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ToastProvider>
    );
}
