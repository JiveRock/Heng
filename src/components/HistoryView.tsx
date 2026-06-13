import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, ExternalLink, Calendar, Search, Filter, Download, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath } from 'react-katex';
import { MathSolution } from '../services/geminiService';
import { exportSingleSolutionToPDF, exportStudyWorkbookToPDF } from '../lib/pdfGenerator';

interface HistoryItem {
  id: string;
  equation: string;
  solution: string;
  timestamp: number;
  type: 'solver' | 'drills' | 'foundations' | 'checker' | 'dashboard';
  fullSolution?: MathSolution;
}

const HistoryView: React.FC<{ focusMode?: boolean }> = ({ focusMode }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const saved = localStorage.getItem('math_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      localStorage.removeItem('math_history');
      setHistory([]);
    }
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('math_history', JSON.stringify(newHistory));
  };

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.equation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.type === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const solverItemsWithSolutions = history
    .filter(item => item.type === 'solver' && item.fullSolution)
    .map(item => item.fullSolution!);

  return (
    <div className={`space-y-6 ${focusMode ? 'max-w-4xl mx-auto px-4 py-10' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <HistoryIcon className="text-blue-600" size={28} />
            Study Log
          </h2>
          <p className="text-sm text-slate-500 mt-1">Review your previously analyzed equations and generated steps.</p>
        </div>
        
        <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
          {solverItemsWithSolutions.length > 0 && (
            <button 
              onClick={() => exportStudyWorkbookToPDF(solverItemsWithSolutions)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md shadow-blue-50 hover:shadow-lg transition-all text-xs font-extrabold whitespace-nowrap active:scale-95 group font-mono"
              title="Compile all saved step-by-step solutions into an offline revision workbook"
            >
              <BookOpen size={14} className="group-hover:scale-110 transition-transform" />
              EXPORT STUDY WORKBOOK ({solverItemsWithSolutions.length})
            </button>
          )}

          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-sm font-bold border border-transparent hover:border-rose-100"
            >
              <Trash2 size={16} />
              Clear Log
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-slate-300" size={20} />
          <input 
            type="text"
            placeholder="Search equations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-0 focus:ring-2 focus:ring-blue-500 rounded-xl pl-12 pr-4 py-2.5 text-sm"
          />
        </div>
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-2 md:pb-0">
          {['all', 'solver', 'drills', 'foundations', 'checker'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {f === 'all' ? 'Everything' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-200 transition-all group flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="shrink-0 flex md:flex-col items-center gap-3">
                <div className={`p-3 rounded-xl ${
                  item.type === 'solver' ? 'bg-blue-50 text-blue-600' :
                  item.type === 'drills' ? 'bg-emerald-50 text-emerald-600' :
                  item.type === 'checker' ? 'bg-amber-50 text-amber-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  <HistoryIcon size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 p-1 md:text-center">
                  {item.type.toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{formatDate(item.timestamp)}</span>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-2 overflow-x-auto">
                   <BlockMath math={item.equation} />
                </div>
                {item.solution && (
                  <div className="text-emerald-600 font-serif italic text-sm pl-2 border-l-2 border-emerald-100">
                    Result: {item.solution}
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-2 items-center shrink-0">
                 {item.type === 'solver' && item.fullSolution && (
                   <button 
                    onClick={() => exportSingleSolutionToPDF(item.fullSolution!)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Export Step-by-Step PDF"
                   >
                     <Download size={18} />
                   </button>
                 )}
                 <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  title="Delete from history"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredHistory.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                <HistoryIcon size={32} />
             </div>
             <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No entries found in your log</p>
             <p className="text-slate-500 text-sm mt-2">Problems you solve will appear here for review.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
