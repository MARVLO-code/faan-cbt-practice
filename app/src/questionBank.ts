import raw from './data/questions.json';
import type { Category, CategoryChoice, ModeChoice, Question } from './types';

export const allQuestions = raw as Question[];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function countAvailable(category: CategoryChoice, mode: ModeChoice): number {
  return filterQuestions(category, mode).length;
}

function filterQuestions(category: CategoryChoice, mode: ModeChoice): Question[] {
  return allQuestions.filter((q) => {
    const catOk = category === 'mixed' || q.category === category;
    const modeOk = mode === 'mixture' || q.type === mode;
    return catOk && modeOk;
  });
}

/** When "Mixed" subject area is chosen, this fraction of questions comes
 * from the Mechanical Department (the rest from General Knowledge). */
const MIXED_MECHANICAL_SHARE = 0.8;

/**
 * Builds a randomized session. For the 'mixed' category it targets an
 * 80% Mechanical / 20% General split (falling back to whichever pool has
 * questions available if one side runs short). For 'mixture' mode it draws
 * freely from both past and likely questions.
 */
export function buildSession(
  category: CategoryChoice,
  mode: ModeChoice,
  numQuestions: number,
): Question[] {
  if (category === 'mixed') {
    const mechPool = shuffle(filterQuestions('mechanical', mode));
    const genPool = shuffle(filterQuestions('general', mode));

    let mechCount = Math.round(numQuestions * MIXED_MECHANICAL_SHARE);
    let genCount = numQuestions - mechCount;

    if (mechCount > mechPool.length) {
      genCount += mechCount - mechPool.length;
      mechCount = mechPool.length;
    }
    if (genCount > genPool.length) {
      mechCount += genCount - genPool.length;
      genCount = genPool.length;
    }
    mechCount = Math.min(mechCount, mechPool.length);
    genCount = Math.min(genCount, genPool.length);

    const picked = shuffle([...mechPool.slice(0, mechCount), ...genPool.slice(0, genCount)]);
    return picked.map(randomizeOptionOrder);
  }

  const pool = filterQuestions(category, mode);
  const shuffled = shuffle(pool);
  const picked = shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  // Shuffle each question's option order independently so the correct
  // answer isn't always in the same position across sessions.
  return picked.map(randomizeOptionOrder);
}

function randomizeOptionOrder(q: Question): Question {
  const order = shuffle(q.options.map((_, i) => i));
  const options = order.map((i) => q.options[i]);
  const correctIndex = order.indexOf(q.correctIndex);
  return { ...q, options, correctIndex };
}

export const categoryLabels: Record<Category, string> = {
  general: 'General Knowledge & Current Affairs',
  mechanical: 'Mechanical Department',
};
