# Apex-DAW-Virtual-Piano-Music-Studio
Apex DAW is a browser-based virtual piano and music studio that lets users play piano using a laptop keyboard, practice songs, visualize notes with a piano roll and audio spectrum, record MIDI performances, and customize sound with volume, sustain, transpose, velocity, reverb, delay, chorus, and EQ controls.
# 🎹 Apex DAW – Advanced Virtual Piano & Music Studio

**Apex DAW** is an advanced browser-based virtual piano and music studio designed to provide an interactive digital piano experience directly from a laptop or desktop. The application combines a realistic virtual piano keyboard with music practice tools, piano-roll visualization, audio analysis, instrument controls, MIDI recording, and professional-style audio effects.

The project is designed for beginners, music learners, and advanced users who want to experiment with piano playing and music creation without requiring physical piano hardware.

## ✨ Key Features

### 🎹 Interactive Virtual Piano

* Fully interactive digital piano keyboard.
* Play notes using the computer keyboard.
* Click or tap piano keys using the mouse.
* Supports multiple octaves and notes.
* Displays the corresponding laptop keyboard key on each piano key.
* Visual feedback when a piano key is pressed.
* Supports simultaneous key presses for chords and melodies.
* Keyboard-based music playing for users without a physical MIDI keyboard.

### 💻 Laptop Keyboard Mapping

The application converts the laptop/desktop keyboard into a virtual piano controller.

Example mappings include:

* `A S D F G H J K L` → Piano white keys
* `W E T Y U` → Piano black keys
* Additional keyboard keys are mapped to higher notes.

This allows users to play melodies directly from their computer keyboard.

### 📖 Music Book / Practice Studio

The built-in **Music Book Studio** provides a dedicated area for learning and practicing songs.

Features include:

* Song library
* Classical songs
* Popular songs
* Beginner-friendly songs
* Song selection
* Practice mode
* Auto-play demonstration
* Stop playback
* Tempo control
* Loop mode
* Song progression
* Practice-oriented interface

Users can select a song and practice it using the virtual piano.

### 🎼 Piano Roll Visualization

The application includes a professional-style **Piano Roll** area for visualizing played notes.

The piano roll can be used to:

* Display musical notes
* Visualize melodies
* Track played notes
* Understand note timing
* Analyze musical sequences
* Provide visual feedback while playing

This makes the application useful not only as a piano simulator but also as a basic music-production environment.

### 🎵 Audio Spectrum & Waveform

The application provides real-time audio visualization.

Supported visualizations include:

* Waveform
* Audio spectrum
* Piano-roll visualization
* Real-time audio feedback

This gives the application a Digital Audio Workstation (DAW)-style experience.

## 🎛️ Advanced Audio Controls

A dedicated **Audio Controls & DSP** panel provides detailed control over the piano sound.

### Instrument Engine

Users can select and configure the instrument engine, including:

* Grand Piano
* Instrument presets
* Digital instrument sounds

The architecture can be extended with additional instruments in the future.

### 🔊 Master Volume

Control the overall output volume using the master volume control.

### 🎚️ Octave Shift

Users can shift the piano keyboard across different octaves to access higher and lower notes.

### 🎼 Transpose

The transpose control allows users to shift the pitch of the entire keyboard without changing the physical keyboard mapping.

### 🦶 Sustain Pedal

Includes sustain functionality to simulate a real piano sustain pedal.

The sustain system allows notes to continue playing after releasing the corresponding key.

### 🎹 Key Velocity

Velocity controls how strongly a note is played.

This helps create more realistic piano performances by allowing different playing intensities.

### 🎶 Polyphony

The piano engine supports multiple simultaneously playing notes, allowing users to play:

* Chords
* Melodies
* Arpeggios
* Two-handed combinations

## 🎚️ Studio DSP Effects

The application includes a studio-style effects rack with multiple audio-processing controls.

Available effects include:

* Reverb Mix
* Delay Mix
* Chorus Mix
* EQ Low
* EQ Mid
* EQ High

These effects allow users to customize the sound and create different musical atmospheres.

## 🎼 Chord Mode

The application includes configurable chord functionality.

Users can experiment with:

* Single-note mode
* Chord-based playing
* Multiple simultaneous notes
* Chord progressions

This makes it easier for beginners to experiment with harmony.

## 🎯 Scale Note Highlighter

A scale note highlighter can be used to identify notes belonging to a selected musical scale.

This feature can help beginners learn:

* Musical scales
* Note relationships
* Melody construction
* Basic music theory

## 🎚️ Tempo Control

The music practice system includes tempo control.

Users can:

* Slow down songs for learning
* Increase tempo for practice
* Maintain a normal playback speed
* Practice difficult sections repeatedly

## 🔁 Loop Practice

The loop feature allows users to repeatedly play a selected musical sequence.

This is useful for:

* Learning difficult passages
* Repeating melodies
* Practicing chords
* Improving timing
* Learning songs gradually

## 🎙️ MIDI Recording

The application includes a MIDI recording system for capturing performances.

Recorded performances can be used to:

* Save musical ideas
* Replay performances
* Analyze notes
* Practice melodies
* Build musical sequences

The project is designed to support MIDI-based workflows and can be extended with additional MIDI functionality.

## ⚙️ Keymap Editor

