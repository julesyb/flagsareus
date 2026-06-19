/**
 * Tests for the Fact of the Day data and selection logic.
 * Guards the integrity of the curated trivia pool: every fact must have
 * complete, parallel content across all locales and a valid answer.
 */
import { DAILY_FACTS, getFactForDate, getFactContent } from '../dailyFacts';
import { getAllFlags } from '../index';
import type { LocaleCode } from '../../utils/i18n';

const LOCALES: LocaleCode[] = ['en', 'fr', 'es', 'de', 'pt-BR', 'zh'];

describe('DAILY_FACTS data integrity', () => {
  it('has a non-empty pool with unique ids', () => {
    expect(DAILY_FACTS.length).toBeGreaterThan(0);
    const ids = DAILY_FACTS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(DAILY_FACTS.map((f) => [f.id, f] as const))('fact "%s" is well formed', (_id, fact) => {
    // Every locale present
    for (const loc of LOCALES) {
      expect(fact.content[loc]).toBeDefined();
      const c = fact.content[loc];
      expect(c.question.trim().length).toBeGreaterThan(0);
      expect(c.fact.trim().length).toBeGreaterThan(0);
      // Exactly four options, none empty
      expect(c.options).toHaveLength(4);
      for (const opt of c.options) {
        expect(opt.trim().length).toBeGreaterThan(0);
      }
    }

    // Answer index points at a real option
    expect(fact.answer).toBeGreaterThanOrEqual(0);
    expect(fact.answer).toBeLessThan(4);

    // No accidental duplicate options within a locale
    for (const loc of LOCALES) {
      const opts = fact.content[loc].options;
      expect(new Set(opts).size).toBe(opts.length);
    }
  });

  it('references only real flag codes', () => {
    const flagIds = new Set(getAllFlags().map((f) => f.id.toLowerCase()));
    for (const fact of DAILY_FACTS) {
      if (fact.flagId) {
        expect(flagIds.has(fact.flagId.toLowerCase())).toBe(true);
      }
    }
  });

  it('forbids em dashes and emoji in user-facing text', () => {
    const emDash = /[—–]/; // em dash / en dash
    const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    for (const fact of DAILY_FACTS) {
      for (const loc of LOCALES) {
        const c = fact.content[loc];
        for (const text of [c.question, c.fact, ...c.options]) {
          expect(text).not.toMatch(emDash);
          expect(text).not.toMatch(emoji);
        }
      }
    }
  });
});

describe('getFactForDate', () => {
  it('is deterministic for a given date', () => {
    const a = getFactForDate('2026-06-19');
    const b = getFactForDate('2026-06-19');
    expect(a.id).toBe(b.id);
  });

  it('varies across nearby dates', () => {
    const dates = ['2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22', '2026-06-23'];
    const ids = dates.map((d) => getFactForDate(d).id);
    // Not all identical — the selection actually rotates day to day
    expect(new Set(ids).size).toBeGreaterThan(1);
  });

  it('always returns a fact from the pool', () => {
    const poolIds = new Set(DAILY_FACTS.map((f) => f.id));
    for (let i = 1; i <= 60; i++) {
      const date = `2026-07-${String(i).padStart(2, '0')}`;
      expect(poolIds.has(getFactForDate(date).id)).toBe(true);
    }
  });
});

describe('getFactContent', () => {
  it('falls back to English for an unknown locale', () => {
    const fact = DAILY_FACTS[0];
    const content = getFactContent(fact, 'xx' as LocaleCode);
    expect(content).toBe(fact.content.en);
  });

  it('returns the requested locale when available', () => {
    const fact = DAILY_FACTS[0];
    expect(getFactContent(fact, 'fr')).toBe(fact.content.fr);
  });
});
