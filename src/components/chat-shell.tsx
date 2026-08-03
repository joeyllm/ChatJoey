"use client";

import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Edit3,
  Menu,
  MessageSquareText,
  Mic,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ChatMessage, sendChatMessage } from "@/lib/chat-client";

const initialChats = [
  "Dataset quality review",
  "Australian corpus summary",
  "Sprint 4 planning",
  "Qdrant exploration notes",
];

const suggestions = [
  {
    title: "Explore project knowledge",
    detail: "Summarise what the JoeyLLM team achieved last semester",
  },
  {
    title: "Plan an experiment",
    detail: "Design a dataset quality and training-parameter comparison",
  },
  {
    title: "Understand Qdrant",
    detail: "Explain collections, vectors, payloads and similarity search",
  },
  {
    title: "Prepare a tutor update",
    detail: "Turn this week’s progress into a concise meeting report",
  },
];

function JoeyMark({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "joey-mark joey-mark--small" : "joey-mark"} aria-hidden="true">
      <Sparkles size={small ? 15 : 22} strokeWidth={2.1} />
    </span>
  );
}

export function ChatShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setMobileSidebarOpen(false);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const submitMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChatMessage(nextMessages);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: error instanceof Error ? error.message : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  const chooseSuggestion = (detail: string) => {
    setInput(detail);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const copyMessage = async (message: ChatMessage) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 1400);
  };

  return (
    <div className="app-shell" data-theme={darkMode ? "dark" : "light"}>
      {mobileSidebarOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "" : "sidebar--collapsed"} ${
          mobileSidebarOpen ? "sidebar--mobile-open" : ""
        }`}
      >
        <div className="sidebar-top">
          <button className="brand" onClick={startNewChat} aria-label="ChatJoey home">
            <JoeyMark small />
            <span>ChatJoey</span>
          </button>
          <button
            className="icon-button sidebar-close-desktop"
            onClick={() => setSidebarOpen(false)}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
          <button
            className="icon-button sidebar-close-mobile"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="sidebar-actions" aria-label="Chat navigation">
          <button className="sidebar-action" onClick={startNewChat}>
            <Edit3 size={17} />
            <span>New chat</span>
          </button>
          <button className="sidebar-action">
            <Search size={17} />
            <span>Search chats</span>
          </button>
        </nav>

        <div className="chat-history">
          <p className="history-label">Today</p>
          {initialChats.slice(0, 2).map((chat, index) => (
            <button className={`history-item ${index === 0 && messages.length ? "history-item--active" : ""}`} key={chat}>
              <span>{chat}</span>
              <MoreHorizontal className="history-more" size={16} />
            </button>
          ))}
          <p className="history-label history-label--spaced">Previous 7 days</p>
          {initialChats.slice(2).map((chat) => (
            <button className="history-item" key={chat}>
              <span>{chat}</span>
              <MoreHorizontal className="history-more" size={16} />
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="profile-button">
            <span className="avatar">CN</span>
            <span className="profile-copy">
              <strong>Chen Nuo</strong>
              <small>JoeyLLM team</small>
            </span>
            <MoreHorizontal size={17} />
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            {!sidebarOpen && (
              <button className="icon-button desktop-menu" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <Menu size={20} />
              </button>
            )}
            <button className="icon-button mobile-menu" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <button className="model-picker">
              <span>JoeyLLM</span>
              <span className="model-version">Preview</span>
              <ChevronDown size={15} />
            </button>
          </div>
          <div className="topbar-actions">
            <span className="service-status"><i /> Interface ready</span>
            <button className="icon-button" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle colour theme">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="share-button">Share</button>
            <button className="icon-button" aria-label="More options">
              <MoreHorizontal size={19} />
            </button>
          </div>
        </header>

        <div className="conversation" ref={scrollRef}>
          {messages.length === 0 ? (
            <section className="welcome" aria-labelledby="welcome-title">
              <JoeyMark />
              <h1 id="welcome-title">How can I help you today?</h1>
              <p>Ask Joey about the project, the dataset, or your next experiment.</p>
              <div className="suggestion-grid">
                {suggestions.map((suggestion) => (
                  <button className="suggestion-card" key={suggestion.title} onClick={() => chooseSuggestion(suggestion.detail)}>
                    <span>
                      <strong>{suggestion.title}</strong>
                      <small>{suggestion.detail}</small>
                    </span>
                    <ArrowUp size={16} />
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <article className={`message-row message-row--${message.role}`} key={message.id}>
                  {message.role === "assistant" && <JoeyMark small />}
                  <div className="message-content">
                    <div className="message-bubble">{message.content}</div>
                    {message.role === "assistant" && (
                      <div className="message-actions">
                        <button onClick={() => void copyMessage(message)} aria-label="Copy response">
                          {copiedId === message.id ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                        <button aria-label="Good response"><ThumbsUp size={15} /></button>
                        <button aria-label="Bad response"><ThumbsDown size={15} /></button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
              {loading && (
                <article className="message-row message-row--assistant">
                  <JoeyMark small />
                  <div className="typing-indicator" aria-label="Joey is thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              )}
            </div>
          )}
        </div>

        <div className="composer-area">
          <form className="composer" onSubmit={submitMessage}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message Joey"
              aria-label="Message Joey"
            />
            <div className="composer-toolbar">
              <div className="composer-tools">
                <button type="button" className="composer-icon" aria-label="Attach a file">
                  <Plus size={20} />
                </button>
                <button type="button" className="tools-button">
                  <SlidersHorizontal size={16} />
                  <span>Tools</span>
                </button>
                <span className="retrieval-chip"><MessageSquareText size={14} /> Qdrant planned</span>
              </div>
              <div className="composer-actions">
                {!input.trim() && (
                  <button type="button" className="composer-icon" aria-label="Voice input">
                    <Mic size={19} />
                  </button>
                )}
                <button className="send-button" type="submit" disabled={!input.trim() || loading} aria-label="Send message">
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </form>
          <p className="composer-note">Joey can make mistakes. Check important information.</p>
        </div>
      </main>
    </div>
  );
}
