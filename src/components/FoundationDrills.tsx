import React, { useState } from 'react';
import { InlineMath } from 'react-katex';
import { Brain, RefreshCw, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Difficulty, Problem } from '../types';

const FoundationDrills: React.FC<{ focusMode?: boolean }> = ({ focusMode }) => {
  const [domain, setDomain] = useState<'Algebra' | 'Derivatives' | 'Integrals' | 'Trigonometry' | 'Limits' | 'Matrices' | 'Probability' | 'Vectors'>('Algebra');
  const [difficulty, setDifficulty] = useState<Difficulty>('Basic');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const generateDerivativeProblem = (diff: Difficulty) => {
    let equation, solution, hint;
    const coeff = Math.floor(Math.random() * 8) + 2;
    const power = Math.floor(Math.random() * 4) + 2;

    switch (diff) {
      case 'Advanced':
        // Trig Derivatives or chain rule
        if (Math.random() > 0.5) {
          equation = `\\frac{d}{dx}[\\sin(${coeff}x)]`;
          solution = `${coeff}\\cos(${coeff}x)`;
          hint = "Apply the Chain Rule: Derivative of sin(u) is cos(u) * u'. Here u = ax.";
        } else {
          equation = `\\frac{d}{dx}[e^{${coeff}x}]`;
          solution = `${coeff}e^{${coeff}x}`;
          hint = "The derivative of e^(ax) is a * e^(ax).";
        }
        break;
      case 'Intermediate':
        equation = `\\frac{d}{dx}[${coeff}x^{${power}} + ${Math.floor(Math.random() * 20)}]`;
        solution = `${coeff * power}x^{${power - 1}}`;
        hint = "Apply the Power Rule. Remember, the derivative of a constant is zero.";
        break;
      case 'Basic':
      default:
        equation = `\\frac{d}{dx}[x^{${power}}]`;
        solution = `${power}x^{${power - 1}}`;
        hint = "Apply the Power Rule: Multiply the coefficient by the current power, then subtract 1 from the power.";
        break;
    }
    return { equation, solution, hint, steps: [] };
  };

  const generateIntegralProblem = (diff: Difficulty) => {
    let equation, solution, hint;
    const coeff = Math.floor(Math.random() * 8) + 2;
    const power = Math.floor(Math.random() * 4) + 2;

    switch (diff) {
      case 'Advanced':
        if (Math.random() > 0.5) {
          equation = `\\int \\sin(${coeff}x) \\, dx`;
          solution = `-\\frac{1}{${coeff}}\\cos(${coeff}x) + C`;
          hint = "Integrate sine: The integral of sin(ax) is -(1/a)cos(ax) + C.";
        } else {
          equation = `\\int e^{${coeff}x} \\, dx`;
          solution = `\\frac{1}{${coeff}}e^{${coeff}x} + C`;
          hint = "The integral of e^(ax) is (1/a)e^(ax) + C.";
        }
        break;
      case 'Intermediate':
        const constant = Math.floor(Math.random() * 10) + 1;
        equation = `\\int (${coeff}x^{${power}} + ${constant}) \\, dx`;
        const newPowerInt = power + 1;
        solution = `\\frac{${coeff}}{${newPowerInt}}x^{${newPowerInt}} + ${constant}x + C`;
        hint = "Integrate term-by-term. Add 1 to each exponent and divide by the new exponent.";
        break;
      case 'Basic':
      default:
        equation = `\\int x^{${power}} \\, dx`;
        const newPower = power + 1;
        solution = `\\frac{1}{${newPower}}x^{${newPower}} + C`;
        hint = "Reverse the Power Rule: Add 1 to the exponent, then divide by the new exponent. Don't forget + C!";
        break;
    }
    return { equation, solution, hint, steps: [] };
  };

  const generateTrigonometryProblem = (diff: Difficulty) => {
    let equation, solution, hint;
    const anglesBasic = [
      { rad: '\\frac{\\pi}{6}', deg: '30^\\circ', sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}' },
      { rad: '\\frac{\\pi}{4}', deg: '45^\\circ', sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}' },
      { rad: '\\frac{\\pi}{3}', deg: '60^\\circ', sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}' },
      { rad: '\\frac{\\pi}{2}', deg: '90^\\circ', sin: '1', cos: '0' }
    ];
    const chosen = anglesBasic[Math.floor(Math.random() * anglesBasic.length)];

    switch (diff) {
      case 'Advanced':
        if (Math.random() > 0.5) {
          equation = `2\\sin(x) - 1 = 0 \\quad (0 \\le x < 2\\pi)`;
          solution = `x = \\frac{\\pi}{6}, \\frac{5\\pi}{6}`;
          hint = "Isolate sin(x) to get sin(x) = 1/2. Find the angles in the first and second quadrants.";
        } else {
          equation = `2\\sin(x)\\cos(x)`;
          solution = `\\sin(2x)`;
          hint = "Recall the double-angle identity: sin(2A) = 2 sin(A) cos(A).";
        }
        break;
      case 'Intermediate':
        if (Math.random() > 0.5) {
          equation = `\\sin^2(x) + \\cos^2(x) + \\tan^2(x)`;
          solution = `\\sec^2(x)`;
          hint = "Use the Pythagorean identity: sin^2(x) + cos^2(x) = 1. Then use 1 + tan^2(x) = sec^2(x).";
        } else {
          equation = `\\cos(\\pi - x)`;
          solution = `-\\cos(x)`;
          hint = "Use the angle subtraction identity or the unit circle symmetry for quadrant II.";
        }
        break;
      case 'Basic':
      default:
        const isSin = Math.random() > 0.5;
        equation = isSin ? `\\sin\\left(${chosen.rad}\\right)` : `\\cos\\left(${chosen.rad}\\right)`;
        solution = isSin ? chosen.sin : chosen.cos;
        hint = `Recall the standard trigonometric values for ${chosen.deg} on the unit circle.`;
        break;
    }
    return { equation, solution, hint, steps: [] };
  };

  const generateLimitsProblem = (diff: Difficulty) => {
    let equation, solution, hint;
    const val = Math.floor(Math.random() * 5) + 1;

    switch (diff) {
      case 'Advanced':
        if (Math.random() > 0.5) {
          equation = `\\lim_{x \\to 0} \\frac{\\sin(${val}x)}{x}`;
          solution = `${val}`;
          hint = "Use the fundamental trigonometric limit: lim_{u -> 0} (sin(u)/u) = 1. Multiply numerator and denominator by the coefficient.";
        } else {
          equation = `\\lim_{x \\to \\infty} \\frac{${val}x^2 + 2x}{x^2 - 1}`;
          solution = `${val}`;
          hint = "For limits at infinity of rational functions, compare the highest degree terms in the numerator and denominator.";
        }
        break;
      case 'Intermediate':
        const target = val * val;
        equation = `\\lim_{x \\to ${val}} \\frac{x^2 - ${target}}{x - ${val}}`;
        solution = `${val * 2}`;
        hint = `Factor the numerator as (x - ${val})(x + ${val}), cancel the (x - ${val}) term, and substitute x = ${val}.`;
        break;
      case 'Basic':
      default:
        equation = `\\lim_{x \\to ${val}} (${val}x + ${Math.floor(Math.random() * 5) + 1})`;
        solution = `${val * val + (Math.floor(Math.random() * 5) + 1)}`;
        hint = "Use direct substitution: replace x with the target limit value.";
        break;
    }
    return { equation, solution, hint, steps: [] };
  };

  const generateMatricesProblem = (diff: Difficulty) => {
    let equation, solution, hint;
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 2;
    const c = Math.floor(Math.random() * 4) + 1;
    const d = Math.floor(Math.random() * 5) + 1;

    switch (diff) {
      case 'Advanced':
        const matrixDet = (a * d) - (b * c);
        equation = `\\det \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
        solution = `${matrixDet}`;
        hint = "Recall that determinant of a 2x2 matrix is ad - bc.";
        break;
      case 'Intermediate':
        equation = `\\text{Trace of } \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
        solution = `${a + d}`;
        hint = "The trace of a square matrix is the sum of the elements along the main diagonal.";
        break;
      case 'Basic':
      default:
        const factor = Math.floor(Math.random() * 3) + 2;
        equation = `${factor} \\cdot \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
        solution = `\\begin{pmatrix} ${factor * a} & ${factor * b} \\\\ ${factor * c} & ${factor * d} \\end{pmatrix}`;
        hint = "Multiply every entry of the matrix by the outer scalar factor in front.";
        break;
    }
    return { equation, solution, hint, steps: [] };
  };

  const generateProbabilityProblem = (diff: Difficulty) => {
    let equation, solution, hint;
    switch (diff) {
      case 'Advanced':
        equation = `\\text{Number of ways to choose 2 items out of 5}`;
        solution = `10`;
        hint = "Use combinations: nCr = n! / (r! * (n - r)!). Here, 5C2 = 5! / (2! * 3!).";
        break;
      case 'Intermediate':
        equation = `\\text{For 5 red and 3 blue balls, } P(\\text{Red then Blue without replacement})`;
        solution = `\\frac{15}{56}`;
        hint = "Calculate (5/8) * (3/7) since one red is drawn first, leaving 7 balls total.";
        break;
      case 'Basic':
      default:
        equation = `\\text{P(Rolling a number } > 4 \\text{ on standard 6-sided die)}`;
        solution = `\\frac{1}{3}`;
        hint = "The matching numbers are {5, 6} (2 options out of 6). So, P = 2/6 = 1/3.";
        break;
    }
    return { equation, solution, hint, steps: [] };
  };

  const generateVectorsProblem = (diff: Difficulty) => {
    let equation, solution, hint;
    const x1 = Math.floor(Math.random() * 4) + 1;
    const y1 = Math.floor(Math.random() * 4) + 1;
    const x2 = Math.floor(Math.random() * 4) + 1;
    const y2 = Math.floor(Math.random() * 4) + 1;

    switch (diff) {
      case 'Advanced':
        const z1 = Math.floor(Math.random() * 3) + 1;
        const z2 = Math.floor(Math.random() * 3) + 1;
        equation = `(${x1}\\vec{i} + ${y1}\\vec{j} - ${z1}\\vec{k}) \\cdot (${x2}\\vec{i} - ${y2}\\vec{j} + ${z2}\\vec{k})`;
        solution = `${(x1 * x2) - (y1 * y2) - (z1 * z2)}`;
        hint = "Apply the 3D dot product: u_x*v_x + u_y*v_y + u_z*v_z. Pay close attention to positive and negative signs.";
        break;
      case 'Intermediate':
        equation = `\\langle ${x1}, ${y1} \\rangle \\cdot \\langle ${x2}, ${y2} \\rangle`;
        solution = `${(x1 * x2) + (y1 * y2)}`;
        hint = "Multiply respective dimensions and add them: u_x*v_x + u_y*v_y.";
        break;
      case 'Basic':
      default:
        equation = `\\text{Magnitude of } 3\\vec{i} + 4\\vec{j}`;
        solution = `5`;
        hint = "Find magnitude via Pythagorean formula: ||v|| = sqrt(x^2 + y^2). sqrt(3^2 + 4^2) = sqrt(25).";
        break;
    }
    return { equation, solution, hint, steps: [] };
  };

  const generateProblem = (diff: Difficulty, currentDomain: 'Algebra' | 'Derivatives' | 'Integrals' | 'Trigonometry' | 'Limits' | 'Matrices' | 'Probability' | 'Vectors' = domain) => {
    setShowAnswer(false);
    
    if (currentDomain === 'Derivatives') {
      setCurrentProblem(generateDerivativeProblem(diff));
      return;
    }
    
    if (currentDomain === 'Integrals') {
      setCurrentProblem(generateIntegralProblem(diff));
      return;
    }

    if (currentDomain === 'Trigonometry') {
      setCurrentProblem(generateTrigonometryProblem(diff));
      return;
    }

    if (currentDomain === 'Limits') {
      setCurrentProblem(generateLimitsProblem(diff));
      return;
    }

    if (currentDomain === 'Matrices') {
      setCurrentProblem(generateMatricesProblem(diff));
      return;
    }

    if (currentDomain === 'Probability') {
      setCurrentProblem(generateProbabilityProblem(diff));
      return;
    }

    if (currentDomain === 'Vectors') {
      setCurrentProblem(generateVectorsProblem(diff));
      return;
    }

    let a, b, x, equation, solution, hint;
    
    switch (diff) {
      case 'Advanced':
        // Advanced: Equations with negative coefficients and two steps
        a = (Math.floor(Math.random() * 8) + 2) * -1; // Force negative coefficient
        x = Math.floor(Math.random() * 10) + 1;
        b = (Math.floor(Math.random() * 15) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const c = a * x + b;
        
        const bLabelAdv = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        equation = `${a}x ${bLabelAdv} = ${c}`;
        solution = `x = ${x}`;
        hint = b >= 0 
          ? `First subtract ${b} from both sides, then divide by ${a}. Watch the sign!` 
          : `First add ${Math.abs(b)} to both sides, then divide by ${a}. Watch the sign!`;
        break;
      case 'Intermediate':
        // Intermediate: Focused on multiplication and division
        const isMult = Math.random() > 0.5;
        a = Math.floor(Math.random() * 10) + 2;
        x = Math.floor(Math.random() * 12) + 1;
        
        if (isMult) {
          equation = `${a}x = ${a * x}`;
          hint = `Divide both sides by ${a} to isolate x.`;
        } else {
          equation = `\\frac{x}{${a}} = ${x}`;
          hint = `Multiply both sides by ${a} to isolate x.`;
          x = a * x; // Correct the solution for division
        }
        solution = `x = ${isMult ? x : x/a}`;
        break;
      case 'Basic':
      default:
        // Basic: Focused on simple addition and subtraction
        b = Math.floor(Math.random() * 20) + 1;
        x = Math.floor(Math.random() * 15) + 1;
        const isSubBasic = Math.random() > 0.5;
        if (isSubBasic) {
          const target = x + b;
          equation = `x + ${b} = ${target}`;
          hint = `Subtract ${b} from both sides to find x.`;
        } else {
          equation = `x - ${b} = ${x}`;
          hint = `Add ${b} to both sides to find x.`;
          x = x + b; // Correct target solution for sub equation x - b = original_x
        }
        solution = `x = ${isSubBasic ? x : x - b}`;
        break;
    }

    setCurrentProblem({ equation, solution, hint, steps: [] });
  };

  const toggleShowAnswer = () => {
    const nextShow = !showAnswer;
    setShowAnswer(nextShow);
    
    if (nextShow && currentProblem) {
      // Save to history
      const saved = localStorage.getItem('math_history');
      const history = saved ? JSON.parse(saved) : [];
      
      // Prevent duplicates if already in history
      const isDuplicate = history.length > 0 && history[0].equation === currentProblem.equation;
      if (!isDuplicate) {
        const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          equation: currentProblem.equation,
          solution: currentProblem.solution,
          timestamp: Date.now(),
          type: 'drills'
        };
        localStorage.setItem('math_history', JSON.stringify([newItem, ...history].slice(0, 50)));
      }
    }
  };

  return (
    <div className={`space-y-6 ${focusMode ? 'max-w-2xl mx-auto' : ''}`}>
      <div className={`bg-white rounded-2xl p-6 transition-all duration-500 ${focusMode ? 'shadow-lg border-blue-100' : 'shadow-sm border-slate-200'} border`}>
        {!focusMode && (
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Brain size={12} /> Practice Drills
          </label>
        )}
        
        <div className="flex gap-2 mb-6 border-b border-slate-100 pb-3 overflow-x-auto scrollbar-none scroll-smooth">
          {(['Algebra', 'Derivatives', 'Integrals', 'Trigonometry', 'Limits', 'Matrices', 'Probability', 'Vectors'] as const).map((d) => (
            <button
              key={d}
              onClick={() => { setDomain(d); generateProblem(difficulty, d); }}
              className={`text-xs font-bold transition-all px-3 py-1.5 rounded-lg whitespace-nowrap active:scale-95 ${
                domain === d 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {d === 'Algebra' ? 'Algebra 🧮' : 
               d === 'Derivatives' ? 'Derivatives 📈' : 
               d === 'Integrals' ? 'Integrals 📉' : 
               d === 'Trigonometry' ? 'Trig 📐' :
               d === 'Limits' ? 'Limits 🎯' :
               d === 'Matrices' ? 'Matrices 🔢' :
               d === 'Probability' ? 'Probability 🎲' : 'Vectors ➡️'}
            </button>
          ))}
        </div>

        <div className={`flex gap-2 ${focusMode ? 'mb-10 justify-center' : 'mb-6'}`}>
          {(['Basic', 'Intermediate', 'Advanced'] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => { setDifficulty(level); generateProblem(level, domain); }}
              className={`py-2 px-6 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                difficulty === level 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
              } ${focusMode ? 'flex-none' : 'flex-1'}`}
            >
              {level}
            </button>
          ))}
        </div>

        {!currentProblem ? (
          <button 
            onClick={() => generateProblem(difficulty)}
            className="w-full py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all flex flex-col items-center gap-3 active:scale-[0.99]"
          >
            <RefreshCw size={32} className="animate-spin duration-1000" style={{ animationIterationCount: 1 }} />
            <span className="font-bold">Generate Problem</span>
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-8 transition-all duration-500 ${focusMode ? 'bg-white' : 'bg-slate-50 border border-white shadow-inner'} text-center`}
          >
            <div className="text-sm font-bold text-blue-500 mb-4 uppercase tracking-tight">
              {domain === 'Derivatives' ? 'Differentiate 📈' : 
               domain === 'Integrals' ? 'Integrate 📉' : 
               domain === 'Trigonometry' ? 'Trig Evaluation 📐' :
               domain === 'Limits' ? 'Evaluate Limit 🎯' :
               domain === 'Matrices' ? 'Matrix Operation 🔢' :
               domain === 'Probability' ? 'Evaluate Probability 🎲' :
               domain === 'Vectors' ? 'Vector Operation ➡️' : 'Solve for x 🧮'}
            </div>
            <div className={`font-serif italic text-slate-800 mb-10 ${focusMode ? 'text-6xl' : 'text-4xl'}`}>
              <InlineMath math={currentProblem.equation} />
            </div>
            
            <div className={`flex gap-3 max-w-sm mx-auto`}>
              <button 
                onClick={toggleShowAnswer}
                className="flex-1 bg-white text-slate-700 border border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                {showAnswer ? 'Hide Solution' : 'Check Solution'}
              </button>
              <button 
                onClick={() => generateProblem(difficulty)}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100"
              >
                <RefreshCw size={20} />
              </button>
            </div>

            {showAnswer && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-8 pt-8 border-t border-slate-200"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-2">
                  <Trophy size={16} /> Result
                </div>
                <div className="text-4xl font-serif italic text-emerald-700">
                  <InlineMath math={currentProblem.solution} />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {(currentProblem || !focusMode) && (
        <div className={`transition-all duration-500 ${focusMode ? 'bg-white shadow-sm border border-slate-100' : 'bg-blue-50 border border-blue-100 shadow-none'} rounded-2xl p-6`}>
          <h4 className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
            <Brain size={16} /> Learning Tip
          </h4>
          <p className="text-sm text-blue-600 leading-relaxed">
            {currentProblem?.hint || "Select a difficulty and generate a problem to start practicing your skills!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FoundationDrills;
