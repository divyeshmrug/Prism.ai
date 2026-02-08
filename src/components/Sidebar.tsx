import React from 'react';
import { MessageSquare, Database, Brain, Wrench, Shield, PanelLeftClose, PanelLeft } from 'lucide-react';
import Link from 'next/link';

export type ViewType = 'chat' | 'knowledge' | 'memory' | 'tools' | 'admin';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    toggleSidebar,
    activeView,
    onViewChange,
}) => {
    const navItems = [
        { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
        { id: 'knowledge', label: 'Knowledge', icon: <Database className="w-5 h-5" /> },
        { id: 'memory', label: 'Memory', icon: <Brain className="w-5 h-5" /> },
        { id: 'tools', label: 'Tools', icon: <Wrench className="w-5 h-5" /> },
        { id: 'admin', label: 'Admin', icon: <Shield className="w-5 h-5" /> },
    ] as const;

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

            <aside className={`fixed top-0 left-0 h-full bg-[#050505] border-r border-white/5 transition-all duration-300 z-40 ${isOpen ? 'w-[280px]' : 'w-0 overflow-hidden'
                }`}>
                <div className="flex flex-col h-full w-[280px]">
                    {/* Brand Header */}
                    <div className="p-8 pb-10 border-b border-white/5">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Prizm AI</span>
                            </h1>
                            <button onClick={toggleSidebar} className="text-gray-600 hover:text-white transition-colors">
                                <PanelLeftClose className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[13px] text-gray-500 font-medium ml-0.5">Intelligent Assistant</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-4 py-8 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id as ViewType)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group ${activeView === item.id
                                    ? 'bg-[#1a1a1a] text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                <div className={`${activeView === item.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm font-bold tracking-wide">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Footer Placeholder (Matching image style) */}
                    <div className="p-8 border-t border-white/5">
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
                            <div className="flex flex-col">
                                <span className="text-sm text-white font-bold group-hover:text-primary transition-colors">Admin Portal</span>
                                <span className="text-[11px] text-gray-500">v2.4.0 Stable</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
