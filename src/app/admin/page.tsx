"use client";

import { mockStats, mockUsers } from '@/lib/mockData';
import { Users, Activity, Server } from 'lucide-react';

export default function AdminDashboard() {
    const recentUsers = mockUsers.slice(0, 5);

    return (
        <div className="flex-1 flex flex-col p-10 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-14">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Dashboard</h1>
                <p className="text-gray-500 text-xl font-medium">Manage your application</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Total Users */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Total Users</h3>
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <p className="text-5xl font-black text-white">{mockStats.totalUsers}</p>
                </div>

                {/* Active Sessions */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">Active Sessions</h3>
                        <div className="bg-blue-500/10 p-3 rounded-2xl">
                            <Activity className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-5xl font-black text-white">{mockStats.activeSessions}</p>
                </div>

                {/* System Status */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide">System Status</h3>
                        <div className="bg-green-500/10 p-3 rounded-2xl">
                            <Server className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-5xl font-black text-green-500">{mockStats.systemStatus}</p>
                </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-10 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">Recent Registrations</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Name</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Email</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                                    <td className="py-4 px-4 text-gray-400">{user.email}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'active'
                                                ? 'bg-green-500/10 text-green-500'
                                                : 'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
