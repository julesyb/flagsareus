/**
 * Tests for the GeoFacts data: browse fact pool and quiz generation.
 * Facts are structured + rendered via localized templates, so we assert on
 * the rendered (default-locale) output.
 */
import { getGeoFacts, getGeoFactCount, renderGeoFact, generateGeoQuiz, getGeoQuizBankSize } from '../geoFacts';
import { getAllFlags } from '../index';

describe('getGeoFacts (browse pool)', () => {
  const facts = getGeoFacts();
  const flagIds = new Set(getAllFlags().map((f) => f.id));

  it('provides at least 1200 stable facts', () => {
    expect(facts.length).toBeGreaterThanOrEqual(1200);
    expect(getGeoFactCount()).toBe(facts.length);
  });

  it('has unique ids and renders to non-empty text', () => {
    const ids = facts.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of facts) {
      expect(renderGeoFact(f).trim().length).toBeGreaterThan(0);
    }
  });

  it('references only real flag codes (or none)', () => {
    for (const f of facts) {
      if (f.flagId) expect(flagIds.has(f.flagId)).toBe(true);
      if (f.otherId) expect(flagIds.has(f.otherId)).toBe(true);
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
});
