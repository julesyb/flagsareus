import { getAllFlags } from './index';
import { countryCapitals } from './countryCapitals';
import { countryNeighbors } from './countryNeighbors';
import { twinPairs } from './countryAliases';
import { DAILY_FACTS } from './dailyFacts';
import { t, getLocale } from '../utils/i18n';
import { flagName, translateName } from './countryNames';
import type { FlagItem } from '../types';

// ─── GeoFacts ────────────────────────────────────────────────
// A large pool of stable, verifiable flag and country facts powering the
// GeoFacts game mode. Facts are generated from the app's own datasets
// (capitals, regions, land borders) plus a curated trivia pool and a
// verified landlocked set, so accuracy is grounded in existing data.
//
// Facts are stored as structured records (a type plus ids), not prose. The
// display sentence is built at render time from localized templates and
// localized country/region names, so every fact is fully translated in all
// six locales without hand-translating thousands of sentences. Only fact
// types chosen to be time-stable are included (no population, GDP, leaders,
// or other figures that change).

// The 44 landlocked countries (ISO-2). Stable and well established; only
// those present in the dataset produce facts.
const LANDLOCKED = new Set<string>([
  'af', 'am', 'at', 'az', 'by', 'bt', 'bo', 'bw', 'bf', 'bi', 'cf', 'td',
  'cz', 'sz', 'et', 'hu', 'kz', 'kg', 'la', 'ls', 'li', 'lu', 'mw', 'ml',
  'md', 'mn', 'np', 'ne', 'mk', 'py', 'rw', 'sm', 'rs', 'sk', 'ss', 'ch',
  'tj', 'tm', 'ug', 'uz', 'zm', 'zw', 'ad', 'xk',
]);

// "X is in region Y" facts are only generated for this curated set of
// well-known countries whose continental placement is clear and
// uncontroversial. Transcontinental or commonly-debated cases (Russia,
// Turkey, Egypt, Kazakhstan, the Caucasus, Cyprus) and obscure micro-states
// are intentionally left out, since a flat "located in" claim is either
// misleading or too obscure there. This keeps the Browse list focused on
// richer trivia instead of a long run of repetitive region lines.
const REGION_FACT_COUNTRIES = new Set<string>([
  // Africa
  'dz', 'et', 'gh', 'ke', 'ma', 'ng', 'sn', 'tz', 'ug', 'za',
  // Asia
  'cn', 'id', 'in', 'jp', 'kr', 'mn', 'np', 'pk', 'ph', 'sa', 'th', 'vn',
  // Europe
  'de', 'es', 'fr', 'gb', 'gr', 'ie', 'it', 'nl', 'no', 'pl', 'pt', 'se',
  // Americas
  'ar', 'br', 'ca', 'cl', 'co', 'cu', 'jm', 'mx', 'pe', 'us', 'uy', 've',
  // Oceania
  'au', 'fj', 'nz', 'pg',
]);

export type GeoFactType =
  | 'capital'
  | 'region'
  | 'borders'
  | 'borderWith'
  | 'island'
  | 'landlocked'
  | 'twin'
  | 'trivia';

export interface GeoFact {
  id: string;
  /** Country code for the flag shown beside the fact (empty = no flag). */
  flagId: string;
  /** Canonical English region for filtering ('' = unfiled). */
  region: string;
  type: GeoFactType;
  capital?: string;
  count?: number;
  /** Flag id of a related country (border neighbor / twin). */
  otherId?: string;
  /** Related country name when no id is available (twin). */
  otherName?: string;
  /** Daily-fact id backing a curated trivia entry. */
  triviaId?: string;
}

export interface GeoQuizQuestion {
  id: string;
  flagId?: string;
  prompt: string;
  options: string[];
  /** Index of the correct option within `options`. */
  answerIndex: number;
}

const flagsById = new Map<string, FlagItem>(getAllFlags().map((f) => [f.id, f]));

function countryLabel(id: string): string {
  const f = flagsById.get(id);
  return f ? flagName(f) : id;
}

function regionLabel(region: string): string {
  return region ? t(`categories.${region.toLowerCase()}`) : region;
}

function shuffle<T>(array: T[]): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ─── Browse facts ────────────────────────────────────────────
let cachedFacts: GeoFact[] | null = null;

export function getGeoFacts(): GeoFact[] {
  if (cachedFacts) return cachedFacts;

  const flags = getAllFlags();
  const facts: GeoFact[] = [];

  // 1. Curated, high-interest trivia (localized via the daily fact pool).
  for (const f of DAILY_FACTS) {
    const flag = f.flagId ? flagsById.get(f.flagId) : undefined;
    facts.push({ id: `trivia-${f.id}`, flagId: f.flagId ?? '', region: flag?.region ?? '', type: 'trivia', triviaId: f.id });
  }

  // 2. Generated facts per country, grouped and ordered by country name.
  const sorted = [...flags].sort((a, b) => a.name.localeCompare(b.name));
  for (const flag of sorted) {
    const capital = countryCapitals[flag.id];
    if (capital) {
      facts.push({ id: `cap-${flag.id}`, flagId: flag.id, region: flag.region, type: 'capital', capital });
    }

    if (REGION_FACT_COUNTRIES.has(flag.id)) {
      facts.push({ id: `reg-${flag.id}`, flagId: flag.id, region: flag.region, type: 'region' });
    }

    if (LANDLOCKED.has(flag.id)) {
      facts.push({ id: `land-${flag.id}`, flagId: flag.id, region: flag.region, type: 'landlocked' });
    }

    const neighbors = countryNeighbors[flag.id];
    if (neighbors && neighbors.length > 0) {
      facts.push({ id: `bor-${flag.id}`, flagId: flag.id, region: flag.region, type: 'borders', count: neighbors.length });
      // One fact per specific border - stable and drawn from the same data
      // that powers the Neighbors mode.
      for (const otherId of neighbors) {
        facts.push({ id: `borw-${flag.id}-${otherId}`, flagId: flag.id, region: flag.region, type: 'borderWith', otherId });
      }
    } else if (flag.tags.includes('island_nations')) {
      facts.push({ id: `isl-${flag.id}`, flagId: flag.id, region: flag.region, type: 'island' });
    }

    const twins = twinPairs[flag.name];
    if (twins && twins.length > 0) {
      facts.push({ id: `twin-${flag.id}`, flagId: flag.id, region: flag.region, type: 'twin', otherName: twins[0] });
    }
  }

  cachedFacts = facts;
  return facts;
}

