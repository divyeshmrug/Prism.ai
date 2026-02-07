"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [userEnteredCode, setUserEnteredCode] = useState('');

    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            setSignupSuccess(true);
        }
    }, [searchParams]);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSignupSuccess(false);

        if (!isLogin && isVerifying) {
            if (userEnteredCode === verificationCode) {
                // Signup Logic - Complete
                const username = name.toLowerCase().replace(/\s+/g, '_') + Math.floor(Math.random() * 1000);
                const newUser = { name, email, password, username };
                const existingUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');
                existingUsers.push(newUser);
                localStorage.setItem('prism_registered_users', JSON.stringify(existingUsers));
                setIsLogin(true);
                setSignupSuccess(true);
                setIsVerifying(false);
                setVerificationCode('');
                setUserEnteredCode('');
                setName('');
                setEmail('');
                setPassword('');
            } else {
                setError('Invalid verification code.');
            }
            return;
        }

        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all required fields.');
            return;
        }

        // Email validation (only if it looks like an email)
        if (email.includes('@')) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address.');
                return;
            }
        }

        if (isLogin) {
            // Login Logic
            const isDemo = email === 'demo@example.com' && password === 'password123';
            // Check for registered users in localStorage
            const registeredUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');
            const registeredUser = registeredUsers.find((u: any) => (u.email === email || u.username === email) && u.password === password);

            if (isDemo || registeredUser) {
                localStorage.setItem('prism_auth', 'true');
                // Store name for the profile page if it's a registered user
                if (registeredUser) {
                    localStorage.setItem('prism_user_name', registeredUser.name);
                    localStorage.setItem('prism_user_email', registeredUser.email);
                    localStorage.setItem('prism_username', registeredUser.username);
                } else {
                    localStorage.setItem('prism_user_name', 'Demo User');
                    localStorage.setItem('prism_user_email', 'demo@example.com');
                    localStorage.setItem('prism_username', 'demo_user');
                }
                router.push('/');
            } else {
                setError('Invalid email/username or password.');
            }
        } else {
            // Check if user exists
            const existingUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');
            if (existingUsers.some((u: any) => u.email === email)) {
                setError('An account with this email already exists.');
                return;
            }

            // Start verification
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setVerificationCode(code);
            setIsVerifying(true);
            setTimeout(() => {
                alert(`Your verification code is: ${code}`);
            }, 500);
        }
    };

    return (
        <div className={`aurora-bg ${styles.container}`}>
            <div className={styles.card}>
                <button className={styles.closeButton} onClick={() => router.push('/')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className={styles.toggleContainer}>
                    <button
                        className={`${styles.toggleBtn} ${!isLogin ? styles.toggleBtnActive : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign up
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${isLogin ? styles.toggleBtnActive : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Sign in
                    </button>
                </div>

                <div className={styles.header}>
                    <h1 className={styles.title}>{isLogin ? 'Sign in' : 'Create an account'}</h1>
                </div>

                {signupSuccess && (
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
                        {isLogin ? 'Account created successfully! Please sign in.' : 'Account created!'}
                    </div>
                )}

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleAuth}>
                    {!isLogin && (
                        !isVerifying ? (
                            <>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <span className={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </span>
                                        <input
                                            type="text"
                                            className={`${styles.input} ${styles.inputWithIcon}`}
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <div className={styles.inputWrapper}>
                                        <span className={styles.inputIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        </span>
                                        <input
                                            type="password"
                                            className={`${styles.input} ${styles.inputWithIcon}`}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.inputGroup}>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Verification Code"
                                        value={userEnteredCode}
                                        onChange={(e) => setUserEnteredCode(e.target.value)}
                                        maxLength={6}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={styles.button}
                                    style={{ marginTop: '10px', background: 'transparent', border: 'none', color: 'var(--primary)', textDecoration: 'underline' }}
                                    onClick={() => alert(`Resent code: ${verificationCode}`)}
                                >
                                    Resend Code
                                </button>
                            </div>
                        )
                    )}

                    {isLogin && (
                        <>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </span>
                                    <input
                                        type="text"
                                        className={`${styles.input} ${styles.inputWithIcon}`}
                                        placeholder="Email or Username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    </span>
                                    <input
                                        type="password"
                                        className={`${styles.input} ${styles.inputWithIcon}`}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className={styles.button}>
                        {isLogin ? 'Sign in' : (isVerifying ? 'Verify & Sign up' : 'Create an account')}
                    </button>

                    {!isLogin && isVerifying && (
                        <button
                            type="button"
                            className={styles.button}
                            style={{ marginTop: '10px', background: 'transparent', border: '1px solid var(--border-color)' }}
                            onClick={() => setIsVerifying(false)}
                        >
                            Back
                        </button>
                    )}
                </form>

                <div className={styles.divider}>OR SIGN IN WITH</div>

                <div className={styles.socialGrid}>
                    <button className={styles.socialBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </button>
                    <button className={styles.socialBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.96.95-2.44 1.78-3.99 1.72-1.58-.05-2.99-.99-3.96-1.01-.99-.02-2.5.89-3.95.82C3.12 21.73 1 19.16 1 15.65c0-3.37 2.15-5.14 4.1-5.14s3.15 1.13 4 1.13c.83 0 2.22-1.28 4.19-1.07 1.25.13 2.18.77 2.63 1.4-.2.13-1.87 1.24-1.85 3.35.03 2.5 2.15 3.37 2.2 3.39-.02.05-.3 1.01-1.22 2.07M12.03 7.25c-.02-2.12 1.72-3.94 3.79-4.04.14 2.41-2.06 4.39-3.79 4.04z" />
                        </svg>
                    </button>
                </div>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        By creating an account, you agree to our <Link href="#" className={styles.link}>Terms & Service</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={
            <div className={`aurora-bg ${styles.container}`}>
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
