
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, BuyerProfile, SellerProfile } from '../server/types';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string, role: 'user' | 'seller', additionalData?: { location?: string }) => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch('http://localhost:5000/api/users/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Auth check failed', error);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const res = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Login failed');
        }

        setUser(data.user);
        if (rememberMe) {
            localStorage.setItem('token', data.token);
        } else {
            // For session only, we could use sessionStorage, but for simplicity we'll use localStorage 
            // or just keep it in memory. User asked for "Remember Me" to persist. 
            // If not remember me, maybe we don't store in local storage? 
            // But then refresh loses session. 
            // Usually "Remember Me" means "keep me logged in for a long time" vs "session cookie".
            // Here we'll just store it if rememberMe is true. If false, we might store in sessionStorage.
            sessionStorage.setItem('token', data.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    };

    const register = async (username: string, email: string, password: string, role: 'user' | 'seller', additionalData?: { location?: string }) => {
        const id = Date.now().toString(); // Simple ID generation
        const payload = { id, username, email, password, role, ...additionalData };
        console.log('Sending register payload:', payload);

        const res = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            const errorData = { message: data.message || 'Registration failed', ...data };
            throw errorData;
        }

        setUser(data.user);
        localStorage.setItem('token', data.token);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
