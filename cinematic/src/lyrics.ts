// Verified LRCLIB lyric text with word-level timings from OpenAI Whisper small.en
// (full rescan of "Sequence 01.mp4" original audio; bass render shares exact timing).
export interface LyricWord { text: string; time: number; end: number }
export interface LyricLine { time: number; end: number; text: string; words: LyricWord[] }

export const LYRICS: LyricLine[] = [
  { time: 30.16, end: 33.7, text: "Only love never hesitates", words: [{ text: "only", time: 30.16, end: 31.2 }, { text: "love", time: 31.2, end: 31.8 }, { text: "never", time: 31.8, end: 32.28 }, { text: "hesitates", time: 32.28, end: 33.7 }] },
  { time: 33.7, end: 36.45, text: "Only trust has a price to pay", words: [{ text: "only", time: 33.7, end: 34.86 }, { text: "trust", time: 34.86, end: 35.6 }, { text: "has", time: 35.6, end: 35.98 }, { text: "a", time: 35.98, end: 36.14 }, { text: "price", time: 36.14, end: 36.4 }, { text: "to", time: 36.4, end: 37.24 }, { text: "pay", time: 36.1, end: 36.45 }] },
  { time: 38.0, end: 40.58, text: "Like a flower in a hurricane", words: [{ text: "like", time: 38.0, end: 38.72 }, { text: "a", time: 38.72, end: 39.0 }, { text: "flower", time: 39.0, end: 39.36 }, { text: "in", time: 39.36, end: 39.8 }, { text: "a", time: 39.8, end: 40.02 }, { text: "hurricane", time: 40.02, end: 40.58 }] },
  { time: 40.58, end: 45.14, text: "We see the sun rise into another day", words: [{ text: "we", time: 40.58, end: 41.54 }, { text: "see", time: 41.54, end: 41.6 }, { text: "the", time: 41.6, end: 41.84 }, { text: "sun", time: 41.84, end: 42.22 }, { text: "rise", time: 42.22, end: 42.98 }, { text: "into", time: 42.98, end: 43.5 }, { text: "another", time: 43.5, end: 44.02 }, { text: "day", time: 44.02, end: 45.14 }] },
  { time: 45.14, end: 49.04, text: "Only love never hesitates", words: [{ text: "only", time: 45.14, end: 46.5 }, { text: "love", time: 46.5, end: 47.06 }, { text: "never", time: 47.06, end: 47.56 }, { text: "hesitates", time: 47.56, end: 49.04 }] },
  { time: 49.04, end: 51.79, text: "Only trust has a price to pay", words: [{ text: "only", time: 49.04, end: 50.16 }, { text: "trust", time: 50.16, end: 50.88 }, { text: "has", time: 50.88, end: 51.22 }, { text: "a", time: 51.22, end: 51.52 }, { text: "price", time: 51.52, end: 51.64 }, { text: "to", time: 51.64, end: 52.7 }, { text: "pay", time: 51.44, end: 51.79 }] },
  { time: 52.7, end: 55.98, text: "Like a flower in a hurricane", words: [{ text: "like", time: 52.7, end: 53.86 }, { text: "a", time: 53.86, end: 54.2 }, { text: "flower", time: 54.2, end: 54.62 }, { text: "in", time: 54.62, end: 55.06 }, { text: "a", time: 55.06, end: 55.26 }, { text: "hurricane", time: 55.26, end: 55.98 }] },
  { time: 55.98, end: 60.2, text: "I will die before I walk away, walk away", words: [{ text: "i", time: 55.98, end: 56.64 }, { text: "will", time: 56.64, end: 56.84 }, { text: "die", time: 56.84, end: 57.3 }, { text: "before", time: 57.3, end: 57.82 }, { text: "i", time: 57.82, end: 58.1 }, { text: "walk", time: 58.1, end: 58.36 }, { text: "away", time: 58.36, end: 58.92 }, { text: "walk", time: 59.02, end: 59.26 }, { text: "away", time: 59.26, end: 60.2 }] },

];

export function currentLyricIndex(time: number): number {
  let idx = -1;
  for (let i = 0; i < LYRICS.length; i++) {
    if (time >= LYRICS[i].time) idx = i;
    else break;
  }
  return idx;
}

export function currentWordIndex(line: LyricLine, time: number): number {
  let idx = -1;
  for (let i = 0; i < line.words.length; i++) {
    if (time >= line.words[i].time) idx = i;
    else break;
  }
  return idx;
}
