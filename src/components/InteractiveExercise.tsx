import React, { useState, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { Layers, Lightbulb, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Challenge {
  equation: string;
  step1Prompt: string;
  step1Prefix: string;
  step1Target: string;
  finalAnswer: string;
}

const InteractiveExercise: React.FC<{ onComplete: () => void; focusMode?: boolean }> = ({ onComplete, focusMode }) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userStep, setUserStep] = useState('');
  const [userFinal, setUserFinal] = useState('');
  const [stage, setStage] = useState<1 | 2 | 3>(1); // 1: Step 1, 2: Final, 3: Success
  const [error, setError] = useState(false);

  const generateChallenge = () => {
    const a = Math.floor(Math.random() * 5) + 2;
    const x = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = a * x + b;

    setChallenge({
      equation: `${a}x + ${b} = ${c}`,
      step1Prompt: `Subtract ${b} from both sides`,
      step1Prefix: `${a}x = `,
      step1Target: (c - b).toString(),
      finalAnswer: x.toString()
    });
    setStage(1);
    setUserStep('');
    setUserFinal('');
    setError(false);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const [isAnimatingError, setIsAnimatingError] = useState(false);

  const triggerError = () => {
    setError(true);
    setIsAnimatingError(true);
    setTimeout(() => setIsAnimatingError(false), 500);
  };

  const handleStepSubmit = () => {
    if (userStep === challenge?.step1Target) {
      setStage(2);
      setError(false);
    } else {
      triggerError();
    }
  };

  const handleFinalSubmit = () => {
    if (userFinal === challenge?.finalAnswer) {
      setStage(3);
      onComplete();
      setError(false);

      // Save to history
      const saved = localStorage.getItem('math_history');
      const history = saved ? JSON.parse(saved) : [];
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        equation: challenge.equation,
        solution: `x = ${challenge.finalAnswer}`,
        timestamp: Date.now(),
        type: 'foundations'
      };
      localStorage.setItem('math_history', JSON.stringify([newItem, ...history].slice(0, 50)));
    } else {
      triggerError();
    }
  };

  if (!challenge) return null;

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  };

  return (
    <div className={`transition-all duration-500 ${focusMode ? 'max-w-2xl mx-auto' : ''} bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200`}>
      {!focusMode && (
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Layers size={24} className="text-blue-600" />
            Interactive Foundations
          </h3>
          <button onClick={generateChallenge} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <RefreshCw size={20} />
          </button>
        </div>
      )}

      <div className={`rounded-2xl p-8 transition-all duration-500 ${focusMode ? 'bg-white border-transparent' : 'bg-slate-50 border-slate-100 shadow-inner'} text-center mb-10`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Current Challenge</p>
        <motion.div 
          key={challenge.equation}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-serif italic text-slate-800 ${focusMode ? 'text-6xl' : 'text-4xl'}`}
        >
          <BlockMath math={challenge.equation} />
        </motion.div>
      </div>

      <div className="space-y-8 max-w-lg mx-auto">
        {/* Step 1 */}
        <div className={`transition-all duration-500 ${stage >= 1 ? 'opacity-100' : 'opacity-20'}`}>
          <div className="flex items-center gap-3 mb-4">
            <motion.span 
              animate={stage > 1 ? { scale: [1, 1.2, 1], backgroundColor: '#10b981' } : {}}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stage > 1 ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}
            >
              {stage > 1 ? <CheckCircle2 size={14} /> : '1'}
            </motion.span>
            <p className="text-sm font-bold text-slate-700">{challenge.step1Prompt}</p>
          </div>
          
          <motion.div 
            animate={isAnimatingError && stage === 1 ? shakeAnimation : {}}
            className={`flex items-center gap-3 bg-white border p-4 rounded-xl shadow-sm transition-all ${
              stage > 1 ? 'border-emerald-200 bg-emerald-50/30' : 
              error && stage === 1 ? 'border-rose-300 ring-2 ring-rose-50' :
              focusMode ? 'border-blue-100 ring-2 ring-blue-50' : 'border-slate-200'
            }`}
          >
            <span className="font-serif italic text-xl text-slate-500 whitespace-nowrap">{challenge.step1Prefix}</span>
            <input 
              type="text"
              disabled={stage > 1}
              value={userStep}
              onChange={(e) => { setUserStep(e.target.value); if(error) setError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleStepSubmit()}
              className={`flex-1 bg-slate-50 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 font-mono text-lg ${stage > 1 ? 'text-emerald-600 font-bold bg-emerald-50' : ''} ${focusMode ? 'text-center' : ''}`}
            />
            {stage === 1 && (
              <button 
                onClick={handleStepSubmit}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Step 2 */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.span 
                  animate={stage > 2 ? { scale: [1, 1.2, 1], backgroundColor: '#10b981' } : {}}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stage > 2 ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {stage > 2 ? <CheckCircle2 size={14} /> : '2'}
                </motion.span>
                <p className="text-sm font-bold text-slate-700">Divide to solve for x</p>
              </div>

              <motion.div 
                animate={isAnimatingError && stage === 2 ? shakeAnimation : {}}
                className={`flex items-center gap-3 bg-white border p-4 rounded-xl shadow-sm transition-all ${
                  stage > 2 ? 'border-emerald-200 bg-emerald-50/30' : 
                  error && stage === 2 ? 'border-rose-300 ring-2 ring-rose-50' :
                  focusMode ? 'border-blue-100 ring-2 ring-blue-50' : 'border-slate-200'
                }`}
              >
                <span className="font-serif italic text-xl text-slate-500 whitespace-nowrap">x = </span>
                <input 
                  type="text"
                  disabled={stage > 2}
                  value={userFinal}
                  onChange={(e) => { setUserFinal(e.target.value); if(error) setError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinalSubmit()}
                  className={`flex-1 bg-slate-50 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 font-mono text-lg ${stage > 2 ? 'text-emerald-600 font-bold bg-emerald-50' : ''} ${focusMode ? 'text-center' : ''}`}
                />
                {stage === 2 && (
                  <button 
                    onClick={handleFinalSubmit}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        {stage === 3 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl text-center shadow-sm"
          >
            <p className="text-emerald-700 font-bold text-xl mb-4 flex items-center justify-center gap-2">
              <CheckCircle2 size={28} /> Bravo! Foundations Solidified.
            </p>
            <button 
              onClick={generateChallenge}
              className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              Try Next Level
            </button>
          </motion.div>
        )}

        {/* Error/Hint */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 shadow-sm"
          >
            <Lightbulb className="text-amber-500 mt-1" size={24} />
            <p className="text-sm text-amber-800 font-medium leading-relaxed">Review the arithmetic! You are performing an inverse operation to isolate the term.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InteractiveExercise;
