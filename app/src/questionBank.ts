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

/**
 * Builds a randomized session. For 'mixed' category it balances roughly
 * evenly between general and mechanical. For 'mixture' mode it balances
 * roughly evenly between past and likely questions.
 */
export function buildSession(
  category: CategoryChoice,
  mode: ModeChoice,
  numQuestions: number,
): Question[] {
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
