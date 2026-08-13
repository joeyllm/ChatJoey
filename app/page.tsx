"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./page.module.css";

type MessageRole = "user" | "assistant";

type Message = {
  id: number;
  role: MessageRole;
  content: string;
};

type ChatMode = "ready" | "thinking" | "live" | "mock" | "error";

type ChatErrorResponse = {
  error?: string;
};

const copy = {
  chatAriaLabel: "Joey LLM chat interface",
  productTagline: "Start every conversation with clarity",
  status: "Ready",
  thinkingStatus: "Thinking",
  liveStatus: "Joey LLM live",
  previewStatus: "Local preview",
  errorStatus: "Connection issue",
  messagesAriaLabel: "Conversation messages",
  thinkingMessage: "Thinking…",
  welcomeTitle: "What can we solve together today?",
  welcomeDescription:
    "Type a question or choose an example below. It's sent securely to Joey LLM through the server.",
  examplesAriaLabel: "Example questions",
  starterPrompts: [
    "Help me plan today's priorities",
    "Explain vector search in simple terms",
    "Create an acceptance checklist for a new feature",
  ],
  userRole: "You",
  assistantRole: "Joey LLM",
  inputLabel: "Message",
  placeholder: "Message Joey LLM…",
  sendButtonLabel: "Send message",
  send: "Send",
  hint: "Enter to send · Shift + Enter for a new line",
  disclaimer:
    "Joey LLM can make mistakes. Check important information. Qdrant and RAG are not connected yet.",
  requestFailed:
    "Could not reach Joey LLM. Please check the connection and try again.",
  mockReply: (preview: string) =>
    `Local mock reply: I received “${preview}”. This prototype only demonstrates interface interactions and is not connected to a real model or knowledge base.`,
};

export default function Home() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<ChatMode>("ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nextMessageId = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();
    if (!content || mode === "thinking") {
      return;
    }

    const userMessage: Message = {
      id: nextMessageId.current++,
      role: "user",
      content,
    };
    const requestMessages = [...messages, userMessage];

    setMessages(requestMessages);
    setDraft("");
    setErrorMessage(null);
    setMode("thinking");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: requestMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response
          .json()
          .catch(() => null)) as ChatErrorResponse | null;
        throw new Error(payload?.error ?? "Invalid chat response");
      }

      const chatMode = response.headers.get("X-Chat-Mode");
      if (
        (chatMode !== "live" && chatMode !== "mock") ||
        !response.body
      ) {
        throw new Error("Invalid chat response");
      }

      const assistantId = nextMessageId.current++;
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setMode(chatMode);

      if (chatMode === "mock") {
        await response.body.cancel();
        const preview =
          content.length > 72 ? `${content.slice(0, 72)}…` : content;
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantId
              ? { ...message, content: copy.mockReply(preview) }
              : message,
          ),
        );
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        assistantContent += decoder.decode(value, { stream: true });
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantId
              ? { ...message, content: assistantContent }
              : message,
          ),
        );
      }
    } catch {
      setErrorMessage(copy.requestFailed);
      setMode("error");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const statusCopy = {
    ready: copy.status,
    thinking: copy.thinkingStatus,
    live: copy.liveStatus,
    mock: copy.previewStatus,
    error: copy.errorStatus,
  }[mode];

  return (
    <main className={styles.page}>
      <section className={styles.chatShell} aria-label={copy.chatAriaLabel}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <span className={styles.mark} aria-hidden="true">
              JL
            </span>
            <div>
              <p className={styles.productName}>Joey LLM</p>
              <p className={styles.productTagline}>{copy.productTagline}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <span
              className={`${styles.status} ${
                mode === "error" ? styles.errorStatus : ""
              }`}
              aria-live="polite"
            >
              {statusCopy}
            </span>
          </div>
        </header>

        <section
          className={styles.conversation}
          aria-label={copy.messagesAriaLabel}
          aria-live="polite"
          aria-busy={mode === "thinking"}
        >
          {messages.length === 0 ? (
            <div className={styles.welcome}>
              <span className={styles.welcomeMark} aria-hidden="true">
                ✦
              </span>
              <h1>{copy.welcomeTitle}</h1>
              <p>{copy.welcomeDescription}</p>
              <div
                className={styles.starters}
                aria-label={copy.examplesAriaLabel}
              >
                {copy.starterPrompts.map((prompt) => (
                  <button
                    className={styles.starterButton}
                    key={prompt}
                    onClick={() => setDraft(prompt)}
                    type="button"
                  >
                    {prompt}
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ol className={styles.messageList}>
              {messages.map((message) => (
                <li
                  className={`${styles.messageRow} ${
                    message.role === "user"
                      ? styles.userRow
                      : styles.assistantRow
                  }`}
                  key={message.id}
                >
                  <article className={styles.message}>
                    <p className={styles.messageRole}>
                      {message.role === "user"
                        ? copy.userRole
                        : copy.assistantRole}
                    </p>
                    <p className={styles.messageContent}>{message.content}</p>
                  </article>
                </li>
              ))}
              {mode === "thinking" ? (
                <li className={`${styles.messageRow} ${styles.assistantRow}`}>
                  <article className={`${styles.message} ${styles.pendingMessage}`}>
                    <p className={styles.messageRole}>{copy.assistantRole}</p>
                    <p className={styles.messageContent}>{copy.thinkingMessage}</p>
                  </article>
                </li>
              ) : null}
            </ol>
          )}
          {errorMessage ? (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          ) : null}
          <div ref={messagesEndRef} />
        </section>

        <footer className={styles.composerArea}>
          <form
            className={styles.composer}
            onSubmit={handleSubmit}
            aria-busy={mode === "thinking"}
          >
            <label className={styles.label} htmlFor="chat-message">
              {copy.inputLabel}
            </label>
            <div className={styles.inputRow}>
              <textarea
                id="chat-message"
                maxLength={4000}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={copy.placeholder}
                rows={2}
                value={draft}
              />
              <button
                aria-label={copy.sendButtonLabel}
                className={styles.sendButton}
                disabled={!draft.trim() || mode === "thinking"}
                type="submit"
              >
                <span>{copy.send}</span>
                <span aria-hidden="true">↑</span>
              </button>
            </div>
            <p className={styles.hint}>{copy.hint}</p>
          </form>
          <p className={styles.disclaimer}>{copy.disclaimer}</p>
        </footer>
      </section>
    </main>
  );
}
