"use client";

import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Sidebar, { ViewType } from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import EmptyState from '@/components/EmptyState';
import KnowledgeBase from '@/components/KnowledgeBase';

interface Message {
  role: 'user' | 'prism';
  content: string;
  isStreaming?: boolean;
}

interface Chat {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('prism_history_v2');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('prism_history_v2', JSON.stringify(history));
  }, [history]);

  // Autoscroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string, files: File[] = []) => {
    if (!text.trim() && files.length === 0) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error("API Key not found. Please add your Gemini API key in Settings or .env.local");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }, { apiVersion: 'v1beta' });

      const prompt = `You are Prizm AI, a product analysis expert. The user is asking: "${text}"`;
      const result = await model.generateContentStream(prompt);

      let fullContent = "";
      const assistantMessage: Message = { role: 'prism', content: "", isStreaming: true };
      setMessages(prev => [...prev, assistantMessage]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullContent += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'prism', content: fullContent, isStreaming: true };
          return newMessages;
        });
      }

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { role: 'prism', content: fullContent, isStreaming: false };
        return newMessages;
      });

    } catch (error: any) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'prism', content: `Sorry, I encountered an error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onNewChat = () => {
    // setActiveChatId(null); // This state is removed
    setMessages([]);
  };

  const onSelectChat = (id: string) => {
    const chat = history.find(c => c.id === id);
    if (chat) {
      // setActiveChatId(id); // This state is removed
      setMessages(chat.messages);
    }
  };

  const onDeleteChat = (id: string) => {
    setHistory(prev => prev.filter(c => c.id !== id));
    // if (activeChatId === id) { // This state is removed
    //   onNewChat();
    // }
  };

  const onRenameChat = (id: string, newTitle: string) => {
    setHistory(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  return (
    <div className="flex h-screen bg-black text-white selection:bg-primary/30 overflow-hidden">
      {/* Premium Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1a1a1a_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className={`relative z-10 flex-1 flex flex-col transition-all duration-300 ease-in-out h-full ${isSidebarOpen ? 'pl-[280px]' : 'pl-0'
        }`}>
        {activeView === 'chat' ? (
          <div className="flex-1 flex flex-col relative overflow-hidden">
            <div className="flex-1 overflow-y-auto pt-20 pb-10 scroll-smooth custom-scrollbar">
              {messages.length === 0 ? (
                <EmptyState onSelectPrompt={(p) => handleSendMessage(p, [])} />
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} {...msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="shrink-0 w-full mt-auto">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        ) : activeView === 'knowledge' ? (
          <div className="flex-1 flex flex-col pt-16 overflow-y-auto">
            <KnowledgeBase />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 font-medium">
            <p className="text-xl italic">The {activeView} module is under development.</p>
          </div>
        )}
      </main>
    </div>
  );
}
