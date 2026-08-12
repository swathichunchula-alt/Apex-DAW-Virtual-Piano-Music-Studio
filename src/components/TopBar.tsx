import React, { useEffect, useState } from 'react';
import type { InstrumentType } from '../types/piano';
import { audioEngine } from '../audio/AudioEngine';

interface TopBarProps {
  instrument: InstrumentType;
  transpose: number;
  bpm: number;
  isRecording: boolean;
  onOpenKeymapModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  instrument,
  transpose,
  bpm,
  isRecording,
  onOpenKeymapModal
}) => {
  const [audioActive, setAudioActive] = useState(false);
  const [peakDb, setPeakDb] = useState(-60);

  useEffect(() => {
    const checkAudio = () => {
      if (audioEngine.isInitialized && audioEngine.ctx?.state === 'running') {
        setAudioActive(true);
      }
    };
    checkAudio();

    const timer = setInterval(() => {
      checkAudio();
      if (audioEngine.isInitialized) {
        setPeakDb(audioEngine.getPeakLevel());
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleUnlockAudio = () => {
    audioEngine.ensureRunning();
    setAudioActive(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const meterPct = Math.max(0, Math.min(100, ((peakDb + 60) / 60) * 100));

  return (
    <header className="top-bar">
      <div className="top-left">
        <div className="studio-brand">
          <span className="brand-logo">🎹</span>
          <div className="brand-titles">
            <span className="brand-main">APEX DAW</span>
            <span className="brand-sub">PRO PIANO WORKSTATION</span>
          </div>
        </div>

        <button
          className={`status-pill ${audioActive ? 'active' : ''}`}
          onClick={handleUnlockAudio}
          title="Click to activate Web Audio Engine"
        >
          <span className="status-dot" />
          <span>{audioActive ? 'Audio Engine Online' : 'Click to Enable Audio'}</span>
        </button>

        <div className="peak-meter-container" title={`Master Peak: ${peakDb} dB`}>
          <span className="meter-label">PEAK</span>
          <div className="meter-track">
            <div
              className={`meter-bar ${peakDb > -3 ? 'clipping' : ''}`}
              style={{ width: `${meterPct}%` }}
            />
          </div>
          <span className="meter-val">{peakDb} dB</span>
        </div>
      </div>

      <div className="top-center-badges">
        <span className="info-badge">
          <span className="badge-lbl">INST:</span> {instrument.toUpperCase()}
        </span>
        <span className="info-badge">
          <span className="badge-lbl">TRANS:</span> {transpose > 0 ? `+${transpose}` : transpose} ST
        </span>
        <span className="info-badge">
          <span className="badge-lbl">BPM:</span> {bpm}
        </span>
        {isRecording && (
          <span className="info-badge recording-badge">
            <span className="rec-dot" /> REC ACTIVE
          </span>
        )}
      </div>

      <div className="top-right-tools">
        <button className="top-btn" onClick={onOpenKeymapModal} title="Customize Laptop Keyboard Mapping">
          ⚙️ Keymap Editor
        </button>
        <button className="icon-btn" onClick={toggleFullscreen} title="Toggle Fullscreen Mode">
          ⛶
        </button>
      </div>
    </header>
  );
};
