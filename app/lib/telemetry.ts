/**
 * Anonymous frontend context + session telemetry.
 *
 * Two jobs, both automatic and unobtrusive:
 *
 *  1. `frontendContext(mode)` — a snapshot of everything the browser already
 *     knows about this visit (ids, URL, referrer, UA / platform / locale /
 *     timezone, screen + viewport, connection, UTM…). `app/page.tsx` attaches
 *     it to every `/api/chat` body as `client`; JoeyBackend stores it on the
 *     `chat_interactions` row.
 *
 *  2. `trackEvent(type, detail?)` — lightweight UI events (page view, mode
 *     selection, chat start, message submit, response complete, error,
 *     downtime). Queued and flushed in small batches to `/api/telemetry`
 *     (which forwards to JoeyBackend `/events`) using `navigator.sendBeacon`
 *     where possible so it never blocks or delays anything on the page.
 *
 * Everything here is best-effort: no network call is awaited by the UI, and
 * every browser API access is guarded so server rendering and locked-down
 * privacy modes just no-op.
 */

const VISITOR_KEY = "joey_visitor_id";
const SESSION_KEY = "joey_session_id";
const TELEMETRY_ENDPOINT = "/api/telemetry";
const FLUSH_DELAY_MS = 2_000;
const MAX_QUEUE = 20;

export type JoeyEventType =
  | "page_view"
  | "mode_select"
  | "chat_start"
  | "message_submit"
  | "response_complete"
  | "error"
  | "downtime";

type QueuedEvent = {
  type: JoeyEventType;
  ts: string;
  visitorId?: string;
  sessionId?: string;
  url?: string;
  path?: string;
  mode?: string;
  interactionId?: string;
  detail?: Record<string, unknown>;
};

const isBrowser = typeof window !== "undefined";

let queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenersBound = false;
/** Last interaction id seen from a `/api/chat` response, attached to later
 *  events (e.g. `response_complete`, `error`) when the caller doesn't pass one. */
let lastInteractionId: string | undefined;

function randomByte(): number {
  try {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      return crypto.getRandomValues(new Uint8Array(1))[0];
    }
  } catch {
    /* fall through */
  }
  return Math.floor(Math.random() * 256);
}

function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  // RFC-4122 v4 fallback for old / non-secure-context browsers.
  const bytes = Array.from({ length: 16 }, randomByte);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0"));
  return (
    hex.slice(0, 4).join("") +
    "-" +
    hex.slice(4, 6).join("") +
    "-" +
    hex.slice(6, 8).join("") +
    "-" +
    hex.slice(8, 10).join("") +
    "-" +
    hex.slice(10, 16).join("")
  );
}

function readStored(store: Storage | undefined, key: string): string | undefined {
  try {
    return store?.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
}

function writeStored(store: Storage | undefined, key: string, value: string) {
  try {
    store?.setItem(key, value);
  } catch {
    /* private mode / storage disabled — ids just won't persist */
  }
}

/** Persistent anonymous visitor id (localStorage). Stable across visits. */
export function visitorId(): string | undefined {
  if (!isBrowser) return undefined;
  let id = readStored(window.localStorage, VISITOR_KEY);
  if (!id) {
    id = uuid();
    writeStored(window.localStorage, VISITOR_KEY, id);
  }
  return id;
}

/** Per-visit session id (sessionStorage). New for each tab/visit. */
export function sessionId(): string | undefined {
  if (!isBrowser) return undefined;
  let id = readStored(window.sessionStorage, SESSION_KEY);
  if (!id) {
    id = uuid();
    writeStored(window.sessionStorage, SESSION_KEY, id);
  }
  return id;
}

/** Remember the interaction id from a `/api/chat` response. */
export function setLastInteractionId(id: string | null | undefined) {
  lastInteractionId = id ?? undefined;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
  "msclkid",
  "ref",
];

function campaignParams(search: string): Record<string, string> | undefined {
  try {
    const params = new URLSearchParams(search);
    const out: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) out[key] = value.slice(0, 256);
    }
    return Object.keys(out).length ? out : undefined;
  } catch {
    return undefined;
  }
}

type NavigatorConnectionLike = {
  effectiveType?: string;
  type?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
};

type NavigatorUADataLike = {
  brands?: { brand: string; version: string }[];
  mobile?: boolean;
  platform?: string;
};

/**
 * Everything the browser already exposes about this visit. Sent as the
 * `client` object on each `/api/chat` request. Missing / unavailable pieces
 * are simply omitted.
 */
