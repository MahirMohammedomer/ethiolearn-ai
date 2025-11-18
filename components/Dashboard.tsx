import React, { useState } from 'react';
import { UserStats, Language, StudyPlan, StudyTask } from '../types';
import { TRANSLATIONS, NATIONAL_EXAM_DATE } from '../constants';

interface DashboardProps {
  stats: UserStats;
  lang: Language;
  studyPlan: StudyPlan | null;
  onGeneratePlan: (goals: string, weakAreas: string) => void;
  onToggleTask: (taskId: string) => void;
  isGeneratingPlan: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  lang, 
  studyPlan, 
  onGeneratePlan, 
  onToggleTask,
  isGeneratingPlan 
}) => {
  const t = TRANSLATIONS[lang];
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((NATIONAL_EXAM_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const [goals, setGoals] = useState('');
  const [weakAreas, setWeakAreas] = useState('');
  const [showPlanForm, setShowPlanForm] = useState(false);

  const handleSubmitPlan = () => {
    if (goals && weakAreas) {
      onGeneratePlan(goals, weakAreas);
      setShowPlanForm(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in pb-20">
      {/* Welcome & Quote */}
      <div className="bg-gradient-to-r from-ethio-green/90 to-emerald-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <h2 className="text-3xl font-bold mb-2 relative z-10">{t.welcome}</h2>
        <p className="text-emerald-100 italic max-w-2xl relative z-10">"{t.dailyQuote}"</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title={t.streak} value={stats.streak} icon="🔥" color="text-orange-500" bg="bg-orange-50 dark:bg-orange-900/20" />
        <StatCard title={t.xp} value={stats.xp} icon="⚡" color="text-yellow-500" bg="bg-yellow-50 dark:bg-yellow-900/20" />
        <StatCard title="Level" value={stats.level} icon="🏆" color="text-purple-500" bg="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard title={t.examCountdown} value={daysLeft} icon="📅" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/20" suffix="Days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personalized Study Plan Section */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                📅 {t.yourPlan}
            </h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex-1 min-h-[300px]">
                {!studyPlan && !isGeneratingPlan ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        {!showPlanForm ? (
                            <>
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-3xl mb-2">
                                    🚀
                                </div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{t.noPlan}</h4>
                                <button 
                                    onClick={() => setShowPlanForm(true)}
                                    className="px-6 py-3 bg-ethio-green text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
                                >
                                    {t.createPlan}
                                </button>
                            </>
                        ) : (
                            <div className="w-full max-w-md space-y-4 animate-slide-up text-left">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.goals}</label>
                                    <input 
                                        type="text" 
                                        value={goals}
                                        onChange={(e) => setGoals(e.target.value)}
                                        placeholder={t.goalsPlaceholder}
                                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.weakAreas}</label>
                                    <input 
                                        type="text" 
                                        value={weakAreas}
                                        onChange={(e) => setWeakAreas(e.target.value)}
                                        placeholder={t.weakAreasPlaceholder}
                                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button 
                                        onClick={() => setShowPlanForm(false)}
                                        className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSubmitPlan}
                                        disabled={!goals || !weakAreas}
                                        className="flex-1 py-3 bg-ethio-green text-white rounded-xl font-bold disabled:opacity-50"
                                    >
                                        {t.generatePlan}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : isGeneratingPlan ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin text-4xl">⏳</div>
                        <p className="text-gray-500">{t.loading}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">{t.goals}: <span className="font-medium text-gray-800 dark:text-gray-200">{studyPlan?.goals}</span></p>
                            </div>
                            <button onClick={() => onGeneratePlan(studyPlan!.goals, studyPlan!.weakAreas.join(','))} className="text-sm text-ethio-green hover:underline">Regenerate</button>
                        </div>
                        <div className="space-y-3">
                            {studyPlan?.tasks.map((task) => (
                                <div key={task.id} className={`flex items-center p-4 rounded-xl border transition-all ${task.isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 opacity-75' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-300'}`}>
                                    <button 
                                        onClick={() => onToggleTask(task.id)}
                                        className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-500'}`}
                                    >
                                        {task.isCompleted && '✓'}
                                    </button>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{task.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                            <span className="uppercase font-bold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{task.subjectId}</span>
                                            <span>⏱️ {task.durationMinutes} min</span>
                                            <span>🏷️ {task.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.recentActivity}</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                <ActivityItem title="Biology Quiz: Genetics" time="2 hours ago" score="85%" />
                <ActivityItem title="Physics: Newton's Laws" time="Yesterday" score="Study" />
                <ActivityItem title="Amharic: Grammar" time="2 days ago" score="90%" />
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg, suffix = '' }: any) => (
  <div className={`${bg} p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all`}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
    </div>
    <div className={`text-2xl font-bold ${color}`}>
      {value} <span className="text-sm text-gray-400 font-normal">{suffix}</span>
    </div>
  </div>
);

const ActivityItem = ({ title, time, score }: any) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">📝</div>
        <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{title}</p>
            <p className="text-xs text-gray-500">{time}</p>
        </div>
    </div>
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        {score}
    </span>
  </div>
);

export default Dashboard;