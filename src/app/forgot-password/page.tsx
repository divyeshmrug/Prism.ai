"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css';

export default function ForgotPassword() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate reset logic
        alert("Reset link sent to your email");
        router.push('/login');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Reset password</h1>
                    <p className={styles.subtitle}>Enter your email to receive instructions</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email address</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            placeholder="you@example.com"
                        />
                    </div>

                    <button type="submit" className={styles.button}>
                        Send Reset Link
                    </button>
                </form>

                <div className={styles.footer}>
                    <Link href="/login" className={styles.link}>
                        ← Back to Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
