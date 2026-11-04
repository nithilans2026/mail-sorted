"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NotifyStrings } from "@/lib/i18n-notify";
import {
  CUSTOM_KEY, CUSTOM_NAME_KEY, PRESETS, type NotifySettings, type SoundChoice,
  playAlert, playCustom, playPreset, vibrate,
} from "@/lib/sounds";

const MAX_RECORD_MS = 6000;
const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024; // keeps the saved sound small enough for browser storage

const ICONS: Record<SoundChoice, string> = {
  alarm: "🚨", siren: "📢", bell: "🔔", chime: "🎐", ping: "✨", custom: "🎙️", silent: "🔇",
};

function saveCustom(dataUrl: string, name: string) {
  try {
    localStorage.setItem(CUSTOM_KEY, dataUrl);
    localStorage.setItem(CUSTOM_NAME_KEY, name);
    return true;
  } catch {
    return false;
  }
}

export default function NotifyPanel({
  settings, onChange, s,
}: { settings: NotifySettings; onChange: (next: NotifySettings) => void; s: NotifyStrings }) {
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [customName, setCustomName] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    setPermission("Notification" in window ? Notification.permission : "unsupported");
    try {
      setCustomName(localStorage.getItem(CUSTOM_NAME_KEY));
    } catch {}
  }, []);

  // Close when tapping outside the panel.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !sheetRef.current?.contains(t)) setOpen(false);
    };
    const place = () => {
      const r = panelRef.current?.getBoundingClientRect();
      if (r) setAnchor({ top: r.bottom + 10, right: Math.max(16, window.innerWidth - r.right) });
    };
    place();
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [open]);

  const set = (patch: Partial<NotifySettings>) => onChange({ ...settings, ...patch });

  const toggleEnabled = async () => {
    const enabling = !settings.enabled;
    if (enabling && "Notification" in window && Notification.permission === "default") {
      setPermission(await Notification.requestPermission());
    }
    set({ enabled: enabling });
    if (enabling) vibrate(60);
  };

  const choose = (sound: SoundChoice) => {
    set({ sound });
    if (sound === "custom") {
      let url: string | null = null;
      try {
        url = localStorage.getItem(CUSTOM_KEY);
      } catch {}
      if (url) playCustom(url, settings.volume);
      else setHint(s.noCustom);
    } else if (sound !== "silent") {
      playPreset(sound, settings.volume);
    }
  };

  const startRecording = async () => {
    setHint(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        const reader = new FileReader();
        reader.onload = () => {
          const name = `🎙️ ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
          if (saveCustom(reader.result as string, name)) {
            setCustomName(name);
            onChange({ ...settings, sound: "custom" });
            playCustom(reader.result as string, settings.volume);
          }
        };
        reader.readAsDataURL(new Blob(chunks, { type: rec.mimeType }));
        setRecording(false);
      };
      recorder.current = rec;
      rec.start();
      setRecording(true);
      setTimeout(() => rec.state === "recording" && rec.stop(), MAX_RECORD_MS);
    } catch {
      setHint(s.blocked);
    }
  };

  const onUpload = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) return setHint("≤ 1.5 MB");
    const reader = new FileReader();
    reader.onload = () => {
      if (saveCustom(reader.result as string, file.name)) {
        setCustomName(file.name);
        onChange({ ...settings, sound: "custom" });
        playCustom(reader.result as string, settings.volume);
      }
    };
    reader.readAsDataURL(file);
  };

  const options: SoundChoice[] = [...PRESETS, "custom", "silent"];
  const label = (c: SoundChoice) => (c === "custom" ? s.mySound : c === "silent" ? s.silent : s.presets[c]);

  return (
    <div className="notify" ref={panelRef}>
      <button
        className={`notify-btn${settings.enabled ? " on" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={s.notifications}
        title={s.notifications}
      >
        <span className="bell" aria-hidden>{settings.enabled && settings.sound !== "silent" ? "🔔" : "🔕"}</span>
      </button>

      {/* Rendered on <body> so ancestor transforms (entrance animations) can't trap or clip it. */}
      {open && anchor && createPortal(
        <div
          className="notify-panel"
          role="dialog"
          aria-label={s.notifications}
          ref={sheetRef}
          style={{ top: anchor.top, insetInlineEnd: anchor.right } as React.CSSProperties}
        >
          <div className="notify-head">
            <strong>{s.notifications}</strong>
            <button className={`switch${settings.enabled ? " on" : ""}`} role="switch" aria-checked={settings.enabled} onClick={toggleEnabled}>
              <span className="knob" />
              <span className="switch-label">{settings.enabled ? s.on : s.off}</span>
            </button>
          </div>
          {settings.enabled && permission === "denied" && <p className="notify-warn">{s.blocked}</p>}

          <fieldset className="sound-list" disabled={!settings.enabled}>
            <legend>{s.sound}</legend>
            {options.map((c) => (
              <button
                key={c}
                className={`sound-option${settings.sound === c ? " active" : ""}`}
                role="radio"
                aria-checked={settings.sound === c}
                onClick={() => choose(c)}
              >
                <span aria-hidden>{ICONS[c]}</span>
                <span className="sound-name">{label(c)}</span>
                {c === "custom" && customName && <span className="muted small custom-name">{customName}</span>}
              </button>
            ))}
          </fieldset>

          {settings.enabled && settings.sound === "custom" && (
            <div className="custom-tools">
              <button className={recording ? "danger rec" : "ghost"} onClick={() => (recording ? recorder.current?.stop() : startRecording())}>
                {recording ? `⏹ ${s.stop}` : `🎙️ ${s.record}`}
              </button>
              <label className="ghost-btn">
                📁 {s.upload}
                <input type="file" accept="audio/*" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
              </label>
            </div>
          )}
          {hint && <p className="notify-warn">{hint}</p>}

          <label className="volume-row">
            <span>🔊 {s.volume}</span>
            <input
              type="range" min={0} max={100} value={Math.round(settings.volume * 100)}
              disabled={!settings.enabled || settings.sound === "silent"}
              onChange={(e) => set({ volume: Number(e.target.value) / 100 })}
              onPointerUp={() => settings.enabled && playAlert(settings)}
            />
            <span className="vol-num">{Math.round(settings.volume * 100)}%</span>
          </label>

          <div className="notify-foot">
            <label className="check-row">
              <input type="checkbox" checked={settings.tapSounds} onChange={(e) => set({ tapSounds: e.target.checked })} />
              {s.tapSounds}
            </label>
            <button
              className="primary-sm"
              disabled={!settings.enabled || settings.sound === "silent"}
              onClick={() => {
                playAlert(settings);
                vibrate([300, 100, 300, 100, 600]);
              }}
            >
              ▶ {s.test}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
