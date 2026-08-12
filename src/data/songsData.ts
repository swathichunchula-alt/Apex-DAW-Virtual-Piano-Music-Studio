import type { Song } from '../types/piano';

export const SONGS_DATABASE: Song[] = [
  {
    id: 'fur_elise',
    title: 'Für Elise',
    artist: 'Ludwig van Beethoven',
    category: 'Classical',
    difficulty: 'Medium',
    diffClass: 'diff-medium',
    tempo: 130,
    sequence: [
      { note: 'E5', label: 'E5', duration: 300, gap: 50 },
      { note: 'D#5', label: 'D#5', duration: 300, gap: 50 },
      { note: 'E5', label: 'E5', duration: 300, gap: 50 },
      { note: 'D#5', label: 'D#5', duration: 300, gap: 50 },
      { note: 'E5', label: 'E5', duration: 300, gap: 50 },
      { note: 'B4', label: 'B4', duration: 300, gap: 50 },
      { note: 'D5', label: 'D5', duration: 300, gap: 50 },
      { note: 'C5', label: 'C5', duration: 300, gap: 50 },
      { note: 'A4', label: 'A4', duration: 600, gap: 150 },
      { note: 'C4', label: 'C4', duration: 300, gap: 50 },
      { note: 'E4', label: 'E4', duration: 300, gap: 50 },
      { note: 'A4', label: 'A4', duration: 300, gap: 50 },
      { note: 'B4', label: 'B4', duration: 600, gap: 150 },
      { note: 'E4', label: 'E4', duration: 300, gap: 50 },
      { note: 'G#4', label: 'G#4', duration: 300, gap: 50 },
      { note: 'B4', label: 'B4', duration: 300, gap: 50 },
      { note: 'C5', label: 'C5', duration: 600, gap: 200 }
    ]
  },
  {
    id: 'canon_in_d',
    title: 'Canon in D',
    artist: 'Johann Pachelbel',
    category: 'Classical',
    difficulty: 'Medium',
    diffClass: 'diff-medium',
    tempo: 110,
    sequence: [
      { note: 'F#5', label: 'F#5', duration: 500, gap: 100 },
      { note: 'E5', label: 'E5', duration: 500, gap: 100 },
      { note: 'D5', label: 'D5', duration: 500, gap: 100 },
      { note: 'C#5', label: 'C#5', duration: 500, gap: 100 },
      { note: 'B4', label: 'B4', duration: 500, gap: 100 },
      { note: 'A4', label: 'A4', duration: 500, gap: 100 },
      { note: 'B4', label: 'B4', duration: 500, gap: 100 },
      { note: 'C#5', label: 'C#5', duration: 500, gap: 100 }
    ]
  },
  {
    id: 'moonlight',
    title: 'Moonlight Sonata',
    artist: 'Ludwig van Beethoven',
    category: 'Classical',
    difficulty: 'Hard',
    diffClass: 'diff-hard',
    tempo: 90,
    sequence: [
      { note: 'G#4', label: 'G#4', duration: 400, gap: 50 },
      { note: 'C#5', label: 'C#5', duration: 400, gap: 50 },
      { note: 'E5', label: 'E5', duration: 400, gap: 50 },
      { note: 'G#4', label: 'G#4', duration: 400, gap: 50 },
      { note: 'C#5', label: 'C#5', duration: 400, gap: 50 },
      { note: 'E5', label: 'E5', duration: 400, gap: 50 },
      { note: 'A4', label: 'A4', duration: 400, gap: 50 },
      { note: 'C#5', label: 'C#5', duration: 400, gap: 50 },
      { note: 'E5', label: 'E5', duration: 400, gap: 50 }
    ]
  },
  {
    id: 'ode_to_joy',
    title: 'Ode to Joy',
    artist: 'Ludwig van Beethoven',
    category: 'Beginner',
    difficulty: 'Easy',
    diffClass: 'diff-easy',
    tempo: 120,
    sequence: [
      { note: 'E4', label: 'E4', duration: 400, gap: 50 },
      { note: 'E4', label: 'E4', duration: 400, gap: 50 },
      { note: 'F4', label: 'F4', duration: 400, gap: 50 },
      { note: 'G4', label: 'G4', duration: 400, gap: 50 },
      { note: 'G4', label: 'G4', duration: 400, gap: 50 },
      { note: 'F4', label: 'F4', duration: 400, gap: 50 },
      { note: 'E4', label: 'E4', duration: 400, gap: 50 },
      { note: 'D4', label: 'D4', duration: 400, gap: 50 },
      { note: 'C4', label: 'C4', duration: 400, gap: 50 },
      { note: 'C4', label: 'C4', duration: 400, gap: 50 },
      { note: 'D4', label: 'D4', duration: 400, gap: 50 },
      { note: 'E4', label: 'E4', duration: 400, gap: 50 },
      { note: 'E4', label: 'E4', duration: 600, gap: 50 },
      { note: 'D4', label: 'D4', duration: 200, gap: 50 },
      { note: 'D4', label: 'D4', duration: 800, gap: 200 }
    ]
  },
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    artist: 'Traditional',
    category: 'Beginner',
    difficulty: 'Easy',
    diffClass: 'diff-easy',
    tempo: 110,
    sequence: [
      { note: 'C4', label: 'C4', duration: 400, gap: 100 },
      { note: 'C4', label: 'C4', duration: 400, gap: 100 },
      { note: 'G4', label: 'G4', duration: 400, gap: 100 },
      { note: 'G4', label: 'G4', duration: 400, gap: 100 },
      { note: 'A4', label: 'A4', duration: 400, gap: 100 },
      { note: 'A4', label: 'A4', duration: 400, gap: 100 },
      { note: 'G4', label: 'G4', duration: 800, gap: 200 },
      { note: 'F4', label: 'F4', duration: 400, gap: 100 },
      { note: 'F4', label: 'F4', duration: 400, gap: 100 },
      { note: 'E4', label: 'E4', duration: 400, gap: 100 },
      { note: 'E4', label: 'E4', duration: 400, gap: 100 },
      { note: 'D4', label: 'D4', duration: 400, gap: 100 },
      { note: 'D4', label: 'D4', duration: 400, gap: 100 },
      { note: 'C4', label: 'C4', duration: 800, gap: 300 }
    ]
  },
  {
    id: 'happy_birthday',
    title: 'Happy Birthday',
    artist: 'Popular Melody',
    category: 'Popular',
    difficulty: 'Easy',
    diffClass: 'diff-easy',
    tempo: 100,
    sequence: [
      { note: 'C4', label: 'C4', duration: 300, gap: 50 },
      { note: 'C4', label: 'C4', duration: 300, gap: 50 },
      { note: 'D4', label: 'D4', duration: 500, gap: 50 },
      { note: 'C4', label: 'C4', duration: 500, gap: 50 },
      { note: 'F4', label: 'F4', duration: 500, gap: 50 },
      { note: 'E4', label: 'E4', duration: 800, gap: 150 },
      { note: 'C4', label: 'C4', duration: 300, gap: 50 },
      { note: 'C4', label: 'C4', duration: 300, gap: 50 },
      { note: 'D4', label: 'D4', duration: 500, gap: 50 },
      { note: 'C4', label: 'C4', duration: 500, gap: 50 },
      { note: 'G4', label: 'G4', duration: 500, gap: 50 },
      { note: 'F4', label: 'F4', duration: 800, gap: 200 }
    ]
  }
];
