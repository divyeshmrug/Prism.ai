import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check, RotateCcw, Volume2, User, Bot } from 'lucide-react';

interface ChatMessageProps {
    role: 'user' | 'prism';
    content: string;
    isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isStreaming }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTTS = () => {
        const utterance = new SpeechSynthesisUtterance(content);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className={`flex w-full py-10 transition-colors ${role === 'prism' ? 'bg-[#0a0a0a]/50 border-y border-white/5' : ''}`}>
            <div className="max-w-4xl mx-auto flex gap-8 px-6 w-full group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${role === 'user' ? 'bg-blue-600' : 'bg-primary'
                    }`}>
                    {role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-black" />}
                </div>

                <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="relative group rounded-lg overflow-hidden my-4">
                                            <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md border border-white/10"
                                                >
                                                    <Copy className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={match[1]}
                                                PreTag="div"
                                                className="!m-0 !bg-neutral-900"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                table({ children }) {
                                    return (
                                        <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                                            <table className="w-full text-left bg-white/5">{children}</table>
                                        </div>
                                    );
                                },
                                th({ children }) {
                                    return <th className="px-4 py-2 border-b border-white/10 font-semibold">{children}</th>;
                                },
                                td({ children }) {
                                    return <td className="px-4 py-2 border-b border-white/5">{children}</td>;
                                }
                            }}
                        >
                            {content + (isStreaming ? ' \u25CF' : '')}
                        </ReactMarkdown>
                    </div>

                    {role === 'prism' && !isStreaming && (
                        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Copy">
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button onClick={handleTTS} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Read Aloud">
                                <Volume2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors" title="Regenerate">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
