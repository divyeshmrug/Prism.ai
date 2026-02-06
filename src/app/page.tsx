"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Loader from '@/components/Loader';
import { mockAnalytics } from '@/lib/mockData';
import styles from './page.module.css';

type Message = {
  role: 'user' | 'prism';
  content: string;
  insight?: {
    type: 'funnel' | 'stats' | 'friction';
    data: any;
  };
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setActiveChatId(null);
  };

  const handleLoadChat = (id: string) => {
    const chatToLoad = history.find(chat => chat.id === id);
    if (chatToLoad) {
      setMessages(chatToLoad.messages);
      setActiveChatId(chatToLoad.id);
    }
  };

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('prism_auth') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Simulate startup initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  const submitMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);

    const lowerText = text.toLowerCase();
    let responseText = "I'm Prism AI. I can help analyzing your product data. This is a simulated response.";
    let insight: Message['insight'] = undefined;

    if (lowerText.includes('conversion') || lowerText.includes('drop-off')) {
      responseText = "Based on recent data, your checkout conversion rate is 3.2%, which is down 0.9% from last week. The biggest drop-off is at the 'Add to Cart' to 'Checkout Start' step.";
      insight = {
        type: 'funnel',
        data: mockAnalytics.conversion
      };
    } else if (lowerText.includes('friction') || lowerText.includes('mobile')) {
      responseText = "I've identified 2 high-impact friction points affecting your mobile users. These together impact roughly 12% of sessions.";
      insight = {
        type: 'friction',
        data: mockAnalytics.frictionPoints
      };
    } else if (lowerText.includes('session') || lowerText.includes('summarize')) {
      responseText = "I've summarized 50 recent sessions. Common patterns include frustration on the checkout page due to slow loading.";
      insight = {
        type: 'stats',
        data: [
          { label: 'Avg Duration', value: '4:15', trend: 'down', trendVal: '12%' },
          { label: 'Frustration Rate', value: '18%', trend: 'up', trendVal: '5%' },
        ]
      };
    } else if (lowerText.includes('signup') || lowerText.includes('decrease')) {
      responseText = "Signups decreased by 15% yesterday. This correlates with a 20% drop in traffic from your main marketing landing page.";
      insight = {
        type: 'stats',
        data: [
          { label: 'Daily Signups', value: '142', trend: 'down', trendVal: '15%' },
          { label: 'Marketing Traffic', value: '8.4k', trend: 'down', trendVal: '20%' },
        ]
      };
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'prism',
        content: responseText,
        insight
      };

      setMessages(prev => {
        const newMessages = [...prev, aiResponse];

        // Update history
        setHistory(prevHistory => {
          const currentChatId = activeChatId || Date.now().toString();
          if (!activeChatId) setActiveChatId(currentChatId);

          const existingChatIndex = prevHistory.findIndex(chat => chat.id === currentChatId);
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          const title = firstUserMsg ? firstUserMsg.content : 'New Chat';

          if (existingChatIndex !== -1) {
            const updatedHistory = [...prevHistory];
            updatedHistory[existingChatIndex] = { ...updatedHistory[existingChatIndex], messages: newMessages, title };
            return updatedHistory;
          } else {
            return [{ id: currentChatId, title, messages: newMessages }, ...prevHistory];
          }
        });

        return newMessages;
      });
    }, 600);

    setInput('');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  const handleExampleClick = (text: string) => {
    submitMessage(text.replace(/"/g, ''));
  };

  const handleShare = () => {
    // In a real app, this might generate a shareable link
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const renderInsight = (insight: Message['insight']) => {
    if (!insight) return null;

    if (insight.type === 'funnel') {
      return (
        <div className={styles.insightCard}>
          <div className={styles.insightTitle}>Checkout Funnel Analysis</div>
          <div className={styles.funnelChart}>
            {insight.data.steps.map((step: any, i: number) => (
              <div key={i} className={styles.funnelStep}>
                <div className={styles.funnelLabel}>
                  <span>{step.name}</span>
                  <span>{step.rate}%</span>
                </div>
                <div className={styles.funnelBarBg}>
                  <div className={styles.funnelBar} style={{ width: `${step.rate}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (insight.type === 'stats') {
      return (
        <div className={styles.insightCard}>
          <div className={styles.statGrid}>
            {insight.data.map((stat: any, i: number) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={`${styles.statTrend} ${stat.trend === 'down' ? styles.trendDown : styles.trendUp}`}>
                  {stat.trend === 'down' ? '▼' : '▲'} {stat.trendVal}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (insight.type === 'friction') {
      return (
        <div className={styles.insightCard}>
          <div className={styles.insightTitle}>Top Friction Points</div>
          <div className={styles.frictionList}>
            {insight.data.map((item: any, i: number) => (
              <div key={i} className={styles.frictionItem}>
                <div className={styles.frictionInfo}>
                  <span className={styles.frictionPage}>{item.page}</span>
                  <span className={styles.frictionIssue}>{item.issue}</span>
                </div>
                <span className={`${styles.impactBadge} ${item.impact === 'High' ? styles.impactHigh : styles.impactMedium}`}>
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          <Loader />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar onNewChat={handleNewChat} onLoadChat={handleLoadChat} history={history} />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.modelSelector}>
            <span>Prism v1.0</span>
            <span className={styles.chevron}>▼</span>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.actionBtn}
              onClick={handleShare}
            >
              {shared ? 'Copied!' : 'Share'}
            </button>
          </div>
        </header>

        <div className={styles.chatArea}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.logoEmpty}>
                <Image src="/logo.png" alt="Prism AI Logo" width={180} height={180} className={styles.logoImage} priority />
              </div>
              <div className={styles.examplesGrid}>
                <button className={styles.exampleBtn} onClick={() => handleExampleClick("Analyze drop-off rates on checkout")}>"Analyze drop-off rates on checkout"</button>
                <button className={styles.exampleBtn} onClick={() => handleExampleClick("Show me friction points for mobile users")}>"Show me friction points for mobile users"</button>
                <button className={styles.exampleBtn} onClick={() => handleExampleClick("Summarize recent session replays")}>"Summarize recent session replays"</button>
                <button className={styles.exampleBtn} onClick={() => handleExampleClick("Why did signups decrease yesterday?")}>"Why did signups decrease yesterday?"</button>
              </div>
            </div>
          ) : (
            <div className={styles.messageList}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.message} ${msg.role === 'prism' ? styles.messagePrism : styles.messageUser}`}>
                  <div className={styles.messageAvatar}>{msg.role === 'user' ? 'U' : 'AI'}</div>
                  <div className={styles.messageContent}>
                    <p>{msg.content}</p>
                    {renderInsight(msg.insight)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <form onSubmit={handleSend} className={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Prism anything..."
              className={styles.chatInput}
            />
            <button type="submit" className={styles.sendButton} disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>
          <p className={styles.disclaimer}>Prism AI can make mistakes. Consider checking important info.</p>
        </div>
      </main>
    </div>
  );
}
