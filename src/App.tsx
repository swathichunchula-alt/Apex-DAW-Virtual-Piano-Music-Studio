import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  InstrumentType,
  NoteConfig,
  NoteEvent,
  SavedRecording,
  Song,
  ChordType,
  ScaleType,
  DspSettings
} from './types/piano';
import { DEFAULT_NOTE_CONFIGS } from './data/defaultKeymap';
import { audioEngine } from './audio/AudioEngine';
import { metronomeEngine } from './audio/Metronome';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { PianoRollVisualizer } from './components/PianoRollVisualizer';
import { PianoKeyboard } from './components/PianoKeyboard';
import { RightPanel } from './components/RightPanel';
import { BottomTimeline } from './components/BottomTimeline';
import { KeymapEditorModal } from './components/KeymapEditorModal';

export function App() {
  const [noteConfigs, setNoteConfigs] = useState<NoteConfig[]>(() => {
    try {
      const saved = localStorage.getItem('apex_piano_keymap');
      return saved ? JSON.parse(saved) : DEFAULT_NOTE_CONFIGS;
    } catch (e) {
      return DEFAULT_NOTE_CONFIGS;
    }
  });

  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [octaveShift, setOctaveShift] = useState(0);
  const [transpose, setTranspose] = useState(0);
  const [sustain, setSustain] = useState(false);
  const [velocitySensitivity, setVelocitySensitivity] = useState(2);
  const [polyphonyLimit, setPolyphonyLimit] = useState(32);
  const [chordType, setChordType] = useState<ChordType>('none');
  const [scaleType, setScaleType] = useState<ScaleType>('none');

  const [dspSettings, setDspSettings] = useState<DspSettings>({
    reverbMix: 0.3,
    reverbDecay: 2.5,
    delayMix: 0.2,
    delayTime: 0.3,
    delayFeedback: 0.4,
    chorusMix: 0.2,
    eqLow: 0,
    eqMid: 0,
    eqHigh: 0,
    compThreshold: -24,
    compRatio: 4
  });

  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [guidedNotes, setGuidedNotes] = useState<Set<string>>(new Set());
  const [labelMode, setLabelMode] = useState<'keyboard' | 'notes' | 'none'>('keyboard');
  const [vizMode, setVizMode] = useState<'waveform' | 'bars'>('waveform');

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlayingGuide, setIsPlayingGuide] = useState(false);
  const [guideSpeed, setGuideSpeed] = useState(1.0);
  const [isLoopingSection, setIsLoopingSection] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [wrongNotesCount, setWrongNotesCount] = useState(0);
  const [totalNotesPlayed, setTotalNotesPlayed] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedEvents, setRecordedEvents] = useState<NoteEvent[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState(0);
  const [isPlayingRec, setIsPlayingRec] = useState(false);
  const [isPausedRec, setIsPausedRec] = useState(false);
  const [playbackTimeMs, setPlaybackTimeMs] = useState(0);

  const [bpm, setBpm] = useState(120);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [isKeymapModalOpen, setIsKeymapModalOpen] = useState(false);

  const [savedRecordings, setSavedRecordings] = useState<SavedRecording[]>(() => {
    try {
      const data = localStorage.getItem('apex_piano_recordings');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  });

  const keyPositionsRef = useRef<Map<string, { x: number; width: number; isBlack: boolean }>>(new Map());
  const guideTimeoutIds = useRef<number[]>([]);
  const recTimeoutIds = useRef<number[]>([]);

  useEffect(() => {
    audioEngine.setInstrument(instrument);
    audioEngine.setVolume(volume);
    audioEngine.setTranspose(transpose);
    audioEngine.setSustain(sustain);
    audioEngine.velocitySensitivity = velocitySensitivity;
    audioEngine.polyphonyLimit = polyphonyLimit;
    audioEngine.updateDsp(dspSettings);
  }, [instrument, volume, transpose, sustain, velocitySensitivity, polyphonyLimit, dspSettings]);

  const pressNote = useCallback((rootNoteName: string) => {
    const notesToPlay = audioEngine.getChordNotes(rootNoteName, chordType);

    if (selectedSong && selectedSong.sequence[currentStepIndex]) {
      const targetNote = selectedSong.sequence[currentStepIndex].note;
      if (rootNoteName !== targetNote) {
        setWrongNotesCount(prev => prev + 1);
      } else {
        setCurrentStepIndex(prev => Math.min(selectedSong.sequence.length, prev + 1));
      }
      setTotalNotesPlayed(prev => prev + 1);
    }

    notesToPlay.forEach(n => {
      audioEngine.startNote(n);
      setActiveNotes(prev => new Set(prev).add(n));
    });

    if (isRecording) {
      const time = performance.now() - recordingStartTime;
      setRecordedEvents(prev => [...prev, { noteName: rootNoteName, type: 'down', time }]);
    }
  }, [chordType, selectedSong, currentStepIndex, isRecording, recordingStartTime]);

  const releaseNote = useCallback((rootNoteName: string) => {
    const notesToRelease = audioEngine.getChordNotes(rootNoteName, chordType);

    notesToRelease.forEach(n => {
      audioEngine.stopNote(n);
      setActiveNotes(prev => {
        const next = new Set(prev);
        next.delete(n);
        return next;
      });
    });

    if (isRecording) {
      const time = performance.now() - recordingStartTime;
      setRecordedEvents(prev => [...prev, { noteName: rootNoteName, type: 'up', time }]);
    }
  }, [chordType, isRecording, recordingStartTime]);

  // Robust 100% Accuracy Key Event Resolver for Laptop Keypad / Numpad / Digits / Letters
  const findNoteConfigFromEvent = useCallback((e: KeyboardEvent): NoteConfig | null => {
    const rawKey = e.key.toLowerCase();
    const rawCode = e.code.toLowerCase();

    // 1. Direct match on keyBind (e.g. 'a', 's', '1', 'w')
    for (const cfg of noteConfigs) {
      if (cfg.keyBind.toLowerCase() === rawKey) return cfg;
    }

    // 2. Code match (e.g. 'keya' -> 'a', 'digit1' -> '1', 'numpad1' -> '1')
    const codeClean = rawCode.replace(/^key/, '').replace(/^digit/, '').replace(/^numpad/, '');
    for (const cfg of noteConfigs) {
      if (cfg.keyBind.toLowerCase() === codeClean) return cfg;
    }

    // 3. Fallback Map for Keypad / Numpad / Top Row Digits -> Main Octave Keys
    const numpadFallbackMap: Record<string, string> = {
      '1': 'a', 'numpad1': 'a',
      '2': 's', 'numpad2': 's',
      '3': 'd', 'numpad3': 'd',
      '4': 'f', 'numpad4': 'f',
      '5': 'g', 'numpad5': 'g',
      '6': 'h', 'numpad6': 'h',
      '7': 'j', 'numpad7': 'j',
      '8': 'k', 'numpad8': 'k',
      '9': 'l', 'numpad9': 'l',
      '0': ';', 'numpad0': ';'
    };

    const targetKey = numpadFallbackMap[rawKey] || numpadFallbackMap[rawCode] || numpadFallbackMap[codeClean];
    if (targetKey) {
      for (const cfg of noteConfigs) {
        if (cfg.keyBind.toLowerCase() === targetKey) return cfg;
      }
    }

    return null;
  }, [noteConfigs]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) setSustain(prev => !prev);
        return;
      }

      const cfg = findNoteConfigFromEvent(e);
      if (cfg) {
        if (e.repeat) return;
        e.preventDefault();
        const noteName = `${cfg.baseNote}${cfg.baseOctave + octaveShift}`;
        pressNote(noteName);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))) return;

      const cfg = findNoteConfigFromEvent(e);
      if (cfg) {
        e.preventDefault();
        const noteName = `${cfg.baseNote}${cfg.baseOctave + octaveShift}`;
        releaseNote(noteName);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [findNoteConfigFromEvent, octaveShift, pressNote, releaseNote]);

  const playSongGuide = () => {
    if (!selectedSong) return;
    stopSongGuide();
    setIsPlayingGuide(true);
    setCurrentStepIndex(0);
    setWrongNotesCount(0);
    setTotalNotesPlayed(0);

    const speedMult = guideSpeed;
    let accumulatedTime = 200;

    const playSequence = () => {
      selectedSong.sequence.forEach((item, idx) => {
        const dur = item.duration / speedMult;
        const gap = item.gap / speedMult;

        const tid1 = window.setTimeout(() => {
          if (!isPlayingGuide) return;
          setCurrentStepIndex(idx);
          setGuidedNotes(new Set([item.note]));
          audioEngine.startNote(item.note);
        }, accumulatedTime);

        const tid2 = window.setTimeout(() => {
          if (!isPlayingGuide) return;
          audioEngine.stopNote(item.note);
          setGuidedNotes(new Set());
        }, accumulatedTime + dur);

        guideTimeoutIds.current.push(tid1, tid2);
        accumulatedTime += dur + gap;
      });

      const endTid = window.setTimeout(() => {
        if (isLoopingSection) {
          playSequence();
        } else {
          stopSongGuide();
        }
      }, accumulatedTime + 300);
      guideTimeoutIds.current.push(endTid);
    };

    playSequence();
  };

  const stopSongGuide = () => {
    setIsPlayingGuide(false);
    guideTimeoutIds.current.forEach(id => clearTimeout(id));
    guideTimeoutIds.current = [];
    setGuidedNotes(new Set());
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordedEvents([]);
    setRecordingStartTime(performance.now());
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const playRecording = () => {
    if (recordedEvents.length === 0) return;
    setIsPlayingRec(true);
    setIsPausedRec(false);

    let startTime = performance.now();
    let animId: number;

    const updateTime = () => {
      if (isPlayingRec && !isPausedRec) {
        setPlaybackTimeMs(performance.now() - startTime);
        animId = requestAnimationFrame(updateTime);
      }
    };
    animId = requestAnimationFrame(updateTime);

    recordedEvents.forEach(evt => {
      const tid = window.setTimeout(() => {
        if (evt.type === 'down') pressNote(evt.noteName);
        else releaseNote(evt.noteName);
      }, evt.time);
      recTimeoutIds.current.push(tid);
    });

    const maxTime = recordedEvents[recordedEvents.length - 1].time + 500;
    const endTid = window.setTimeout(() => {
      stopRecordingPlayback();
      cancelAnimationFrame(animId);
    }, maxTime);
    recTimeoutIds.current.push(endTid);
  };

  const stopRecordingPlayback = () => {
    setIsPlayingRec(false);
    setIsPausedRec(false);
    setPlaybackTimeMs(0);
    recTimeoutIds.current.forEach(id => clearTimeout(id));
    recTimeoutIds.current = [];
  };

  const saveCurrentRecording = () => {
    if (recordedEvents.length === 0) return;
    const name = prompt('Enter a name for your recording:', `MIDI Song ${savedRecordings.length + 1}`);
    if (!name) return;

    const newRec: SavedRecording = {
      id: Date.now(),
      name,
      date: new Date().toLocaleDateString(),
      durationMs: recordedEvents[recordedEvents.length - 1].time,
      bpm,
      events: recordedEvents
    };

    const updated = [...savedRecordings, newRec];
    setSavedRecordings(updated);
    localStorage.setItem('apex_piano_recordings', JSON.stringify(updated));

    const blob = new Blob([JSON.stringify(newRec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteRecording = (id: number) => {
    const updated = savedRecordings.filter(r => r.id !== id);
    setSavedRecordings(updated);
    localStorage.setItem('apex_piano_recordings', JSON.stringify(updated));
  };

  const getAllowedScaleNotes = (): Set<string> | null => {
    if (scaleType === 'none') return null;
    const map: Record<ScaleType, string[]> = {
      none: [],
      c_major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      g_major: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
      d_major: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
      a_major: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
      f_major: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
      a_minor: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      e_minor: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
      pentatonic: ['A', 'C', 'D', 'E', 'G'],
      blues: ['A', 'C', 'D', 'D#', 'E', 'G']
    };
    return new Set(map[scaleType] || []);
  };

  const accuracyPct = totalNotesPlayed === 0 ? 100 : Math.max(0, Math.round(((totalNotesPlayed - wrongNotesCount) / totalNotesPlayed) * 100));

  return (
    <div className="studio-app">
      <TopBar
        instrument={instrument}
        transpose={transpose}
        bpm={bpm}
        isRecording={isRecording}
        onOpenKeymapModal={() => setIsKeymapModalOpen(true)}
      />

      <div className="workstation-body">
        <LeftPanel
          selectedSong={selectedSong}
          onSelectSong={setSelectedSong}
          isPlayingGuide={isPlayingGuide}
          onPlayGuide={playSongGuide}
          onStopGuide={stopSongGuide}
          guideSpeed={guideSpeed}
          onChangeGuideSpeed={setGuideSpeed}
          isLoopingSection={isLoopingSection}
          onToggleLoopSection={() => setIsLoopingSection(prev => !prev)}
          currentStepIndex={currentStepIndex}
          wrongNotesCount={wrongNotesCount}
          accuracyPct={accuracyPct}
          savedRecordings={savedRecordings}
          onPlayRecording={(rec) => {
            setRecordedEvents(rec.events);
            playRecording();
          }}
          onDeleteRecording={deleteRecording}
        />

        <main className="center-deck">
          <div className="visualizer-deck">
            <div className="viz-header">
              <span className="viz-label">PIANO ROLL &amp; AUDIO SPECTRUM</span>
              <div className="viz-toggles">
                <button className={`viz-btn ${vizMode === 'waveform' ? 'active' : ''}`} onClick={() => setVizMode('waveform')}>
                  Waveform
                </button>
                <button className={`viz-btn ${vizMode === 'bars' ? 'active' : ''}`} onClick={() => setVizMode('bars')}>
                  Spectrum
                </button>
              </div>
            </div>
            <PianoRollVisualizer
              vizMode={vizMode}
              activeNotes={activeNotes}
              getKeyXPosition={(n) => keyPositionsRef.current.get(n) || null}
            />
          </div>

          <div className="piano-stage">
            <PianoKeyboard
              noteConfigs={noteConfigs}
              octaveShift={octaveShift}
              activeNotes={activeNotes}
              guidedNotes={guidedNotes}
              allowedScaleNotes={getAllowedScaleNotes()}
              labelMode={labelMode}
              onPressNote={pressNote}
              onReleaseNote={releaseNote}
              onRegisterPos={(n, x, w, b) => keyPositionsRef.current.set(n, { x, width: w, isBlack: b })}
            />
          </div>
        </main>

        <RightPanel
          instrument={instrument}
          onChangeInstrument={setInstrument}
          volume={volume}
          onChangeVolume={setVolume}
          isMuted={isMuted}
          onToggleMute={() => {
            const muted = audioEngine.toggleMute();
            setIsMuted(muted);
          }}
          octaveShift={octaveShift}
          onChangeOctave={(delta) => setOctaveShift(prev => Math.max(-3, Math.min(3, prev + delta)))}
          transpose={transpose}
          onChangeTranspose={setTranspose}
          sustain={sustain}
          onToggleSustain={() => setSustain(prev => !prev)}
          velocitySensitivity={velocitySensitivity}
          onChangeVelocity={setVelocitySensitivity}
          polyphonyLimit={polyphonyLimit}
          onChangePolyphony={setPolyphonyLimit}
          chordType={chordType}
          onChangeChordType={setChordType}
          scaleType={scaleType}
          onChangeScaleType={setScaleType}
          dspSettings={dspSettings}
          onChangeDspSettings={setDspSettings}
          labelMode={labelMode}
          onToggleLabelMode={() => {
            setLabelMode(prev => prev === 'keyboard' ? 'notes' : (prev === 'notes' ? 'none' : 'keyboard'));
          }}
        />
      </div>

      <BottomTimeline
        isRecording={isRecording}
        onStartRecord={startRecording}
        onStopRecord={stopRecording}
        isPlayingRec={isPlayingRec}
        isPausedRec={isPausedRec}
        onPlayRec={playRecording}
        onPauseRec={() => setIsPausedRec(true)}
        onResumeRec={() => setIsPausedRec(false)}
        onStopRec={stopRecordingPlayback}
        onClearRec={() => setRecordedEvents([])}
        onSaveRec={saveCurrentRecording}
        recordedEvents={recordedEvents}
        playbackTimeMs={playbackTimeMs}
        bpm={bpm}
        onBpmChange={(b) => {
          setBpm(b);
          metronomeEngine.setBpm(b);
        }}
        isMetronomeActive={isMetronomeActive}
        onToggleMetronome={() => {
          const active = metronomeEngine.toggle();
          setIsMetronomeActive(active);
        }}
      />

      <KeymapEditorModal
        noteConfigs={noteConfigs}
        isOpen={isKeymapModalOpen}
        onClose={() => setIsKeymapModalOpen(false)}
        onSaveKeymap={(newConfigs) => {
          setNoteConfigs(newConfigs);
          localStorage.setItem('apex_piano_keymap', JSON.stringify(newConfigs));
        }}
        onResetDefault={() => {
          setNoteConfigs(DEFAULT_NOTE_CONFIGS);
          localStorage.setItem('apex_piano_keymap', JSON.stringify(DEFAULT_NOTE_CONFIGS));
        }}
      />
    </div>
  );
}
