"use client";

import { useState, useEffect } from 'react';
import { mockSettings, AdminSettings } from '@/lib/mockData';
import { Save, LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function AdminSettingsPage() {
    const { showToast } = useToast();
    const [settings, setSettings] = useState<AdminSettings>(mockSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('adminSettings');
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                showToast('Failed to load saved settings', 'error');
            }
        }
    }, [showToast]);

    const handleSave = async () => {
        setIsSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            localStorage.setItem('adminSettings', JSON.stringify(settings));
            setIsSaving(false);
            showToast('Settings saved successfully', 'success');
        } catch (e) {
            setIsSaving(false);
            showToast('Failed to save settings', 'error');
        }
    };

    const handleLogout = async () => {
        if (!confirm('Are you sure you want to logout?')) return;

        setIsLoggingOut(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        showToast('Logged out successfully', 'info');

        // In a real app, this would clear session and redirect
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    };

    return (
        <div className="flex-1 flex flex-col p-10 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="mb-14">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Admin Settings</h1>
                <p className="text-gray-500 text-xl font-medium">Configure your admin preferences</p>
            </div>

            {/* Settings Form */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-10 shadow-2xl space-y-8">
                {/* Theme Selector */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Theme</label>
                    <select
                        value={settings.theme}
                        onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'dark' | 'light' })}
                        disabled={isSaving}
                        className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-primary/50 transition-all outline-none disabled:opacity-50"
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>

                {/* Admin Email */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Admin Email</label>
                    <input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                        disabled={isSaving}
                        placeholder="admin@example.com"
                        className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-gray-600 focus:border-primary/50 transition-all outline-none disabled:opacity-50"
                    />
                </div>

                {/* Global Announcement */}
                <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Global Announcement</label>
                    <textarea
                        value={settings.globalAnnouncement}
                        onChange={(e) => setSettings({ ...settings, globalAnnouncement: e.target.value })}
                        disabled={isSaving}
                        placeholder="Enter message for all users..."
                        rows={4}
                        className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-gray-600 focus:border-primary/50 transition-all outline-none resize-none disabled:opacity-50"
                    />
                </div>

                {/* Maintenance Mode */}
                <div className="flex items-center justify-between p-6 bg-[#111] rounded-2xl border border-white/10">
                    <div>
                        <h3 className="text-white font-bold mb-1">Maintenance Mode</h3>
                        <p className="text-gray-500 text-sm">Enable maintenance mode for all users</p>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                        disabled={isSaving}
                        className={`relative w-16 h-8 rounded-full transition-all disabled:opacity-50 ${settings.maintenanceMode ? 'bg-primary' : 'bg-gray-700'
                            }`}
                    >
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-black rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-8' : 'translate-x-0'
                            }`} />
                    </button>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-5 bg-primary hover:bg-primary/90 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 bg-[#0a0a0a] border border-red-500/20 rounded-[32px] p-10 shadow-2xl">
                <h2 className="text-red-500 text-xl font-bold mb-6 uppercase tracking-wide">Danger Zone</h2>
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full py-5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isLoggingOut ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Logging out...
                        </>
                    ) : (
                        <>
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
