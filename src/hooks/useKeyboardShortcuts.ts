"use client";

import { useEffect, useRef } from 'react';

/**
 * Interface defining options for a keyboard shortcut
 */
interface ShortcutConfig {
    /** The key to listen for (e.g., 'k', 'Enter', 'Escape') */
    key: string;
    /** Whether the Meta/Command key is required (Mac) or Control key (Windows) */
    metaOrCtrl?: boolean;
    /** Whether the Shift key is required */
    shift?: boolean;
    /** Whether the Alt/Option key is required */
    alt?: boolean;
    /** The callback function to execute when the shortcut is triggered */
    action: (e: KeyboardEvent) => void;
    /** Whether to prevent the default browser behavior */
    preventDefault?: boolean;
}

/**
 * Custom hook for handling keyboard shortcuts globally
 * @param shortcuts Array of shortcut configurations
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    // Use ref to ensure we always have the latest callback without re-attaching listeners
    const shortcutsRef = useRef(shortcuts);

    // Update ref when shortcuts change
    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if we are in an input field or textarea
            // Usually we want to ignore single-letter shortcuts when typing
            const target = event.target as HTMLElement;
            const isInput =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            shortcutsRef.current.forEach(({ key, metaOrCtrl, shift, alt, action, preventDefault = true }) => {
                // Check modifiers
                // metaKey is Command on Mac, Windows key on Windows
                // ctrlKey is Control on both
                // For cross-platform "Cmd/Ctrl + Key", we usually check (metaKey OR ctrlKey)
                const isMetaOrCtrlPressed = event.metaKey || event.ctrlKey;

                const modifiersMatch =
                    (!!metaOrCtrl === isMetaOrCtrlPressed) &&
                    (!!shift === event.shiftKey) &&
                    (!!alt === event.altKey);

                if (
                    event.key.toLowerCase() === key.toLowerCase() &&
                    modifiersMatch
                ) {
                    // If interaction is inside an input, only allow modifier-based shortcuts (like Cmd+K, Cmd+B)
                    // Block single key shortcuts (like '/')
                    if (isInput && !metaOrCtrl && !alt) {
                        return;
                    }

                    if (preventDefault) {
                        event.preventDefault();
                    }

                    action(event);
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
