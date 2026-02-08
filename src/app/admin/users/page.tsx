"use client";

import { useState } from 'react';
import { mockUsers, User } from '@/lib/mockData';
import { Search, Edit, Trash2, X } from 'lucide-react';

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (user: User) => {
        setEditingUser(user);
    };

    const handleSave = () => {
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
            setEditingUser(null);
        }
    };

    const handleDelete = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    return (
        <div className="flex-1 flex flex-col p-10 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-14">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">User Management</h1>
                <p className="text-gray-500 text-xl font-medium">Manage your application users</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white placeholder-gray-600 focus:border-primary/50 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-10 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Name</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Email</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Role</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Last Active</th>
                                <th className="text-right py-4 px-4 text-sm font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                                    <td className="py-4 px-4 text-gray-400">{user.email}</td>
                                    <td className="py-4 px-4 text-gray-300 capitalize">{user.role}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.status === 'active'
                                                ? 'bg-green-500/10 text-green-500'
                                                : 'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-400 text-sm">Just now</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-primary"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-10 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Edit User: {editingUser.name}</h2>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Role Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'user' | 'admin' })}
                                    className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-primary/50 transition-all outline-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Status Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Status</label>
                                <select
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'inactive' })}
                                    className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-primary/50 transition-all outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 py-4 bg-[#333] hover:bg-[#444] text-white font-bold rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-2xl transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
