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

export type DecodeResult =
  | { status: 'ok'; data: ChallengeData }
  | { status: 'unsupported' }
  | { status: 'invalid' };

// ── V2 compact format ──
// Pipe-delimited: name|modeIndex|timeLimit|flagIds|correctBits|times
// - modeIndex: single digit index into CHALLENGE_MODES
// - flagIds: joined 2-char codes (e.g. "usgbfrde")
// - correctBits: binary string "10110..." (1=correct, 0=wrong)
// - times: comma-separated deciseconds (e.g. "23,45,18" for 2.3s, 4.5s, 1.8s)

const MODE_INDEX = new Map(CHALLENGE_MODES.map((m, i) => [m, i]));
const INDEX_MODE = new Map(CHALLENGE_MODES.map((m, i) => [i, m]));

/**
 * Encode challenge data into a shareable string.
 * V2 format: "FT2:" + base64(compact pipe-delimited string)
 * Returns null if encoding fails (e.g. invalid flag IDs).
 */
export function encodeChallenge(data: ChallengeData): string | null {
  // V2 format requires all flag IDs to be exactly 2 chars (ISO 3166-1 alpha-2)
  if (data.flagIds.some((id) => id.length !== 2)) {
    return null;
  }
  const modeIdx = MODE_INDEX.get(data.mode);
  if (modeIdx === undefined) {
    return null;
  }
  const flags = data.flagIds.join('');
  const bits = data.hostResults.map((r) => r.correct ? '1' : '0').join('');
  // Store times as deciseconds (divide ms by 100, round) to save chars
  const times = data.hostResults.map((r) => Math.round(r.timeMs / 100)).join(',');
  const payload = `${data.hostName}|${modeIdx}|${data.timeLimit}|${flags}|${bits}|${times}`;
  const encoded = toBase64(payload);
  return `FT2:${encoded}`;
}

/**
 * Decode a challenge code string back into ChallengeData.
 * Supports both V2 (FT2:) and legacy V1 (FT:) formats.
 */
export function decodeChallenge(code: string): DecodeResult {
  try {
    const trimmed = code.trim();
    if (trimmed.startsWith('FT2:')) {
      const data = decodeV2(trimmed.slice(4));
      return data ? { status: 'ok', data } : { status: 'invalid' };
    }
    if (trimmed.startsWith('FT:')) {
      const data = decodeV1(trimmed.slice(3));
      return data ? { status: 'ok', data } : { status: 'invalid' };
    }
    // FT: (V1) and FT2: (V2) are handled above via startsWith checks.
    // Any other FTn: prefix indicates a newer format we can't decode.
    // This regex matches FT followed by one or more digits and a colon.
    if (/^FT\d+:/.test(trimmed)) {
      return { status: 'unsupported' };
    }
    return { status: 'invalid' };
  } catch {
    return { status: 'invalid' };
  }
}

function decodeV2(encoded: string): ChallengeData | null {
  const payload = fromBase64(encoded);
  const parts = payload.split('|');
  if (parts.length !== 6) return null;

  const [hostName, modeIdxStr, timeLimitStr, flags, bits, timesStr] = parts;
  if (!hostName || hostName.length > 50 || flags.length === 0 || flags.length % 2 !== 0) return null;

  const modeIdx = parseInt(modeIdxStr, 10);
  const mode = INDEX_MODE.get(modeIdx);
  if (!mode) return null;

  const timeLimit = parseInt(timeLimitStr, 10);
  if (isNaN(timeLimit)) return null;

  // Split flag IDs (each is 2 chars)
  const flagIds: string[] = [];
  for (let i = 0; i < flags.length; i += 2) {
    flagIds.push(flags.slice(i, i + 2));
  }

  if (bits.length !== flagIds.length) return null;

  const times = timesStr.split(',');
  if (times.length !== flagIds.length) return null;

  const hostResults = flagIds.map((_, i) => ({
    correct: bits[i] === '1',
    timeMs: parseInt(times[i], 10) * 100,
  }));

  return { hostName, mode, timeLimit, flagIds, hostResults };
}

// Legacy V1 decoder for backwards compatibility
interface CompactChallengeV1 {
  n: string;
  m: string;
  t: number;
  f: string[];
  r: [number, number][];
}

function decodeV1(encoded: string): ChallengeData | null {
  const json = fromBase64(encoded);
  const compact: CompactChallengeV1 = JSON.parse(json);

  if (!compact.n || typeof compact.t !== 'number' || !Array.isArray(compact.f) || !Array.isArray(compact.r)) {
    return null;
  }
  if (compact.f.length === 0 || compact.f.length !== compact.r.length) {
    return null;
  }

  const mode = (compact.m || 'flagpuzzle') as GameMode;
  if (!CHALLENGE_MODES.includes(mode)) return null;

  return {
    hostName: compact.n,
    mode,
    timeLimit: compact.t,
    flagIds: compact.f,
    hostResults: compact.r.map(([c, t]) => ({ correct: c === 1, timeMs: t })),
  };
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

/** Screen names that support challenge play */
export type ChallengeScreenName = 'Game' | 'FlagPuzzle' | 'Neighbors' | 'CapitalConnection';

/**
 * Get the navigation screen name for a given game mode.
 */
export function getScreenForMode(mode: GameMode): ChallengeScreenName {
  const map: Partial<Record<GameMode, ChallengeScreenName>> = {
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
