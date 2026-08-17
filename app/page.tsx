"use client";

import {
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./page.module.css";
import JoeyWordmark from "./components/JoeyWordmark";
import { activeMode as defaultMode, modes } from "@/modes";
import type { JoeyTheme } from "@/modes/types";

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

const SIDEBAR_MIN_WIDTH = 200;
const SIDEBAR_MAX_WIDTH = 380;
const SIDEBAR_DEFAULT_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const SIDEBAR_RESIZE_STEP = 16;

function clampSidebarWidth(width: number) {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width));
}

const THEME_CSS_VARS = {
  accent: "--accent",
  accentDeep: "--accent-deep",
  background: "--chat-background",
  userMessage: "--user-message-bg",
  speechBubble: "--speech-bubble-bg",
  sidebarTint: "--sidebar-tint",
} satisfies Record<keyof JoeyTheme, `--${string}`>;

type ThemeStyle = CSSProperties & {
  [key: `--${string}`]: string | undefined;
};

function themeStyle(theme: JoeyTheme): CSSProperties {
  const style: ThemeStyle = {};
  for (const key of Object.keys(THEME_CSS_VARS) as Array<keyof JoeyTheme>) {
    const value = theme[key];
    if (value) {
      style[THEME_CSS_VARS[key]] = value;
    }
  }
  return style;
}

