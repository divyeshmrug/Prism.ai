import React, { useState } from 'react';
import { MessageSquare, Database, Brain, Wrench, Shield, PanelLeftClose, PanelLeft, Plus, MessageCircle, Trash2, Edit2, X, Check, Download, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export type ViewType = 'chat' | 'knowledge' | 'memory' | 'tools' | 'admin';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    // Chat History Props
    chatHistory?: { id: string; title: string; timestamp: number }[];
    activeChatId?: string | null;
    onNewChat?: () => void;
    onSelectChat?: (id: string) => void;
    onDeleteChat?: (id: string) => void;
    onRenameChat?: (id: string, newTitle: string) => void;
    onExportChat?: () => void;
}

import { useAuth } from './AuthContext';
import { LogOut } from 'lucide-react';

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    toggleSidebar,
    activeView,
    onViewChange,
    chatHistory = [],
    activeChatId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onRenameChat,
    onExportChat
}) => {
    const { user, logout } = useAuth();
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const navItems = [
        { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
        { id: 'knowledge', label: 'Knowledge', icon: <Database className="w-5 h-5" /> },
        { id: 'memory', label: 'Memory', icon: <Brain className="w-5 h-5" /> },
        { id: 'tools', label: 'Tools', icon: <Wrench className="w-5 h-5" /> },
        { id: 'admin', label: 'Admin', icon: <Shield className="w-5 h-5" /> },
    ] as const;

    const startEditing = (id: string, currentTitle: string) => {
        setEditingChatId(id);
        setEditTitle(currentTitle);
    };

    const saveEdit = (id: string) => {
        if (onRenameChat && editTitle.trim()) {
            onRenameChat(id, editTitle.trim());
        }
        setEditingChatId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') saveEdit(id);
        if (e.key === 'Escape') setEditingChatId(null);
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed left-4 top-4 z-50 p-2 bg-[#0d0d0d] rounded-lg border border-white/5 text-gray-400 hover:text-white transition-all shadow-xl"
                >
                    <PanelLeft className="w-5 h-5" />
                </button>
            )}

            <aside className={`fixed top-0 left-0 h-full bg-[#1B1B1B] border-r border-[#333333] transition-all duration-300 z-40 ${isOpen ? 'w-[280px]' : 'w-0 overflow-hidden'
                }`}>
                <div className="flex flex-col h-full w-[280px]">
                    {/* Brand Header */}
                    <div className="p-6 pb-6 border-b border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-white">
                                <span className="">Prizm AI</span>
                            </h1>
                            <button onClick={toggleSidebar} className="text-gray-600 hover:text-white transition-colors">
                                <PanelLeftClose className="w-5 h-5" />
                            </button>
                        </div>

                        {/* New Chat Button */}
                        <button
                            onClick={() => {
                                onViewChange('chat');
                                onNewChat?.();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-xl transition-all font-bold text-sm shadow-lg group mb-2"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span>New Chat</span>
                        </button>

                        {activeChatId && activeView === 'chat' && (
                            <button
                                onClick={onExportChat}
                                className="w-full flex items-center gap-3 px-4 py-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all font-medium text-xs group"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export Chat</span>
                            </button>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="px-4 py-6 space-y-1 border-b border-white/5">
                        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Modules</p>
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id as ViewType)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${activeView === item.id
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className={`${activeView === item.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Chat History List */}
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">History</p>
                        <div className="space-y-1">
                            {chatHistory.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-600 text-sm italic">
                                    No history yet
                                </div>
                            ) : (
                                chatHistory.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer ${activeChatId === chat.id
                                            ? 'bg-white/5 text-white'
                                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                            }`}
                                        onClick={() => {
                                            if (editingChatId !== chat.id) {
                                                onSelectChat?.(chat.id);
                                                onViewChange('chat');
                                            }
                                        }}
                                    >
                                        <MessageCircle className="w-4 h-4 flex-shrink-0" />

                                        {editingChatId === chat.id ? (
                                            <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, chat.id)}
                                                    autoFocus
                                                    className="w-full bg-black/50 border border-white/20 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:border-primary"
                                                />
                                                <button onClick={() => saveEdit(chat.id)} className="text-green-500 hover:text-green-400"><Check className="w-3 h-3" /></button>
                                                <button onClick={() => setEditingChatId(null)} className="text-red-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-medium truncate flex-1">{chat.title}</span>
                                        )}

                                        {!editingChatId && (
                                            <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-[#050505] pl-2 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEditing(chat.id, chat.title);
                                                    }}
                                                    className="p-1 hover:text-white"
                                                    title="Rename"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteChat?.(chat.id);
                                                    }}
                                                    className="p-1 hover:text-red-500"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5">
                        {user ? (
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white uppercase border border-white/10">
                                        {user.name.slice(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white font-bold truncate max-w-[120px]">{user.name}</span>
                                        <span className="text-[11px] text-gray-500 truncate max-w-[120px]">{user.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
                                <span>Sign In</span>
                            </Link>
                        )}

                        <button
                            onClick={() => {
                                const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                                document.documentElement.setAttribute('data-theme', newTheme);
                                localStorage.setItem('theme', newTheme);
                            }}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-all"
                        >
                            <Sun className="w-3 h-3 block dark:hidden" />
                            <Moon className="w-3 h-3 hidden dark:block" />
                            <span>Toggle Theme</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
