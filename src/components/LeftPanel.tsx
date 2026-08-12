import React, { useState } from 'react';
import type { Song, SavedRecording } from '../types/piano';
import { SONGS_DATABASE } from '../data/songsData';

interface LeftPanelProps {
  selectedSong: Song | null;
  onSelectSong: (song: Song) => void;
  isPlayingGuide: boolean;
  onPlayGuide: () => void;
  onStopGuide: () => void;
  guideSpeed: number;
  onChangeGuideSpeed: (spd: number) => void;
  isLoopingSection: boolean;
  onToggleLoopSection: () => void;
  currentStepIndex: number;
  wrongNotesCount: number;
  accuracyPct: number;
  savedRecordings: SavedRecording[];
  onPlayRecording: (rec: SavedRecording) => void;
  onDeleteRecording: (id: number) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  selectedSong,
  onSelectSong,
  isPlayingGuide,
  onPlayGuide,
  onStopGuide,
  guideSpeed,
  onChangeGuideSpeed,
  isLoopingSection,
  onToggleLoopSection,
  currentStepIndex,
  wrongNotesCount,
  accuracyPct,
  savedRecordings,
  onPlayRecording,
  onDeleteRecording
}) => {
  const [filterCategory, setFilterCategory] = useState<'All' | 'Classical' | 'Popular' | 'Beginner'>('All');

  const filteredSongs = SONGS_DATABASE.filter(s => filterCategory === 'All' || s.category === filterCategory);

  return (
    <aside className="sidebar left-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-icon">📚</span>
          <h3>MUSIC BOOK STUDIO</h3>
        </div>
        <span className="panel-tag">PRACTICE SYSTEM</span>
      </div>

      <div className="panel-content">
        <div className="filter-tabs">
          {(['All', 'Classical', 'Popular', 'Beginner'] as const).map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="input-group">
          <label className="input-label">Select Song</label>
          <div className="select-wrapper">
            <select
              className="studio-select"
              value={selectedSong?.id || ''}
              onChange={(e) => {
                const song = SONGS_DATABASE.find(s => s.id === e.target.value);
                if (song) onSelectSong(song);
              }}
            >
              <option value="" disabled>-- Choose a Song --</option>
              {filteredSongs.map(song => (
                <option key={song.id} value={song.id}>
                  {song.title} • {song.artist} ({song.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedSong ? (
          <div className="song-card">
            <div className="song-card-header">
              <h4>{selectedSong.title}</h4>
              <span className={`diff-badge ${selectedSong.diffClass}`}>{selectedSong.difficulty}</span>
            </div>
            <p className="song-artist">{selectedSong.artist} • {selectedSong.category}</p>
          </div>
        ) : (
          <div className="song-card empty-card">
            <p>Select a song from the library above to begin practice.</p>
          </div>
        )}

        <div className="guide-controls-box">
          <div className="guide-btn-row">
            <button
              className="studio-btn primary-btn"
              onClick={onPlayGuide}
              disabled={!selectedSong || isPlayingGuide}
            >
              ▶ Auto-Play Demo
            </button>
            <button
              className="studio-btn danger-btn"
              onClick={onStopGuide}
              disabled={!isPlayingGuide}
            >
              ⏹ Stop
            </button>
          </div>

          <div className="guide-options-row">
            <div className="speed-option">
              <label>Tempo:</label>
              <select
                className="studio-select mini-select"
                value={guideSpeed}
                onChange={(e) => onChangeGuideSpeed(parseFloat(e.target.value))}
              >
                <option value={0.5}>0.5x Slow</option>
                <option value={0.75}>0.75x Slow</option>
                <option value={1.0}>1.0x Normal</option>
                <option value={1.25}>1.25x Fast</option>
              </select>
            </div>

            <button
              className={`studio-toggle-btn mini-toggle ${isLoopingSection ? 'active' : ''}`}
              onClick={onToggleLoopSection}
              title="Loop selected song sequence continuously"
            >
              🔁 Loop
            </button>
          </div>
        </div>

        {selectedSong && (
          <div className="practice-stats-box">
            <div className="stat-card">
              <span className="stat-label">Accuracy Score</span>
              <span className="stat-val accuracy-val">{accuracyPct}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Wrong Notes</span>
              <span className="stat-val wrong-val">{wrongNotesCount}</span>
            </div>
          </div>
        )}

        {selectedSong && (
          <div className="sheet-notes-section">
            <div className="section-header">
              <span>STEP-BY-STEP SHEET NOTES</span>
              <span className="step-counter">{currentStepIndex} / {selectedSong.sequence.length}</span>
            </div>
            <div className="sheet-notes-display">
              {selectedSong.sequence.map((step, idx) => (
                <span
                  key={idx}
                  className={`note-chip ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'passed' : ''}`}
                >
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="saved-recs-section">
          <div className="section-header">
            <span>SAVED MIDI RECORDINGS</span>
            <span className="count-badge">{savedRecordings.length}</span>
          </div>

          <div className="saved-recs-list">
            {savedRecordings.length === 0 ? (
              <p className="empty-msg">No saved MIDI recordings yet. Record a song and click Save!</p>
            ) : (
              savedRecordings.map(rec => (
                <div key={rec.id} className="rec-item">
                  <div className="rec-info">
                    <span className="rec-name">{rec.name}</span>
                    <span className="rec-date">{rec.date} • {Math.round(rec.durationMs / 1000)}s</span>
                  </div>
                  <div className="rec-actions">
                    <button className="rec-btn play" onClick={() => onPlayRecording(rec)} title="Play Recording">
                      ▶
                    </button>
                    <button className="rec-btn delete" onClick={() => onDeleteRecording(rec.id)} title="Delete Recording">
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
