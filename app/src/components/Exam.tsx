import { useEffect, useRef, useState } from 'react';
import type { Answer, Question, SessionConfig, SessionResult } from '../types';

interface Props {
  config: SessionConfig;
  questions: Question[];
  startedAt: number;
  initialAnswers?: Record<string, number | null>;
  onAnswersChange: (answers: Record<string, number | null>) => void;
  onFinish: (result: SessionResult) => void;
}

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export default function Exam({
  config,
  questions,
  startedAt,
  initialAnswers,
  onAnswersChange,
  onFinish,
}: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>(
    () => initialAnswers ?? Object.fromEntries(questions.map((q) => [q.id, null])),
  );
  const finishedRef = useRef(false);

  useEffect(() => {
    onAnswersChange(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const totalSeconds = config.durationMinutes * 60;
  const [remaining, setRemaining] = useState(() => {
    const elapsed = (Date.now() - startedAt) / 1000;
    return Math.max(0, totalSeconds - elapsed);
  });

  const finish = (timedOut: boolean) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const answerList: Answer[] = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: answers[q.id] ?? null,
    }));
    onFinish({
      config,
      questions,
      answers: answerList,
      startedAt,
      finishedAt: Date.now(),
      timedOut,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const left = totalSeconds - elapsed;
      setRemaining(Math.max(0, left));
      if (left <= 0) {
        clearInterval(interval);
        finish(true);
      }
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, totalSeconds]);

  const q = questions[current];
  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const lowTime = remaining <= 60;

  const selectOption = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
  };

  return (
    <div className="card exam-card">
      <div className="exam-header">
        <div>
          <strong>Question {current + 1}</strong> of {questions.length}
          <span className="section-tag">{q.section}</span>
        </div>
        <div className={`timer ${lowTime ? 'timer-low' : ''}`}>{formatTime(remaining)}</div>
      </div>

      <p className="question-text">{q.question}</p>

      <div className="options">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            className={`option-btn ${answers[q.id] === idx ? 'selected' : ''}`}
            onClick={() => selectOption(idx)}
          >
            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
            {opt}
          </button>
        ))}
      </div>

      <div className="exam-nav">
        <button
          type="button"
          className="secondary-btn"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
          >
            Next
          </button>
        ) : (
          <button type="button" className="primary-btn" onClick={() => finish(false)}>
            Submit Test
          </button>
        )}
      </div>

      <div className="palette">
        {questions.map((pq, idx) => (
          <button
            key={pq.id}
            type="button"
            className={`palette-dot ${answers[pq.id] !== null ? 'answered' : ''} ${
              idx === current ? 'current' : ''
            }`}
            onClick={() => setCurrent(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <p className="hint">
        {answeredCount} of {questions.length} answered.{' '}
        <button type="button" className="link-btn" onClick={() => finish(false)}>
          Submit now
        </button>
      </p>
    </div>
  );
}
