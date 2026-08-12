import React from 'react';
import type { NoteEvent } from '../types/piano';

interface BottomTimelineProps {
  isRecording: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
  isPlayingRec: boolean;
  isPausedRec: boolean;
  onPlayRec: () => void;
  onPauseRec: () => void;
  onResumeRec: () => void;
  onStopRec: () => void;
  onClearRec: () => void;
  onSaveRec: () => void;
  recordedEvents: NoteEvent[];
  playbackTimeMs: number;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  isMetronomeActive: boolean;
  onToggleMetronome: () => void;
}

export const BottomTimeline: React.FC<BottomTimelineProps> = ({
  isRecording,
  onStartRecord,
  onStopRecord,
  isPlayingRec,
  isPausedRec,
  onPlayRec,
  onPauseRec,
  onResumeRec,
  onStopRec,
  onClearRec,
  onSaveRec,
  recordedEvents,
  playbackTimeMs,
  bpm,
  onBpmChange,
  isMetronomeActive,
  onToggleMetronome
}) => {
  const hasEvents = recordedEvents.length > 0;
  const totalDurationMs = hasEvents ? recordedEvents[recordedEvents.length - 1].time + 1000 : 10000;
  const playheadPct = Math.min(100, (playbackTimeMs / totalDurationMs) * 100);

  return (
    <footer className="bottom-timeline-bar">
      <div className="transport-row">
        {!isRecording ? (
          <button className="transport-btn record" onClick={onStartRecord} title="Start Recording MIDI Note Events">
            🔴 Record
          </button>
        ) : (
          <button className="transport-btn recording" onClick={onStopRecord} title="Stop Recording">
            ⏹ Stop Rec
          </button>
        )}

        {!isPlayingRec && !isPausedRec && (
          <button className="transport-btn play" onClick={onPlayRec} disabled={!hasEvents} title="Play Recording">
            ▶ Play
          </button>
        )}

        {isPlayingRec && !isPausedRec && (
          <button className="transport-btn pause" onClick={onPauseRec} title="Pause Playback">
            ⏸ Pause
          </button>
        )}

        {isPausedRec && (
          <button className="transport-btn play" onClick={onResumeRec} title="Resume Playback">
            ▶ Resume
          </button>
        )}

        <button className="transport-btn stop" onClick={onStopRec} disabled={!isPlayingRec && !isPausedRec} title="Stop Playback">
          ⏹ Stop
        </button>

        <button className="transport-btn clear" onClick={onClearRec} disabled={!hasEvents} title="Clear Current Recording Buffer">
          🗑 Clear
        </button>

        <button className="transport-btn save" onClick={onSaveRec} disabled={!hasEvents} title="Save & Download MIDI Performance">
          💾 Save JSON
        </button>

        <div className="transport-divider" />

        <div className="metronome-box">
          <button
            className={`metronome-toggle ${isMetronomeActive ? 'active' : ''}`}
            onClick={onToggleMetronome}
            title="Toggle Audible Metronome Beat Click"
          >
            ⏱️ Metronome: {isMetronomeActive ? 'ON' : 'OFF'}
          </button>
          <div className="bpm-box">
            <label>BPM:</label>
            <input
              type="number"
              min="40"
              max="240"
              value={bpm}
              onChange={(e) => onBpmChange(parseInt(e.target.value, 10) || 120)}
              className="bpm-input"
            />
          </div>
        </div>
      </div>

      <div className="timeline-track-container">
        <div className="timeline-ruler">
          <span>0.00s</span>
          <span>{Math.round(totalDurationMs / 4000)}s</span>
          <span>{Math.round(totalDurationMs / 2000)}s</span>
          <span>{Math.round((totalDurationMs * 3) / 4000)}s</span>
          <span>{Math.round(totalDurationMs / 1000)}s</span>
        </div>

        <div className="timeline-canvas-box">
          {recordedEvents.filter(e => e.type === 'down').map((evt, idx) => {
            const leftPct = (evt.time / totalDurationMs) * 100;
            return (
              <div
                key={idx}
                className="midi-note-block"
                style={{ left: `${leftPct}%`, width: '12px' }}
                title={`${evt.noteName} at ${Math.round(evt.time)}ms`}
              />
            );
          })}

          {(isPlayingRec || isPausedRec) && (
            <div className="playhead-cursor" style={{ left: `${playheadPct}%` }} />
          )}
        </div>
      </div>
    </footer>
  );
};
