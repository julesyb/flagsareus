import { getAllFlags, getFlagsForCategory } from '../data';
import { FlagItem, GameQuestion, GameMode } from '../types';
import { shuffleArray } from './gameEngine';
import { twinPairs } from '../data/countryAliases';

/** Modes that support the challenge feature */
export const CHALLENGE_MODES: GameMode[] = [
  'flagpuzzle', 'easy', 'medium', 'hard', 'timeattack', 'neighbors', 'capitalconnection',
];

export interface ChallengeData {
  hostName: string;
  mode: GameMode;
  timeLimit: number;
  flagIds: string[];
  hostResults: { correct: boolean; timeMs: number }[];
}

interface CompactChallenge {
  n: string;
  m: string;
  t: number;
  f: string[];
  r: [number, number][];
}

/**
 * Encode challenge data into a shareable string.
 * Format: "FT:" + base64(JSON)
 */
export function encodeChallenge(data: ChallengeData): string {
  const compact: CompactChallenge = {
    n: data.hostName,
    m: data.mode,
    t: data.timeLimit,
    f: data.flagIds,
    r: data.hostResults.map((r) => [r.correct ? 1 : 0, r.timeMs]),
  };
  const json = JSON.stringify(compact);
  const encoded = toBase64(json);
  return `FT:${encoded}`;
}

/**
 * Decode a challenge code string back into ChallengeData.
 * Returns null if the code is invalid.
 */
export function decodeChallenge(code: string): ChallengeData | null {
  try {
    const trimmed = code.trim();
    if (!trimmed.startsWith('FT:')) return null;
    const encoded = trimmed.slice(3);
    const json = fromBase64(encoded);
    const compact: CompactChallenge = JSON.parse(json);

    if (!compact.n || typeof compact.t !== 'number' || !Array.isArray(compact.f) || !Array.isArray(compact.r)) {
      return null;
    }
    if (compact.f.length === 0 || compact.f.length !== compact.r.length) {
      return null;
    }

    const mode = (compact.m || 'flagpuzzle') as GameMode;

    return {
      hostName: compact.n,
      mode,
      timeLimit: compact.t,
      flagIds: compact.f,
      hostResults: compact.r.map(([c, t]) => ({ correct: c === 1, timeMs: t })),
    };
  } catch {
    return null;
  }
}

/**
 * Build GameQuestion array from challenge flag IDs.
 * For modes with multiple choice, generates options per question.
 */
export function buildChallengeQuestions(flagIds: string[], mode: GameMode): GameQuestion[] | null {
  const allFlags = getAllFlags();
  const flagMap = new Map<string, FlagItem>(allFlags.map((f) => [f.id, f]));

  const questions: GameQuestion[] = [];
  for (const id of flagIds) {
    const flag = flagMap.get(id);
    if (!flag) return null;

    // Generate options for modes that need them
    const needsOptions = mode === 'easy' || mode === 'medium' || mode === 'timeattack';
    let options: string[] = [];
    if (needsOptions) {
      const choiceCount = mode === 'easy' ? 2 : 4;
      const otherFlags = allFlags.filter((f) => f.id !== flag.id);
      const twinNames = twinPairs[flag.name] || [];
      const twinFlags = otherFlags.filter((f) => twinNames.includes(f.name));
      const nonTwinFlags = otherFlags.filter((f) => !twinNames.includes(f.name));
      const wrongCount = choiceCount - 1;
      const selectedTwins = shuffleArray(twinFlags).slice(0, wrongCount);
      const remaining = wrongCount - selectedTwins.length;
      const selectedOthers = shuffleArray(nonTwinFlags).slice(0, remaining);
      const wrongOptions = [...selectedTwins, ...selectedOthers].map((f) => f.name);
      options = shuffleArray([flag.name, ...wrongOptions]);
    }

    questions.push({ flag, options });
  }
  return questions;
}

/**
 * Get the navigation screen name for a given game mode.
 */
export function getScreenForMode(mode: GameMode): string {
  const map: Partial<Record<GameMode, string>> = {
    flagpuzzle: 'FlagPuzzle',
    neighbors: 'Neighbors',
    capitalconnection: 'CapitalConnection',
  };
  return map[mode] || 'Game';
}

// ── Base64 helpers (cross-platform) ──

function toBase64(str: string): string {
  if (typeof btoa === 'function') {
    return btoa(unescape(encodeURIComponent(str)));
  }
  // Node/RN fallback
  return Buffer.from(str, 'utf-8').toString('base64');
}

function fromBase64(encoded: string): string {
  if (typeof atob === 'function') {
    return decodeURIComponent(escape(atob(encoded)));
  }
  return Buffer.from(encoded, 'base64').toString('utf-8');
}
