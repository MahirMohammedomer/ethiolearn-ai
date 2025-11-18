import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudyHub from './components/StudyHub';
import QuizArena from './components/QuizArena';
import AITutor from './components/AITutor';
import QuestionAnalyzer from './components/QuestionAnalyzer';
import { ViewState, Language, UserStats, Subject, QuizQuestion, StudyPlan } from './types';
import { generateStudyPlan } from './services/geminiService';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [lang, setLang] = useState<Language>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  
  // Study Plan State
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Mock User Data
  const [stats, setStats] = useState<UserStats>({
    streak: 12,
    xp: 2450,
    level: 5,
    studyMinutes: 420,
    questionsAnswered: 85
  });

  const handleGeneratePlan = async (goals: string, weakAreas: string) => {
    setIsGeneratingPlan(true);
    const weakAreasList = weakAreas.split(',').map(s => s.trim());
    const tasks = await generateStudyPlan(goals, weakAreasList, lang);
    setStudyPlan({
      goals,
      weakAreas: weakAreasList,
      tasks
    });
    setIsGeneratingPlan(false);
  };

  const handleToggleTask = (taskId: string) => {
    if (!studyPlan) return;
    setStudyPlan({
      ...studyPlan,
      tasks: studyPlan.tasks.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    });
    
    // If completing a task, add some stats (simple mock logic)
    const task = studyPlan.tasks.find(t => t.id === taskId);
    if (task && !task.isCompleted) {
        setStats(prev => ({
            ...prev,
            xp: prev.xp + 50,
            studyMinutes: prev.studyMinutes + task.durationMinutes
        }));
    }
  };

  // Handle View Transitions
  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            stats={stats} 
            lang={lang} 
            studyPlan={studyPlan}
            onGeneratePlan={handleGeneratePlan}
            onToggleTask={handleToggleTask}
            isGeneratingPlan={isGeneratingPlan}
          />
        );
      case ViewState.STUDY_HUB:
        return <StudyHub lang={lang} onStartQuiz={startQuiz} />;
      case ViewState.QUIZ:
        return (
          <QuizArena 
            questions={quizQuestions} 
            lang={lang} 
            onComplete={handleQuizComplete} 
            onExit={() => setCurrentView(ViewState.STUDY_HUB)}
          />
        );
      case ViewState.AI_TUTOR:
        return <AITutor lang={lang} />;
      case ViewState.ANALYZER:
        return <QuestionAnalyzer lang={lang} />;
      default:
        return (
          <Dashboard 
            stats={stats} 
            lang={lang} 
            studyPlan={studyPlan}
            onGeneratePlan={handleGeneratePlan}
            onToggleTask={handleToggleTask}
            isGeneratingPlan={isGeneratingPlan}
          />
        );
    }
  };

  const startQuiz = (subject: Subject, questions: QuizQuestion[]) => {
    setQuizQuestions(questions);
    setCurrentView(ViewState.QUIZ);
  };

  const handleQuizComplete = (score: number) => {
    // Simple gamification update
    setStats(prev => ({
      ...prev,
      xp: prev.xp + (score * 100),
      questionsAnswered: prev.questionsAnswered + 5
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        lang={lang}
        setLang={setLang}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-lg text-gray-800 dark:text-white">EthioLearn AI</span>
          <div className="w-10 h-10 rounded-full bg-ethio-green/20 flex items-center justify-center text-ethio-green font-bold">
            {stats.level}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-0 md:p-2">
           {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;