import { useMemo, useState } from 'react';
import type { SessionResult } from '../types';

interface Props {
  result: SessionResult;
  onRestart: () => void;
}

export default function Results({ result, onRestart }: Props) {
  const [showReview, setShowReview] = useState(false);

  const { questions, answers } = result;
  const answerMap = useMemo(
    () => Object.fromEntries(answers.map((a) => [a.questionId, a.selectedIndex])),
    [answers],
  );

  const correctCount = questions.filter((q) => answerMap[q.id] === q.correctIndex).length;
  const unansweredCount = questions.filter((q) => answerMap[q.id] === null || answerMap[q.id] === undefined).length;
  const wrongCount = questions.length - correctCount - unansweredCount;
  const percent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const pass = percent >= 50;

  const timeTakenSeconds = Math.round((result.finishedAt - result.startedAt) / 1000);
  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;

  return (
    <div className="card results-card">
      <h1>Results</h1>
      {result.timedOut && <p className="timeout-note">Time elapsed — test was submitted automatically.</p>}

      <div className={`score-circle ${pass ? 'pass' : 'fail'}`}>
        <span className="score-percent">{percent}%</span>
        <span className="score-label">{pass ? 'PASS' : 'NEEDS MORE PRACTICE'}</span>
      </div>

      <div className="score-breakdown">
        <div><strong>{correctCount}</strong> Correct</div>
        <div><strong>{wrongCount}</strong> Wrong</div>
        <div><strong>{unansweredCount}</strong> Unanswered</div>
        <div><strong>{questions.length}</strong> Total</div>
        <div>
          <strong>
            {minutes}m {seconds}s
          </strong>{' '}
          Time Taken
        </div>
      </div>

      <div className="results-actions">
        <button type="button" className="secondary-btn" onClick={() => setShowReview((s) => !s)}>
          {showReview ? 'Hide' : 'Show'} Answer Review
        </button>
        <button type="button" className="primary-btn" onClick={onRestart}>
          Start New Test
        </button>
      </div>

      {showReview && (
        <div className="review-list">
          {questions.map((q, idx) => {
            const selected = answerMap[q.id];
            const isCorrect = selected === q.correctIndex;
            return (
              <div key={q.id} className={`review-item ${isCorrect ? 'review-correct' : 'review-wrong'}`}>
                <p className="review-question">
                  {idx + 1}. {q.question}
                </p>
                <div className="review-options">
                  {q.options.map((opt, oIdx) => {
                    let cls = 'review-option';
                    if (oIdx === q.correctIndex) cls += ' is-correct';
                    else if (oIdx === selected) cls += ' is-wrong-selected';
                    return (
                      <div key={oIdx} className={cls}>
                        <span className="option-letter">{String.fromCharCode(65 + oIdx)}</span>
                        {opt}
                      </div>
                    );
                  })}
                </div>
                {selected === null || selected === undefined ? (
                  <p className="review-status">You left this unanswered.</p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
