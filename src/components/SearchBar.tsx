"use client";

import styles from './SearchBar.module.css';

const SearchBar = () => {
    return (
        <div className={styles.container}>
            <input
                type="text"
                placeholder="Ask Prism anything about your product..."
                className={styles.input}
            />
            <div className={styles.icon}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    );
};

export default SearchBar;
