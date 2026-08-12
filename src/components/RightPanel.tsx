import React from 'react';
import type { InstrumentType, ChordType, ScaleType, DspSettings } from '../types/piano';
import { Knob } from './Knob';

interface RightPanelProps {
  instrument: InstrumentType;
  onChangeInstrument: (inst: InstrumentType) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  octaveShift: number;
  onChangeOctave: (delta: number) => void;
  transpose: number;
  onChangeTranspose: (st: number) => void;
  sustain: boolean;
  onToggleSustain: () => void;
  velocitySensitivity: number;
  onChangeVelocity: (vel: number) => void;
  polyphonyLimit: number;
  onChangePolyphony: (poly: number) => void;
  chordType: ChordType;
  onChangeChordType: (chord: ChordType) => void;
  scaleType: ScaleType;
  onChangeScaleType: (scale: ScaleType) => void;
  dspSettings: DspSettings;
  onChangeDspSettings: (settings: DspSettings) => void;
  labelMode: 'keyboard' | 'notes' | 'none';
  onToggleLabelMode: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  instrument,
  onChangeInstrument,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
  octaveShift,
  onChangeOctave,
  transpose,
  onChangeTranspose,
  sustain,
  onToggleSustain,
  velocitySensitivity,
  onChangeVelocity,
  polyphonyLimit,
  onChangePolyphony,
  chordType,
  onChangeChordType,
  scaleType,
  onChangeScaleType,
  dspSettings,
  onChangeDspSettings,
  labelMode,
  onToggleLabelMode
}) => {
  const updateDspKey = (key: keyof DspSettings, val: number) => {
    onChangeDspSettings({ ...dspSettings, [key]: val });
  };

  return (
    <aside className="sidebar right-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-icon">⚙️</span>
          <h3>AUDIO CONTROLS &amp; DSP</h3>
        </div>
        <span className="panel-tag">STUDIO FX</span>
      </div>

      <div className="panel-content">
        <div className="input-group">
          <label className="input-label">Instrument Engine</label>
          <div className="select-wrapper">
            <select
              className="studio-select"
              value={instrument}
              onChange={(e) => onChangeInstrument(e.target.value as InstrumentType)}
            >
              <option value="piano">🎹 Grand Piano</option>
              <option value="rhodes">⚡ Rhodes Electric Piano</option>
              <option value="organ">⛪ Church Organ</option>
              <option value="synth">🎛️ Synth Lead</option>
              <option value="strings">🎻 Orchestral Strings</option>
              <option value="pad">🌌 Velvet Ambient Pad</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <div className="label-row">
            <label className="input-label">Master Volume</label>
            <span className="val-display">{Math.round(volume * 100)}%</span>
          </div>
          <div className="slider-row">
            <button className="mini-icon-btn" onClick={onToggleMute} title="Toggle Mute">
              {isMuted ? '🔇' : '🔊'}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : Math.round(volume * 100)}
              onChange={(e) => onChangeVolume(parseInt(e.target.value, 10) / 100)}
              className="studio-slider"
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group flex-1">
            <label className="input-label">Octave Shift</label>
            <div className="octave-button-group">
              <button className="oct-btn" onClick={() => onChangeOctave(-1)}>-</button>
              <span className="oct-badge">{octaveShift > 0 ? `+${octaveShift}` : octaveShift}</span>
              <button className="oct-btn" onClick={() => onChangeOctave(1)}>+</button>
            </div>
          </div>

          <div className="input-group flex-1">
            <label className="input-label">Transpose</label>
            <div className="octave-button-group">
              <button className="oct-btn" onClick={() => onChangeTranspose(transpose - 1)}>-</button>
              <span className="oct-badge">{transpose > 0 ? `+${transpose}` : transpose} ST</span>
              <button className="oct-btn" onClick={() => onChangeTranspose(transpose + 1)}>+</button>
            </div>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Sustain Pedal</label>
          <button
            className={`studio-toggle-btn ${sustain ? 'active' : ''}`}
            onClick={onToggleSustain}
          >
            <span className="toggle-icon">🦵</span>
            <span>Sustain: {sustain ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="input-row">
          <div className="input-group flex-1">
            <div className="label-row">
              <label className="input-label">Key Velocity</label>
              <span className="val-display">{['', 'Soft', 'Med', 'Hard'][velocitySensitivity]}</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={velocitySensitivity}
              onChange={(e) => onChangeVelocity(parseInt(e.target.value, 10))}
              className="studio-slider"
            />
          </div>

          <div className="input-group flex-1">
            <label className="input-label">Polyphony</label>
            <select
              className="studio-select mini-select"
              value={polyphonyLimit}
              onChange={(e) => onChangePolyphony(parseInt(e.target.value, 10))}
            >
              <option value={16}>16 Voices</option>
              <option value={32}>32 Voices</option>
              <option value={64}>64 Voices</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">1-Key Chord Mode</label>
          <div className="select-wrapper">
            <select
              className="studio-select"
              value={chordType}
              onChange={(e) => onChangeChordType(e.target.value as ChordType)}
            >
              <option value="none">Single Note (Off)</option>
              <option value="major">Major Triad</option>
              <option value="minor">Minor Triad</option>
              <option value="7th">Dominant 7th</option>
              <option value="maj7">Major 7th</option>
              <option value="min7">Minor 7th</option>
              <option value="sus2">Sus2</option>
              <option value="sus4">Sus4</option>
              <option value="dim">Diminished</option>
              <option value="aug">Augmented</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Scale Note Highlighter</label>
          <div className="select-wrapper">
            <select
              className="studio-select"
              value={scaleType}
              onChange={(e) => onChangeScaleType(e.target.value as ScaleType)}
            >
              <option value="none">Show All Notes (Off)</option>
              <option value="c_major">C Major Scale</option>
              <option value="g_major">G Major Scale</option>
              <option value="d_major">D Major Scale</option>
              <option value="a_major">A Major Scale</option>
              <option value="f_major">F Major Scale</option>
              <option value="a_minor">A Minor Scale</option>
              <option value="e_minor">E Minor Scale</option>
              <option value="pentatonic">Minor Pentatonic</option>
              <option value="blues">Blues Scale</option>
            </select>
          </div>
        </div>

        <div className="dsp-knobs-section">
          <span className="section-title">STUDIO DSP EFFECTS RACK</span>
          
          <div className="knob-row">
            <Knob
              label="REVERB MIX"
              value={Math.round(dspSettings.reverbMix * 100)}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => updateDspKey('reverbMix', v / 100)}
            />
            <Knob
              label="DELAY MIX"
              value={Math.round(dspSettings.delayMix * 100)}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => updateDspKey('delayMix', v / 100)}
            />
            <Knob
              label="CHORUS MIX"
              value={Math.round(dspSettings.chorusMix * 100)}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => updateDspKey('chorusMix', v / 100)}
            />
          </div>

          <div className="knob-row">
            <Knob
              label="EQ LOW"
              value={dspSettings.eqLow}
              min={-12}
              max={12}
              unit="dB"
              onChange={(v) => updateDspKey('eqLow', v)}
            />
            <Knob
              label="EQ MID"
              value={dspSettings.eqMid}
              min={-12}
              max={12}
              unit="dB"
              onChange={(v) => updateDspKey('eqMid', v)}
            />
            <Knob
              label="EQ HIGH"
              value={dspSettings.eqHigh}
              min={-12}
              max={12}
              unit="dB"
              onChange={(v) => updateDspKey('eqHigh', v)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Key Overlay Labels</label>
          <button
            className={`studio-toggle-btn ${labelMode !== 'none' ? 'active' : ''}`}
            onClick={onToggleLabelMode}
          >
            <span>Show: {labelMode === 'keyboard' ? 'Laptop Keys' : (labelMode === 'notes' ? 'Note Names' : 'Hidden')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
