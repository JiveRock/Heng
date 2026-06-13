/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  History as HistoryIcon, 
  Settings, 
  Printer, 
  Link as LinkIcon, 
  Maximize2,
  Minimize2,
  BookOpen,
  LayoutGrid,
  CheckCircle2,
  ChevronRight,
  Info,
  Layers,
  Award,
  Sparkles,
  Smile,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';

import MathSolver from './components/MathSolver';
import FoundationDrills from './components/FoundationDrills';
import HomeworkChecker from './components/HomeworkChecker';
import FormulaDashboard from './components/FormulaDashboard';
import InteractiveExercise from './components/InteractiveExercise';
import HistoryView from './components/HistoryView';
import GradeSyllabus from './components/GradeSyllabus';
import MascotCenter from './components/MascotCenter';
import HonorCertificate from './components/HonorCertificate';
import AuthScreen, { UserAuth } from './components/AuthScreen';
import FriendsHub from './components/FriendsHub';
import { loadStreakState, registerStudySession, StreakState, SessionResult } from './services/streakService';
import { Users, LogOut, HelpCircle, Send, X } from 'lucide-react';
import Markdown from 'react-markdown';

type Tab = 'solver' | 'drills' | 'checker' | 'dashboard' | 'foundations' | 'history' | 'syllabus' | 'buddies' | 'certificates' | 'friends_hub';

