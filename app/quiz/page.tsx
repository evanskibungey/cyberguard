'use client';

import { useState } from 'react';
import QuizProgress from '@/components/QuizProgress';
import type { QuizQuestion } from '@/lib/types';
import questionsData from '@/data/quiz-questions.json';

const questions: QuizQuestion[] = questionsData as QuizQuestion[];
const PASS_THRESHOLD = 0.7;

type AnswerState = {
  selected: number;
  correct: boolean;
};

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentIndex];
  const hasAnswered = currentIndex in answers;

  function handleAnswer(optionIndex: number) {
    if (hasAnswered) return;
    const correct = optionIndex === question.correctIndex;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selected: optionIndex, correct },
    }));
    setShowFeedback(true);
  }

  function handleNext() {
    setShowFeedback(false);
    if (currentIndex + 1 >= questions.length) {
      setQuizComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetake() {
    setCurrentIndex(0);
    setAnswers({});
    setShowFeedback(false);
    setQuizComplete(false);
  }

  // Results
  if (quizComplete) {
    const total = questions.length;
    const correct = Object.values(answers).filter((a) => a.correct).length;
    const percentage = Math.round((correct / total) * 100);
    const passed = correct / total >= PASS_THRESHOLD;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div
          className={`rounded-xl border p-8 text-center mb-8 ${
            passed
              ? 'bg-green-900/20 border-green-700'
              : 'bg-red-900/20 border-red-700'
          }`}
        >
          <div className="text-5xl mb-4">{passed ? '🎉' : '📚'}</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {passed ? 'Quiz Passed!' : 'Keep Learning'}
          </h1>
          <p className="text-slate-300 text-lg mb-4">
            You scored <strong className={passed ? 'text-green-400' : 'text-red-400'}>{correct}</strong> out of{' '}
            <strong className="text-white">{total}</strong> ({percentage}%)
          </p>
          <div
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
              passed
                ? 'bg-green-900/50 text-green-300 border border-green-700'
                : 'bg-red-900/50 text-red-300 border border-red-700'
            }`}
          >
            {passed ? `✓ Passed (≥70% required)` : `✗ Failed — 70% required to pass`}
          </div>
          <div className="mt-6">
            <button
              onClick={handleRetake}
              className="bg-[#0ea5e9] hover:bg-sky-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              🔄 Retake Quiz
            </button>
          </div>
        </div>

        {/* All questions with explanations */}
        <h2 className="text-xl font-bold text-white mb-4">Review All Questions</h2>
        <div className="space-y-4">
          {questions.map((q, qi) => {
            const ans = answers[qi];
            const wasCorrect = ans?.correct;
            return (
              <div
                key={q.id}
                className={`bg-[#1e293b] border rounded-xl p-5 ${
                  wasCorrect ? 'border-green-700' : 'border-red-700'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-lg shrink-0">{wasCorrect ? '✅' : '❌'}</span>
                  <div>
                    <span className="text-xs text-[#0ea5e9] font-medium">{q.category}</span>
                    <p className="text-slate-200 text-sm font-medium mt-0.5">{q.question}</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3 ml-8">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`text-xs px-3 py-1.5 rounded-lg ${
                        oi === q.correctIndex
                          ? 'bg-green-900/40 text-green-300 border border-green-700'
                          : oi === ans?.selected && !wasCorrect
                          ? 'bg-red-900/40 text-red-300 border border-red-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {oi === q.correctIndex && '✓ '}
                      {oi === ans?.selected && !wasCorrect && '✗ '}
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="ml-8 bg-[#0f172a] rounded-lg p-3">
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong className="text-[#0ea5e9]">Explanation:</strong> {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active quiz
  const currentAnswer = answers[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🧠 Phishing Awareness Quiz</h1>
        <p className="text-slate-400 text-sm">
          Test your ability to spot phishing, smishing, fake websites, and social engineering attacks.
        </p>
      </div>

      <QuizProgress current={currentIndex + 1} total={questions.length} />

      <div className="bg-[#1e293b] border border-[#1e3a5f] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/30 px-2 py-0.5 rounded-full font-medium">
            {question.category}
          </span>
        </div>

        <p className="text-slate-100 font-medium text-base leading-relaxed mb-6">
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            let btnClass =
              'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ';

            if (!hasAnswered) {
              btnClass += 'bg-[#0f172a] border-[#334155] text-slate-200 hover:border-[#0ea5e9] hover:bg-[#1e3a5f] cursor-pointer';
            } else if (i === question.correctIndex) {
              btnClass += 'bg-green-900/40 border-green-600 text-green-300 cursor-default';
            } else if (i === currentAnswer?.selected && !currentAnswer.correct) {
              btnClass += 'bg-red-900/40 border-red-600 text-red-300 cursor-default';
            } else {
              btnClass += 'bg-[#0f172a] border-[#334155] text-slate-500 cursor-default';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={hasAnswered}
                className={btnClass}
              >
                <span className="font-mono text-slate-500 mr-3">{String.fromCharCode(65 + i)}.</span>
                {option}
                {hasAnswered && i === question.correctIndex && (
                  <span className="float-right text-green-400">✓ Correct</span>
                )}
                {hasAnswered && i === currentAnswer?.selected && !currentAnswer.correct && (
                  <span className="float-right text-red-400">✗ Wrong</span>
                )}
              </button>
            );
          })}
        </div>

        {showFeedback && currentAnswer && (
          <div
            className={`mt-4 p-4 rounded-lg border ${
              currentAnswer.correct
                ? 'bg-green-900/30 border-green-700'
                : 'bg-red-900/30 border-red-700'
            }`}
          >
            <p
              className={`text-sm font-semibold mb-1 ${
                currentAnswer.correct ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {currentAnswer.correct ? '✅ Correct!' : '❌ Incorrect'}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {hasAnswered && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="bg-[#0ea5e9] hover:bg-sky-400 text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm"
            >
              {currentIndex + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>

      {/* Score tracker */}
      <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
        <span>
          ✅ Correct: <strong className="text-green-400">{Object.values(answers).filter((a) => a.correct).length}</strong>
        </span>
        <span>
          ❌ Wrong: <strong className="text-red-400">{Object.values(answers).filter((a) => !a.correct).length}</strong>
        </span>
        <span>
          Remaining: <strong className="text-slate-300">{questions.length - Object.keys(answers).length}</strong>
        </span>
      </div>
    </div>
  );
}
