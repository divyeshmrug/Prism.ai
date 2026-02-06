"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            setSignupSuccess(true);
        }
    }, [searchParams]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSignupSuccess(false);

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        // Check for harcoded demo account
        const isDemo = email === 'demo@example.com' && password === 'password123';

        // Check for registered users in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');
        const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password);

        if (isDemo || registeredUser) {
            localStorage.setItem('prism_auth', 'true');
            // Store name for the profile page if it's a registered user
            if (registeredUser) {
                localStorage.setItem('prism_user_name', registeredUser.name);
                localStorage.setItem('prism_user_email', registeredUser.email);
            } else {
                localStorage.setItem('prism_user_name', 'Demo User');
                localStorage.setItem('prism_user_email', 'demo@example.com');
            }
            router.push('/');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to your Prism AI account</p>
                </div>

                {signupSuccess && (
                    <div style={{
                        background: 'rgba(16, 163, 127, 0.1)',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        Account created successfully! Please sign in.
                    </div>
                )}

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email address</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.actions}>
                        <Link href="/forgot-password" className={styles.link}>
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className={styles.button}>
                        Sign in
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Don't have an account?{' '}
                        <Link href="/signup" className={styles.linkHighlight}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Loading...</h1>
                    </div>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
