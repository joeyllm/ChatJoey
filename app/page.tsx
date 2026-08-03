"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  sources?: string[];
};

const starterMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hi, I’m Joey. Ask me anything about the project knowledge base — I’ll keep the answer clear and show where the information came from.",
    sources: ["JoeyLLM project brief"],
  },
  {
    id: 2,
    role: "user",
    content: "What are we focusing on in the current sprint?",
  },
  {
    id: 3,
    role: "assistant",
    content: "The current focus is a Next.js chat experience and an initial exploration of Qdrant. The interface will later connect to a retrieval service and be deployed with Vercel.",
    sources: ["Sprint update", "Technical direction"],
  },
];

const conversations = [
  { title: "Current sprint focus", time: "Now", active: true },
  { title: "How Qdrant search works", time: "Yesterday" },
  { title: "Project data overview", time: "2 days ago" },
];

const suggestions = [
  "Explain vector search simply",
  "Summarise our project direction",
  "How will Qdrant connect to this chat?",
];

function Icon({ name }: { name: "plus" | "menu" | "send" | "spark" | "search" }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    send: <path d="m22 2-7 20-4-9-9-4Z M22 2 11 13" />,
    spark: <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />,
    search: <path d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

export default function Home() {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    const value = text.trim();
    if (!value || isTyping) return;

    setMessages((current) => [...current, { id: Date.now(), role: "user", content: value }]);
    setInput("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "This is a prototype response. Once the retrieval API is connected, I’ll search the Qdrant knowledge base and answer with the most relevant project context.",
          sources: ["Prototype knowledge base"],
        },
      ]);
      setIsTyping(false);
    }, 900);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  function newConversation() {
    setMessages([starterMessages[0]]);
    setSidebarOpen(false);
  }

  return (
    <main className="appShell">
      {sidebarOpen && <button className="scrim" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "sidebarOpen" : ""}`}>
        <div className="brand">
          <div className="brandMark"><Icon name="spark" /></div>
          <div><strong>ChatJoey</strong><span>Project assistant</span></div>
        </div>

        <button className="newChat" onClick={newConversation}><Icon name="plus" /> New conversation</button>

        <label className="searchBox">
          <Icon name="search" />
          <input aria-label="Search conversations" placeholder="Search conversations" />
        </label>

        <nav className="conversationList" aria-label="Conversation history">
          <p className="eyebrow">Recent</p>
          {conversations.map((conversation) => (
            <button className={conversation.active ? "conversation active" : "conversation"} key={conversation.title}>
              <span>{conversation.title}</span><small>{conversation.time}</small>
            </button>
          ))}
        </nav>

        <div className="profile">
          <div className="avatar avatarUser">XC</div>
          <div><strong>Xiang Chang</strong><span>Team member</span></div>
          <span className="statusDot" title="Online" />
        </div>
      </aside>

      <section className="chatPanel">
        <header className="topbar">
          <button className="menuButton" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}><Icon name="menu" /></button>
          <div><h1>Current sprint focus</h1><p><span className="onlineDot" /> Joey is ready</p></div>
          <span className="modelPill">Prototype</span>
        </header>

        <div className="messages" aria-live="polite">
          <div className="dateDivider"><span>Today</span></div>
          {messages.map((message) => (
            <article className={`message ${message.role}`} key={message.id}>
              <div className={`avatar ${message.role === "assistant" ? "avatarJoey" : "avatarUser"}`}>
                {message.role === "assistant" ? <Icon name="spark" /> : "XC"}
              </div>
              <div className="messageContent">
                <div className="messageMeta"><strong>{message.role === "assistant" ? "Joey" : "You"}</strong><span>just now</span></div>
                <div className="bubble"><p>{message.content}</p></div>
                {message.sources && <div className="sources">{message.sources.map((source) => <span key={source}>↗ {source}</span>)}</div>}
              </div>
            </article>
          ))}

          {isTyping && (
            <article className="message assistant">
              <div className="avatar avatarJoey"><Icon name="spark" /></div>
              <div className="typing" aria-label="Joey is typing"><i /><i /><i /></div>
            </article>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="composerArea">
          <div className="suggestions">
            {suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>)}
          </div>
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              aria-label="Message Joey"
              placeholder="Ask Joey about the project…"
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <button className="sendButton" type="submit" disabled={!input.trim() || isTyping} aria-label="Send message"><Icon name="send" /></button>
          </form>
          <p className="disclaimer">ChatJoey can make mistakes. Check important project information.</p>
        </div>
      </section>
    </main>
  );
}
