import React, { useState } from 'react';
import { SUBJECTS, TRANSLATIONS } from '../constants';
import { Language, Subject } from '../types';
import { generateQuiz } from '../services/geminiService';

interface StudyHubProps {
  lang: Language;
  onStartQuiz: (subject: Subject, questions: any[]) => void;
}

const StudyHub: React.FC<StudyHubProps> = ({ lang, onStartQuiz }) => {
  const t = TRANSLATIONS[lang];
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuiz = async (subject: Subject) => {
    setIsLoading(true);
    const questions = await generateQuiz(subject.nameEn, lang);
    setIsLoading(false);
    onStartQuiz(subject, questions);
  };

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {selectedSubject ? (lang === 'am' ? selectedSubject.nameAm : selectedSubject.nameEn) : t.selectSubject}
      </h2>

      {!selectedSubject ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{subject.icon}</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">{lang === 'am' ? subject.nameAm : subject.nameEn}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-fade-in">
          <button 
            onClick={() => setSelectedSubject(null)}
            className="self-start mb-4 text-sm text-gray-500 hover:text-ethio-green flex items-center gap-1"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Textbook Mock View */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg">{lang === 'am' ? 'ምዕራፍ 1፡ መግቢያ' : 'Unit 1: Introduction'}</h3>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Listen">🔊</button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Download">⬇️</button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto prose dark:prose-invert max-w-none pr-2">
                    <p>
                        {lang === 'am' 
                          ? 'ይህ የትምህርት ይዘት ምሳሌ ነው። እውነተኛው መተግበሪያ የፒዲኤፍ (PDF) መጽሐፍትን እዚህ ያሳያል። ባዮሎጂ የህይወት ሳይንስ ነው። ህይወት ያላቸው ነገሮች እንዴት እንደሚፈጠሩ፣ እንደሚያድጉ እና እንደሚራቡ ያጠናል።'
                          : 'This is a placeholder for the textbook content. In the real application, parsed PDF content or interactive HTML textbooks would appear here. Biology is the science of life. It studies how living things are formed, grow, and reproduce.'
                        }
                    </p>
                    <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">{lang === 'am' ? 'ቁልፍ ነጥቦች' : 'Key Concepts'}</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Cell Theory</li>
                            <li>Genetics & Heredity</li>
                            <li>Ecosystems</li>
                        </ul>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                    </p>
                </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-4">
                <div className="bg-ethio-green/10 rounded-2xl p-6 border border-ethio-green/20">
                    <h3 className="font-bold text-ethio-green mb-2">{t.startQuiz}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {lang === 'am' ? 'ከዚህ ምዕራፍ የተውጣጡ ጥያቄዎችን ይሞክሩ።' : 'Test your knowledge with AI generated questions from this chapter.'}
                    </p>
                    <button 
                        onClick={() => handleGenerateQuiz(selectedSubject)}
                        disabled={isLoading}
                        className="w-full py-3 bg-ethio-green hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
                    >
                        {isLoading ? (
                            <><span className="animate-spin">⏳</span> {t.loading}</>
                        ) : (
                            <>{t.startQuiz} 🚀</>
                        )}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t.aiTutor}</h3>
                     <button className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {t.askTutor}
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyHub;