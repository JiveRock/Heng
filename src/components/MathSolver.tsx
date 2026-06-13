import React, { useState, useEffect } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { Calculator, ChevronRight, Info, CheckCircle2, Sparkles, Brain, GraduationCap, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { solveWithAI, MathSolution } from '../services/geminiService';
import { exportSingleSolutionToPDF } from '../lib/pdfGenerator';

const MathSolver: React.FC<{ focusMode?: boolean }> = ({ focusMode }) => {
  const [equation, setEquation] = useState('3x + 5 = 20');
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number>(1);
  const [isWalkthrough, setIsWalkthrough] = useState(false);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingStatuses = [
    "Preparing the calculation grid...",
    "កំពុងវិភាគសមីការគណិតវិទ្យា...",
    "Synthesizing calculus & algebraic logic...",
    "កំពុងស្វែងរកវិធីដោះស្រាយលឿនបំផុត...",
    "Formatting standard KaTeX formulas...",
    "កំពុងផ្ទៀងផ្ទាត់លទ្ធផលចុងក្រោយ..."
  ];

  useEffect(() => {
    let statusInterval: any;
    let progressInterval: any;
    if (loading) {
      setLoadingStatusIndex(0);
      setProgress(5);
      
      statusInterval = setInterval(() => {
        setLoadingStatusIndex((prev) => (prev + 1) % loadingStatuses.length);
      }, 1400);

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 45) return prev + 15;
          if (prev < 80) return prev + 7;
          if (prev < 96) return prev + 2;
          return prev;
        });
      }, 150);
    } else {
      setProgress(100);
    }
    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, [loading]);

  const solveEquation = async (input: string) => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setSolution(null);
    setVisibleSteps(1);
    try {
      const result = await solveWithAI(input);
      setSolution(result);
      
      // Save to history
      const saved = localStorage.getItem('math_history');
      const history = saved ? JSON.parse(saved) : [];
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        equation: input,
        solution: result.finalAnswer,
        timestamp: Date.now(),
        type: 'solver',
        fullSolution: result
      };
      localStorage.setItem('math_history', JSON.stringify([newItem, ...history].slice(0, 50)));
    } catch (err: any) {
      console.error("Solver Error: ", err);
      if (err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')) {
        setError('The Universal Architect is currently resting (Rate Limit Exceeded). Please try again in 1 minute.');
      } else {
        setError('The Architect encountered a logical paradox. Please check your equation and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    solveEquation(equation);
  }, []);

  return (
    <div className={`space-y-6 ${focusMode ? 'px-4 max-w-2xl mx-auto' : ''}`}>
      <div className={`bg-white rounded-3xl p-6 transition-all duration-500 ${focusMode ? 'shadow-xl border-blue-200' : 'shadow-sm border-slate-200'} border`}>
        {!focusMode && (
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Calculator size={12} /> Universal Solver Input
          </label>
        )}
        <div className="relative mb-4">
          <input 
            type="text" 
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && solveEquation(equation)}
            className={`w-full text-lg font-mono border-2 rounded-2xl px-4 py-4 focus:outline-none focus:border-blue-500 transition-all ${focusMode ? 'border-blue-200 bg-white text-center text-2xl' : 'border-blue-50 bg-slate-50'}`}
            placeholder="e.g. Find the derivative of x^2 + 5x..."
          />
          {!focusMode && (
            <div className="absolute right-4 top-4 text-blue-400">
              <Sparkles size={20} className={loading ? 'animate-spin' : ''} />
            </div>
          )}
        </div>
        <button 
          disabled={loading}
          onClick={() => solveEquation(equation)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
        >
          {loading ? 'Consulting the Architect...' : 'Architect Solution'}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3"
          >
            <div className="p-1 bg-rose-100 text-rose-500 rounded-md shrink-0">
              <Info size={16} />
            </div>
            <p className="text-sm text-rose-700 font-medium leading-relaxed">
              {error}
            </p>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {solution ? (
          <motion.div 
            key="solution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header / Strategy */}
            <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-4`}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap size={14} /> {solution.level}
                </span>
                <button
                  onClick={() => exportSingleSolutionToPDF(solution)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100 hover:shadow-lg active:scale-95 group font-mono"
                  title="Download offline study report with full derivation"
                >
                  <Download size={13} className="group-hover:translate-y-0.5 transition-transform" />
                  EXPORT STUDY SHEET (PDF)
                </button>
              </div>
              
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Strategy & The "Why"</h2>
                <p className="text-slate-700 leading-relaxed italic border-l-4 border-blue-100 pl-4">
                  {solution.strategy}
                </p>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <h2 className="text-xs font-bold text-blue-500 uppercase tracking-tight mb-2">Core Concept</h2>
                 <p className="text-sm text-slate-600 font-medium">{solution.coreConcept}</p>
              </div>
            </div>

            {/* Steps */}
            <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden`}>
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calculator size={18} className="text-blue-600" />
                  Logical Breakdown
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsWalkthrough(!isWalkthrough); setVisibleSteps(isWalkthrough ? solution.steps.length : 1); }}
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                      isWalkthrough ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isWalkthrough ? 'Walkthrough Mode' : 'View Full'}
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-8 space-y-12">
                {solution.steps.slice(0, isWalkthrough ? visibleSteps : solution.steps.length).map((step, i) => {
                  const isVisible = !isWalkthrough || i < visibleSteps;
                  const isLastVisible = isWalkthrough && i === visibleSteps - 1 && visibleSteps < solution.steps.length;
                  const isLastStep = i === solution.steps.length - 1;
                  
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex gap-6"
                    >
                      <div className="flex flex-col items-center shrink-0">
                        <motion.div 
                          animate={isVisible ? { scale: [1, 1.1, 1], backgroundColor: ['#eff6ff', '#2563eb', '#2563eb'], color: ['#2563eb', '#ffffff', '#ffffff'] } : {}}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-white ${isVisible ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}
                        >
                          {i + 1 < visibleSteps || !isWalkthrough ? <CheckCircle2 size={16} /> : i + 1}
                        </motion.div>
                        {!isLastStep && (
                           <div className={`w-px flex-1 my-2 transition-colors duration-500 ${i < visibleSteps - 1 || !isWalkthrough ? 'bg-blue-200' : 'bg-slate-100'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-6">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 italic flex items-center justify-between">
                          <span>{step.desc}</span>
                          {(!isWalkthrough || i < visibleSteps - 1) && <span className="text-emerald-500 text-[8px]">LOGIC VALIDATED</span>}
                        </h4>
                        <div className={`bg-white border-2 rounded-2xl p-6 shadow-sm mb-4 overflow-x-auto transition-all ${isVisible ? 'border-blue-50 ring-1 ring-blue-50' : 'border-slate-50'}`}>
                          <BlockMath math={step.latex} />
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{step.explanation}</p>
                        
                        {isLastVisible && (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setVisibleSteps(v => v + 1)}
                            className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 group"
                          >
                            Analyze Next Step
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Final Answer */}
            <AnimatePresence>
              {(!isWalkthrough || visibleSteps === solution.steps.length) && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-8 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-100 text-center space-y-4"
                >
                  <h3 className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em]">Final Verification Result</h3>
                  <div className="text-4xl md:text-5xl font-serif italic tracking-tight">
                    <BlockMath math={solution.finalAnswer} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pro-Tip */}
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Brain size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-tight mb-1">Architect's Pro-Tip</h4>
                <p className="text-sm text-emerald-600 leading-relaxed font-medium">
                  {solution.proTip}
                </p>
              </div>
            </div>
          </motion.div>
        ) : loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-16 px-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-6"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-blue-100 opacity-75 animate-ping"></span>
              <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Sparkles size={28} className="animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>
            
            <div className="space-y-2 text-center max-w-sm">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Calculating Logic Path
              </h3>
              <p className="text-xs font-semibold text-blue-600 min-h-12 flex items-center justify-center px-4 transition-all duration-300">
                {loadingStatuses[loadingStatusIndex]}
              </p>
            </div>

            <div className="w-full max-w-xs space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                  className="h-full bg-blue-600 rounded-full shadow"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                <span>ANALYZING / វិភាគ</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default MathSolver;

