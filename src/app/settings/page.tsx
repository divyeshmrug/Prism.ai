"use client";

import { useState, useEffect } from 'react';
import { Save, Key, User, Shield, Trash2, Camera, Loader2, Brain } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/components/ToastProvider';

export default function SettingsPage() {
    const { user, updateProfile, deleteAccount } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'api' | 'intelligence'>('profile');

    // Profile State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // API Key State
    const [apiKey, setApiKey] = useState('');

    // Intelligence State
    const [systemPromptMode, setSystemPromptMode] = useState('default');
    const [customPrompt, setCustomPrompt] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        const storedKey = localStorage.getItem('prism_gemini_api_key');
        if (storedKey) setApiKey(storedKey);

        const storedMode = localStorage.getItem('prism_system_prompt_mode') || 'default';
        const storedPrompt = localStorage.getItem('prism_custom_system_prompt') || '';
        setSystemPromptMode(storedMode);
        setCustomPrompt(storedPrompt);
    }, []);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateProfile({ name, email });
            showToast('Profile updated successfully', 'success');
        } catch (e) {
            console.error(e);
            showToast('Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveApiKey = () => {
        localStorage.setItem('prism_gemini_api_key', apiKey);
        showToast('API Key saved successfully', 'success');
    };

    const handleSaveIntelligence = () => {
        localStorage.setItem('prism_system_prompt_mode', systemPromptMode);
        localStorage.setItem('prism_custom_system_prompt', customPrompt);
        showToast('AI Persona updated', 'success');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        { id: 'intelligence', label: 'Intelligence', icon: <Brain className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
        { id: 'api', label: 'API Configuration', icon: <Key className="w-4 h-4" /> },
    ];

    const personas = {
        default: "You are Prizm AI, a helpful and versatile AI assistant.",
        coder: "You are an expert software engineer. Provide concise, high-quality code. Avoid conversational filler. Focus on performance and best practices.",
        storyteller: "You are a creative writer. Use vivid imagery, metaphors, and engaging narratives. Be descriptive and immersive.",
        custom: "Custom"
    };

    return (
        <div className="flex-1 p-10 max-w-4xl mx-auto w-full overflow-y-auto">
            <h1 className="text-4xl font-black text-white mb-2">Settings</h1>
            <p className="text-gray-500 mb-8">Manage your account preferences and configurations.</p>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8 border-b border-white/10 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'border-purple-500 text-white'
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-8 pb-20">
                {activeTab === 'profile' && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-500" />
                            Personal Information
                        </h2>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white uppercase shadow-2xl">
                                        {name.slice(0, 2)}
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Click to upload</p>
                            </div>

                            {/* Form */}
                            <div className="flex-1 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'intelligence' && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Brain className="w-5 h-5 text-blue-500" />
                                AI Persona
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['default', 'coder', 'storyteller', 'custom'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setSystemPromptMode(mode)}
                                        className={`p-4 rounded-xl border text-left transition-all ${systemPromptMode === mode
                                            ? 'bg-blue-500/10 border-blue-500/50 text-white'
                                            : 'bg-[#111] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                                            }`}
                                    >
                                        <div className="font-bold capitalize mb-1">{mode}</div>
                                        <div className="text-xs opacity-70">
                                            {mode === 'default' && 'Helpful & Versatile'}
                                            {mode === 'coder' && 'Strict & Technical'}
                                            {mode === 'storyteller' && 'Creative & Vivid'}
                                            {mode === 'custom' && 'User Defined'}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">System Instruction</label>
                                <textarea
                                    value={systemPromptMode === 'custom' ? customPrompt : personas[systemPromptMode as keyof typeof personas]}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    disabled={systemPromptMode !== 'custom'}
                                    rows={5}
                                    className={`w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all font-mono text-sm leading-relaxed ${systemPromptMode !== 'custom' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder="Define how the AI should behave..."
                                />
                                <p className="text-xs text-gray-500">
                                    {systemPromptMode !== 'custom' ? "Select 'Custom' to edit this prompt." : "This instruction will be prepended to every conversation."}
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleSaveIntelligence}
                                    className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Persona
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Key className="w-5 h-5 text-yellow-500" />
                            API Configuration
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">Google Gemini API Key</label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500/50 outline-none transition-all font-mono"
                                />
                                <p className="text-xs text-gray-500">Required for chat functionality. Stored locally in your browser.</p>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleSaveApiKey}
                                    className="px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save API Key
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-500" />
                                Password
                            </h2>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button className="px-6 py-2.5 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
                            <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Danger Zone
                            </h2>
                            <p className="text-gray-400 mb-6 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                            <button
                                onClick={deleteAccount}
                                className="px-6 py-2.5 bg-red-500/10 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
