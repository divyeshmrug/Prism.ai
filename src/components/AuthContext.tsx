"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastProvider';

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
    deleteAccount: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<{ user: User | null; isLoading: boolean }>({
        user: null,
        isLoading: true
    });
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        // Check for saved session
        const storedUser = localStorage.getItem('prism_user_session');
        if (storedUser) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setState({ user: JSON.parse(storedUser), isLoading: false });
            } catch {
                localStorage.removeItem('prism_user_session');
                setState({ user: null, isLoading: false });
            }
        } else {
            setState({ user: null, isLoading: false });
        }
    }, []);

    const { user, isLoading } = state;

    const setUser = (user: User | null) => {
        setState(prev => ({ ...prev, user }));
    };

    const setIsLoading = (isLoading: boolean) => {
        setState(prev => ({ ...prev, isLoading }));
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simple mock validation
        // In a real app, this would verify valid credentials against a DB
        if (email === 'admin@prizm.ai' && password === 'admin123') {
            const adminUser: User = {
                id: 'admin-1',
                name: 'Prizm Admin',
                email: email,
                role: 'admin',
                avatar: 'https://github.com/shadcn.png' // Placeholder
            };
            setUser(adminUser);
            localStorage.setItem('prism_user_session', JSON.stringify(adminUser));
            showToast('Welcome back, Admin!', 'success');
            router.push('/admin');
        } else if (password.length >= 6) {
            // Valid regular user simulation
            const regularUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0], // Default name from email
                email: email,
                role: 'user'
            };
            setUser(regularUser);
            localStorage.setItem('prism_user_session', JSON.stringify(regularUser));
            showToast('Login successful!', 'success');
            router.push('/');
        } else {
            showToast('Invalid credentials', 'error');
            throw new Error('Invalid credentials');
        }
        setIsLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const register = async (name: string, email: string, _password: string) => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            role: 'user'
        };

        setUser(newUser);
        localStorage.setItem('prism_user_session', JSON.stringify(newUser));
        showToast('Account created successfully!', 'success');
        router.push('/');
        setIsLoading(false);
    };

    const updateProfile = async (data: Partial<User>) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API

        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('prism_user_session', JSON.stringify(updatedUser));
            showToast('Profile updated successfully!', 'success');
        }
        setIsLoading(false);
    };

    const deleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            logout();
            showToast('Account deleted.', 'info');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('prism_user_session');
        showToast('Logged out successfully', 'info');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            register,
            logout,
            updateProfile,
            deleteAccount,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
