"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css'; // Reusing login styles

export default function Signup() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validate full name
        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        // Validate email
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        // Email validation - strict regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Validate password
        if (!password.trim()) {
            setError('Please enter a password.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        // Check for existing users in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');

        // Prevent duplicate emails
        if (existingUsers.some((u: any) => u.email === email)) {
            setError('An account with this email already exists.');
            return;
        }

        // Store the new user with name, email, and password
        const newUser = {
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        existingUsers.push(newUser);
        localStorage.setItem('prism_registered_users', JSON.stringify(existingUsers));

        // Show success message
        setSuccess(true);

        // Redirect to login after a short delay
        setTimeout(() => {
            router.push('/login?signup=success');
        }, 1500);
    };

    return (
        <div className={`aurora-bg ${styles.container}`}>
            <div className={styles.card}>
                <button className={styles.closeButton} onClick={() => router.push('/')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className={styles.header}>
                    <h1 className={styles.title}>Create your account</h1>
                    <p className={styles.subtitle}>Join Prism AI today</p>
                </div>

                {success && (
                    <div style={{
                        background: 'rgba(204, 255, 0, 0.1)',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}>
                        Account created successfully! Redirecting to login...
                    </div>
                )}

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleSignup}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </span>
                            <input
                                type="text"
                                id="name"
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </span>
                            <input
                                type="email"
                                id="email"
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </span>
                            <input
                                type="password"
                                id="password"
                                className={`${styles.input} ${styles.inputWithIcon}`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.button}>
                        Create Account
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Already have an account?{' '}
                        <Link href="/login" className={styles.linkHighlight}>
                            Sign in
                        </Link>
                    </p>
                    <p className={styles.footerText} style={{ marginTop: '0.5rem' }}>
                        By creating an account, you agree to our <Link href="#" className={styles.link}>Terms & Service</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
