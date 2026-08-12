import type { InstrumentType, DspSettings, ChordType } from '../types/piano';
import { EffectsChain } from './EffectsChain';

export class AudioEngine {
  public ctx: AudioContext | null = null;
  public masterGainNode: GainNode | null = null;
  public analyserNode: AnalyserNode | null = null;
  public effectsChain: EffectsChain | null = null;

  public volume = 0.8;
  public isMuted = false;
  public instrument: InstrumentType = 'piano';
  public sustainPedal = false;
  public transpose = 0;
  public polyphonyLimit = 32;
  public velocitySensitivity = 2;
  public isInitialized = false;

  private activeNotes = new Map<string, { gain: GainNode; nodes: AudioNode[]; startTime: number }>();
  private sustainedNotes = new Set<string>();

  public NOTE_FREQUENCIES: Record<string, { midi: number; freq: number }> = {};

  constructor() {
    this.NOTE_FREQUENCIES = this.generateNoteFrequencies();
  }

  private generateNoteFrequencies() {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const map: Record<string, { midi: number; freq: number }> = {};
    for (let midi = 12; midi <= 120; midi++) {
      const noteName = notes[midi % 12];
      const octave = Math.floor(midi / 12) - 1;
      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      map[`${noteName}${octave}`] = { midi, freq };
    }
    return map;
  }

  public init() {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.analyserNode.smoothingTimeConstant = 0.85;

      this.effectsChain = new EffectsChain(this.ctx);

      this.effectsChain.outputNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);

