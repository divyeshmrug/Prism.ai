"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    language: string;
    value: string;
}

export default function CodeBlock({ language, value }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-2xl overflow-hidden my-6 border border-white/10 shadow-2xl bg-[#0a0a0a]">
            {/* MacOS-style Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono ml-2 uppercase">{language || 'text'}</span>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            <div className="p-0">
                <SyntaxHighlighter
                    style={atomDark}
                    language={language || 'text'}
                    PreTag="div"
                    className="!m-0 !bg-[#050505] !p-4 !text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    customStyle={{
                        margin: 0,
                        background: 'transparent',
                        padding: '1.5rem',
                        lineHeight: '1.6',
                        fontSize: '0.9rem',
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
