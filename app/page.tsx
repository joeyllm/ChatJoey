"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  languageOptions,
  type LanguageCode,
  translations,
} from "./i18n";
import styles from "./page.module.css";

type MessageRole = "user" | "assistant";

type Message = {
  id: number;
  role: MessageRole;
  content: string;
};

type ChatMode = "ready" | "thinking" | "live" | "mock" | "error";

type ChatResponse = {
  mode?: "live" | "mock";
  message?: {
    role?: string;
    content?: string;
  };
  error?: string;
};

const defaultLanguage: LanguageCode = "en";

export default function Home() {
  const [language, setLanguage] = useState<LanguageCode>(defaultLanguage);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<ChatMode>("ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nextMessageId = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const copy = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy.documentTitle;
  }, [copy.documentTitle, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    setLanguage(event.target.value as LanguageCode);
  }

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
      const payload = (await response.json()) as ChatResponse;

      if (
        !response.ok ||
        (payload.mode !== "live" && payload.mode !== "mock") ||
        typeof payload.message?.content !== "string"
      ) {
        throw new Error(payload.error ?? "Invalid chat response");
      }

      const preview =
        content.length > 72 ? `${content.slice(0, 72)}…` : content;
      const assistantMessage: Message = {
        id: nextMessageId.current++,
        role: "assistant",
        content:
          payload.mode === "mock"
            ? copy.mockReply(preview)
            : payload.message.content,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
      setMode(payload.mode);
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
              CJ
            </span>
            <div>
              <p className={styles.productName}>ChatJoey</p>
              <p className={styles.productTagline}>{copy.productTagline}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <label className={styles.languagePicker}>
              <span>{copy.languageLabel}</span>
              <select
                aria-label={copy.languageLabel}
                value={language}
                onChange={handleLanguageChange}
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
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