export default function App() {
  const [authUser, setAuthUser] = useState<UserAuth | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('syllabus');
  const [focusMode, setFocusMode] = useState(false);
  const [masteryCount, setMasteryCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [activeMascot, setActiveMascot] = useState<{ emoji: string; name: string }>({ emoji: '🦁', name: 'Leo the Math Lion' });
  const [streakState, setStreakState] = useState<StreakState>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    todaySessionCompleted: false,
    unlockedBadgeIds: []
  });
  const [streakNotification, setStreakNotification] = useState<SessionResult | null>(null);

  // Global AI help state
  const [aiCommanderInput, setAiCommanderInput] = useState('');
  const [aiHelpOpen, setAiHelpOpen] = useState(false);
  const [aiHelpQuery, setAiHelpQuery] = useState('');
  const [aiHelpResponse, setAiHelpResponse] = useState('');
  const [aiHelpLoading, setAiHelpLoading] = useState(false);

  const handleAiCommandSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiCommanderInput.trim()) return;

    let targetQuery = aiCommanderInput.trim();
    // Parse /AiHelp or support raw inquiry
    if (targetQuery.toLowerCase().startsWith('/aihelp')) {
      targetQuery = targetQuery.substring(7).trim();
    }
    
    if (!targetQuery) return;

    setAiHelpQuery(targetQuery);
    setAiCommanderInput('');
    setAiHelpOpen(true);
    setAiHelpLoading(true);
    setAiHelpResponse('');

    try {
      const { explainConceptWithAI } = await import('./services/geminiService');
      const response = await explainConceptWithAI(targetQuery, 'ថ្នាក់ទី១២ (Grade 12)');
      setAiHelpResponse(response);
    } catch (err) {
      setAiHelpResponse("សូមអភ័យទោស៖ មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ AI គ្រូបង្រៀន។ សូមព្យាយាមម្ដងទៀត។");
    } finally {
      setAiHelpLoading(false);
    }
  };

  useEffect(() => {
    // Load auth state
    const savedAuth = localStorage.getItem('kh_math_user_auth');
    if (savedAuth) {
      try {
        setAuthUser(JSON.parse(savedAuth));
      } catch (e) {
        console.error(e);
      }
    }

    const saved = localStorage.getItem('math_mastery_count');
    if (saved) setMasteryCount(parseInt(saved, 10));

    const savedXP = localStorage.getItem('kh_student_xp');
    if (savedXP) {
      setTotalXP(parseInt(savedXP, 10));
    } else {
      // Seed with some base XP from masteryCount
      const base = (saved ? parseInt(saved, 10) : 0) * 20;
      setTotalXP(base);
      localStorage.setItem('kh_student_xp', base.toString());
    }

    // Load initial streak state
    setStreakState(loadStreakState());

    // Mascot updater
    const handleMascotUpdate = () => {
      const activeId = localStorage.getItem('active_study_mascot') || 'char_01';
      import('./data/charactersData').then(({ studyCharacters }) => {
        const match = studyCharacters.find(c => c.id === activeId);
        if (match) {
          setActiveMascot({ emoji: match.emoji, name: match.name });
        }
      });
    };
    handleMascotUpdate();

    // Combined streak and XP sync
    const handleStreakAndXPSync = () => {
      setStreakState(loadStreakState());
      const updatedXP = localStorage.getItem('kh_student_xp');
      if (updatedXP) {
        setTotalXP(parseInt(updatedXP, 10));
      }
    };

    window.addEventListener('mascotChanged', handleMascotUpdate);
    window.addEventListener('studentStreakUpdated', handleStreakAndXPSync);
    window.addEventListener('xpChanged', handleStreakAndXPSync);
    
    return () => {
      window.removeEventListener('mascotChanged', handleMascotUpdate);
      window.removeEventListener('studentStreakUpdated', handleStreakAndXPSync);
      window.removeEventListener('xpChanged', handleStreakAndXPSync);
    };
  }, []);

  const incrementMastery = () => {
    const newCount = masteryCount + 1;
    setMasteryCount(newCount);
    localStorage.setItem('math_mastery_count', newCount.toString());
    
    // Register study activity for the day!
    const current = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);
    const result = registerStudySession(current);

    // Read the newest XP value (including potential check-in/milestone bonuses)
    const latestXP = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);
    
    // Add 25 XP for this exact foundational mastery completion
    const updatedXP = latestXP + 25;
    setTotalXP(updatedXP);
    localStorage.setItem('kh_student_xp', updatedXP.toString());

    // Show celebratory modal if a check-in occurred or milestone unlocked
    if (result.streakIncremented || result.streakMilestoneUnlocked) {
      setStreakNotification(result);
    }

    setStreakState(loadStreakState());
    window.dispatchEvent(new Event('studentStreakUpdated'));
  };

  const handleXPEarned = (pts: number) => {
    // Register study activity for the day!
    const current = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);
    const result = registerStudySession(current);

    // Read the newest XP value (including potential check-in/milestone bonuses)
    const latestXP = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);

    // Add activity points (e.g. 50 XP, 100 XP etc.) on top
    const updatedXP = latestXP + pts;
    setTotalXP(updatedXP);
    localStorage.setItem('kh_student_xp', updatedXP.toString());
    
    // Increment mastery counts slightly to reflect learning progress
    const nextMastery = masteryCount + 1;
    setMasteryCount(nextMastery);
    localStorage.setItem('math_mastery_count', nextMastery.toString());

    // Show celebratory modal if a check-in occurred or milestone unlocked
    if (result.streakIncremented || result.streakMilestoneUnlocked) {
      setStreakNotification(result);
    }

    setStreakState(loadStreakState());
    window.dispatchEvent(new Event('studentStreakUpdated'));
  };

  const handleManualCheckIn = () => {
    const current = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);
    const result = registerStudySession(current);
    
    const latestXP = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);
    setTotalXP(latestXP);
    
    setStreakNotification(result);
    setStreakState(loadStreakState());
    window.dispatchEvent(new Event('studentStreakUpdated'));
  };

  // Student ranking helper
  const getSyllabusRank = (pts: number) => {
    if (pts < 50) return 'សិស្សថ្មីថ្មោង (Beginner)';
    if (pts < 150) return 'អ្នកតស៊ូ (Apprentice)';
    if (pts < 300) return 'អ្នកចម្បាំងលេខ (Warrior)';
    if (pts < 500) return 'ស្ថាបត្យករគណិត (Architect)';
    return 'កំពូលប្រាជ្ញាគណិត (Grand Master)';
  };


  if (!authUser) {
    return <AuthScreen onLoginSuccess={(user) => setAuthUser(user)} />;
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden transition-all duration-500 ${focusMode ? 'bg-white' : ''}`}>
      {/* App Header */}
      <AnimatePresence>
        {!focusMode && (
          <motion.header 
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            exit={{ y: -64 }}
            className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-md shadow-blue-200">UMA</div>
              <span className="font-bold text-lg tracking-tight text-slate-800 flex flex-col md:flex-row md:items-baseline md:gap-1.5">
                Universal Math <span className="text-blue-500 font-extrabold text-xs">សាលាគណិតឆ្លាតវៃ AI</span>
              </span>
            </div>
            <nav className="hidden xl:flex gap-5 text-xs font-extrabold text-slate-500 h-full">
              {[
                { id: 'syllabus', label: 'មេរៀន (Curriculum)', icon: BookOpen },
                { id: 'friends_hub', label: 'បន្ទប់សិក្សា & ឆាត (Zoom & DM)', icon: Users },
                { id: 'buddies', label: 'ដៃគូសិក្សា (Mascots)', icon: Smile },
                { id: 'certificates', label: 'បណ្ណសរសើរ (Honor)', icon: Trophy },
                { id: 'foundations', label: 'គ្រឹះគណិត', icon: Layers },
                { id: 'solver', label: 'ម៉ាស៊ីនដោះស្រាយ', icon: Calculator },
                { id: 'drills', label: 'ហ្វឹកហាត់', icon: Award },
                { id: 'checker', label: 'ត្រួតពិនិត្យ', icon: CheckCircle2 },
                { id: 'dashboard', label: 'រូបមន្ត', icon: LayoutGrid },
                { id: 'history', label: 'ប្រវត្តិ', icon: HistoryIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-1.5 px-0.5 transition-all border-b-2 h-full ${
                    activeTab === tab.id 
                      ? 'text-blue-600 border-blue-600 font-black' 
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  <tab.icon size={13} className={activeTab === tab.id ? 'stroke-[2.5]' : ''} />
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3 shrink-0">
              {activeMascot && (
                <button
                  onClick={() => setActiveTab('buddies')}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-all text-xs font-black text-blue-700 shadow-sm outline-none shrink-0"
                  title={`ដៃគូសិក្សា៖ ${activeMascot.name} (ចុចប្តូរ)`}
                >
                  <span className="text-sm select-none">{activeMascot.emoji}</span>
                  <span className="text-[10px] hidden sm:inline">{activeMascot.name.split(' ')[0]}</span>
                </button>
              )}
              {authUser && (
                <button
                  onClick={() => {
                    localStorage.removeItem('kh_math_user_auth');
                    setAuthUser(null);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full text-[10px] font-black text-red-750 transition-all cursor-pointer shrink-0"
                  title="ចាកចេញ (Sign Out of Account)"
                >
                  <LogOut size={11} className="text-red-500" />
                  <span className="hidden sm:inline">ចាកចេញ</span>
                </button>
              )}
              <button 
                onClick={() => setFocusMode(true)}
                className="hidden lg:flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
              >
                <Maximize2 size={13} /> ផ្ដោតអារម្មណ៍ (Focus)
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full shadow-sm" title="ពិន្ទុគណិតវិទ្យាសរុបរបស់អ្នក (Total XP Earned)">
                <Award size={13} className="text-amber-500 fill-amber-300" />
                <span className="text-xs font-black text-amber-700 font-mono leading-none">{totalXP} XP</span>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Focus Mode Exit Trigger */}
      {focusMode && (
        <button 
          onClick={() => setFocusMode(false)}
          className="fixed top-8 right-8 p-3 bg-white shadow-xl border border-slate-100 rounded-full text-slate-400 hover:text-blue-600 z-50 transition-all hover:scale-110"
        >
          <Minimize2 size={24} />
        </button>
      )}

      {/* Main Content Layout */}
      <main className={`flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-8 overflow-hidden transition-all duration-500 ${focusMode ? 'justify-center items-center' : ''}`}>
        
        {/* Sidebar */}
        {!focusMode && (
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 h-full overflow-y-auto lg:overflow-visible">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-1 overflow-x-auto">
              {[
                { id: 'syllabus', label: 'មេរៀនថ្នាក់ទី១-១២', icon: BookOpen },
                { id: 'friends_hub', label: 'បន្ទប់សិក្សា & ឆាត', icon: Users },
                { id: 'buddies', label: 'ដៃគូសិក្សា', icon: Smile },
                { id: 'certificates', label: 'បណ្ណសរសើរ', icon: Trophy },
                { id: 'foundations', label: 'គ្រឹះគណិត', icon: Layers },
                { id: 'solver', label: 'ដោះស្រាយ', icon: Calculator },
                { id: 'drills', label: 'ហ្វឹកហាត់', icon: Award },
                { id: 'checker', label: 'ត្រួតពិនិត្យ', icon: CheckCircle2 },
                { id: 'dashboard', label: ' handbook', icon: LayoutGrid },
                { id: 'history', label: 'ប្រវត្តិ', icon: HistoryIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sidebar Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
               <div>
                 <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">របាយការណ៍សិក្សា (Study Report)</h4>
                 <div className="flex items-center gap-3 mt-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Award size={20} className="fill-blue-100" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">កម្រិតឋានៈសិក្សា (Class Rank)</p>
                      <p className="text-[11px] font-black text-blue-600 mt-1">{getSyllabusRank(totalXP)}</p>
                    </div>
                 </div>
               </div>

               <div className="border-t border-slate-100 pt-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">លំហាត់ដោះស្រាយរួច (Mastered)</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{masteryCount} វិញ្ញាសា (Problems)</p>
                  </div>
               </div>

               <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                 <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                    <span>វឌ្ឍនភាពថ្ងៃនេះ (Daily Goal)</span>
                    <span>{Math.min(100, Math.floor((masteryCount / 10) * 100))}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (masteryCount / 10) * 100)}%` }}
                    ></div>
                 </div>
               </div>

               {/* Daily Streak Tracker */}
               <div className="border-t border-slate-100 pt-3.5 space-y-2">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <span className="text-xl animate-bounce shrink-0 select-none">🔥</span>
                     <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">រៀនជាប់គ្នា (Daily Streak)</p>
                       <p className="text-xs font-black text-orange-600 mt-1">{streakState.currentStreak} ថ្ងៃជាប់ៗគ្នា (Days)</p>
                     </div>
                   </div>
                   <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">ឡូយបំផុត: {streakState.longestStreak}d</span>
                 </div>
                 
                 {streakState.todaySessionCompleted ? (
                   <div className="text-[10px] bg-emerald-50 text-emerald-700 py-1.5 px-3 rounded-xl border border-emerald-100 font-bold flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                     <span>រៀនរួចរាល់សម្រាប់ថ្ងៃនេះ! 🎉</span>
                   </div>
                 ) : (
                   <button
                     onClick={handleManualCheckIn}
                     className="w-full py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl text-[10px] font-black shadow-sm active:scale-95 transition-all text-center flex items-center justify-center gap-1 uppercase tracking-wider"
                   >
                     ⚡ ទទួលរង្វាន់សិក្សាប្រចាំថ្ងៃ (+XP)
                   </button>
                 )}
               </div>
            </div>

            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <h4 className="font-bold flex items-center gap-2 mb-2 text-xs">
                <Sparkles size={14} className="text-amber-300 fill-amber-300" />
                របៀបសិក្សាជាមួយ AI
              </h4>
              <p className="text-[11px] text-blue-500 bg-blue-50/90 font-bold px-2 py-1 rounded mb-3 self-start inline-block uppercase tracking-wider">
                គណិតវិទ្យាថ្នាក់ទី១ ដល់ ១២
              </p>
              <p className="text-xs text-blue-100 leading-relaxed mb-4">
                ប្អូនៗគ្រាន់តែជ្រើសរើសថ្នាក់រៀន រួចចុចពាក្យ "សួរ AI ពន្យល់" ដើម្បីទទួលបានការបកស្រាយលម្អិតឆ្លាតវៃភ្លាមៗ!
              </p>
              <button 
                onClick={() => setActiveTab('syllabus')}
                className="w-full bg-white text-blue-700 hover:bg-blue-50 transition-colors py-2 rounded-xl text-xs font-black border border-transparent shadow-sm whitespace-nowrap"
              >
                ចូលរៀនឥឡូវនេះ (Learn Now)
              </button>
            </div>
          </aside>
        )}

        {/* Content Area */}
        <section className={`flex-1 h-full overflow-hidden min-w-0 transition-all duration-500 ${focusMode ? 'max-w-3xl w-full flex flex-col justify-center' : ''}`}>
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto pr-1"
              >
                {activeTab === 'syllabus' && <GradeSyllabus onXPEarned={handleXPEarned} focusMode={focusMode} />}
                {activeTab === 'friends_hub' && <FriendsHub />}
                {activeTab === 'foundations' && <InteractiveExercise onComplete={incrementMastery} focusMode={focusMode} />}
                {activeTab === 'solver' && <MathSolver focusMode={focusMode} />}
                {activeTab === 'drills' && <FoundationDrills focusMode={focusMode} />}
                {activeTab === 'checker' && <HomeworkChecker focusMode={focusMode} />}
                {activeTab === 'dashboard' && <FormulaDashboard focusMode={focusMode} />}
                {activeTab === 'history' && <HistoryView focusMode={focusMode} />}
                {activeTab === 'buddies' && <MascotCenter activeMascotId="char_01" />}
                {activeTab === 'certificates' && <HonorCertificate />}
              </motion.div>
           </AnimatePresence>
        </section>
      </main>

      {/* Bottom Status Bar */}
      {!focusMode && (
        <footer className="h-8 bg-slate-800 text-white flex items-center px-8 text-[10px] uppercase tracking-tighter shrink-0 font-medium z-10">
          <div className="flex-1 flex gap-6">
            <span className="opacity-50 flex items-center gap-1.5 whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              Foundations Core: Active
            </span>
            <span className="opacity-50 hidden sm:inline border-l border-slate-700 pl-6 ml-0">Revision 2.4.0</span>
          </div>
          <div className="flex gap-6 whitespace-nowrap">
            <span className="hidden md:inline opacity-50">Local Learning Active</span>
            <span className="text-blue-400 font-bold">Secure Progress Session</span>
          </div>
        </footer>
      )}
      {/* Celebratory Daily Streak check-in / Milestone Achievement Modal */}
      <AnimatePresence>
        {streakNotification !== null && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl relative overflow-hidden text-center space-y-5"
            >
              {/* Decorative backgrounds */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="space-y-2">
                <div className="text-5xl animate-bounce select-none">
                  {streakNotification.streakMilestoneUnlocked ? streakNotification.streakMilestoneUnlocked.emoji : "🔥"}
                </div>
                {streakNotification.streakMilestoneUnlocked ? (
                  <span className="inline-block bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest leading-none">
                    មេដាយសម្រេចបានថ្មី! (New Milestone!)
                  </span>
                ) : (
                  <span className="inline-block bg-orange-100 text-orange-800 border border-orange-200 text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest leading-none">
                    ការកត់ត្រាការសិក្សាប្រចាំថ្ងៃ (Daily Streak Active)
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-slate-800">
                  {streakNotification.streakMilestoneUnlocked 
                     ? `ទទួលបានមេដាយ៖ ${streakNotification.streakMilestoneUnlocked.titleKh}` 
                     : `${streakNotification.newStreak} ថ្ងៃជាប់គ្នាសម្រេចបាន!`}
                </h3>
                <p className="text-xs text-slate-600 font-semibold px-4 select-text leading-relaxed">
                  {streakNotification.messageKh}
                </p>
              </div>

              {/* Reward feedback panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-inner">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">រង្វាន់លើកទឹកចិត្តជ័យលាភី (Rewards)</p>
                <div className="flex items-center gap-2.5 mt-1">
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-black text-amber-700 leading-none">
                    <Award size={11} className="text-amber-500 fill-amber-300" />
                    <span>+{streakNotification.xpBonus} XP Bonus</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full text-[10px] font-black text-orange-700 leading-none">
                    <span>🔥 {streakNotification.newStreak} ថ្ងៃ</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2">
                <button
                  onClick={() => setStreakNotification(null)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-50 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 pointer-events-auto"
                >
                  តស៊ូរៀនបន្តជាមួយដៃគូសិក្សា 🚀
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global AI Command Console */}
      {!focusMode && authUser && (
        <div className="bg-slate-900 border-t border-slate-800 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 z-10 text-xs shadow-xl min-h-[46px]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs select-none animate-pulse">🤖</div>
            <p className="font-extrabold text-[11px] uppercase tracking-wider text-slate-300">
              AI Command center: <span className="text-blue-400">Type /AiHelp &lt;concept&gt; to teach step-by-step</span>
            </p>
          </div>

          <form onSubmit={handleAiCommandSubmit} className="flex gap-2 w-full sm:w-auto max-w-lg flex-1">
            <input
              type="text"
              value={aiCommanderInput}
              onChange={(e) => setAiCommanderInput(e.target.value)}
              placeholder="ឧ. /AiHelp ពន្យល់រូបមន្តដេរីវេ ថ្នាក់ទី12"
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 w-full placeholder-slate-500 text-white font-semibold"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2 rounded-xl cursor-pointer active:scale-95 transition-all text-[11px] flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-900/40"
            >
              <span>សួរ AI</span>
              <Send size={12} />
            </button>
          </form>
        </div>
      )}

      {/* AI HELP POPUP MODAL */}
      <AnimatePresence>
        {aiHelpOpen && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              <button
                onClick={() => setAiHelpOpen(false)}
                className="absolute top-4 right-4 text-slate-450 hover:text-slate-650 transition-colors p-1 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer flex items-center justify-center"
                title="បិទ"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">🤖</div>
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-wide">គ្រូបង្រៀនគណិតវិទ្យា AI (AI Tutor Assistant)</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase select-text">Command: /AiHelp {aiHelpQuery}</p>
                </div>
              </div>

              {/* Scrollable Result space */}
              <div className="flex-1 overflow-y-auto py-5 space-y-4 px-1 min-h-[250px]">
                {aiHelpLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="relative animate-spin w-16 h-16 border-4 border-blue-150 border-t-blue-600 rounded-full"></div>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-705">AI គ្រូបង្រៀនកំពុងវិភាគសមីការ និងរូបមន្តរបស់ប្អូន...</p>
                      <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wider mt-1 animate-pulse">Calculating with Gemini-3.5-Flash</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 leading-relaxed text-slate-800 select-text text-sm">
                    <div className="markdown-body shadow-xs bg-white rounded-xl border border-slate-200 p-6 whitespace-pre-wrap">
                      <Markdown>{aiHelpResponse}</Markdown>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions dialog footer */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                  <Sparkles size={11} className="text-blue-500 fill-blue-200 animate-pulse" /> ពន្យល់ជាភាសាខ្មែរជំហានៗ
                </span>
                <button
                  onClick={() => setAiHelpOpen(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black active:scale-95 transition-all cursor-pointer"
                >
                  យល់ព្រម (Close)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
