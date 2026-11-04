"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Category, SortedMail } from "@/lib/categorize";
import { LANGS, fill, langInfo, strings } from "@/lib/i18n";
import { syncStrings } from "@/lib/i18n-sync";
import { selectStrings } from "@/lib/i18n-select";
import { notifyStrings } from "@/lib/i18n-notify";
import { composeStrings } from "@/lib/i18n-compose";
import { DEFAULT_SETTINGS, SETTINGS_KEY, type NotifySettings, playAlert, playTap, unlock, vibrate } from "@/lib/sounds";
import CategoryArt from "./CategoryArt";
import NotifyPanel from "./NotifyPanel";

const TABS: { id: Category | "inbox"; icon: string }[] = [
  { id: "inbox", icon: "📥" },
  { id: "transport", icon: "🚌" },
  { id: "timetable", icon: "📅" },
  { id: "exams", icon: "📝" },
  { id: "assignments", icon: "📚" },
  { id: "opportunities", icon: "💡" },
  { id: "campus", icon: "🎉" },
  { id: "review", icon: "🔎" },
  { id: "other", icon: "📦" },
];

const REFRESH_MS = 2 * 60 * 60 * 1000; // every 2 hours
const BLOCK_KEY = "blockedSenders";
const LANG_KEY = "lang";
const LAYOUT_KEY = "tabLayout";
type TabLayout = "side" | "top";
const HISTORY_KEY = "syncHistory";
const HISTORY_MAX = 30;
const CHECK_MS = 60 * 1000; // new-mail check every minute
type SyncTrigger = "open" | "auto" | "manual" | "newMail";
type SyncEntry = { at: number; trigger: SyncTrigger; total: number; fresh: number; ok: boolean };
type Toast = { kind: "sync" | "trash" | "trashFailed"; n: number; key: number };
const CREATOR = { name: "NITHILAN S", email: "nithilan.s2026@vitstudent.ac.in" };

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

type Translated = { subject: string; snippet: string };
type Reader = {
  mail: SortedMail;
  loading: boolean;
  body?: string;
  translation?: { subject: string; body: string };
  translateError?: string;
  error?: string;
  showOriginal: boolean;
};

function LanguagePicker({ lang, onChange, label }: { lang: string; onChange: (l: string) => void; label: string }) {
  return (
    <label className="lang-picker">
      <span aria-hidden>🌐</span>
      <select aria-label={label} value={lang} onChange={(e) => onChange(e.target.value)}>
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.name}</option>
        ))}
      </select>
    </label>
  );
}

