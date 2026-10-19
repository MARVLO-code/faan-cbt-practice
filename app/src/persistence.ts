import type { Answer, Question, SessionConfig } from './types';

const KEY = 'faan_cbt_session_v1';

export interface PersistedSession {
  config: SessionConfig;
  questions: Question[];
  answers: Answer[];
  startedAt: number;
}

export function saveSession(session: PersistedSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Storage unavailable (e.g. private browsing) — the test still works,
    // it just won't survive a refresh.
  }
}

export function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
