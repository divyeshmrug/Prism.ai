"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onNewChat?: () => void;
    onLoadChat?: (id: string) => void;
    history?: { id: string; title: string }[];
}

const Sidebar = ({ onNewChat, onLoadChat, history = [] }: SidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [showAllHistory, setShowAllHistory] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Demo User',
        username: 'demo_user',
        avatar: ''
    });

    useEffect(() => {
        const name = localStorage.getItem('prism_user_name') || 'Demo User';
        const username = localStorage.getItem('prism_username') || 'demo_user';
        const avatar = localStorage.getItem('prism_user_avatar') || '';
        setUserData({ name, username, avatar });
    }, []);

    const displayedHistory = showAllHistory ? history : history.slice(0, 5);

    const handleNewChat = () => {
        if (onNewChat) {
            onNewChat();
        } else {
            router.push('/');
        }
    };



    const navItems = [
        { name: 'Settings', path: '/settings' },
    ];

    return (
        <aside className={styles.sidebar}>


            <nav className={styles.nav}>
                <button onClick={handleNewChat} className={styles.newChatBtn}>
                    <span>+</span> New chat
                </button>

                <div className={styles.historySection}>
                    <div className={styles.historyLabel}>Recent</div>
                    {history.length === 0 ? (
                        <div className={styles.historyItem} style={{ pointerEvents: 'none', fontStyle: 'italic', opacity: 0.5 }}>No recent chats</div>
                    ) : (
                        <>
                            {displayedHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.historyItem}
                                    onClick={() => onLoadChat && onLoadChat(item.id)}
                                >
                                    {item.title}
                                </div>
                            ))}
                            {history.length > 5 && (
                                <button
                                    onClick={() => setShowAllHistory(!showAllHistory)}
                                    className={styles.viewMoreBtn}
                                >
                                    {showAllHistory ? 'Show less' : 'View more'}
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div className={styles.navBottom}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className={styles.user}>
                <div
                    className={styles.avatar}
                    style={userData.avatar && userData.avatar.length > 10 ? { backgroundImage: `url(${userData.avatar})`, backgroundSize: 'cover', color: 'transparent' } : {}}
                >
                    {(!userData.avatar || userData.avatar.length < 10) && userData.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{userData.name}</span>
                    <span className={styles.userRole}>@{userData.username}</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