      this.isInitialized = true;
      console.log('AudioEngine & DSP Effects initialized.');
    } catch (e) {
      console.error('Failed to initialize Web Audio API', e);
    }
  }

  public ensureRunning() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGainNode && this.ctx && !this.isMuted) {
      this.masterGainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.01);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGainNode && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGainNode.gain.setTargetAtTime(target, this.ctx.currentTime, 0.01);
    }
    return this.isMuted;
  }

  public setInstrument(inst: InstrumentType) {
    this.instrument = inst;
  }

  public setTranspose(semitones: number) {
    this.transpose = Math.max(-12, Math.min(12, semitones));
  }

  public setSustain(enabled: boolean) {
    this.sustainPedal = enabled;
    if (!enabled) {
      this.sustainedNotes.forEach(noteName => this.stopNote(noteName, true));
      this.sustainedNotes.clear();
    }
  }

  public updateDsp(settings: DspSettings) {
    if (this.effectsChain) {
      this.effectsChain.updateSettings(settings);
    }
  }

  public getPeakLevel(): number {
    if (!this.analyserNode) return -60;
    const buffer = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(buffer);
    
    let maxVal = 0;
    for (let i = 0; i < buffer.length; i++) {
      const sample = Math.abs((buffer[i] - 128) / 128);
      if (sample > maxVal) maxVal = sample;
    }
    if (maxVal === 0) return -60;
    return Math.max(-60, Math.round(20 * Math.log10(maxVal)));
  }

  private getTransposedFreq(noteName: string): { noteName: string; freq: number } | null {
    const data = this.NOTE_FREQUENCIES[noteName];
    if (!data) return null;

    const transposedMidi = data.midi + this.transpose;
    const freq = 440 * Math.pow(2, (transposedMidi - 69) / 12);
    return { noteName, freq };
  }

  public getChordNotes(rootNote: string, chordType: ChordType): string[] {
    if (chordType === 'none') return [rootNote];
    const data = this.NOTE_FREQUENCIES[rootNote];
    if (!data) return [rootNote];

    const rootMidi = data.midi;
    let intervals: number[] = [0];

    switch (chordType) {
      case 'major': intervals = [0, 4, 7]; break;
      case 'minor': intervals = [0, 3, 7]; break;
      case '7th': intervals = [0, 4, 7, 10]; break;
      case 'maj7': intervals = [0, 4, 7, 11]; break;
      case 'min7': intervals = [0, 3, 7, 10]; break;
      case 'sus2': intervals = [0, 2, 7]; break;
      case 'sus4': intervals = [0, 5, 7]; break;
      case 'dim': intervals = [0, 3, 6]; break;
      case 'aug': intervals = [0, 4, 8]; break;
    }

    const notes: string[] = [];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    intervals.forEach(semi => {
      const targetMidi = rootMidi + semi;
      const nName = noteNames[targetMidi % 12];
      const oct = Math.floor(targetMidi / 12) - 1;
      notes.push(`${nName}${oct}`);
    });

    return notes;
  }

  public startNote(noteName: string) {
    this.ensureRunning();
    if (!this.ctx || !this.effectsChain) return;

    if (this.activeNotes.size >= this.polyphonyLimit) {
      const oldestKey = this.activeNotes.keys().next().value;
      if (oldestKey) this.stopNote(oldestKey, true);
    }

    if (this.activeNotes.has(noteName)) {
      this.stopNote(noteName, true);
    }

    const tf = this.getTransposedFreq(noteName);
    if (!tf) return;

    const now = this.ctx.currentTime;
    const noteNodes: AudioNode[] = [];
    const noteGain = this.ctx.createGain();

    noteGain.connect(this.effectsChain.inputNode);

    const velFactor = this.velocitySensitivity === 1 ? 0.6 : (this.velocitySensitivity === 3 ? 1.15 : 0.85);

    switch (this.instrument) {
      case 'rhodes':
        this.createRhodesVoice(tf.freq, now, noteGain, noteNodes, velFactor);
        break;
      case 'organ':
        this.createOrganVoice(tf.freq, now, noteGain, noteNodes, velFactor);
        break;
      case 'synth':
        this.createSynthVoice(tf.freq, now, noteGain, noteNodes, velFactor);
        break;
      case 'strings':
        this.createStringsVoice(tf.freq, now, noteGain, noteNodes, velFactor);
        break;
      case 'pad':
        this.createPadVoice(tf.freq, now, noteGain, noteNodes, velFactor);
        break;
      case 'piano':
      default:
        this.createPianoVoice(tf.freq, now, noteGain, noteNodes, velFactor);
        break;
    }

    this.activeNotes.set(noteName, { gain: noteGain, nodes: noteNodes, startTime: now });
  }

  public stopNote(noteName: string, immediate = false) {
    if (!this.ctx || !this.activeNotes.has(noteName)) return;

    if (this.sustainPedal && !immediate) {
      this.sustainedNotes.add(noteName);
      return;
    }

    const noteObj = this.activeNotes.get(noteName);
    if (!noteObj) return;

    this.activeNotes.delete(noteName);
    this.sustainedNotes.delete(noteName);

    const now = this.ctx.currentTime;
    const releaseTime = this.getReleaseTime();

    try {
      noteObj.gain.gain.cancelScheduledValues(now);
      noteObj.gain.gain.setValueAtTime(noteObj.gain.gain.value, now);
      noteObj.gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

      setTimeout(() => {
        noteObj.nodes.forEach(node => {
          if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
            (node as OscillatorNode).stop();
          }
          node.disconnect();
        });
        noteObj.gain.disconnect();
      }, (releaseTime + 0.1) * 1000);
    } catch (e) {
      // Ignore
    }
  }

  private getReleaseTime(): number {
    switch (this.instrument) {
      case 'rhodes': return 0.35;
      case 'organ': return 0.08;
      case 'synth': return 0.25;
      case 'strings': return 0.8;
      case 'pad': return 1.4;
      case 'piano':
      default: return this.sustainPedal ? 1.6 : 0.45;
    }
  }

  private createPianoVoice(freq: number, now: number, noteGain: GainNode, noteNodes: AudioNode[], vel: number) {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0.2, now);

    osc1.connect(noteGain);
    osc2.connect(g2);
    g2.connect(noteGain);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.9 * vel, now + 0.005);
    noteGain.gain.exponentialRampToValueAtTime(0.35 * vel, now + 0.8);

    osc1.start(now);
    osc2.start(now);
    noteNodes.push(osc1, osc2, g2);
  }

  private createRhodesVoice(freq: number, now: number, noteGain: GainNode, noteNodes: AudioNode[], vel: number) {
    if (!this.ctx) return;
    const bodyOsc = this.ctx.createOscillator();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(freq, now);

    const tineOsc = this.ctx.createOscillator();
    tineOsc.type = 'sine';
    tineOsc.frequency.setValueAtTime(freq * 4, now);

    const tineGain = this.ctx.createGain();
    tineGain.gain.setValueAtTime(0.4 * vel, now);
    tineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    bodyOsc.connect(noteGain);
    tineOsc.connect(tineGain);
    tineGain.connect(noteGain);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.85 * vel, now + 0.01);
    noteGain.gain.exponentialRampToValueAtTime(0.3 * vel, now + 1.2);

    bodyOsc.start(now);
    tineOsc.start(now);
    noteNodes.push(bodyOsc, tineOsc, tineGain);
  }

  private createOrganVoice(freq: number, now: number, noteGain: GainNode, noteNodes: AudioNode[], vel: number) {
    if (!this.ctx) return;
    [0.5, 1, 2, 4].forEach(h => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h, now);
      osc.connect(noteGain);
      osc.start(now);
      noteNodes.push(osc);
    });

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.7 * vel, now + 0.02);
  }

  private createSynthVoice(freq: number, now: number, noteGain: GainNode, noteNodes: AudioNode[], vel: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(5, now);
    filter.frequency.setValueAtTime(freq * 5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.3);

    osc.connect(filter);
    filter.connect(noteGain);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.7 * vel, now + 0.01);
    noteGain.gain.exponentialRampToValueAtTime(0.4 * vel, now + 0.4);

    osc.start(now);
    noteNodes.push(osc, filter);
  }

  private createStringsVoice(freq: number, now: number, noteGain: GainNode, noteNodes: AudioNode[], vel: number) {
    if (!this.ctx) return;
    [-6, 0, 6].forEach(d => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(d, now);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, now);

      osc.connect(filter);
      filter.connect(noteGain);
      osc.start(now);
      noteNodes.push(osc, filter);
    });

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.65 * vel, now + 0.25);
  }

  private createPadVoice(freq: number, now: number, noteGain: GainNode, noteNodes: AudioNode[], vel: number) {
    if (!this.ctx) return;
    [-8, 0, 8].forEach(d => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(d, now);

      osc.connect(noteGain);
      osc.start(now);
      noteNodes.push(osc);
    });

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.6 * vel, now + 0.2);
  }
}

export const audioEngine = new AudioEngine();
