"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { ViewType } from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput, { ChatInputHandle } from '@/components/ChatInput';
import EmptyState from '@/components/EmptyState';
import KnowledgeBase from '@/components/KnowledgeBase';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { GoogleGenerativeAI, Part } from "@google/generative-ai";
interface KnowledgeItem {
  id: string;
  name: string;
  status: string;
  content: string;
  [key: string]: unknown;
}

interface Message {
  role: 'user' | 'prism';
  content: string;
  isStreaming?: boolean;
  model?: string;
  files?: File[];
  images?: string[]; // Base64 strings
}

interface Chat {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export default function Home() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputHandle>(null);

  const handleViewChange = (view: ViewType) => {
    if (view === 'admin') {
      router.push('/admin');
    } else {
      setActiveView(view);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Keyboard Shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      metaOrCtrl: true,
      action: () => {
        chatInputRef.current?.focus();
      }
    },
    {
      key: 'b',
      metaOrCtrl: true,
      action: () => {
        setIsSidebarOpen(prev => !prev);
      }
    },
    {
      key: 'n',
      metaOrCtrl: true,
      shift: true,
      action: () => {
        handleNewChat();
      }
    }
  ]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('prism_history_v2');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      // Optional: Load the most recent chat if available
      // if (parsed.length > 0) handleSelectChat(parsed[0].id);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('prism_history_v2', JSON.stringify(history));
  }, [history]);

  // Autoscroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setActiveView('chat');
    chatInputRef.current?.focus();
  };

  const handleSelectChat = (id: string) => {
    const chat = history.find(c => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setActiveChatId(id);
      setActiveView('chat');
    }
  };

  const handleDeleteChat = (id: string) => {
    setHistory(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      handleNewChat();
    }
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setHistory(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;

    const chatTitle = history.find(c => c.id === activeChatId)?.title || 'New Chat';
    const date = new Date().toLocaleDateString();

    let mdContent = `# ${chatTitle}\n*Exported on ${date}*\n\n---\n\n`;

    messages.forEach(msg => {
      const role = msg.role === 'user' ? 'User' : 'Prizm AI';
      mdContent += `### ${role}\n${msg.content}\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateChatHistory = (msgs: Message[]) => {
    if (!activeChatId) {
      // Create new chat
      const newId = Math.random().toString(36).substr(2, 9);
      const newChat: Chat = {
        id: newId,
        title: msgs[0]?.content.slice(0, 30) + (msgs[0]?.content.length > 30 ? '...' : '') || 'New Chat',
        timestamp: Date.now(),
        messages: msgs
      };
      setHistory(prev => [newChat, ...prev]);
      setActiveChatId(newId);
    } else {
      // Update existing chat
      setHistory(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: msgs, timestamp: Date.now() } : c));
    }
  };

  const handleSendMessage = async (text: string, files: File[] = [], existingImages: string[] = []) => {
    if (!text.trim() && files.length === 0 && existingImages.length === 0) return;

    // Separate images from other files
    const imageFiles = files.filter(f => f.type.startsWith('image/'));

    // Convert images to base64 for display and API
    const imagePromises = imageFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    const newImages = await Promise.all(imagePromises);
    const images = [...existingImages, ...newImages];

    const userMessage: Message = { role: 'user', content: text, images };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (activeChatId) {
      updateChatHistory(updatedMessages);
    }

    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error("API Key not found. Please add your Gemini API key in Settings or .env.local");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use 1.5 Flash for multimodal

      // Build Prompt Parts
      const promptParts: Part[] = [];

      // Add text
      if (text) promptParts.push({ text });

      // Add images
      for (const image of images) {
        // Remove data:image/xxx;base64, prefix for API
        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];

        promptParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      // Add Knowledge Base Context if no images (Context + Images can maximize token limits, keep simple for now)
      // Or include it as text part
      // Add Knowledge Base Context
      const knowledgeItems: KnowledgeItem[] = JSON.parse(localStorage.getItem('prism_knowledge_base') || '[]');
      const context = knowledgeItems
        .filter((item) => item.status === 'indexed' && item.content)
        .map((item) => `[Document: ${item.name}]\n${item.content}`)
        .join('\n\n');

      if (context) {
        promptParts.unshift({ text: `CONTEXT:\n${context}\n\n` });
      }

      promptParts.unshift({ text: "You are Prizm AI. Analyze the input. If images are provided, describe them or answer questions about them." });

      const result = await model.generateContentStream(promptParts);

      let fullContent = "";
      const assistantMessage: Message = { role: 'prism', content: "", isStreaming: true };
      setMessages([...updatedMessages, assistantMessage]);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullContent += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'prism', content: fullContent, isStreaming: true };
          return newMessages;
        });
      }

      const finalMessages = [...updatedMessages, { role: 'prism', content: fullContent, isStreaming: false } as Message];
      setMessages(finalMessages);
      updateChatHistory(finalMessages);

    } catch (error: unknown) {
      console.error("Gemini Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      const errorMsg = { role: 'prism', content: `Sorry, I encountered an error: ${errorMessage}` } as Message;
      const finalMessages = [...updatedMessages, errorMsg];
      setMessages(finalMessages);
      updateChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    // Find the last user message index
    const lastUserIndex = messages.findLastIndex(m => m.role === 'user');
    if (lastUserIndex === -1) return;

    const lastUserMessage = messages[lastUserIndex];

    // Reset messages to BEFORE the last user message
    const messagesBeforeLast = messages.slice(0, lastUserIndex);
    setMessages(messagesBeforeLast);

    // Pass existing images if any
    await handleSendMessage(lastUserMessage.content, [], lastUserMessage.images);
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
        onViewChange={handleViewChange}
        // Chat History Props
        chatHistory={history}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onExportChat={handleExportChat}
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
                    <ChatMessage
                      key={i}
                      {...msg}
                      onRegenerate={i === messages.length - 1 && msg.role === 'prism' ? handleRegenerate : undefined}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="shrink-0 w-full mt-auto">
              <ChatInput ref={chatInputRef} onSendMessage={handleSendMessage} isLoading={isLoading} />
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
