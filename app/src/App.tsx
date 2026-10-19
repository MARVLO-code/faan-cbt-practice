import { useState } from 'react';
import Setup from './components/Setup';
import Exam from './components/Exam';
import Results from './components/Results';
import { buildSession } from './questionBank';
import { clearSession, loadSession, saveSession } from './persistence';
import type { Answer, Question, SessionConfig, SessionResult } from './types';
import './App.css';

type View =
  | { screen: 'setup' }
  | {
      screen: 'exam';
      config: SessionConfig;
      questions: Question[];
      startedAt: number;
      initialAnswers?: Record<string, number | null>;
    }
  | { screen: 'results'; result: SessionResult };

function restoreView(): View {
  const saved = loadSession();
  if (!saved) return { screen: 'setup' };

  const elapsedSeconds = (Date.now() - saved.startedAt) / 1000;
  const totalSeconds = saved.config.durationMinutes * 60;

  if (elapsedSeconds >= totalSeconds) {
    // Time already ran out while the page was closed/refreshed — grade it
    // automatically as a timed-out submission instead of discarding it.
    const result: SessionResult = {
      config: saved.config,
      questions: saved.questions,
      answers: saved.answers,
      startedAt: saved.startedAt,
      finishedAt: saved.startedAt + totalSeconds * 1000,
      timedOut: true,
    };
    clearSession();
    return { screen: 'results', result };
  }

  const initialAnswers = Object.fromEntries(saved.answers.map((a) => [a.questionId, a.selectedIndex]));
  return {
    screen: 'exam',
    config: saved.config,
    questions: saved.questions,
    startedAt: saved.startedAt,
    initialAnswers,
  };
}

export default function App() {
  const [view, setView] = useState<View>(restoreView);

  const handleStart = (config: SessionConfig) => {
    const questions = buildSession(config.category, config.mode, config.numQuestions);
    const startedAt = Date.now();
    saveSession({
      config,
      questions,
      answers: questions.map((q) => ({ questionId: q.id, selectedIndex: null })),
      startedAt,
    });
    setView({ screen: 'exam', config, questions, startedAt });
  };

  const handleAnswersChange = (
    config: SessionConfig,
    questions: Question[],
    startedAt: number,
    answers: Record<string, number | null>,
  ) => {
    const answerList: Answer[] = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: answers[q.id] ?? null,
    }));
    saveSession({ config, questions, answers: answerList, startedAt });
  };

  const handleFinish = (result: SessionResult) => {
    clearSession();
    setView({ screen: 'results', result });
  };

  const handleRestart = () => {
    clearSession();
    setView({ screen: 'setup' });
  };

  return (
    <div className="app-shell">
      {view.screen === 'setup' && <Setup onStart={handleStart} />}
      {view.screen === 'exam' && (
        <Exam
          config={view.config}
          questions={view.questions}
          startedAt={view.startedAt}
          initialAnswers={view.initialAnswers}
          onAnswersChange={(answers) =>
            handleAnswersChange(view.config, view.questions, view.startedAt, answers)
          }
          onFinish={handleFinish}
        />
      )}
      {view.screen === 'results' && <Results result={view.result} onRestart={handleRestart} />}
      <footer className="app-footer">FAAN Staff Promotion CBT Practice &middot; Works fully offline</footer>
    </div>
  );
}
