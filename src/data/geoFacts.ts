import { getAllFlags } from './index';
import { countryCapitals } from './countryCapitals';
import { countryNeighbors } from './countryNeighbors';
import { twinPairs } from './countryAliases';
import { DAILY_FACTS } from './dailyFacts';

// ─── GeoFacts ────────────────────────────────────────────────
// A large pool of flag and country facts powering the GeoFacts game mode.
// Facts are generated from the app's own verified datasets (capitals,
// regions, land borders) plus the curated trivia pool, so accuracy is
// grounded in existing data rather than hand-typed prose. The pool yields
// 600+ browse facts and a comparable bank of quiz questions.
//
// Note: fact text is authored in English. Country names elsewhere in the app
// are localized via countryNames, but these generated sentences are not yet
// translated - a deliberate, documented gap given the volume.

export interface GeoFact {
  id: string;
  /** Country code for the flag shown beside the fact (empty = no flag). */
  flagId: string;
  /** Region the fact belongs to, used for filtering ('' = unfiled). */
  region: string;
  text: string;
}

export interface GeoQuizQuestion {
  id: string;
  flagId?: string;
  prompt: string;
  options: string[];
  /** Index of the correct option within `options`. */
  answerIndex: number;
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

  // 1. Curated, high-interest trivia (reused from the daily fact pool).
  for (const f of DAILY_FACTS) {
    const flag = f.flagId ? flags.find((x) => x.id === f.flagId) : undefined;
    facts.push({
      id: `trivia-${f.id}`,
      flagId: f.flagId ?? '',
      region: flag?.region ?? '',
      text: f.content.en.fact,
    });
  }

  // 2. Generated facts per country, grouped and ordered by country name.
  const sorted = [...flags].sort((a, b) => a.name.localeCompare(b.name));
  for (const flag of sorted) {
    const capital = countryCapitals[flag.id];
    if (capital) {
      facts.push({
        id: `cap-${flag.id}`,
        flagId: flag.id,
        region: flag.region,
        text: `The capital of ${flag.name} is ${capital}.`,
      });
    }

    facts.push({
      id: `reg-${flag.id}`,
      flagId: flag.id,
      region: flag.region,
      text: `${flag.name} is located in ${flag.region}.`,
    });

    const neighbors = countryNeighbors[flag.id];
    if (neighbors && neighbors.length > 0) {
      const n = neighbors.length;
      facts.push({
        id: `bor-${flag.id}`,
        flagId: flag.id,
        region: flag.region,
        text: `${flag.name} shares a land border with ${n} ${n === 1 ? 'country' : 'countries'}.`,
      });
    } else if (flag.tags.includes('island_nations')) {
      facts.push({
        id: `isl-${flag.id}`,
        flagId: flag.id,
        region: flag.region,
        text: `${flag.name} is an island nation with no land borders.`,
      });
    }

    const twins = twinPairs[flag.name];
    if (twins && twins.length > 0) {
      facts.push({
        id: `twin-${flag.id}`,
        flagId: flag.id,
        region: flag.region,
        text: `${flag.name}'s flag looks very similar to that of ${twins[0]}.`,
      });
    }
  }

  cachedFacts = facts;
  return facts;
}

export function getGeoFactCount(): number {
  return getGeoFacts().length;
}

// ─── Quiz questions ──────────────────────────────────────────
/** Build the full bank of possible quiz questions (distractors fixed per call). */
function buildQuizBank(): GeoQuizQuestion[] {
  const flags = getAllFlags();
  const withCapital = flags.filter((f) => countryCapitals[f.id]);
  const allCapitals = Array.from(new Set(withCapital.map((f) => countryCapitals[f.id])));
  const allNames = flags.map((f) => f.name);
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
      prompt: `What is the capital of ${f.name}?`,
      options,
      answerIndex: options.indexOf(correct),
    });
  }

  // Which country has this capital
  for (const f of withCapital) {
    const correct = f.name;
    const distractors = shuffle(allNames.filter((n) => n !== correct)).slice(0, 3);
    const options = shuffle([correct, ...distractors]);
    bank.push({
      id: `q-rcap-${f.id}`,
      prompt: `${countryCapitals[f.id]} is the capital of which country?`,
      options,
      answerIndex: options.indexOf(correct),
    });
  }

  // Region of a country
  for (const f of flags) {
    const correct = f.region;
    const distractors = shuffle(regions.filter((r) => r !== correct)).slice(0, 3);
    const options = shuffle([correct, ...distractors]);
    bank.push({
      id: `q-reg-${f.id}`,
      flagId: f.id,
      prompt: `Which region is ${f.name} in?`,
      options,
      answerIndex: options.indexOf(correct),
    });
  }

  // Curated trivia questions
  for (const tf of DAILY_FACTS) {
    const en = tf.content.en;
    bank.push({
      id: `q-tr-${tf.id}`,
      flagId: tf.flagId,
      prompt: en.question,
      options: en.options,
      answerIndex: tf.answer,
    });
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