// ☀️/🌙 switch. Follows the device until clicked, then remembers the choice (read again in layout.tsx before paint).
function ThemeToggle({ label }: { label: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === "light" || saved === "dark") return setTheme(saved);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(media.matches ? "dark" : "light");
    const follow = (e: MediaQueryListEvent) => {
      if (!document.documentElement.dataset.theme) setTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-anim"), 500);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <span key={theme ?? "none"} aria-hidden>{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
}

// Two-button switch: category tabs down the left side, or across the top.
function LayoutToggle({ value, onChange, labels }: { value: TabLayout; onChange: (v: TabLayout) => void; labels: { side: string; top: string } }) {
  return (
    <div className="layout-toggle" role="radiogroup">
      {(["side", "top"] as const).map((v) => (
        <button
          key={v}
          role="radio"
          aria-checked={value === v}
          aria-label={labels[v]}
          title={labels[v]}
          className={value === v ? "active" : ""}
          onClick={() => onChange(v)}
        >
          <svg viewBox="0 0 20 16" aria-hidden>
            {v === "side" ? (
              <>
                <rect x="1" y="1" width="5" height="14" rx="1.5" />
                <rect x="8" y="1" width="11" height="3" rx="1.5" opacity="0.45" />
                <rect x="8" y="6.5" width="11" height="3" rx="1.5" opacity="0.45" />
                <rect x="8" y="12" width="11" height="3" rx="1.5" opacity="0.45" />
              </>
            ) : (
              <>
                <rect x="1" y="1" width="18" height="4" rx="1.5" />
                <rect x="1" y="7" width="18" height="3" rx="1.5" opacity="0.45" />
                <rect x="1" y="12" width="18" height="3" rx="1.5" opacity="0.45" />
              </>
            )}
          </svg>
        </button>
      ))}
    </div>
  );
}

function CreatedBy({ label }: { label: string }) {
  return (
    <footer className="created-by reveal">
      <span className="rule" aria-hidden />
      <span>
        {label.toUpperCase()}: <strong>{CREATOR.name}</strong> ·{" "}
        <a href={`mailto:${CREATOR.email}`}>{CREATOR.email}</a>
      </span>
    </footer>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const [mails, setMails] = useState<SortedMail[]>([]);
  const [tab, setTab] = useState<Category | "inbox">("inbox");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState<Record<string, Translated>>({});
  const [translateState, setTranslateState] = useState<"idle" | "busy" | "NO_KEY" | "FAILED">("idle");
  const [reader, setReader] = useState<Reader | null>(null);
  const [tabLayout, setTabLayout] = useState<TabLayout>("side");
  const [history, setHistory] = useState<SyncEntry[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<Toast | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [trashing, setTrashing] = useState(false);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [notify, setNotify] = useState<NotifySettings>(DEFAULT_SETTINGS);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [pull, setPull] = useState(0); // pull-to-refresh distance in px
  const [showTop, setShowTop] = useState(false);
  const [compose, setCompose] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const touchRef = useRef({ y: 0, active: false });
  const notifyRef = useRef(notify);
  notifyRef.current = notify;
  const busyRef = useRef(false);
  const seenRef = useRef<Set<string> | null>(null);
  const checkedRef = useRef<Set<string>>(new Set());
  const translatingRef = useRef(false);

  const t = strings(lang);
  const ts = syncStrings(lang);
  const tx = selectStrings(lang);
  const tn = notifyStrings(lang);
  const tc = composeStrings(lang);
  const locale = langInfo(lang).locale;

  useEffect(() => {
    setBlocked(read<string[]>(BLOCK_KEY, []));
    setLang(read(LANG_KEY, "en"));
    setTabLayout(read<TabLayout>(LAYOUT_KEY, "side") === "top" ? "top" : "side");
    setHistory(read<SyncEntry[]>(HISTORY_KEY, []));
    setNotify({ ...DEFAULT_SETTINGS, ...read<Partial<NotifySettings>>(SETTINGS_KEY, {}) });
  }, []);

  const changeNotify = (next: NotifySettings) => {
    setNotify(next);
    write(SETTINGS_KEY, next);
  };

  // Phone-app plumbing: service worker (installable + notification taps) and the "Install app" prompt.
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onInstalled = () => setInstallPrompt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Every tap: unlock audio, soft tick + tiny vibration (if enabled), and a ripple on buttons.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      unlock();
      const el = (e.target as HTMLElement).closest<HTMLElement>("button, a, select, label, .mail-main");
      if (!el || (el as HTMLButtonElement).disabled) return;
      if (notifyRef.current.tapSounds) {
        playTap();
        vibrate(8);
      }
      if (el.matches("button:not(.side-link):not(.mail-main):not(.link)")) {
        const r = el.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(r.width, r.height) * 2;
        ripple.className = "ripple";
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
        el.classList.add("ripple-host");
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // Scroll effects: progress bar + parallax (via a CSS variable) and the back-to-top button.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        document.documentElement.style.setProperty("--scroll", String(scrollY));
        document.documentElement.style.setProperty("--scroll-progress", String(max > 0 ? scrollY / max : 0));
        setShowTop(scrollY > 500);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLayout = (v: TabLayout) => {
    setTabLayout(v);
    write(LAYOUT_KEY, v);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    // Arabic, Urdu and Hebrew read right-to-left; the layout mirrors via logical CSS properties.
    document.documentElement.dir = langInfo(lang).dir ?? "ltr";
  }, [lang]);

  const changeLang = (l: string) => {
    setLang(l);
    write(LANG_KEY, l);
    setTranslateState("idle");
  };

  // New mail: loud sound + strong vibration, and a phone/system notification when the app isn't on screen.
  const alertTextRef = useRef({ title: "", count: "" });
  alertTextRef.current = { title: ts.trigger.newMail, count: ts.newCount };
  const alertNewMail = (fresh: SortedMail[]) => {
    const settings = notifyRef.current;
    if (!settings.enabled) return;
    playAlert(settings);
    if (settings.sound !== "silent") vibrate([400, 120, 400, 120, 800]);
    if (!("Notification" in window) || Notification.permission !== "granted" || !document.hidden) return;
    const { title, count } = alertTextRef.current;
    navigator.serviceWorker?.ready
      .then((reg) =>
        reg.showNotification(`📬 ${title} · ${fill(count, { n: fresh.length })}`, {
          body: fresh.slice(0, 3).map((m) => `${m.from}: ${m.subject}`).join("\n"),
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          tag: "new-mail",
          silent: settings.sound === "silent",
        } as NotificationOptions),
      )
      .catch(() => {});
  };

  const record = (entry: SyncEntry) =>
    setHistory((h) => {
      const next = [entry, ...h].slice(0, HISTORY_MAX);
      write(HISTORY_KEY, next);
      return next;
    });

  // One sync: fetch + sort the inbox, mark mails we hadn't seen before as NEW, and log it in the history.
  const load = useCallback(async (trigger: SyncTrigger) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: read<string[]>(BLOCK_KEY, []) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const incoming: SortedMail[] = data.mails;
      const firstLoad = seenRef.current === null;
      const fresh = firstLoad ? [] : incoming.filter((m) => !seenRef.current!.has(m.id));
      seenRef.current = new Set([...(seenRef.current ?? []), ...incoming.map((m) => m.id)]);
      setMails(incoming);
      if (fresh.length) setNewIds((s) => new Set([...s, ...fresh.map((m) => m.id)]));
      setUpdatedAt(new Date());
      record({ at: Date.now(), trigger, total: incoming.length, fresh: fresh.length, ok: true });
      if (!firstLoad && (fresh.length || trigger === "manual")) setToast({ kind: "sync", n: fresh.length, key: Date.now() });
      if (!firstLoad && fresh.length) alertNewMail(fresh);
    } catch (e: any) {
      setError(e.message);
      record({ at: Date.now(), trigger, total: 0, fresh: 0, ok: false });
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, []);

  // Full sync on open and every 2 hours; a cheap new-mail check every minute (and when you come back to the tab).
  useEffect(() => {
    if (status !== "authenticated") return;
    load("open");
    const full = setInterval(() => load("auto"), REFRESH_MS);

    const check = async () => {
      if (document.hidden || busyRef.current || !seenRef.current) return;
      try {
        const res = await fetch("/api/mail-check");
        if (!res.ok) return;
        const { ids } = (await res.json()) as { ids: string[] };
        const firstSeen = ids.findIndex((id) => seenRef.current!.has(id));
        const newer = firstSeen === -1 ? ids : ids.slice(0, firstSeen);
        if (newer.some((id) => !checkedRef.current.has(id))) load("newMail");
        ids.forEach((id) => checkedRef.current.add(id));
      } catch {}
    };
    const watcher = setInterval(check, CHECK_MS);
    const onVisible = () => !document.hidden && check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(full);
      clearInterval(watcher);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status, load]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Translate subjects and previews for any mails not yet translated into the chosen language.
  useEffect(() => {
    if (lang === "en" || mails.length === 0) return;
    const missing = mails.filter((m) => !translations[`${lang}:${m.id}`]);
    if (missing.length === 0 || translatingRef.current) return;

    translatingRef.current = true;
    setTranslateState("busy");

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang, items: missing.map((m) => ({ id: m.id, subject: m.subject, snippet: m.snippet })) }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "FAILED");
        setTranslations((prev) => {
          const next = { ...prev };
          for (const item of (data.items || [])) {
            next[`${lang}:${item.id}`] = { subject: item.subject, snippet: item.snippet };
          }
          for (const m of missing) {
            next[`${lang}:${m.id}`] ??= { subject: m.subject, snippet: m.snippet };
          }
          return next;
        });
        setTranslateState("idle");
      })
      .catch((e) => {
        setTranslateState(e.message === "NO_KEY" ? "NO_KEY" : "FAILED");
      })
      .finally(() => {
        translatingRef.current = false;
      });
  }, [lang, mails, translations]);

  const openReader = async (mail: SortedMail) => {
    setReader({ mail, loading: true, showOriginal: false });
    try {
      const params = new URLSearchParams({ lang, subject: mail.subject });
      const res = await fetch(`/api/mail/${mail.id}?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReader((r) => r && { ...r, loading: false, body: data.body, translation: data.translation, translateError: data.translateError });
    } catch (e: any) {
      setReader((r) => r && { ...r, loading: false, error: e.message });
    }
  };

  const notImportant = (mail: SortedMail) => {
    const next = Array.from(new Set([...blocked, mail.fromEmail]));
    setBlocked(next);
    write(BLOCK_KEY, next);
    setMails((ms) => ms.filter((m) => m.fromEmail !== mail.fromEmail));
  };

  const markImportant = (mail: SortedMail, category: Category) =>
    setMails((ms) => ms.map((m) => (m.id === mail.id ? { ...m, category } : m)));

  const shownText = (m: SortedMail): Translated =>
    (lang !== "en" && translations[`${lang}:${m.id}`]) || { subject: m.subject, snippet: m.snippet };

  const daysLeft = (deadline: string) => {
    const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
    if (Number.isNaN(d) || d < 0) return null;
    return d === 0 ? t.today : fill(t.daysLeft, { n: d });
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

  const counts = useMemo(() => {
    const c: Record<string, number> = { inbox: mails.length };
    for (const m of mails) c[m.category] = (c[m.category] ?? 0) + 1;
    return c;
  }, [mails]);

  const deadlines = useMemo(
    () =>
      mails
        .filter((m) => m.deadline && daysLeft(m.deadline) !== null)
        .sort((a, b) => a.deadline!.localeCompare(b.deadline!))
        .slice(0, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mails],
  );

  // Scroll reveal: anything with .reveal fades and slides in the first time it scrolls into view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (els.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  if (status === "loading") return <main className="center muted">{t.loading}</main>;

  if (!session) {
    return (
      <main className="landing">
        <span className="shape blob-blue" aria-hidden />
        <span className="shape blob-pink" aria-hidden />
        <span className="shape ring ring-1" aria-hidden />
        <span className="shape ring ring-2" aria-hidden />

        <nav className="topnav">
          <div className="logo envelope" aria-label="MAIL SORTED">✉</div>
          <span className="rule" aria-hidden />
          <div className="topnav-links">
            <span>{t.navTransport}</span>
            <span>{t.navTimetable}</span>
            <span>{t.navEvents}</span>
          </div>
          <LanguagePicker lang={lang} onChange={changeLang} label={t.language} />
          <ThemeToggle label={t.toggleTheme} />
        </nav>

        <section className="hero">
          <div className="hero-title-row">
            <h1 className="hero-title">{t.heroTitle}</h1>
            <img
              src="/icons/icon-192.png"
              alt="MAIL SORTED"
              className="hero-logo"
              width={84}
              height={84}
            />
          </div>
          <div className="hero-sub">
            <span className="rule" aria-hidden />
            <h2>
              {t.heroSub1}
              <br />
              {t.heroSub2}
            </h2>
          </div>
          <p className="hero-copy">{t.heroCopy}</p>
          <button className="btn-primary" onClick={() => signIn("google")}>{t.signIn}</button>
          <div className="dots" aria-hidden>
            <i className="blue" />
            <i className="pink" />
            <i className="ink" />
          </div>
          <CreatedBy label={t.createdBy} />
        </section>
      </main>
    );
  }

  const shown = tab === "inbox" ? mails : mails.filter((m) => m.category === tab);
  const sortedShown = tab === "exams" || tab === "assignments"
    ? [...shown].sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"))
    : tab === "inbox"
    ? [...shown].sort((a, b) => b.date.localeCompare(a.date))
    : shown;

  const activeTab = TABS.find((tb) => tb.id === tab)!;
  const artCategory: Category = tab === "inbox" ? "other" : tab;

  // Select mode: only mails visible in the current view can be selected and trashed.
  const selectedHere = sortedShown.filter((m) => selected.has(m.id)).map((m) => m.id);
  const allSelected = sortedShown.length > 0 && selectedHere.length === sortedShown.length;
  const toggleSelect = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const exitSelect = () => {
    setSelecting(false);
    setSelected(new Set());
  };
  const trashSelected = async () => {
    const ids = selectedHere;
    if (ids.length === 0 || !window.confirm(fill(tx.confirmTrash, { n: ids.length }))) return;
    setTrashing(true);
    try {
      const res = await fetch("/api/mail-trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "SCOPE") {
        setNeedsReauth(true);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      const gone = new Set<string>(data.trashed);
      setMails((ms) => ms.filter((m) => !gone.has(m.id)));
      setSelected((s) => new Set([...s].filter((id) => !gone.has(id))));
      setToast(data.failed.length ? { kind: "trashFailed", n: data.failed.length, key: Date.now() } : { kind: "trash", n: gone.size, key: Date.now() });
      if (!data.failed.length) setSelecting(false);
    } catch {
      setToast({ kind: "trashFailed", n: ids.length, key: Date.now() });
    } finally {
      setTrashing(false);
    }
  };

  // Pull down from the very top on a phone to sync.
  const touchStart = touchRef.current;
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.active = window.scrollY <= 0 && !reader && !compose;
    touchStart.y = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.active) return;
    const dy = e.touches[0].clientY - touchStart.y;
    setPull(dy > 0 ? Math.min(dy * 0.5, 110) : 0);
  };
  const onTouchEnd = () => {
    if (pull > 70) {
      vibrate(20);
      load("manual");
    }
    setPull(0);
    touchStart.active = false;
  };

  return (
    <div className="shell" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="scroll-progress" aria-hidden />
      <div
        className={`pull-indicator${pull > 70 ? " ready" : ""}${loading ? " loading" : ""}`}
        style={{ transform: `translate(-50%, ${pull - 50}px) rotate(${pull * 3}deg)`, opacity: pull > 5 || loading ? 1 : 0 }}
        aria-hidden
      >
        ⟳
      </div>
      <main className={`panel layout-${tabLayout}`}>
        <aside className="side" key={tabLayout}>
          <div className="logo badge">
            <span className="envelope-glyph" aria-label="MAIL SORTED">✉</span>
            <i aria-hidden />
          </div>

          {/* Mobile APK orientation switcher: switch between Horizontal (top) and Vertical (side) tabs */}
          <div className="mobile-orientation-toggle" aria-label={tc.orientation}>
            <button
              type="button"
              className={tabLayout === "top" ? "active" : ""}
              onClick={() => changeLayout("top")}
              title={tc.horizontal}
              aria-label={tc.horizontal}
            >
              ↔ {tc.horizontal}
            </button>
            <button
              type="button"
              className={tabLayout === "side" ? "active" : ""}
              onClick={() => changeLayout("side")}
              title={tc.vertical}
              aria-label={tc.vertical}
            >
              ↕ {tc.vertical}
            </button>
          </div>

          <nav className="side-nav">
            {TABS.map((tb, i) => (
              <button
                key={tb.id}
                className={tb.id === tab ? "side-link active" : "side-link"}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => {
                  setTab(tb.id);
                  setSelected(new Set()); // never carry a hidden selection into another category
                }}
              >
                <span className="side-icon" aria-hidden>{tb.icon}</span>
                <span className="side-label">{tb.id === "inbox" ? t.inbox : t.tabs[tb.id]}</span>
                <span className="side-count">{counts[tb.id] ?? 0}</span>
              </button>
            ))}
          </nav>
          <span className="side-bar" aria-hidden />
        </aside>

        <section className="content">
          <header className="content-top">
            <span className="muted small">
              {loading ? t.refreshing : updatedAt ? fill(t.updated, { time: updatedAt.toLocaleTimeString(locale) }) : ""}
            </span>

            {/* Plus button to compose & send emails */}
            <button
              className="compose-btn"
              onClick={() => { setCompose(true); setSendError(null); setSendSuccess(false); }}
              aria-label={tc.compose}
              title={tc.compose}
            >
              <span className="plus-sign" aria-hidden>＋</span> {tc.compose}
            </button>

            <LanguagePicker lang={lang} onChange={changeLang} label={t.language} />
            <LayoutToggle value={tabLayout} onChange={changeLayout} labels={{ side: t.tabsSide, top: t.tabsTop }} />
            <ThemeToggle label={t.toggleTheme} />
            <NotifyPanel settings={notify} onChange={changeNotify} s={tn} />
            {installPrompt && (
              <button
                className="install-btn"
                onClick={async () => {
                  installPrompt.prompt();
                  await installPrompt.userChoice.catch(() => null);
                  setInstallPrompt(null);
                }}
              >
                ⬇ {tn.installApp}
              </button>
            )}
            <button className={loading ? "sync-btn spinning" : "sync-btn"} onClick={() => load("manual")} disabled={loading}>
              <span className="sync-icon" aria-hidden>⟳</span> {loading ? ts.syncing : ts.sync}
            </button>
            <button onClick={() => signOut()}>{t.signOut}</button>
            <span className="burger" aria-hidden />
          </header>

          <div className="hero-row">
            <div className="hero-left" key={tab}>
              <h1 className="cat-title">{tab === "inbox" ? t.inbox : t.tabs[tab]}</h1>
              <div className="dots" aria-hidden>
                <i className="blue" />
                <i className="pink" />
                <i className="green" />
              </div>
              <p className="cat-desc">
                {fill(t.mailsCount, { n: sortedShown.length })} · {tab === "inbox" ? t.inbox : t.inbox}
              </p>
            </div>
            <div className="swirl-tile">
              <CategoryArt category={artCategory} />
              {deadlines.length > 0 && (
                <div className="tile-deadlines">
                  <h2>⏰ {t.deadlines}</h2>
                  <ul>
                    {deadlines.slice(0, 3).map((m) => (
                      <li key={m.id}>
                        <button className="link" onClick={() => openReader(m)}>{shownText(m).subject}</button>
                        <span className="tile-pill">{daysLeft(m.deadline!)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {lang !== "en" && translateState === "busy" && <p className="notice">{t.translating}</p>}
          {lang !== "en" && translateState === "NO_KEY" && <p className="notice">{t.needsKey}</p>}
          {lang !== "en" && translateState === "FAILED" && <p className="notice">{t.translateFailed}</p>}

          {needsReauth && (
            <p className="notice reauth">
              {tx.needsReauth} <button onClick={() => signIn("google")}>{tx.reauth}</button>
            </p>
          )}

          {sortedShown.length > 0 && (
            <div className={selecting ? "select-bar active" : "select-bar"}>
              {!selecting ? (
                <button className="ghost" onClick={() => setSelecting(true)}>☑ {tx.select}</button>
              ) : (
                <>
                  <button
                    className="ghost"
                    onClick={() => setSelected(allSelected ? new Set() : new Set(sortedShown.map((m) => m.id)))}
                  >
                    {allSelected ? tx.deselectAll : tx.selectAll}
                  </button>
                  <span className="select-count">{fill(tx.selectedCount, { n: selectedHere.length })}</span>
                  <button className="danger" onClick={trashSelected} disabled={selectedHere.length === 0 || trashing}>
                    🗑 {tx.moveToTrash}
                  </button>
                  <button className="ghost" onClick={exitSelect}>{tx.cancel}</button>
                </>
              )}
            </div>
          )}

          <ul className={selecting ? "mails selecting" : "mails"} key={tab}>
            {sortedShown.length === 0 && !loading && <li className="muted empty">{t.nothing}</li>}
            {sortedShown.map((m, i) => {
              const text = shownText(m);
              const isSelected = selected.has(m.id);
              return (
                <li
                  key={m.id}
                  className={`mail reveal cat-${m.category}${isSelected ? " selected" : ""}`}
                  style={{ "--i": Math.min(i, 6) } as React.CSSProperties}
                >
                  {selecting && (
                    <input
                      type="checkbox"
                      className="mail-check"
                      checked={isSelected}
                      onChange={() => toggleSelect(m.id)}
                      aria-label={text.subject}
                    />
                  )}
                  <button className="mail-main" onClick={() => (selecting ? toggleSelect(m.id) : openReader(m))}>
                    <div className="mail-top">
                      <strong>
                        {newIds.has(m.id) && <span className="new-badge">{ts.newBadge}</span>}
                        {m.from}
                      </strong>
                      <div className="mail-meta">
                        {tab === "inbox" && (
                          <span className="inbox-cat-badge">
                            {TABS.find((tb) => tb.id === m.category)?.icon} {t.tabs[m.category]}
                          </span>
                        )}
                        <span className="muted small">{formatDate(m.date)}</span>
                      </div>
                    </div>
                    <div className="subject">{text.subject}</div>
                    <div className="muted small snippet">{text.snippet}</div>
                    {m.deadline && <span className="pill">{fill(t.deadline, { date: formatDate(m.deadline) })}</span>}
                  </button>
                  <div className="actions">
                    {tab === "review" && (
                      <select defaultValue="" onChange={(e) => markImportant(m, e.target.value as Category)}>
                        <option value="" disabled>{t.moveTo}</option>
                        {TABS.filter((tb): tb is { id: Category; icon: string } => tb.id !== "review" && tb.id !== "inbox").map((tb) => (
                          <option key={tb.id} value={tb.id}>{t.tabs[tb.id]}</option>
                        ))}
                      </select>
                    )}
                    <button className="ghost" onClick={() => notImportant(m)} title={m.fromEmail}>
                      {t.notImportant}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {blocked.length > 0 && (
            <details className="blocked">
              <summary>{fill(t.hiddenSenders, { n: blocked.length })}</summary>
              <ul>
                {blocked.map((s) => (
                  <li key={s}>
                    {s}{" "}
                    <button
                      className="ghost"
                      onClick={() => {
                        const next = blocked.filter((b) => b !== s);
                        setBlocked(next);
                        write(BLOCK_KEY, next);
                      }}
                    >
                      {t.unhide}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {history.length > 0 && (
            <details className="sync-history">
              <summary>🕘 {ts.syncHistory} <span className="muted small">({history.length})</span></summary>
              <ol>
                {history.map((h) => (
                  <li key={h.at} className={h.ok ? "" : "failed"}>
                    <time dateTime={new Date(h.at).toISOString()}>
                      {new Date(h.at).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </time>
                    <span className={`trigger trigger-${h.trigger}`}>{ts.trigger[h.trigger]}</span>
                    <span className="result">
                      {!h.ok ? ts.syncFailed : h.fresh > 0 ? fill(ts.newCount, { n: h.fresh }) : ts.noNew}
                      {h.ok && <span className="muted"> · {fill(t.mailsCount, { n: h.total })}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <CreatedBy label={t.createdBy} />
        </section>
      </main>

      {/* Floating Action Plus Button for Composing / Sending Email */}
      <button
        className="compose-fab"
        onClick={() => { setCompose(true); setSendError(null); setSendSuccess(false); }}
        aria-label={tc.compose}
        title={tc.compose}
      >
        <span className="plus-icon" aria-hidden>＋</span>
      </button>

      {/* Back to top button */}
      <button
        className={`to-top${showTop ? " show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="↑"
        tabIndex={showTop ? 0 : -1}
      >
        ↑
      </button>

      {toast && (
        <div className="toast" key={toast.key} role="status" onClick={() => setToast(null)}>
          {toast.kind === "trash" ? <>🗑 {fill(tx.trashed, { n: toast.n })}</>
            : toast.kind === "trashFailed" ? <>⚠ {tx.trashFailed}</>
            : toast.n > 0 ? <>📬 {fill(ts.newCount, { n: toast.n })}</>
            : <>✓ {ts.noNew}</>}
        </div>
      )}

      {/* Mail Reader modal */}
      {reader && (
        <div className="reader-backdrop" onClick={() => setReader(null)}>
          <article className="reader" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
            <div className="reader-top">
              <div className="muted small">
                {reader.mail.from} · {formatDate(reader.mail.date)}
              </div>
              <button onClick={() => setReader(null)}>{t.close}</button>
            </div>
            <h2>{reader.translation && !reader.showOriginal ? reader.translation.subject : reader.mail.subject}</h2>
            {reader.loading && <p className="muted">{lang === "en" ? t.loading : t.translating}</p>}
            {reader.error && <p className="error">{reader.error}</p>}
            {reader.translateError && <p className="notice">{t.translateFailed}</p>}
            {reader.body !== undefined && (
              <div className="reader-body">
                {reader.translation && !reader.showOriginal ? reader.translation.body : reader.body}
              </div>
            )}
            <div className="reader-actions">
              {reader.translation && (
                <button className="ghost" onClick={() => setReader((r) => r && { ...r, showOriginal: !r.showOriginal })}>
                  {reader.showOriginal ? t.showTranslation : t.showOriginal}
                </button>
              )}
              <a className="btn-link" href={reader.mail.link} target="_blank" rel="noreferrer">{t.openGmail} ↗</a>
            </div>
          </article>
        </div>
      )}

      {/* Compose & Send Email modal */}
      {compose && (
        <div className="reader-backdrop" onClick={() => !sending && setCompose(false)}>
          <article className="compose-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
            <div className="reader-top">
              <h2><span className="plus-sign" aria-hidden>＋</span> {tc.compose}</h2>
              <button onClick={() => !sending && setCompose(false)}>{t.close}</button>
            </div>
            <form
              className="compose-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                setSending(true);
                setSendError(null);
                setSendSuccess(false);
                try {
                  const res = await fetch("/api/mail-send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      to: fd.get("to"),
                      subject: fd.get("subject"),
                      body: fd.get("body"),
                      cc: fd.get("cc") || undefined,
                      bcc: fd.get("bcc") || undefined,
                    }),
                  });
                  const data = await res.json();
                  if (res.status === 403 && data.error === "SCOPE") {
                    setNeedsReauth(true);
                    setSendError(tc.sendNeedsReauth);
                    return;
                  }
                  if (!res.ok) throw new Error(data.error);
                  setSendSuccess(true);
                  form.reset();
                  setTimeout(() => setCompose(false), 1500);
                } catch (err: any) {
                  setSendError(err.message || tc.sendFailed);
                } finally {
                  setSending(false);
                }
              }}
            >
              <label className="compose-field">
                <span>{tc.composeTo} *</span>
                <input name="to" type="email" required placeholder="recipient@example.com" autoFocus />
              </label>
              <div className="compose-row">
                <label className="compose-field">
                  <span>Cc</span>
                  <input name="cc" type="email" placeholder={tc.composeOptional} />
                </label>
                <label className="compose-field">
                  <span>Bcc</span>
                  <input name="bcc" type="email" placeholder={tc.composeOptional} />
                </label>
              </div>
              <label className="compose-field">
                <span>{tc.composeSubject}</span>
                <input name="subject" placeholder={tc.composeSubject} />
              </label>
              <label className="compose-field body-field">
                <span>{tc.composeBody}</span>
                <textarea name="body" rows={8} placeholder={tc.composeBodyPlaceholder} />
              </label>
              {sendError && <p className="error">{sendError}</p>}
              {sendSuccess && <p className="notice">{tc.sendOk}</p>}
              <div className="compose-actions">
                <button type="submit" className="btn-primary compose-send" disabled={sending}>
                  {sending ? tc.sendingSpin : tc.composeSend}
                </button>
                <button type="button" className="ghost" onClick={() => !sending && setCompose(false)}>{t.close}</button>
              </div>
            </form>
          </article>
        </div>
      )}
    </div>
  );
}
