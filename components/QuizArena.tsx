import React, { useState } from 'react';
import { QuizQuestion, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface QuizArenaProps {
  questions: QuizQuestion[];
  lang: Language;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const QuizArena: React.FC<QuizArenaProps> = ({ questions, lang, onComplete, onExit }) => {
  const t = TRANSLATIONS[lang];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      onComplete(score);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
         <div className="text-4xl mb-4">⚠️</div>
         <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">No questions loaded.</h2>
         <button onClick={onExit} className="mt-4 text-blue-500 underline">Go Back</button>
      </div>
    )
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-6xl mb-6 animate-bounce">
          🏆
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Quiz Complete!</h2>
        <p className="text-gray-500 mb-8 text-lg">You scored {score} out of {questions.length}</p>
        <button 
          onClick={onExit}
          className="px-8 py-3 bg-ethio-green text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
        >
          Back to Study Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onExit} className="text-gray-500 hover:text-gray-800">✕</button>
        <div className="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-ethio-green transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-500">{currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let cardClass = "bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500";
            
            if (showResult) {
              if (idx === currentQuestion.correctAnswer) {
                cardClass = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
              } else if (idx === selectedOption) {
                cardClass = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
              } else {
                cardClass = "opacity-50 border-transparent";
              }
            } else if (selectedOption === idx) {
                cardClass = "border-blue-500 bg-blue-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 ${cardClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className={`mt-6 p-4 rounded-xl ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} animate-slide-up`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {selectedOption === currentQuestion.correctAnswer 
              ? <span className="text-green-700 dark:text-green-400">✅ {t.correct}</span>
              : <span className="text-red-700 dark:text-red-400">❌ {t.incorrect}</span>
            }
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-bold">{t.explanation}:</span> {currentQuestion.explanation}
          </p>
          <button 
            onClick={handleNext}
            className="mt-4 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizArena;