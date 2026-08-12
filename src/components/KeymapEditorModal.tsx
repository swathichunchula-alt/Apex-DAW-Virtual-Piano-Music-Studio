import React, { useState } from 'react';
import type { NoteConfig } from '../types/piano';

interface KeymapEditorModalProps {
  noteConfigs: NoteConfig[];
  isOpen: boolean;
  onClose: () => void;
  onSaveKeymap: (newConfigs: NoteConfig[]) => void;
  onResetDefault: () => void;
}

export const KeymapEditorModal: React.FC<KeymapEditorModalProps> = ({
  noteConfigs,
  isOpen,
  onClose,
  onSaveKeymap,
  onResetDefault
}) => {
  const [editingKeymap, setEditingKeymap] = useState<NoteConfig[]>([...noteConfigs]);
  const [listeningMidi, setListeningMidi] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleKeyBindChange = (midi: number, newKey: string) => {
    const updated = editingKeymap.map(cfg => {
      if (cfg.midi === midi) {
        return { ...cfg, keyBind: newKey.toLowerCase() };
      }
      return cfg;
    });
    setEditingKeymap(updated);
    setListeningMidi(null);
  };

  const handleKeyDownToRebind = (e: React.KeyboardEvent, midi: number) => {
    e.preventDefault();
    const key = e.key.toLowerCase();
    if (key.length === 1 || ['[', ']', ';', '\'', '\\', ',', '.', '/'].includes(key)) {
      handleKeyBindChange(midi, key);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content keymap-modal">
        <div className="modal-header">
          <h3>⌨️ KEYBOARD MAPPING EDITOR</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">
            Click on any keyboard shortcut field and press any key on your laptop keyboard to rebind the piano note mapping.
          </p>

          <div className="keymap-grid">
            {editingKeymap.map(cfg => (
              <div key={cfg.midi} className={`keymap-row ${cfg.isBlack ? 'black-note-row' : ''}`}>
                <span className="note-name-badge">{cfg.baseNote}{cfg.baseOctave}</span>
                <span className="midi-num">MIDI {cfg.midi}</span>
                <button
                  className={`keybind-input-btn ${listeningMidi === cfg.midi ? 'listening' : ''}`}
                  onClick={() => setListeningMidi(cfg.midi)}
                  onKeyDown={(e) => listeningMidi === cfg.midi && handleKeyDownToRebind(e, cfg.midi)}
                >
                  {listeningMidi === cfg.midi ? 'Press key...' : cfg.keyBind.toUpperCase()}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="studio-btn secondary-btn" onClick={onResetDefault}>
            🔄 Reset Defaults
          </button>
          <button className="studio-btn primary-btn" onClick={() => { onSaveKeymap(editingKeymap); onClose(); }}>
            💾 Save Keymap
          </button>
        </div>
      </div>
    </div>
  );
};
