import { audioEngine } from './AudioEngine';

export class Metronome {
  private isRunning = false;
  private bpm = 120;
  private intervalId: number | null = null;
  private currentBeat = 0;
  private onBeatCallback?: (beat: number) => void;

  public setBpm(bpm: number) {
    this.bpm = Math.max(40, Math.min(240, bpm));
    if (this.isRunning) {
      this.start();
    }
  }

  public setOnBeat(cb: (beat: number) => void) {
    this.onBeatCallback = cb;
  }

  public start() {
    this.stop();
    this.isRunning = true;
    this.currentBeat = 0;

    const intervalMs = (60 / this.bpm) * 1000;
    this.intervalId = window.setInterval(() => {
      this.playTick();
      if (this.onBeatCallback) {
        this.onBeatCallback(this.currentBeat % 4);
      }
      this.currentBeat++;
    }, intervalMs);
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  private playTick() {
    audioEngine.ensureRunning();
    const ctx = audioEngine.ctx;
    const masterGain = audioEngine.masterGainNode;
    if (!ctx || !masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const isBeatOne = (this.currentBeat % 4) === 0;
    osc.type = isBeatOne ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isBeatOne ? 1200 : 800, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const metronomeEngine = new Metronome();
