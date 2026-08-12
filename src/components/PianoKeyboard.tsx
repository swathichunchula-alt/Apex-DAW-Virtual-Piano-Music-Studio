import React, { useRef, useEffect } from 'react';
import type { NoteConfig } from '../types/piano';

interface PianoKeyboardProps {
  noteConfigs: NoteConfig[];
  octaveShift: number;
  activeNotes: Set<string>;
  guidedNotes: Set<string>;
  allowedScaleNotes: Set<string> | null;
  labelMode: 'keyboard' | 'notes' | 'none';
  onPressNote: (noteName: string) => void;
  onReleaseNote: (noteName: string) => void;
  onRegisterPos: (noteName: string, x: number, width: number, isBlack: boolean) => void;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  noteConfigs,
  octaveShift,
  activeNotes,
  guidedNotes,
  allowedScaleNotes,
  labelMode,
  onPressNote,
  onReleaseNote,
  onRegisterPos
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getNoteName = (cfg: NoteConfig) => `${cfg.baseNote}${cfg.baseOctave + octaveShift}`;

  const WHITE_KEY_WIDTH = 60;
  const BLACK_KEY_WIDTH = 36;
  const PADDING_LEFT = 20;

  useEffect(() => {
    noteConfigs.forEach(cfg => {
      const noteName = getNoteName(cfg);
      if (cfg.isBlack) {
        const left = PADDING_LEFT + (cfg.afterWhiteIndex! + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;
        onRegisterPos(noteName, left + BLACK_KEY_WIDTH / 2, BLACK_KEY_WIDTH, true);
      } else {
        const left = PADDING_LEFT + cfg.whiteIndex! * WHITE_KEY_WIDTH;
        onRegisterPos(noteName, left + WHITE_KEY_WIDTH / 2, WHITE_KEY_WIDTH - 3, false);
      }
    });
  }, [noteConfigs, octaveShift]);

  const whiteConfigs = noteConfigs.filter(c => !c.isBlack);
  const blackConfigs = noteConfigs.filter(c => c.isBlack);

  return (
    <div className="piano-keyboard-wrapper">
      <div ref={containerRef} className="piano-keyboard">
        {whiteConfigs.map(cfg => {
          const noteName = getNoteName(cfg);
          const isActive = activeNotes.has(noteName);
          const isGuided = guidedNotes.has(noteName);
          const isScaleAllowed = allowedScaleNotes === null || allowedScaleNotes.has(cfg.baseNote);

          return (
            <div
              key={noteName}
              className={`key white-key ${isActive ? 'active' : ''} ${isGuided ? 'guided' : ''} ${!isScaleAllowed ? 'scale-dim' : 'scale-highlight'}`}
              onMouseDown={(e) => { e.preventDefault(); onPressNote(noteName); }}
              onMouseUp={(e) => { e.preventDefault(); onReleaseNote(noteName); }}
              onMouseLeave={(e) => { e.preventDefault(); onReleaseNote(noteName); }}
              onTouchStart={(e) => { e.preventDefault(); onPressNote(noteName); }}
              onTouchEnd={(e) => { e.preventDefault(); onReleaseNote(noteName); }}
            >
              <span className="key-label">
                {labelMode === 'keyboard' ? cfg.keyBind.toUpperCase() : (labelMode === 'notes' ? noteName : '')}
              </span>
              <span className="key-note">
                {labelMode === 'keyboard' ? noteName : (labelMode === 'notes' ? cfg.keyBind.toUpperCase() : '')}
              </span>
            </div>
          );
        })}

        {blackConfigs.map(cfg => {
          const noteName = getNoteName(cfg);
          const isActive = activeNotes.has(noteName);
          const isGuided = guidedNotes.has(noteName);
          const isScaleAllowed = allowedScaleNotes === null || allowedScaleNotes.has(cfg.baseNote);

          const leftPos = PADDING_LEFT + (cfg.afterWhiteIndex! + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2;

          return (
            <div
              key={noteName}
              className={`key black-key ${isActive ? 'active' : ''} ${isGuided ? 'guided' : ''} ${!isScaleAllowed ? 'scale-dim' : 'scale-highlight'}`}
              style={{ left: `${leftPos}px` }}
              onMouseDown={(e) => { e.preventDefault(); onPressNote(noteName); }}
              onMouseUp={(e) => { e.preventDefault(); onReleaseNote(noteName); }}
              onMouseLeave={(e) => { e.preventDefault(); onReleaseNote(noteName); }}
              onTouchStart={(e) => { e.preventDefault(); onPressNote(noteName); }}
              onTouchEnd={(e) => { e.preventDefault(); onReleaseNote(noteName); }}
            >
              <span className="key-label">
                {labelMode === 'keyboard' ? cfg.keyBind.toUpperCase() : (labelMode === 'notes' ? noteName : '')}
              </span>
              <span className="key-note">
                {labelMode === 'keyboard' ? noteName : (labelMode === 'notes' ? cfg.keyBind.toUpperCase() : '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
