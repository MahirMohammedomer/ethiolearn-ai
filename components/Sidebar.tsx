import React from 'react';
import { ViewState, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, lang, setLang, isOpen, toggleSidebar }) => {
  const t = TRANSLATIONS[lang];

  const menuItems = [
    { id: ViewState.DASHBOARD, label: t.dashboard, icon: '📊' },
    { id: ViewState.STUDY_HUB, label: t.studyHub, icon: '📚' },
    { id: ViewState.QUIZ, label: t.quiz, icon: '🎮' },
    { id: ViewState.AI_TUTOR, label: t.aiTutor, icon: '🤖' },
    { id: ViewState.ANALYZER, label: t.analyzer, icon: '🔍' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ethio-green via-ethio-yellow to-ethio-red flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">EthioLearn AI</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                ${currentView === item.id 
                  ? 'bg-ethio-green/10 text-ethio-green dark:text-green-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Language</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${lang === 'en' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('am')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${lang === 'am' ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white' : 'text-gray-500'}`}
              >
                አማ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;