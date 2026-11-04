// Alert, tap and custom sounds, all generated with the Web Audio API (no audio files to download).
// Browsers only allow sound after the user has touched the page once, so unlock() runs on the first tap.

export const PRESETS = ["alarm", "siren", "bell", "chime", "ping"] as const;
export type Preset = (typeof PRESETS)[number];
export type SoundChoice = Preset | "custom" | "silent";

export type NotifySettings = {
  enabled: boolean;
  sound: SoundChoice;
  volume: number; // 0..1
  tapSounds: boolean;
};

export const DEFAULT_SETTINGS: NotifySettings = { enabled: true, sound: "alarm", volume: 1, tapSounds: true };
export const SETTINGS_KEY = "notifySettings";
export const CUSTOM_KEY = "notifyCustomSound"; // data: URL of the user's recorded/uploaded sound
export const CUSTOM_NAME_KEY = "notifyCustomName";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AC();
    // Limiter so "loud" stays loud without clipping into crackle.
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.1;
    master = ctx.createGain();
    master.connect(limiter).connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return { ctx, out: master! };
}

export function unlock() {
  try {
    audio();
  } catch {}
}

function tone(type: OscillatorType, freq: number, start: number, dur: number, peak: number, endFreq?: number) {
  const { ctx, out } = audio();
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  if (endFreq) osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + start + dur);
  env.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  env.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + start + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(env).connect(out);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}

// Each preset is ~1.5–2.5 s. Gain above 1 is intentional: the limiter keeps it clean at full loudness.
export function playPreset(preset: Preset, volume: number) {
  const v = Math.max(0, Math.min(1, volume)) * 2.2;
  if (v === 0) return;
  switch (preset) {
    case "alarm": // urgent two-tone beeping
      for (let i = 0; i < 8; i++) tone("square", i % 2 ? 1320 : 880, i * 0.16, 0.13, v * 0.6);
      for (let i = 0; i < 8; i++) tone("square", i % 2 ? 1320 : 880, 1.5 + i * 0.16, 0.13, v * 0.6);
      break;
    case "siren": // rising and falling sweep
      tone("sawtooth", 600, 0, 0.6, v * 0.5, 1500);
      tone("sawtooth", 1500, 0.6, 0.6, v * 0.5, 600);
      tone("sawtooth", 600, 1.2, 0.6, v * 0.5, 1500);
      tone("sawtooth", 1500, 1.8, 0.6, v * 0.5, 600);
      break;
    case "bell": // struck bell with overtones
      for (const [f, a] of [[660, 1], [1320, 0.5], [1980, 0.3], [2640, 0.15]] as const) tone("sine", f, 0, 2.2, v * 0.5 * a);
      for (const [f, a] of [[660, 1], [1320, 0.5], [1980, 0.3]] as const) tone("sine", f, 0.6, 1.8, v * 0.4 * a);
      break;
    case "chime": // bright three-note arpeggio, twice
      [1047, 1319, 1568, 2093].forEach((f, i) => tone("triangle", f, i * 0.12, 0.9, v * 0.5));
      [1047, 1319, 1568, 2093].forEach((f, i) => tone("triangle", f, 0.8 + i * 0.12, 0.9, v * 0.5));
      break;
    case "ping":
      tone("sine", 1760, 0, 0.5, v * 0.6);
      tone("sine", 2349, 0.18, 0.6, v * 0.5);
      break;
  }
}

let customAudio: HTMLAudioElement | null = null;

export function playCustom(dataUrl: string, volume: number) {
  const { ctx, out } = audio();
  customAudio?.pause();
  customAudio = new Audio(dataUrl);
  try {
    // Route through the same limiter + boost so a quiet recording still comes out loud.
    const src = ctx.createMediaElementSource(customAudio);
    const boost = ctx.createGain();
    boost.gain.value = Math.max(0, Math.min(1, volume)) * 2.2;
    src.connect(boost).connect(out);
  } catch {
    customAudio.volume = Math.max(0, Math.min(1, volume));
  }
  customAudio.play().catch(() => {});
}

export function playAlert(settings: NotifySettings) {
  if (settings.sound === "silent") return;
  if (settings.sound === "custom") {
    let url: string | null = null;
    try {
      url = localStorage.getItem(CUSTOM_KEY);
    } catch {}
    if (url) return playCustom(url, settings.volume);
    return playPreset("alarm", settings.volume); // no custom sound saved yet
  }
  playPreset(settings.sound, settings.volume);
}

// Short soft "tick" for taps.
export function playTap() {
  try {
    const { ctx, out } = audio();
    const len = Math.floor(ctx.sampleRate * 0.012);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = "bandpass";
    filter.frequency.value = 3200;
    gain.gain.value = 0.35;
    src.buffer = buf;
    src.connect(filter).connect(gain).connect(out);
    src.start();
  } catch {}
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
}
