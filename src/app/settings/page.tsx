"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import styles from './page.module.css';

export default function Settings() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [profile, setProfile] = useState({
        name: typeof window !== 'undefined' ? localStorage.getItem('prism_user_name') || 'Demo User' : 'Demo User',
        email: typeof window !== 'undefined' ? localStorage.getItem('prism_user_email') || 'demo@example.com' : 'demo@example.com'
    });
    const [tempProfile, setTempProfile] = useState({ ...profile });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Refresh profile from localStorage in case it changed
        setProfile({
            name: localStorage.getItem('prism_user_name') || 'Demo User',
            email: localStorage.getItem('prism_user_email') || 'demo@example.com'
        });
    }, []);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem('prism_auth');
        router.push('/login');
    };

    const handleEdit = () => {
        setTempProfile({ ...profile });
        setIsEditing(true);
    };

    const handleSave = () => {
        // Save to current session
        localStorage.setItem('prism_user_name', tempProfile.name);
        localStorage.setItem('prism_user_email', tempProfile.email);

        // Update user registry if they signed up
        const registeredUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');
        const userIndex = registeredUsers.findIndex((u: any) => u.email === profile.email);

        if (userIndex !== -1) {
            registeredUsers[userIndex] = {
                ...registeredUsers[userIndex],
                name: tempProfile.name,
                email: tempProfile.email
            };
            localStorage.setItem('prism_registered_users', JSON.stringify(registeredUsers));
        }

        setProfile({ ...tempProfile });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.subtitle}>Manage your account and preferences.</p>
                </header>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Profile</h2>
                    <div className={styles.card}>
                        <div className={styles.profileRow}>
                            <div className={styles.avatar}>
                                {profile.name.charAt(0).toUpperCase()}
                            </div>

                            {isEditing ? (
                                <div className={styles.editForm}>
                                    <input
                                        type="text"
                                        className={styles.editInput}
                                        value={tempProfile.name}
                                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        placeholder="Full Name"
                                    />
                                    <input
                                        type="email"
                                        className={styles.editInput}
                                        value={tempProfile.email}
                                        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                        placeholder="Email Address"
                                    />
                                    <div className={styles.formActions}>
                                        <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
                                        <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.profileInfo}>
                                        <p className={styles.profileName}>{profile.name}</p>
                                        <p className={styles.profileEmail}>{profile.email}</p>
                                    </div>
                                    <button className={styles.editButton} onClick={handleEdit}>Edit</button>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Application</h2>
                    <div className={styles.card}>
                        <div className={styles.settingRow}>
                            <span>Theme</span>
                            <select
                                className={styles.select}
                                value={theme}
                                onChange={(e) => handleThemeChange(e.target.value)}
                            >
                                <option value="dark">Dark (Default)</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Log out
                    </button>
                </section>
            </main>
        </div>
    );
}
