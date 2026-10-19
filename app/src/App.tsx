import { useState } from 'react';
import Setup from './components/Setup';
import Exam from './components/Exam';
import Results from './components/Results';
import { buildSession } from './questionBank';
import type { Question, SessionConfig, SessionResult } from './types';
import './App.css';

type View =
  | { screen: 'setup' }
  | { screen: 'exam'; config: SessionConfig; questions: Question[]; startedAt: number }
  | { screen: 'results'; result: SessionResult };

export default function App() {
  const [view, setView] = useState<View>({ screen: 'setup' });

  const handleStart = (config: SessionConfig) => {
    const questions = buildSession(config.category, config.mode, config.numQuestions);
    setView({ screen: 'exam', config, questions, startedAt: Date.now() });
  };

  const handleFinish = (result: SessionResult) => {
    setView({ screen: 'results', result });
  };

  const handleRestart = () => setView({ screen: 'setup' });

  return (
    <div className="app-shell">
      {view.screen === 'setup' && <Setup onStart={handleStart} />}
      {view.screen === 'exam' && (
        <Exam
          config={view.config}
          questions={view.questions}
          startedAt={view.startedAt}
          onFinish={handleFinish}
        />
      )}
      {view.screen === 'results' && <Results result={view.result} onRestart={handleRestart} />}
      <footer className="app-footer">FAAN Staff Promotion CBT Practice &middot; Works fully offline</footer>
    </div>
  );
}
