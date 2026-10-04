// Every sound is synthesized with the Web Audio API: no files to download, nothing plays
// until the user opts in, and levels are kept deliberately low.

export type SoundName = "door" | "pour" | "hit" | "break" | "drop" | "shuffle" | "flip";

type Listener = (enabled: boolean) => void;

class SoundEngine {
  enabled = false;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: { stop: () => void } | null = null;
  private listeners = new Set<Listener>();
  private noise: AudioBuffer | null = null;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => void this.listeners.delete(fn);
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      this.ensure();
      void this.ctx!.resume();
      this.master!.gain.setTargetAtTime(0.9, this.ctx!.currentTime, 0.4);
      if (!this.ambient) this.ambient = this.startAmbient();
    } else if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      const amb = this.ambient;
      this.ambient = null;
      window.setTimeout(() => amb?.stop(), 600);
    }
    this.listeners.forEach((l) => l(on));
  }

  play(name: SoundName) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const fn = {
      door: () => this.door(),
      pour: () => this.pour(),
      hit: () => this.click(1900, 0.18),
      break: () => this.breakShot(),
      drop: () => this.drop(),
      shuffle: () => this.shuffle(),
      flip: () => this.noiseBurst(0.03, 2600, 0.05),
    }[name];
    fn();
  }

  private ensure() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }

  private noiseSource() {
    const src = this.ctx!.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    return src;
  }

  private env(gain: GainNode, peak: number, attack: number, decay: number) {
    const t = this.ctx!.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(peak, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  private startAmbient() {
    const ctx = this.ctx!;
    const room = this.noiseSource();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const roomGain = ctx.createGain();
    roomGain.gain.value = 0.05;
    room.connect(lp).connect(roomGain).connect(this.master!);

    const chatter = this.noiseSource();
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 600;
    bp.Q.value = 1.4;
    const chatterGain = ctx.createGain();
    chatterGain.gain.value = 0.018;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.21;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(chatterGain.gain);
    chatter.connect(bp).connect(chatterGain).connect(this.master!);

    room.start();
    chatter.start();
    lfo.start();

    let timer = 0;
    const clink = () => {
      this.bell(2200 + Math.random() * 1400, 0.012, 0.5);
      timer = window.setTimeout(clink, 4000 + Math.random() * 7000);
    };
    timer = window.setTimeout(clink, 2500);

    return {
      stop: () => {
        window.clearTimeout(timer);
        [room, chatter, lfo].forEach((n) => n.stop());
      },
    };
  }

  private bell(freq: number, peak: number, decay: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    this.env(g, peak, 0.005, decay);
    osc.connect(g).connect(this.master!);
    osc.start();
    osc.stop(ctx.currentTime + decay + 0.1);
  }

  private noiseBurst(duration: number, freq: number, peak: number, delay = 0) {
    const ctx = this.ctx!;
    const src = this.noiseSource();
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = freq;
    const g = ctx.createGain();
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(hp).connect(g).connect(this.master!);
    src.start(t);
    src.stop(t + duration + 0.05);
  }

  private click(freq: number, peak: number, delay = 0) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    const t = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.connect(g).connect(this.master!);
    osc.start(t);
    osc.stop(t + 0.1);
    this.noiseBurst(0.03, 3000, peak * 0.3, delay);
  }

  private door() {
    // A café door chime: two soft bells.
    this.bell(1318, 0.05, 1.6);
    window.setTimeout(() => this.bell(988, 0.04, 1.8), 140);
  }

  private pour() {
    const ctx = this.ctx!;
    const src = this.noiseSource();
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 3;
    const t = ctx.currentTime;
    bp.frequency.setValueAtTime(700, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + 1.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.15);
    g.gain.linearRampToValueAtTime(0.0001, t + 1.4);
    src.connect(bp).connect(g).connect(this.master!);
    src.start();
    src.stop(t + 1.5);
  }

  private breakShot() {
    for (let i = 0; i < 7; i++)
      this.click(
        1500 + Math.random() * 900,
        0.08 + Math.random() * 0.06,
        i * 0.035 + Math.random() * 0.03,
      );
  }

  private drop() {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.25);
    const g = ctx.createGain();
    this.env(g, 0.2, 0.005, 0.35);
    osc.connect(g).connect(this.master!);
    osc.start();
    osc.stop(t + 0.5);
    this.click(900, 0.08, 0.02);
  }

  private shuffle() {
    for (let i = 0; i < 14; i++) this.noiseBurst(0.025, 2200, 0.05, i * 0.032);
  }
}

export const sound = new SoundEngine();