export function frontendContext(mode?: string): Record<string, unknown> {
  const base: Record<string, unknown> = {
    visitorId: visitorId(),
    sessionId: sessionId(),
    clientTime: new Date().toISOString(),
  };
  if (mode) base.mode = mode;
  if (!isBrowser) return base;

  try {
    const { location, screen, navigator } = window;

    base.url = location.href;
    base.origin = location.origin;
    base.hostname = location.hostname;
    base.path = location.pathname;
    base.query = location.search || undefined;
    base.hash = location.hash || undefined;
    base.referrer = document.referrer || undefined;
    base.title = document.title || undefined;

    base.userAgent = navigator.userAgent;
    const uaData = (navigator as Navigator & { userAgentData?: NavigatorUADataLike })
      .userAgentData;
    if (uaData) {
      base.uaBrands = uaData.brands;
      base.uaMobile = uaData.mobile;
      base.uaPlatform = uaData.platform;
    }
    base.platform =
      uaData?.platform ||
      (navigator as Navigator & { platform?: string }).platform ||
      undefined;
    base.vendor = (navigator as Navigator & { vendor?: string }).vendor || undefined;
    base.deviceMemory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? undefined;
    base.hardwareConcurrency = navigator.hardwareConcurrency ?? undefined;

    base.language = navigator.language;
    base.languages = navigator.languages;
    try {
      const resolved = Intl.DateTimeFormat().resolvedOptions();
      base.timezone = resolved.timeZone;
      base.locale = resolved.locale;
    } catch {
      /* Intl unavailable */
    }
    base.timezoneOffsetMinutes = new Date().getTimezoneOffset();

    base.screen = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      orientation: screen.orientation?.type,
    };
    base.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    base.devicePixelRatio = window.devicePixelRatio;

    const maxTouchPoints = navigator.maxTouchPoints ?? 0;
    base.touch = "ontouchstart" in window || maxTouchPoints > 0;
    base.maxTouchPoints = maxTouchPoints;

    const connection = (
      navigator as Navigator & { connection?: NavigatorConnectionLike }
    ).connection;
    if (connection) {
      base.connection = {
        effectiveType: connection.effectiveType,
        type: connection.type,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }

    base.online = navigator.onLine;
    base.cookiesEnabled = navigator.cookieEnabled;

    const campaign = campaignParams(location.search);
    if (campaign) base.campaign = campaign;
  } catch {
    /* keep whatever we managed to gather */
  }

  return base;
}

function bindLifecycleListeners() {
  if (listenersBound || !isBrowser) return;
  listenersBound = true;
  const flushNow = () => flush(true);
  window.addEventListener("pagehide", flushNow);
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNow();
  });
}

function scheduleFlush() {
  if (flushTimer || !isBrowser) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush(false);
  }, FLUSH_DELAY_MS);
}

function flush(useBeacon: boolean) {
  if (!isBrowser || queue.length === 0) return;
  const events = queue;
  queue = [];
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const payload = JSON.stringify({ events });

  try {
    if (
      useBeacon &&
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      const ok = navigator.sendBeacon(
        TELEMETRY_ENDPOINT,
        new Blob([payload], { type: "application/json" }),
      );
      if (ok) return;
    }
  } catch {
    /* fall through to fetch */
  }

  try {
    void fetch(TELEMETRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      cache: "no-store",
    }).catch(() => {
      /* best-effort: drop on failure */
    });
  } catch {
    /* best-effort */
  }
}

/**
 * Queue a UI event. Automatically stamps visitor id, session id, timestamp,
 * page URL/path and — when known — the current chat interaction id.
 */
export function trackEvent(
  type: JoeyEventType,
  detail?: Record<string, unknown>,
) {
  if (!isBrowser) return;

  const { interactionId, mode, ...rest } = detail ?? {};
  const event: QueuedEvent = {
    type,
    ts: new Date().toISOString(),
    visitorId: visitorId(),
    sessionId: sessionId(),
    url: window.location.href,
    path: window.location.pathname,
    mode: typeof mode === "string" ? mode : undefined,
    interactionId:
      (typeof interactionId === "string" && interactionId) || lastInteractionId,
    detail: Object.keys(rest).length ? rest : undefined,
  };

  queue.push(event);
  bindLifecycleListeners();

  if (queue.length >= MAX_QUEUE) {
    flush(false);
  } else {
    scheduleFlush();
  }
}

/**
 * Call once on first client render. Ensures the ids exist, wires the
 * page-hide flush, and records the initial page view.
 */
export function initTelemetry(mode?: string) {
  if (!isBrowser) return;
  visitorId();
  sessionId();
  bindLifecycleListeners();
  trackEvent("page_view", mode ? { mode } : undefined);
}
