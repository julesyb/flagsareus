/**
 * Tests for the fact library: the curated trivia pool (Fact of the Day) and
 * the GeoFacts browse/quiz layer built on top of it.
 * Guards the integrity of the curated trivia pool: every fact must have
 * complete, parallel content across all locales and a valid answer.
 */
import {
  DAILY_FACTS,
  FACT_CATEGORIES,
  getFactForDate,
  getFactContent,
  getGeoFacts,
  getGeoFactCount,
  renderGeoFact,
  getQuizTakeaway,
  generateGeoQuiz,
  getGeoQuizBankSize,
} from '../facts';
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

// ─── GeoFacts: browse fact pool and quiz generation ──────────
// Browse is a curated feed: one entry per trivia fact, rendered to its
// localized takeaway sentence and tagged with a category.
describe('getGeoFacts (browse pool)', () => {
  const facts = getGeoFacts();
  const flagIds = new Set(getAllFlags().map((f) => f.id));

  it('surfaces one entry per curated fact', () => {
    expect(facts.length).toBe(DAILY_FACTS.length);
    expect(getGeoFactCount()).toBe(facts.length);
  });

  it('has unique ids and renders to non-empty text', () => {
    const ids = facts.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of facts) {
      expect(renderGeoFact(f).trim().length).toBeGreaterThan(0);
    }
  });

  it('tags every fact with a known category', () => {
    for (const f of facts) {
      expect(FACT_CATEGORIES).toContain(f.category);
    }
  });

  it('references only real flag codes (or none)', () => {
    for (const f of facts) {
      if (f.flagId) expect(flagIds.has(f.flagId)).toBe(true);
    }
  });

  it('returns a stable cached reference', () => {
    expect(getGeoFacts()).toBe(facts);
  });
});

describe('generateGeoQuiz', () => {
  it('exposes a large question bank', () => {
    expect(getGeoQuizBankSize()).toBeGreaterThanOrEqual(500);
  });

  it('returns the requested number of well-formed questions', () => {
    const quiz = generateGeoQuiz(10);
    expect(quiz).toHaveLength(10);
    for (const q of quiz) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4); // no duplicate options
      expect(q.answerIndex).toBeGreaterThanOrEqual(0);
      expect(q.answerIndex).toBeLessThan(4);
      expect(q.prompt.trim().length).toBeGreaterThan(0);
    }
  });

  it('does not exceed the bank size when asked for many', () => {
    const quiz = generateGeoQuiz(100000);
    expect(quiz.length).toBe(getGeoQuizBankSize());
  });

  it('varies between sessions', () => {
    const a = generateGeoQuiz(10).map((q) => q.id);
    const b = generateGeoQuiz(10).map((q) => q.id);
    expect(a.join() === b.join()).toBe(false);
  });

  it('keeps flag-answer questions well formed', () => {
    const flagIds = new Set(getAllFlags().map((f) => f.id));
    let sawFlagAnswer = false;
    // Run many sessions so the random flag/name split is well sampled.
    for (let s = 0; s < 40; s++) {
      for (const q of generateGeoQuiz(10)) {
        if (!q.optionFlags) continue;
        sawFlagAnswer = true;
        // Parallel to options, all real codes, and no giveaway prompt flag.
        expect(q.optionFlags).toHaveLength(q.options.length);
        for (const code of q.optionFlags) expect(flagIds.has(code)).toBe(true);
        expect(new Set(q.optionFlags).size).toBe(q.optionFlags.length);
        expect(q.flagId).toBeUndefined();
      }
    }
    expect(sawFlagAnswer).toBe(true);
  });
});

describe('getQuizTakeaway', () => {
  it('returns the curated takeaway for a trivia question', () => {
    const takeaway = getQuizTakeaway(`q-tr-${DAILY_FACTS[0].id}`);
    expect(takeaway).toBe(DAILY_FACTS[0].content.en.fact);
  });

  it('returns null for generated capital/region questions', () => {
    expect(getQuizTakeaway('q-cap-fr')).toBeNull();
    expect(getQuizTakeaway('q-reg-fr')).toBeNull();
  });

  it('returns null for an unknown trivia id', () => {
    expect(getQuizTakeaway('q-tr-not_a_real_fact')).toBeNull();
  });
});
