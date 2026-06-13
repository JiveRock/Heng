import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import { ClipboardCheck, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectErrorType } from '../lib/MathLogic';

const HomeworkChecker: React.FC<{ focusMode?: boolean }> = ({ focusMode }) => {
  const [problem, setProblem] = useState('2x + 10 = 30');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | 'hint', message: string } | null>(null);

  const checkAnswer = () => {
    if (!userAnswer) return;
    
    // Correct answer for 2x + 10 = 30 is 10
    const correctAnswer = "10";
    
    if (userAnswer.trim() === correctAnswer) {
      setFeedback({ type: 'correct', message: "Perfect! You solved it correctly." });
      
      // Save to history
      const saved = localStorage.getItem('math_history');
      const history = saved ? JSON.parse(saved) : [];
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        equation: problem,
        solution: `x = ${userAnswer}`,
        timestamp: Date.now(),
        type: 'checker'
      };
      localStorage.setItem('math_history', JSON.stringify([newItem, ...history].slice(0, 50)));
    } else {
      const hint = detectErrorType(userAnswer, correctAnswer);
      setFeedback({ type: 'hint', message: hint });
    }
  };

  return (
    <div className={`transition-all duration-500 ${focusMode ? 'max-w-xl mx-auto' : ''} bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6`}>
      {!focusMode && (
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ClipboardCheck size={12} /> Homework Verification
        </label>
      )}

      <div className={`p-8 rounded-2xl border transition-all duration-500 ${focusMode ? 'bg-white border-transparent' : 'bg-slate-50 border-slate-100'} text-center`}>
        <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Target Problem</p>
        <div className={`font-serif italic text-slate-800 ${focusMode ? 'text-5xl' : 'text-3xl'}`}>
          <InlineMath math={problem} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">Your Answer (x = ?)</label>
          <div className="flex gap-2">
            <input 
              type="text"
              value={userAnswer}
              onChange={(e) => { setUserAnswer(e.target.value); setFeedback(null); }}
              placeholder="Enter value"
              className={`flex-1 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500 font-mono transition-all border-2 ${focusMode ? 'border-blue-100 bg-white text-center text-xl' : 'border-slate-50 bg-slate-50'}`}
            />
            <button 
              onClick={checkAnswer}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-xl transition-all shadow-md shadow-blue-100`}
            >
              Verify
            </button>
          </div>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`p-6 rounded-2xl flex items-start gap-3 shadow-sm ${
                feedback.type === 'correct' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' :
                feedback.type === 'hint' ? 'bg-amber-50 border border-amber-100 text-amber-700' :
                'bg-rose-50 border border-rose-100 text-rose-700'
              }`}
            >
              <div className="mt-0.5">
                {feedback.type === 'correct' ? <CheckCircle size={20} /> :
                 feedback.type === 'hint' ? <Lightbulb size={20} /> :
                 <AlertCircle size={20} />}
              </div>
              <p className="text-sm font-bold leading-relaxed">{feedback.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!focusMode && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-2">Teacher Note</p>
          <p className="text-xs text-slate-500 italic">Self-correction is the best way to learn! If you're stuck, use the hint to re-evaluate your steps.</p>
        </div>
      )}
    </div>
  );
};

export default HomeworkChecker;
