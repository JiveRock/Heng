import React, { useState, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Send, 
  RotateCcw, 
  Lightbulb, 
  Zap, 
  Bookmark, 
  Star,
  Check,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { syllabusLessons, SyllabusLesson } from '../data/lessonsData';
import { explainConceptWithAI } from '../services/geminiService';

// Khmer Numbers map for displaying grade labels beautifully
const khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩', '១០', '១១', '១២'];

interface GradeSyllabusProps {
  focusMode?: boolean;
  onXPEarned?: (pts: number) => void;
}

export default function GradeSyllabus({ focusMode, onXPEarned }: GradeSyllabusProps) {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedLesson, setSelectedLesson] = useState<SyllabusLesson | null>(null);
  
  // Quiz student state
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizStatus, setQuizStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [xp, setXP] = useState(0);

  // AI interactive state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<{ query: string; answer: string }[]>([]);

  // Load scores and progress from localstorage
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('kh_completed_lessons');
      if (savedCompleted) {
        setCompletedLessons(JSON.parse(savedCompleted));
      }
      const savedXP = localStorage.getItem('kh_student_xp');
      if (savedXP) {
        setXP(parseInt(savedXP, 10));
      }
    } catch (e) {
      console.error('Error load standard scores:', e);
    }
  }, []);

  // Filter lessons for the chosen grade
  const gradeLessons = syllabusLessons.filter(l => l.grade === selectedGrade);

  // Automatically select the first lesson when grade changes
  useEffect(() => {
    if (gradeLessons.length > 0) {
      setSelectedLesson(gradeLessons[0]);
    } else {
      setSelectedLesson(null);
    }
    setQuizAnswer('');
    setQuizStatus('idle');
    setAiExplanation(null);
    setAiQuestion('');
  }, [selectedGrade]);

  // Handle quiz validation
  const checkAnswer = () => {
    if (!selectedLesson) return;
    
    const isCorrect = quizAnswer.trim().toLowerCase() === selectedLesson.quiz.correctAnswer.trim().toLowerCase();
    
    if (isCorrect) {
      setQuizStatus('correct');
      // If not already completed, reward XP points
      if (!completedLessons.includes(selectedLesson.id)) {
        const bonus = selectedLesson.quiz.points;
        const newXP = xp + bonus;
        setXP(newXP);
        localStorage.setItem('kh_student_xp', newXP.toString());
        
        const nextCompleted = [...completedLessons, selectedLesson.id];
        setCompletedLessons(nextCompleted);
        localStorage.setItem('kh_completed_lessons', JSON.stringify(nextCompleted));

        if (onXPEarned) {
          onXPEarned(bonus);
        }
      }
    } else {
      setQuizStatus('incorrect');
    }
  };

  // Submit automatic query or custom query to AI math buddy
  const askAITutor = async (customQuery?: string) => {
    if (!selectedLesson) return;
    setIsAiLoading(true);
    setAiExplanation(null);

    const queryText = customQuery || aiQuestion;

    try {
      const response = await explainConceptWithAI(
        `${selectedLesson.title} (${selectedLesson.englishTitle})`,
        `ថ្នាក់ទី ${selectedGrade} (Grade ${selectedGrade})`,
        queryText
      );
      setAiExplanation(response);
      if (queryText) {
        setAiHistory(prev => [...prev, { query: queryText, answer: response }]);
      }
      
      // Earn extra small XP for studying with AI! (15 XP for AI interaction, maximum one per lesson)
      const aiXpKey = `ai_xp_${selectedLesson.id}`;
      const alreadyEarnedAI = localStorage.getItem(aiXpKey);
      if (!alreadyEarnedAI) {
        localStorage.setItem(aiXpKey, 'true');
        const newXP = xp + 15;
        setXP(newXP);
        localStorage.setItem('kh_student_xp', newXP.toString());
        if (onXPEarned) {
          onXPEarned(15);
        }
      }
    } catch (err) {
      console.error(err);
      setAiExplanation("សូមអភ័យទោស មានការរអាក់រអួលក្នុងការទទួលទិន្នន័យ។ សូមព្យាយាមឡើងវិញ! (Network Error)");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Compute student Rank level based on XP
  const getStudentRank = (score: number) => {
    if (score < 50) return { title: 'សិស្សថ្មីថ្មោង (Beginner)', color: 'text-slate-500 bg-slate-100' };
    if (score < 150) return { title: 'អ្នកតស៊ូគណិតវិទ្យា (Math Apprentice)', color: 'text-sky-600 bg-sky-50 border border-sky-100' };
    if (score < 300) return { title: 'អ្នកចម្បាំងលេខ (Equation Warrior)', color: 'text-indigo-600 bg-indigo-50 border border-indigo-100' };
    if (score < 500) return { title: 'ស្ថាបត្យករគណិតវិទ្យា (Math Architect)', color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' };
    return { title: 'កំពូលប្រាជ្ញាគណិតវិទ្យា (Grand Master)', color: 'text-amber-600 bg-amber-50 border border-amber-200 shadow-sm animate-pulse' };
  };

  const rank = getStudentRank(xp);

  return (
    <div className={`space-y-6 ${focusMode ? 'max-w-5xl mx-auto px-4 py-8' : ''}`}>
      {/* Upper Gamification & Score Header panel */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-500/10 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none"></div>

        <div className="space-y-2 text-center md:text-left z-10">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="bg-white/20 text-blue-100 text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full">
              កម្មវិធីសិក្សាខ្មែរ (Grade 1 - 12 Cambodia Curriculum)
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            ថ្នាក់រៀនគណិតវិទ្យាស្វ័យសិក្សា និង <span className="text-amber-400">ជំនួយការ AI</span>
          </h2>
          <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
            ស្វែងយល់ពីមេរៀនគ្រប់កម្រិតថ្នាក់ ធ្វើលំហាត់ដើម្បីសន្សំពិន្ទុ XP និងសិក្សាស្វែងយល់បន្ថែមយ៉ាងលម្អិតជាមួយ គ្រូបង្រៀនឆ្លាតវៃ AI ជាភាសាខ្មែរ!
          </p>
        </div>

        {/* Scoring & Rank block */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 z-10 shrink-0 w-full md:w-auto justify-around md:justify-start">
          <div className="text-center px-4 border-r border-white/15">
            <p className="text-[9px] text-blue-200 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
              <Award size={10} className="text-amber-400" /> ពិន្ទុសិក្សា (XP)
            </p>
            <p className="text-3xl font-black text-amber-400 font-mono mt-1">{xp} <span className="text-xs text-white">XP</span></p>
          </div>
          <div className="text-center px-4">
            <p className="text-[9px] text-blue-200 font-extrabold uppercase tracking-widest">ឋានៈសិក្សា (Your Rank)</p>
            <div className={`mt-2 font-extrabold text-[11px] px-3 py-1 rounded-lg ${rank.color}`}>
              {rank.title}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Grade & Lesson selectors (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Grade Selector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp size={12} className="text-blue-500" />
              ជ្រើសរើសថ្នាក់ (Select Grade)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <button
                  key={g}
                  id={`grade-btn-${g}`}
                  onClick={() => setSelectedGrade(g)}
                  className={`py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex flex-col items-center justify-center border ${
                    selectedGrade === g
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-50'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 group-hover:text-white">ថ្នាក់ទី</span>
                  <span className="text-sm font-mono tracking-tight font-extrabold">{khmerNumbers[g]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lessons List within Grade */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen size={12} className="text-blue-500" />
              មេរៀនស្វ័យសិក្សា ({gradeLessons.length})
            </h3>
            <div className="space-y-1.5">
              {gradeLessons.map((les) => {
                const isCompleted = completedLessons.includes(les.id);
                const isCurrent = selectedLesson?.id === les.id;
                return (
                  <button
                    key={les.id}
                    onClick={() => setSelectedLesson(les)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 active:scale-95 border ${
                      isCurrent
                        ? 'bg-blue-50/50 border-blue-200 text-slate-800'
                        : 'bg-white hover:bg-slate-50/70 border-transparent text-slate-600'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle size={15} className="text-emerald-500 fill-emerald-50" />
                      ) : (
                        <div className={`w-3.5 h-3.5 rounded-full border-2 ${isCurrent ? 'border-blue-500' : 'border-slate-300'}`}></div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black leading-snug">{les.title}</p>
                      <p className="text-[9px] font-mono text-slate-400">{les.englishTitle}</p>
                    </div>
                  </button>
                );
              })}
              {gradeLessons.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs text-balance">
                  មិនទាន់មានមេរៀនបញ្ចូលសម្រាប់ថ្នាក់នេះនៅឡើយទេ។ (No lessons uploaded for this grade)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Lesson details & AI Explainer (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {selectedLesson ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Center Panel (Lessons & Quiz) - 7 cols */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Lesson Details Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 flex-wrap">
                    <div>
                      <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        ថ្នាក់ទី {khmerNumbers[selectedLesson.grade]} • Lessons
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-800 mt-1">
                        {selectedLesson.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono tracking-tight">{selectedLesson.englishTitle}</p>
                    </div>

                    {completedLessons.includes(selectedLesson.id) && (
                      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <Check size={12} className="stroke-[3]" /> រៀនរួចរាល់ (+{selectedLesson.quiz.points} XP)
                      </span>
                    )}
                  </div>

                  {/* Syllabus Lesson Description in Khmer */}
                  <div className="space-y-2">
                    <p className="text-slate-700 text-sm font-semibold leading-relaxed">
                      {selectedLesson.descriptionKh}
                    </p>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wide">💡 ឧទាហរណ៍ជាក់ស្ដែង៖</p>
                      <p className="text-xs text-slate-600 mt-1 font-semibold leading-relaxed">{selectedLesson.exampleKh}</p>
                    </div>
                  </div>

                  {/* Math Formula / Theorem Block */}
                  {selectedLesson.formula && (
                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center justify-center overflow-x-auto select-all relative group hover:bg-blue-50/10 transition-colors">
                      <span className="absolute top-2.5 left-3 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
                        រូបមន្តគន្លឹះ / Math Formula
                      </span>
                      <div className="mt-4 text-slate-800 scale-105">
                        <BlockMath math={selectedLesson.formula} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Practice Quiz Block */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 text-slate-800">
                    <HelpCircle size={18} className="text-amber-500" />
                    <h4 className="font-extrabold text-sm tracking-tight">លំហាត់អនុវត្តសាកល្បង ដើម្បីសន្សំពិន្ទុ (+{selectedLesson.quiz.points} XP)</h4>
                  </div>

                  <p className="text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                     {selectedLesson.quiz.question}
                  </p>

                  {/* Optional Multiple choice or text input */}
                  {selectedLesson.quiz.options ? (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedLesson.quiz.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setQuizAnswer(opt);
                            setQuizStatus('idle');
                          }}
                          className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center border ${
                            quizAnswer === opt
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="បញ្ចូលចម្លើយរបស់អ្នកនៅទីនេះ..."
                        value={quizAnswer}
                        onChange={(e) => {
                          setQuizAnswer(e.target.value);
                          setQuizStatus('idle');
                        }}
                        className="flex-1 px-4 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-800"
                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                      />
                    </div>
                  )}

                  {/* Feedback Status */}
                  <AnimatePresence>
                    {quizStatus === 'correct' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-700 space-y-1"
                      >
                        <p className="text-xs font-black flex items-center gap-1.5">
                          <CheckCircle size={15} className="text-emerald-500" />
                          អបអរសាទរ! ចម្លើយរបស់អ្នកត្រឹមត្រូវហើយ! 🎉
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600/90 pl-5">
                          ប្អូនទទួលបាន <strong className="font-extrabold text-emerald-700">+{selectedLesson.quiz.points} XP</strong> ត្រូវបានបញ្ចូលទៅក្នុងគណនីសិក្សា!
                        </p>
                      </motion.div>
                    )}

                    {quizStatus === 'incorrect' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-700 space-y-1.5"
                      >
                        <p className="text-xs font-black flex items-center gap-1.5">
                          <XCircle size={15} className="text-rose-500" />
                          ចម្លើយមិនទាន់ត្រឹមត្រូវទេ! សូមព្យាយាមម្ដងទៀត។ 🤔
                        </p>
                        <div className="pl-5 flex items-start gap-1 justify-between">
                          <p className="text-[10px] text-rose-600/80 font-bold leading-relaxed">
                            <strong className="text-rose-700">ចង្អុលគន្លឹះ៖</strong> {selectedLesson.quiz.hint}
                          </p>
                          <button
                            onClick={() => {
                              setQuizAnswer('');
                              setQuizStatus('idle');
                            }}
                            className="bg-white hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg text-[9px] font-black border border-rose-200 shadow-sm shrink-0 whitespace-nowrap active:scale-95 transition-transform"
                          >
                            គិតឡើងវិញ
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submission and Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={checkAnswer}
                      disabled={!quizAnswer}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold tracking-wide active:scale-95 transition-all shadow-md shadow-slate-100 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      ផ្ទៀងផ្ទាត់ចម្លើយ (Submit Answer)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel (AI Tutor Study Buddy) - 5 cols */}
              <div className="md:col-span-5 space-y-4">
                
                {/* AI Tutor Chat Wrapper */}
                <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 relative flex flex-col justify-between">
                  <div className="absolute top-2.5 right-3.5 flex items-center gap-1 text-[9px] font-extrabold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full">
                    <Sparkles size={11} className="text-blue-500 fill-blue-500 animate-pulse" />
                    AI Tutor
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                      <MessageSquare size={16} className="text-blue-600" />
                      គ្រូបង្រៀនឆ្លាតវៃ AI
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      មិនយល់មេរៀនមែនទេ? សួរដេញដោល AI គ្រូបង្រៀន ដើម្បីពន្យល់ និងបកស្រាយរូបមន្តលម្អិតបន្ថែមជាភាសាខ្មែរគ្រប់ពេលវេលា!
                    </p>
                  </div>

                  {/* AI Primary prompt shortcuts / default explanations */}
                  <div className="flex flex-col gap-1.5 pt-1.5">
                    <button
                      onClick={() => askAITutor()}
                      disabled={isAiLoading}
                      className="w-full text-left p-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl text-[11px] font-bold text-slate-700 transition-all active:scale-98 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5 truncate text-slate-800">
                        <Lightbulb size={12} className="text-indigo-500 shrink-0" />
                        សូមសម្រាយ និងពន្យល់មេរៀននេះលម្អិត
                      </span>
                      <ChevronRight size={12} className="text-slate-400 shrink-0" />
                    </button>
                    <button
                      onClick={() => askAITutor("សូមជួយផ្ដល់ឧទាហរណ៍ជាក់ស្ដែង ៣ បន្ថែមទៀតដែលមានរបៀបដោះស្រាយជាជំហានៗ។ (Give 3 more examples)")}
                      disabled={isAiLoading}
                      className="w-full text-left p-2.5 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl text-[11px] font-bold text-slate-700 transition-all active:scale-98 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5 truncate text-slate-800">
                        <Zap size={12} className="text-amber-500 shrink-0" />
                        សុំឧទាហរណ៍ដោះស្រាយ ៣ បន្ថែមទៀត
                      </span>
                      <ChevronRight size={12} className="text-slate-400 shrink-0" />
                    </button>
                  </div>

                  {/* Interactive Query Input */}
                  <div className="space-y-2 mt-2 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">
                      សួរគ្រូបង្វឹក AI ផ្ទាល់ខ្លួន៖ (Ask AI custom math question)
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="ឧ. ហេតុអ្វីបានជា a²+b²=c²? ឬសួររូបមន្ត..."
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                        onKeyDown={(e) => e.key === 'Enter' && aiQuestion.trim() && askAITutor()}
                      />
                      <button
                        onClick={() => askAITutor()}
                        disabled={!aiQuestion.trim() || isAiLoading}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-blue-600 hover:text-blue-700 disabled:text-slate-300 disabled:pointer-events-none transition-colors"
                        title="សួរទៅ AI"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Loader State */}
                  {isAiLoading && (
                    <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full border-3 border-blue-200 border-t-blue-600 animate-spin"></div>
                      <p className="text-xs font-bold text-slate-500 animate-pulse">គ្រូបង្រៀន AI កំពុងរៀបចំសេចក្ដីយល់ជាភាសាខ្មែរ... 🧠</p>
                    </div>
                  )}

                  {/* AI Explanation render block */}
                  <AnimatePresence>
                    {aiExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-md max-h-[380px] overflow-y-auto space-y-3 relative mt-2 shrink-0 select-text"
                      >
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
                          <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-wider">
                            ការពន្យល់ និងរបៀបដោះស្រាយ
                          </span>
                          <button
                            onClick={() => setAiExplanation(null)}
                            className="text-slate-400 hover:text-slate-600"
                            title="X"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>

                        {/* Rendering Markdown with beautiful Tailwind styling (and no class name in Markdown component as required) */}
                        <div className="markdown-body text-xs text-slate-700 leading-relaxed font-semibold space-y-4 prose prose-sm prose-slate select-text">
                          <Markdown>{aiExplanation}</Markdown>
                        </div>
                        
                        <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/30 text-[10px] font-bold text-blue-600/90 text-center leading-snug">
                          🏆 ប្អូនទទួលបាន <strong className="font-extrabold text-blue-700">+15 XP</strong> សម្រាប់ការសិក្សាស្រាវជ្រាវនេះ!
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <BookOpen size={32} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-700">សូមជ្រើសរើសមេរៀនដើម្បីសិក្សា</h4>
                <p className="text-xs text-slate-400">សូមជ្រើសរើសថ្នាក់ ឬមេរៀនណាមួយនៅប្រអប់បញ្ជីដៃឆ្វេង ដើម្បីចាប់ផ្ដើមស្វ័យសិក្សា និងដោះស្រាយលេខដើម្បីសន្សំពិន្ទុ!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
