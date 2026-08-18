/**
 * Dependency-free text splitting for reveal animations.
 * Returns plain data so components stay declarative — no DOM mutation,
 * which keeps the markup server-renderable and screen-reader friendly
 * (callers wrap the visual output in aria-hidden and supply an sr-only original).
 */

export interface SplitWord {
  readonly text: string;
  readonly chars: readonly string[];
  /** Global character offset — use it to compute a continuous stagger delay. */
  readonly offset: number;
}

/** Split a line into words, each carrying its characters and a global offset. */
export function splitWords(text: string): SplitWord[] {
  const words = text.split(' ').filter(Boolean);
  let offset = 0;

  return words.map((word) => {
    const chars = Array.from(word);
    const entry: SplitWord = { text: word, chars, offset };
    offset += chars.length;
    return entry;
  });
}

/** Split a paragraph into sentence-ish lines for line-by-line reveals. */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?—])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/** Total character count, for sizing a stagger sequence. */
export const charCount = (text: string): number => Array.from(text.replace(/\s/g, '')).length;
