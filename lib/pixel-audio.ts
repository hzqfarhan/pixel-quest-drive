// ═══════════════════════════════════════════════════════
// PIXEL AUDIO — 8-bit sound effects via Web Audio API
// ═══════════════════════════════════════════════════════

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('pq-sound', enabled ? '1' : '0');
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pq-sound');
    if (stored !== null) return stored === '1';
  }
  return soundEnabled;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'square',
  volume: number = 0.15
) {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // AudioContext not available
  }
}

function playSequence(
  notes: { freq: number; dur: number; delay: number }[],
  type: OscillatorType = 'square'
) {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getContext();
    notes.forEach(({ freq, dur, delay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur);
    });
  } catch {
    // AudioContext not available
  }
}

/** Short ascending beep — XP gained */
export function playXPGain() {
  playSequence([
    { freq: 440, dur: 0.08, delay: 0 },
    { freq: 587, dur: 0.08, delay: 0.08 },
    { freq: 698, dur: 0.12, delay: 0.16 },
  ]);
}

/** Coin pickup — short high beep */
export function playCoin() {
  playSequence([
    { freq: 880, dur: 0.06, delay: 0 },
    { freq: 1175, dur: 0.1, delay: 0.06 },
  ]);
}

/** Level up fanfare — triumphant arpeggio */
export function playLevelUp() {
  playSequence([
    { freq: 523, dur: 0.12, delay: 0 },
    { freq: 659, dur: 0.12, delay: 0.12 },
    { freq: 784, dur: 0.12, delay: 0.24 },
    { freq: 1047, dur: 0.3, delay: 0.36 },
    { freq: 784, dur: 0.1, delay: 0.5 },
    { freq: 1047, dur: 0.4, delay: 0.6 },
  ]);
}

/** Chest open sparkle */
export function playOpen() {
  playSequence([
    { freq: 600, dur: 0.06, delay: 0 },
    { freq: 800, dur: 0.06, delay: 0.05 },
    { freq: 1000, dur: 0.06, delay: 0.1 },
    { freq: 1200, dur: 0.1, delay: 0.15 },
  ]);
}

/** Download blip sequence */
export function playDownload() {
  playSequence([
    { freq: 330, dur: 0.08, delay: 0 },
    { freq: 440, dur: 0.08, delay: 0.1 },
    { freq: 554, dur: 0.08, delay: 0.2 },
    { freq: 660, dur: 0.15, delay: 0.3 },
  ]);
}

/** Achievement jingle */
export function playAchievement() {
  playSequence([
    { freq: 523, dur: 0.1, delay: 0 },
    { freq: 659, dur: 0.1, delay: 0.1 },
    { freq: 784, dur: 0.1, delay: 0.2 },
    { freq: 1047, dur: 0.15, delay: 0.3 },
    { freq: 1319, dur: 0.3, delay: 0.45 },
  ]);
}

/** Error — descending bloop */
export function playError() {
  playSequence(
    [
      { freq: 440, dur: 0.1, delay: 0 },
      { freq: 330, dur: 0.1, delay: 0.1 },
      { freq: 220, dur: 0.2, delay: 0.2 },
    ],
    'sawtooth'
  );
}

/** Soft pop — file open */
export function playFileOpen() {
  playTone(660, 0.08, 'square', 0.1);
}
