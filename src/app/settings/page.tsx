"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import styles from './page.module.css';

export default function Settings() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Added for save simulation
    const [theme, setTheme] = useState('dark');
    const [profile, setProfile] = useState({
        name: typeof window !== 'undefined' ? localStorage.getItem('prism_user_name') || 'Demo User' : 'Demo User',
        email: typeof window !== 'undefined' ? localStorage.getItem('prism_user_email') || 'demo@example.com' : 'demo@example.com',
        username: typeof window !== 'undefined' ? localStorage.getItem('prism_username') || 'demo_user' : 'demo_user',
        avatar: typeof window !== 'undefined' ? localStorage.getItem('prism_user_avatar') || '' : ''
    });
    const [tempProfile, setTempProfile] = useState({ ...profile });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Refresh profile from localStorage in case it changed
        const currentProfile = {
            name: localStorage.getItem('prism_user_name') || 'Demo User',
            email: localStorage.getItem('prism_user_email') || 'demo@example.com',
            username: localStorage.getItem('prism_username') || 'demo_user',
            avatar: localStorage.getItem('prism_user_avatar') || ''
        };
        setProfile(currentProfile);
    }, []);

    const generateSuggestions = (fullName: string) => {
        if (!fullName.trim()) {
            setSuggestions([]);
            return;
        }

        const parts = fullName.trim().split(' ');
        const firstName = parts[0].toLowerCase();
        const lastName = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
        const last2 = lastName.length >= 2 ? lastName.slice(-2) : String(Math.floor(10 + Math.random() * 90));

        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yy = String(now.getFullYear()).slice(-2);
        const dateStr = `${dd}${mm}${yy}`;

        const s1 = `${firstName}:${last2}:${dateStr}`;
        const s2 = `${firstName}${Math.floor(100 + Math.random() * 900)}`;
        const s3 = `${firstName}_${yy}`;

        setSuggestions([s1, s2, s3]);
    };

    useEffect(() => {
        if (isEditing) {
            const timer = setTimeout(() => {
                generateSuggestions(tempProfile.name);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [tempProfile.name, isEditing]);

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
        setError('');
        setIsEditing(true);
    };

    const handleSave = () => {
        setError('');

        // 1. Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(tempProfile.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // 2. Uniqueness check if username changed
        if (tempProfile.username !== profile.username) {
            const registeredUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');
            const isTaken = registeredUsers.some((u: any) => u.username === tempProfile.username && u.email !== profile.email);

            if (isTaken) {
                setError('This username is already taken. Please pick another one.');
                return;
            }
        }

        // 2. Refresh local session data
        localStorage.setItem('prism_user_name', tempProfile.name);
        localStorage.setItem('prism_user_email', tempProfile.email);
        localStorage.setItem('prism_username', tempProfile.username);
        localStorage.setItem('prism_user_avatar', tempProfile.avatar);

        // 3. Update the global user registry
        const registeredUsers = JSON.parse(localStorage.getItem('prism_registered_users') || '[]');
        const userIndex = registeredUsers.findIndex((u: any) => (u.email === profile.email || u.username === profile.username));

        if (userIndex !== -1) {
            registeredUsers[userIndex] = {
                ...registeredUsers[userIndex],
                name: tempProfile.name,
                email: tempProfile.email,
                username: tempProfile.username,
                avatar: tempProfile.avatar
            };
            localStorage.setItem('prism_registered_users', JSON.stringify(registeredUsers));
        }

        setProfile({ ...tempProfile });
        setIsEditing(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
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
                            <div className={styles.avatarWrapper}>
                                <div
                                    className={styles.avatar}
                                    style={isEditing && tempProfile.avatar ? { backgroundImage: `url(${tempProfile.avatar})`, backgroundSize: 'cover' } : (!isEditing && profile.avatar ? { backgroundImage: `url(${profile.avatar})`, backgroundSize: 'cover' } : {})}
                                >
                                    {isEditing ? (!tempProfile.avatar && tempProfile.name.charAt(0).toUpperCase()) : (!profile.avatar && profile.name.charAt(0).toUpperCase())}
                                </div>
                                {isEditing && (
                                    <label className={styles.avatarUpload}>
                                        <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                                        <span>Update</span>
                                    </label>
                                )}
                            </div>

                            {isEditing ? (
                                <div className={styles.editForm}>
                                    {error && <div className={styles.error}>{error}</div>}
                                    <div className={styles.inputGroup}>
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            className={styles.editInput}
                                            value={tempProfile.name}
                                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Unique Username</label>
                                        <input
                                            type="text"
                                            className={styles.editInput}
                                            value={tempProfile.username}
                                            onChange={(e) => setTempProfile({ ...tempProfile, username: e.target.value })}
                                            placeholder="Enter unique username"
                                        />
                                        {suggestions.length > 0 && (
                                            <div className={styles.suggestions}>
                                                <span className={styles.suggestionLabel}>Suggestions:</span>
                                                <div className={styles.suggestionList}>
                                                    {suggestions.map((s, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            className={styles.suggestionBadge}
                                                            onClick={() => setTempProfile(prev => ({ ...prev, username: s }))}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            className={styles.editInput}
                                            value={tempProfile.email}
                                            onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formActions}>
                                        <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
                                        <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.profileInfo}>
                                        <p className={styles.profileName}>{profile.name}</p>
                                        <p className={styles.profileUsername}>@{profile.username}</p>
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
                                <option value="dark">Dark</option>
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