const copy = {
  chatAriaLabel: "Joey LLM chat interface",
  status: "Ready",
  thinkingStatus: "Thinking",
  liveStatus: "Live",
  previewStatus: "Demo",
  errorStatus: "Error",
  messagesAriaLabel: "Conversation messages",
  thinkingMessage: "Thinking…",
  welcomeDescription:
    "Ask me anything — serious, silly, or somewhere in between. I’m still learning, so feel free to test me.",
  sessionNotice:
    "Joey’s memory is temporary for now. Refreshing or starting over will clear this chat.",
  newChat: "New Chat",
  joeyModesHeading: "Joey Modes",
  joeyModesSubtext: "Choose how Joey behaves and responds.",
  inputLabel: "Message",
  placeholder: "Message Joey…",
  sendButtonLabel: "Send message",
  send: "Send",
  hint: "Enter to send · Shift + Enter for a new line",
  disclaimerBuiltBy: "Built by",
  disclaimerBuilder: "Southern Cross AI",
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
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState(defaultMode.id);
  const nextMessageId = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const isDraggingSidebarRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentMode =
    modes.find((candidate) => candidate.id === selectedModeId) ?? defaultMode;

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    if (!isResizingSidebar) {
      return;
    }
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizingSidebar]);

  function toggleSidebarCollapsed() {
    setSidebarCollapsed((collapsed) => !collapsed);
  }

  function handleNewChat() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setMode("ready");
    setErrorMessage(null);
    setDraft("");
    nextMessageId.current = 1;
  }

  function handleSelectMode(modeId: string) {
    if (modeId === selectedModeId) {
      return;
    }
    setSelectedModeId(modeId);
    handleNewChat();
  }

  function handleSidebarResizePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    isDraggingSidebarRef.current = true;
    setIsResizingSidebar(true);
  }

  function handleSidebarResizePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (!isDraggingSidebarRef.current || !sidebarRef.current) {
      return;
    }
    const { left } = sidebarRef.current.getBoundingClientRect();
    setSidebarWidth(clampSidebarWidth(event.clientX - left));
  }

  function handleSidebarResizePointerUp(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    isDraggingSidebarRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsResizingSidebar(false);
  }

  function handleSidebarResizePointerCancel() {
    isDraggingSidebarRef.current = false;
    setIsResizingSidebar(false);
  }

  function handleSidebarResizeKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = sidebarWidth ?? SIDEBAR_DEFAULT_WIDTH;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setSidebarWidth(clampSidebarWidth(current - SIDEBAR_RESIZE_STEP));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setSidebarWidth(clampSidebarWidth(current + SIDEBAR_RESIZE_STEP));
    }
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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setMessages(requestMessages);
    setDraft("");
    setErrorMessage(null);
    setMode("thinking");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          // Primed as ordinary conversation turns, not a "system" message —
          // this model doesn't reliably follow persona instructions given
          // via the system role, and using it would also risk colliding
          // with whatever internal system prompt the backend already
          // applies. See modes/AGENTS.md ("prompt.ts is additive").
          messages: [
            { role: "user", content: currentMode.prompt },
            {
              role: "assistant",
              content: "Got it — staying in character from here on.",
            },
            ...requestMessages.map(({ role, content: messageContent }) => ({
              role,
              content: messageContent,
            })),
          ],
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

      const appendAssistantDelta = (delta: string) => {
        if (!delta) {
          return;
        }

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantId
              ? { ...message, content: `${message.content}${delta}` }
              : message,
          ),
        );
      };

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

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        appendAssistantDelta(decoder.decode(value, { stream: true }));
      }

      appendAssistantDelta(decoder.decode());
    } catch {
      if (controller.signal.aborted) {
        return;
      }
      setErrorMessage(copy.requestFailed);
      setMode("error");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
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
    <main className={styles.page} style={themeStyle(currentMode.theme)}>
      <aside
        id="joey-sidebar"
        ref={sidebarRef}
        className={`${styles.sidebar} ${
          isResizingSidebar ? styles.sidebarNoTransition : ""
        } ${sidebarCollapsed ? styles.sidebarCollapsed : ""}`}
        aria-label="Joey LLM"
        style={
          sidebarCollapsed
            ? { width: SIDEBAR_COLLAPSED_WIDTH, flexBasis: SIDEBAR_COLLAPSED_WIDTH }
            : sidebarWidth !== null
              ? { width: sidebarWidth, flexBasis: sidebarWidth }
              : undefined
        }
      >
        <button
          type="button"
          className={styles.sidebarToggle}
          onClick={toggleSidebarCollapsed}
          aria-expanded={!sidebarCollapsed}
          aria-controls="joey-sidebar"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={24} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={24} aria-hidden="true" />
          )}
        </button>
        <div
          className={`${styles.identity} ${
            sidebarCollapsed ? styles.identityCollapsed : ""
          }`}
        >
          <currentMode.icon
            className={styles.mark}
            width={sidebarCollapsed ? 34 : 42}
            height={sidebarCollapsed ? 34 : 42}
            aria-hidden="true"
          />
          {sidebarCollapsed ? null : (
            <JoeyWordmark className={styles.productName} width={81} height={24} />
          )}
        </div>
        {sidebarCollapsed ? null : (
          <p className={styles.sessionNotice}>{copy.sessionNotice}</p>
        )}
        {sidebarCollapsed ? null : (
          <button
            type="button"
            className={styles.newChatButton}
            onClick={handleNewChat}
          >
            <Plus size={16} aria-hidden="true" />
            {copy.newChat}
          </button>
        )}
        {sidebarCollapsed ? null : (
          <>
            <p className={styles.sectionLabel}>{copy.joeyModesHeading}</p>
            <p className={styles.sectionSubtext}>{copy.joeyModesSubtext}</p>
          </>
        )}
        {sidebarCollapsed ? null : (
          <ul className={styles.modeList}>
            {modes.map((candidate) => (
              <li key={candidate.id}>
                <button
                  type="button"
                  className={`${styles.modeButton} ${
                    candidate.id === selectedModeId ? styles.modeButtonActive : ""
                  }`}
                  onClick={() => handleSelectMode(candidate.id)}
                  aria-pressed={candidate.id === selectedModeId}
                >
                  <candidate.icon
                    className={styles.modeButtonIcon}
                    width={20}
                    height={20}
                    aria-hidden="true"
                  />
                  {candidate.switcherLabel ?? candidate.name}
                  {candidate.id === defaultMode.id ? " (default)" : ""}
                  <span className={styles.modeTooltip} role="tooltip">
                    {candidate.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {sidebarCollapsed ? null : (
          <div
            className={styles.sidebarResizeHandle}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar width"
            aria-valuenow={sidebarWidth ?? SIDEBAR_DEFAULT_WIDTH}
            aria-valuemin={SIDEBAR_MIN_WIDTH}
            aria-valuemax={SIDEBAR_MAX_WIDTH}
            tabIndex={0}
            onPointerDown={handleSidebarResizePointerDown}
            onPointerMove={handleSidebarResizePointerMove}
            onPointerUp={handleSidebarResizePointerUp}
            onPointerCancel={handleSidebarResizePointerCancel}
            onLostPointerCapture={handleSidebarResizePointerCancel}
            onKeyDown={handleSidebarResizeKeyDown}
          />
        )}
      </aside>
      <section className={styles.chatShell} aria-label={copy.chatAriaLabel}>
        <header className={styles.header}>
          <div className={styles.mobileHeaderIdentity}>
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={toggleSidebarCollapsed}
              aria-expanded={!sidebarCollapsed}
              aria-controls="joey-sidebar"
              aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={22} aria-hidden="true" />
              ) : (
                <PanelLeftClose size={22} aria-hidden="true" />
              )}
            </button>
            <JoeyWordmark
              className={styles.mobileHeaderWordmark}
              width={72}
              height={22}
            />
          </div>
          <div className={styles.headerActions}>
            <span
              className={`${styles.status} ${
                mode === "error" ? styles.errorStatus : ""
              }`}
              data-mode={mode}
              aria-live="polite"
            >
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.statusText}>{statusCopy}</span>
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
              <div
                className={styles.introRow}
                style={
                  currentMode.introOffset
                    ? {
                        transform: `translate(${currentMode.introOffset.x}px, ${currentMode.introOffset.y}px)`,
                      }
                    : undefined
                }
              >
                <currentMode.mascot />
                <div className={styles.speechBubble}>
                  <p>{currentMode.welcomeIntro}</p>
                </div>
              </div>
              <h1>{currentMode.welcomeTitle}</h1>
              <p>{copy.welcomeDescription}</p>
            </div>
          ) : (
            <ol className={styles.messageList}>
              {messages.map((message) =>
                message.role === "assistant" ? (
                  <li className={`${styles.messageRow} ${styles.assistantRow}`} key={message.id}>
                    <div className={styles.assistantMessage}>
                      <p className={styles.assistantLabel}>
                        <currentMode.icon
                          className={styles.assistantAvatar}
                          width={25}
                          height={25}
                          aria-hidden="true"
                        />
                        {currentMode.name}
                      </p>
                      <div className={`${styles.messageContent} ${styles.markdown}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li className={`${styles.messageRow} ${styles.userRow}`} key={message.id}>
                    <p className={`${styles.message} ${styles.messageContent}`}>
                      {message.content}
                    </p>
                  </li>
                ),
              )}
              {mode === "thinking" ? (
                <li className={`${styles.messageRow} ${styles.assistantRow}`}>
                  <div className={`${styles.assistantMessage} ${styles.pendingMessage}`}>
                    <p className={styles.assistantLabel}>
                      <currentMode.icon
                        className={styles.assistantAvatar}
                        width={25}
                        height={25}
                        aria-hidden="true"
                      />
                      {currentMode.name}
                    </p>
                    <p className={styles.messageContent}>{copy.thinkingMessage}</p>
                  </div>
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
          <p className={styles.disclaimer}>
            {copy.disclaimerBuiltBy}{" "}
            <a
              className={styles.disclaimerLink}
              href="https://southerncross.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.disclaimerBuilder}
            </a>{" "}
            · {currentMode.disclaimer}
          </p>
        </footer>
      </section>
    </main>
  );
}
