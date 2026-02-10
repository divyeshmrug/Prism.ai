import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, RotateCcw, Volume2, User, Bot } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface ChatMessageProps {
    role: 'user' | 'prism';
    content: string;
    isStreaming?: boolean;
    images?: string[];
    onRegenerate?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isStreaming, images, onRegenerate }) => {

    const [copied, setCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTTS = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        // Cancel any other current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(content);

        // Optional: Select a preferred voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
    };

    return (
        <div className={`w-full py-12 px-6 sm:px-12 flex flex-col group transition-none bg-[#1B1B1B] border-b border-white/5`}>
            <div className="max-w-4xl mx-auto w-full flex gap-6 sm:gap-10">
                <div className={`shrink-0 w-8 h-8 rounded-none flex items-center justify-center border ${role === 'user'
                        ? 'bg-transparent border-primary text-primary'
                        : 'bg-transparent border-accent text-accent'
                    }`}>
                    {role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="flex-1 space-y-2 overflow-hidden">
                    {/* Image Grid */}
                    {images && images.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-4">
                            {images.map((img, i) => (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img key={i} src={img} alt="User Upload" className="max-w-xs rounded-xl border border-white/10 shadow-lg hover:scale-105 transition-transform" />
                            ))}
                        </div>
                    )}

                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeContent = String(children).replace(/\n$/, '');

                                    return !inline && match ? (
                                        <CodeBlock
                                            language={match[1]}
                                            value={codeContent}
                                        />
                                    ) : (
                                        <code className="bg-accent/20 px-1.5 py-0.5 rounded text-primary font-mono text-sm" {...props}>
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
                            <button
                                onClick={handleTTS}
                                className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${isSpeaking ? 'text-accent bg-accent/10' : 'text-gray-400 hover:text-white'}`}
                                title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                            >
                                {isSpeaking ? <div className="w-2.5 h-2.5 bg-current rounded-sm m-0.5" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={onRegenerate}
                                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                                title="Regenerate"
                            >
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
