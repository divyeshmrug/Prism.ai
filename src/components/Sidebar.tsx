"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onNewChat?: () => void;
    onLoadChat?: (index: number) => void;
    history?: { title: string }[];
}

const Sidebar = ({ onNewChat, onLoadChat, history = [] }: SidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();

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
                <div className={styles.logoIcon} />
                <span className={styles.logoText}>Prism AI</span>
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
                        history.map((item, i) => (
                            <div
                                key={i}
                                className={styles.historyItem}
                                onClick={() => onLoadChat && onLoadChat(i)}
                            >
                                {item.title}
                            </div>
                        ))
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
