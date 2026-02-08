"use client";

import { Shield, LayoutDashboard, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const adminNavItems = [
        { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { href: '/admin/users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
        { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="w-[280px] bg-[#050505] border-r border-white/5 flex flex-col">
                {/* Brand Header */}
                <div className="p-8 pb-10 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-black tracking-tight">
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Prizm AI</span>
                        </h1>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Shield className="w-4 h-4" />
                        <p className="text-[13px] font-medium">Admin Panel</p>
                    </div>
                </div>

                {/* Admin Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {adminNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-[#1a1a1a] text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                <div className={`${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm font-bold tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Main App */}
                <div className="p-8 border-t border-white/5">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 py-4 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-2xl transition-all"
                    >
                        Back to App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
