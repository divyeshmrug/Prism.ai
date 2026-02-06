"use client";

import { useState, useEffect, useRef } from 'react';
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
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    const isLoggedIn = localStorage.getItem('prism_auth') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  const submitMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsThinking(true);

    // Cycle through thinking phases
    const phases = ["Thinking...", "Analyzing data patterns...", "Retrieving insights...", "Synthesizing response..."];
    let phaseIdx = 0;
    setThinkingMessage(phases[0]);

    const interval = setInterval(() => {
      phaseIdx++;
      if (phaseIdx < phases.length) {
        setThinkingMessage(phases[phaseIdx]);
      }
    }, 600);

    const lowerText = text.toLowerCase();
    let responseText = "I'm Prizm AI. I can help analyzing your product data.";
    let insight: Message['insight'] = undefined;

    if (lowerText.includes('conversion') || lowerText.includes('drop-off')) {
      responseText = "Based on recent data, your checkout conversion rate is 3.2%, which is down 0.9% from last week.";
      insight = {
        type: 'funnel',
        data: mockAnalytics.conversion
      };
    } else if (lowerText.includes('friction') || lowerText.includes('mobile')) {
      responseText = "I've identified 2 high-impact friction points affecting your mobile users.";
      insight = {
        type: 'friction',
        data: mockAnalytics.frictionPoints
      };
    } else if (lowerText.includes('session') || lowerText.includes('summarize')) {
      responseText = "I've summarized 50 recent sessions. Common patterns include frustration on the checkout page.";
      insight = {
        type: 'stats',
        data: [
          { label: 'Avg Duration', value: '4:15', trend: 'down', trendVal: '12%' },
          { label: 'Frustration Rate', value: '18%', trend: 'up', trendVal: '5%' },
        ]
      };
    }

    setTimeout(() => {
      clearInterval(interval);
      setIsThinking(false);

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
    }, 2400);

    setInput('');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
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
            <span>Home</span>
            <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem' }}>▼</span>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.actionBtn} onClick={() => router.push('/login')}>Login</button>
            <button className={styles.actionBtn} style={{ background: '#000', color: '#fff' }} onClick={() => router.push('/login')}>Sign Up</button>
          </div>
        </header>

        <div className={styles.chatArea}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <h1 className={styles.heroTitle}>Get The Theme You Want For Growth</h1>
              <p className={styles.heroSubtitle}>Prizm AI: Analysis-Powered Product Insights and recommendation System</p>

              <div className={styles.examplesGrid}>
                <div className={styles.exampleBtn} onClick={() => submitMessage("Analyze drop-off rates on checkout")}>
                  <span>Analyze drop-off rates on checkout</span>
                  <div className={styles.getThisBtn}>Get This ↗</div>
                </div>
                <div className={styles.exampleBtn} onClick={() => submitMessage("Show me friction points for mobile users")}>
                  <span>Show me friction points for mobile users</span>
                  <div className={styles.getThisBtn}>Get This ↗</div>
                </div>
                <div className={styles.exampleBtn} onClick={() => submitMessage("Summarize recent session replays")}>
                  <span>Summarize recent session replays</span>
                  <div className={styles.getThisBtn}>Get This ↗</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.messageList}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.message} ${msg.role === 'prism' ? styles.messagePrism : styles.messageUser}`}>
                  <div className={styles.messageContent}>
                    <p>{msg.content}</p>
                    {renderInsight(msg.insight)}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className={`${styles.message} ${styles.messagePrism}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.thinking}>
                      <span className={styles.thinkingIcon}></span>
                      {thinkingMessage}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div >
          )
          }
        </div >

        <div className={styles.inputArea}>
          <form onSubmit={handleSend} className={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search theme, API, Application..."
              className={styles.chatInput}
            />
            <button type="submit" className={styles.sendButton} disabled={!input.trim()}>
              Search Now
            </button>
          </form>
          <p className={styles.disclaimer}>Prizm AI can make mistakes. Consider checking important info.</p>
        </div>
      </main >
    </div >
  );
}
