"use client";

import { useState } from 'react';
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

    const displayedHistory = showAllHistory ? history : history.slice(0, 5);

    const handleNewChat = () => {
        if (onNewChat) {
            onNewChat();
        } else {
            router.push('/');
        }
    };

    const handleLogoClick = () => {
        if (onNewChat) {
            onNewChat();
        } else {
            router.push('/');
        }
    }

    const navItems = [
        { name: 'Settings', path: '/settings' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <img src="/logo.png" alt="Prizm AI Logo" className={styles.logoIconImage} />
                <span className={styles.logoText}>Prizm AI</span>
            </div>

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

                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className={styles.user}>
                <div className={styles.avatar} />
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Demo User</span>
                    <span className={styles.userRole}>Admin</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
