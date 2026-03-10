import { GameMode, FlagItem, GameQuestion, GameResult, GameConfig } from '../types';
import { getFlagsForCategory, getAllFlags } from '../data';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateQuestions(config: GameConfig): GameQuestion[] {
  const categoryFlags = getFlagsForCategory(config.category);

  if (categoryFlags.length === 0) return [];

  const shuffledFlags = shuffleArray(categoryFlags);
  const count = Math.min(config.questionCount, categoryFlags.length);
  const selectedFlags = shuffledFlags.slice(0, count);

  // For options, pull from all flags to make it interesting
  const allFlags = getAllFlags();

  return selectedFlags.map((flag) => {
    const options = generateOptions(flag, allFlags, config.mode);
    return { flag, options };
  });
}

function generateOptions(correctFlag: FlagItem, allFlags: FlagItem[], mode: GameMode): string[] {
  if (mode === 'hard' || mode === 'headsup') return [];

  const choiceCount = mode === 'easy' ? 2 : 4;
  const otherFlags = allFlags.filter((f) => f.id !== correctFlag.id);
  const shuffledOthers = shuffleArray(otherFlags);
  const wrongOptions = shuffledOthers.slice(0, choiceCount - 1).map((f) => f.name);

  return shuffleArray([correctFlag.name, ...wrongOptions]);
}

export function checkAnswer(userAnswer: string, correctName: string): boolean {
  const normalize = (s: string) =>
    s.toLowerCase()
      .trim()
      .replace(/['']/g, "'")
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ');

  return normalize(userAnswer) === normalize(correctName);
}

export function calculateAccuracy(results: GameResult[]): number {
  if (results.length === 0) return 0;
  const correct = results.filter((r) => r.correct).length;
  return Math.round((correct / results.length) * 100);
}

export function getStreakFromResults(results: GameResult[]): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const result of results) {
    if (result.correct) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

export function getGrade(accuracy: number): { label: string; color: string } {
  if (accuracy >= 95) return { label: 'S', color: '#FFD700' };
  if (accuracy >= 90) return { label: 'A+', color: '#34C759' };
  if (accuracy >= 80) return { label: 'A', color: '#34C759' };
  if (accuracy >= 70) return { label: 'B', color: '#4A90D9' };
  if (accuracy >= 60) return { label: 'C', color: '#FF9500' };
  if (accuracy >= 50) return { label: 'D', color: '#FF6B35' };
  return { label: 'F', color: '#FF3B30' };
}
