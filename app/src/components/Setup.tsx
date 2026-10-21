import { useMemo, useState } from 'react';
import type { CategoryChoice, ModeChoice, SessionConfig } from '../types';
import { countAvailable } from '../questionBank';
import DownloadWindowsApp from './DownloadWindowsApp';

interface Props {
  onStart: (config: SessionConfig) => void;
}

const CATEGORY_OPTIONS: { value: CategoryChoice; label: string }[] = [
  { value: 'mechanical', label: 'Mechanical Department' },
  { value: 'general', label: 'General Knowledge / Current Affairs' },
  { value: 'mixed', label: 'Mixed (80% Mechanical / 20% General)' },
];

const MODE_OPTIONS: { value: ModeChoice; label: string; hint: string }[] = [
  { value: 'past', label: 'Past Questions', hint: 'Questions taken directly from past syllabus material' },
  { value: 'likely', label: 'Likely Questions', hint: 'New questions based on likely exam topics' },
  { value: 'mixture', label: 'Mixture', hint: 'A blend of past and likely questions' },
];

export default function Setup({ onStart }: Props) {
  const [category, setCategory] = useState<CategoryChoice>('mechanical');
  const [mode, setMode] = useState<ModeChoice>('mixture');
  const [numQuestions, setNumQuestions] = useState(20);
  const [durationMinutes, setDurationMinutes] = useState(20);

  const available = useMemo(() => countAvailable(category, mode), [category, mode]);

  const clampedNum = Math.min(numQuestions, available || 1);

  return (
    <div className="card setup-card">
      <h1>FAAN Promotion CBT Practice</h1>
      <p className="subtitle">Choose your settings, then start the practice test.</p>

      <section>
        <h2>1. Subject Area</h2>
        <div className="choice-grid">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`choice-btn ${category === opt.value ? 'selected' : ''}`}
              onClick={() => setCategory(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>2. Mode</h2>
        <div className="choice-grid">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`choice-btn ${mode === opt.value ? 'selected' : ''}`}
              onClick={() => setMode(opt.value)}
              type="button"
              title={opt.hint}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="hint">{MODE_OPTIONS.find((m) => m.value === mode)?.hint}</p>
      </section>

      <section>
        <h2>3. Number of Questions</h2>
        <p className="hint">{available} question(s) available for this selection.</p>
        <div className="row">
          <input
            type="range"
            min={5}
            max={Math.max(available, 5)}
            step={5}
            value={clampedNum}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
          />
          <input
            type="number"
            min={1}
            max={available || 1}
            value={clampedNum}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="num-input"
          />
        </div>
      </section>

      <section>
        <h2>4. Duration (minutes)</h2>
        <div className="row">
          <input
            type="range"
            min={5}
            max={180}
            step={5}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
          />
          <input
            type="number"
            min={1}
            max={360}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="num-input"
          />
        </div>
      </section>

      <button
        className="primary-btn"
        type="button"
        disabled={available === 0}
        onClick={() =>
          onStart({
            category,
            mode,
            numQuestions: Math.max(1, Math.min(clampedNum, available)),
            durationMinutes: Math.max(1, durationMinutes),
          })
        }
      >
        Start Practice Test
      </button>

      <DownloadWindowsApp />
    </div>
  );
}
