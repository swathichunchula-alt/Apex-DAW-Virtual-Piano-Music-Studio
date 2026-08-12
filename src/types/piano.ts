export type InstrumentType = 'piano' | 'rhodes' | 'organ' | 'synth' | 'strings' | 'pad';

export interface NoteConfig {
  baseNote: string;
  baseOctave: number;
  isBlack: boolean;
  keyBind: string;
  midi: number;
  whiteIndex?: number;
  afterWhiteIndex?: number;
}

export interface NoteEvent {
  noteName: string;
  type: 'down' | 'up';
  time: number; // relative milliseconds from recording start
  midi?: number;
}

export interface SavedRecording {
  id: number;
  name: string;
  date: string;
  durationMs: number;
  bpm: number;
  events: NoteEvent[];
}

export interface SongStep {
  note: string;
  label: string;
  duration: number; // ms
  gap: number; // ms
  chordNotes?: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  category: 'Classical' | 'Popular' | 'Beginner';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  diffClass: string;
  tempo: number;
  sequence: SongStep[];
}

export type ChordType = 'none' | 'major' | 'minor' | '7th' | 'maj7' | 'min7' | 'sus2' | 'sus4' | 'dim' | 'aug';

export type ScaleType = 'none' | 'c_major' | 'g_major' | 'd_major' | 'a_major' | 'f_major' | 'a_minor' | 'e_minor' | 'pentatonic' | 'blues';

export interface DspSettings {
  reverbMix: number; // 0..1
  reverbDecay: number; // 1..5s
  delayMix: number; // 0..1
  delayTime: number; // 0.1..1.0s
  delayFeedback: number; // 0..0.8
  chorusMix: number; // 0..1
  eqLow: number; // -12..12 dB
  eqMid: number; // -12..12 dB
  eqHigh: number; // -12..12 dB
  compThreshold: number; // -50..0 dB
  compRatio: number; // 1..12
}