export function getGeoFactCount(): number {
  return getGeoFacts().length;
}

/** Build the localized display sentence for a fact in the current locale. */
export function renderGeoFact(fact: GeoFact): string {
  switch (fact.type) {
    case 'capital':
      return t('geofacts.tplCapital', { country: countryLabel(fact.flagId), capital: fact.capital ?? '' });
    case 'region':
      return t('geofacts.tplRegion', { country: countryLabel(fact.flagId), region: regionLabel(fact.region) });
    case 'borders':
      return t(fact.count === 1 ? 'geofacts.tplBordersOne' : 'geofacts.tplBorders', {
        country: countryLabel(fact.flagId),
        count: fact.count ?? 0,
      });
    case 'borderWith':
      return t('geofacts.tplBorderWith', { country: countryLabel(fact.flagId), other: countryLabel(fact.otherId ?? '') });
    case 'island':
      return t('geofacts.tplIsland', { country: countryLabel(fact.flagId) });
    case 'landlocked':
      return t('geofacts.tplLandlocked', { country: countryLabel(fact.flagId) });
    case 'twin':
      return t('geofacts.tplTwin', {
        country: countryLabel(fact.flagId),
        other: fact.otherId ? countryLabel(fact.otherId) : translateName(fact.otherName ?? ''),
      });
    case 'trivia': {
      const tf = DAILY_FACTS.find((x) => x.id === fact.triviaId);
      if (!tf) return '';
      const c = tf.content[getLocale()] ?? tf.content.en;
      return c.fact;
    }
  }
}

// ─── Quiz questions ──────────────────────────────────────────
// Built fresh per session in the current locale (prompt and options
// localized; capital names stay as proper nouns).
function buildQuizBank(): GeoQuizQuestion[] {
  const flags = getAllFlags();
  const withCapital = flags.filter((f) => countryCapitals[f.id]);
  const allCapitals = Array.from(new Set(withCapital.map((f) => countryCapitals[f.id])));
  const regions = Array.from(new Set(flags.map((f) => f.region)));

  const bank: GeoQuizQuestion[] = [];

  // Capital of a country
  for (const f of withCapital) {
    const correct = countryCapitals[f.id];
    const distractors = shuffle(allCapitals.filter((c) => c !== correct)).slice(0, 3);
    const options = shuffle([correct, ...distractors]);
    bank.push({
      id: `q-cap-${f.id}`,
      flagId: f.id,
      prompt: t('geofacts.qCapital', { country: flagName(f) }),
      options,
      answerIndex: options.indexOf(correct),
    });
  }

  // Which country has this capital
  for (const f of withCapital) {
    const correctId = f.id;
    const distractorIds = shuffle(flags.filter((x) => x.id !== correctId)).slice(0, 3).map((x) => x.id);
    const ids = shuffle([correctId, ...distractorIds]);
    const options = ids.map((id) => countryLabel(id));
    bank.push({
      id: `q-rcap-${f.id}`,
      prompt: t('geofacts.qReverseCapital', { capital: countryCapitals[f.id] }),
      options,
      answerIndex: ids.indexOf(correctId),
    });
  }

  // Region of a country
  for (const f of flags) {
    const correct = f.region;
    const distractors = shuffle(regions.filter((r) => r !== correct)).slice(0, 3);
    const regionList = shuffle([correct, ...distractors]);
    const options = regionList.map((r) => regionLabel(r));
    bank.push({
      id: `q-reg-${f.id}`,
      flagId: f.id,
      prompt: t('geofacts.qRegion', { country: flagName(f) }),
      options,
      answerIndex: regionList.indexOf(correct),
    });
  }

  // Curated trivia questions (already localized in the daily fact pool)
  for (const tf of DAILY_FACTS) {
    const c = tf.content[getLocale()] ?? tf.content.en;
    bank.push({ id: `q-tr-${tf.id}`, flagId: tf.flagId, prompt: c.question, options: c.options, answerIndex: tf.answer });
  }

  return bank;
}

export function getGeoQuizBankSize(): number {
  return buildQuizBank().length;
}

/** A fresh, shuffled set of quiz questions for one play session. */
export function generateGeoQuiz(count = 10): GeoQuizQuestion[] {
  return shuffle(buildQuizBank()).slice(0, count);
}
