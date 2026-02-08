import React from 'react';
import { Plus, Search, HelpCircle, ArrowRight, Database } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col p-10 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="mb-14">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Knowledge Base</h1>
                <p className="text-gray-500 text-xl font-medium">Add information for RAG retrieval</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[500px]">
                {/* Add Knowledge Card */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-10 flex flex-col shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-bold text-white tracking-wide">Add Knowledge</h2>
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <Plus className="w-6 h-6 text-primary" />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        <textarea
                            placeholder="Enter information to store in the knowledge base..."
                            className="flex-1 bg-[#111] border border-white/10 rounded-2xl p-6 text-white text-lg placeholder-gray-700 resize-none focus:border-primary/50 transition-all outline-none"
                        />

                        <button className="w-full py-5 bg-[#333] hover:bg-[#444] text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                            <Plus className="w-5 h-5" />
                            Add to Knowledge Base
                        </button>
                    </div>
                </div>

                {/* Search Knowledge Card */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] p-10 flex flex-col shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-bold text-white tracking-wide">Search Knowledge</h2>
                        <div className="bg-white/5 p-3 rounded-2xl">
                            <Search className="w-6 h-6 text-gray-500" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[#111] border border-white/10 rounded-2xl py-6 pl-6 pr-16 text-white text-lg placeholder-gray-700 focus:border-primary/50 transition-all outline-none"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-[#444] hover:bg-white hover:text-black rounded-xl transition-all">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-10 opacity-50">
                            <Database className="w-16 h-16 text-gray-800 mb-6" />
                            <p className="text-gray-500 text-lg font-medium text-center">
                                No results yet. Try searching for <br /> something.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;
