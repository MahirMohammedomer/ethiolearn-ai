import React, { useState } from 'react';
import { analyzeQuestionText } from '../services/geminiService';
import { Language, AnalysisResult } from '../types';
import { TRANSLATIONS, SAMPLE_QUESTION } from '../constants';

interface Props {
  lang: Language;
}

const QuestionAnalyzer: React.FC<Props> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text) return;
    setIsLoading(true);
    const res = await analyzeQuestionText(text, lang);
    setResult(res);
    setIsLoading(false);
  };

  const loadSample = () => {
    setText(SAMPLE_QUESTION);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{t.analyzer}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t.uploadQuestion}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text here or type a question..."
              className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex gap-2 mt-4">
              <button 
                onClick={loadSample}
                className="px-4 py-2 text-sm text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Load Sample
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={isLoading || !text}
                className="flex-1 px-4 py-2 bg-ethio-green text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-500/30"
              >
                {isLoading ? t.analyzing : t.analyzeBtn}
              </button>
            </div>
          </div>
          
          {/* Simulated File Upload Info */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-sm text-yellow-800 dark:text-yellow-200">
            ℹ️ Note: In the full app, you can upload PDFs of National Exams (2010-2015 EC). The AI extracts text automatically.
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          {result ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                <h3 className="font-bold text-lg">Analysis Report</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Source Identification */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t.sourcePrediction}</h4>
                    <p className="text-gray-800 dark:text-white font-medium bg-gray-100 dark:bg-gray-700 p-2 rounded-lg inline-block">
                        📚 {result.source}
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                        <h4 className="text-xs text-purple-600 dark:text-purple-300 font-bold uppercase mb-1">{t.difficulty}</h4>
                        <span className={`text-lg font-bold ${result.difficulty === 'Hard' ? 'text-red-500' : 'text-green-500'}`}>
                            {result.difficulty}
                        </span>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                        <h4 className="text-xs text-green-600 dark:text-green-300 font-bold uppercase mb-1">{t.successChance}</h4>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${result.successRate}%` }} />
                            </div>
                            <span className="font-bold text-green-700 dark:text-green-400">{result.successRate}%</span>
                        </div>
                    </div>
                </div>

                {/* Topics */}
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.topics.map((topic, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                                #{topic}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Explanation */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Insight</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {result.explanation}
                    </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                <span className="text-4xl mb-4">📊</span>
                <p className="text-center">Upload a question to see <br/> source prediction and difficulty analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionAnalyzer;