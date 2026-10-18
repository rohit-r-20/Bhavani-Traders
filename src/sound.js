/**
 * Bhavani Traders - Subtle Hardware Tactile Audio Engine
 * Pure Web Audio API synthesis: zero external audio assets required.
 * Default is MUTED to maintain a calm, professional editorial experience.
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.enabled = false;
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playMetallicTap(680, 0.08);
    }
    return this.enabled;
  }

  setEnabled(val) {
    this.enabled = Boolean(val);
    if (this.enabled) this.init();
  }

  // Synthesize a brief mechanical ratchet / screw turn click
  playRatchetClick(pitchMod = 0) {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      
      // Noise burst for metal friction
      const bufferSize = this.audioCtx.sampleRate * 0.02;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400 + pitchMod * 300, now);
      filter.Q.setValueAtTime(4.0, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.03);

      // Resonant metallic ping
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + pitchMod * 200, now);
      oscGain.gain.setValueAtTime(0.03, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio fallback silent
    }
  }

  // Subtle metallic ring (e.g. for anvil / clamp tighten stop)
  playMetallicTap(freq = 880, vol = 0.06) {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.08);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio fallback silent
    }
  }

  // Soft confirmation tone for copy actions
  playSuccessTone() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.05); // E5

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // Audio fallback silent
    }
  }
}

export const sound = new SoundController();