The **Keymap Editor** allows users to customize the relationship between computer keyboard keys and piano notes.

This makes the application more flexible for different keyboard layouts and user preferences.

## 🎨 User Interface

The interface follows a professional dark-themed music-production design.

The main workspace is divided into:

### Left Panel

**Music Book Studio**

Contains:

* Song library
* Song categories
* Practice controls
* Auto-play
* Stop
* Tempo
* Loop
* MIDI recordings

### Center Panel

**Piano Roll & Audio Spectrum**

Contains:

* Piano roll
* Waveform visualization
* Spectrum visualization
* Musical note visualization

### Bottom Panel

**Virtual Piano Keyboard**

Contains:

* Piano keys
* Black and white keys
* Laptop keyboard labels
* Note names
* Interactive key feedback

### Right Panel

**Audio Controls & DSP**

Contains:

* Instrument selection
* Master volume
* Octave shift
* Transpose
* Sustain
* Velocity
* Polyphony
* Chord mode
* Scale highlighting
* Studio effects
* EQ controls

## 🚀 Main Use Cases

Apex DAW can be used for:

* 🎹 Learning piano
* 🎼 Practicing songs
* 🎵 Creating melodies
* 🎶 Experimenting with chords
* 🎧 Audio experimentation
* 🎛️ Learning basic DAW concepts
* 💻 Playing piano without physical hardware
* 📖 Practicing beginner music
* 🎙️ Recording musical ideas
* 🎚️ Experimenting with audio effects

## 🧠 Project Concept

The main idea behind Apex DAW is to transform a normal computer keyboard into an interactive musical instrument.

Instead of requiring an expensive MIDI keyboard or physical piano, users can open the application in a web browser and immediately start playing.

The project combines:

**Computer Keyboard → Virtual Piano → Audio Engine → DSP Effects → Visualization → Music Practice**

This creates an all-in-one browser-based music environment.

## 🛠️ Technology Stack

The project is designed as a modern web-based music application using technologies such as:

* HTML5
* CSS3
* JavaScript / TypeScript
* Web Audio API
* Audio processing
* MIDI concepts
* Responsive UI
* Browser-based audio visualization

The Web Audio API enables real-time audio generation and processing directly inside the browser.

## 🏗️ Application Architecture

```text
                 ┌─────────────────────┐
                 │   Laptop Keyboard   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Keymap / Input    │
                 │      Engine         │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Piano Note Engine │
                 └──────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Volume  │  │ Sustain  │  │ Velocity │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             └─────────────┼─────────────┘
                           ▼
                 ┌─────────────────────┐
                 │    Audio Engine     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    DSP Effects     │
                 │ Reverb / Delay /   │
                 │ Chorus / EQ        │
                 └──────────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        ┌────────────────┐    ┌────────────────┐
        │ Audio Output   │    │ Visualization  │
        │                │    │ Waveform /     │
        │                │    │ Spectrum       │
        └────────────────┘    └────────────────┘
```

## 📚 Practice Workflow

A typical user workflow is:

1. Open Apex DAW.
2. Select a song from the Music Book.
3. Choose a practice mode.
4. Adjust the tempo.
5. Enable loop mode if required.
6. Play notes using the laptop keyboard.
7. View the notes on the piano roll.
8. Adjust volume, sustain, velocity, and effects.
9. Record the performance if required.
10. Replay and improve the performance.

## 🔮 Future Enhancements

The project can be expanded with advanced features such as:

* MIDI keyboard hardware support
* MIDI file import/export
* MIDI recording and editing
* Sheet music generation
* Automatic chord detection
* AI-powered melody generation
* AI music composition
* Real-time pitch detection
* More realistic piano samples
* Multiple instrument libraries
* Drum machine
* Bass instruments
* Guitar instruments
* Beat sequencer
* Multi-track recording
* Audio file export
* WAV/MP3 rendering
* Cloud song library
* User-created songs
* Custom scales
* Advanced MIDI mapping
* Metronome
* Music theory learning mode
* Performance scoring
* Note accuracy detection

## 📸 Project Preview

The application provides a complete music-production workspace with a **Music Book**, **Piano Roll**, **Audio Spectrum**, **Virtual Piano**, and **Advanced Audio/DSP Controls** in a single browser interface.

## 🎯 Project Goal

The goal of Apex DAW is to create a powerful and accessible browser-based piano and music-production environment that combines **learning, playing, recording, visualization, and audio processing** into one application.

It demonstrates how modern web technologies can be used to build interactive musical instruments and real-time audio applications without requiring dedicated desktop music software.

## ⭐ Why Apex DAW?

Unlike a simple virtual piano, Apex DAW combines multiple systems into one application:

**Virtual Piano + Music Library + Practice Mode + Piano Roll + Audio Visualization + MIDI Workflow + DSP Effects + Key Mapping**

This makes it a more complete **browser-based digital music workstation** rather than just a piano simulator.

---

## 👩‍💻 Author

**Swathi Chunchula**

B.Tech – Computer Science & Engineering (AI)

Interested in **Artificial Intelligence, Web Development, AI-powered applications, and innovative software projects**.

---

## 📌 Project Status

🚧 **Actively Developing**

Apex DAW is an evolving project, with additional music-production, MIDI, AI, and audio-processing features planned for future releases.
