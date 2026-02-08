import React, { useState, useRef } from 'react';
import { Send, Mic, Paperclip, X, FileText } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface ChatInputProps {
    onSendMessage: (text: string, files?: File[]) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const { isRecording, transcript, startRecording, stopRecording } = useSpeechToText();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync transcript to input
    React.useEffect(() => {
        if (transcript) setInput(transcript);
    }, [transcript]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((input.trim() || files.length > 0) && !isLoading) {
            onSendMessage(input, files);
            setInput('');
            setFiles([]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-6 pb-12">
            {/* File Pills */}
            {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 px-4">
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full group transition-all hover:bg-white/10">
                            <span className="text-xs text-gray-300 truncate max-w-[150px]">{file.name}</span>
                            <button
                                onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))}
                                className="hover:text-red-400 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="relative flex items-center bg-[#0d0d0d] border border-white/10 rounded-full h-[72px] px-2 pl-6 focus-within:border-white/20 transition-all shadow-2xl group"
            >
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <Paperclip className="w-5 h-5" />
                    <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => setFiles(p => [...p, ...Array.from(e.target.files || [])])} />
                </button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Search, ask, upload anything..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-lg px-4"
                />

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-500/10 text-red-500 animate-pulse' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Mic className="w-5 h-5" />
                    </button>

                    <button
                        type="submit"
                        disabled={(!input.trim() && files.length === 0) || isLoading}
                        className="h-[56px] px-8 bg-black border border-white/10 rounded-full text-white font-bold text-sm tracking-wide hover:bg-white hover:text-black transition-all flex items-center gap-2 group-focus-within:border-primary/50"
                    >
                        {isLoading ? "Thinking..." : "Search Now"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
