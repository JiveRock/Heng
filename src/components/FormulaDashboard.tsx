import React, { useState, useEffect } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { LayoutGrid, Bookmark, Search, X, Sparkles, Filter, Info, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formula } from '../types';

const formulas: Formula[] = [
  { 
    name: 'Quadratic Formula', 
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', 
    category: 'Algebra',
    description: 'Finds the roots/solutions of any quadratic equation in the form of ax² + bx + c = 0.' 
  },
  { 
    name: 'Pythagorean Theorem', 
    latex: 'a^2 + b^2 = c^2', 
    category: 'Geometry',
    description: 'Declares that in any right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.' 
  },
  { 
    name: 'Area of a Circle', 
    latex: 'A = \\pi r^2', 
    category: 'Geometry',
    description: 'Computes the total 2D surface area covered inside a circle with radius r.' 
  },
  { 
    name: 'Slope-Intercept Form', 
    latex: 'y = mx + b', 
    category: 'Algebra',
    description: 'The standard linear equation format specifying the slope m and the y-intercept b.' 
  },
  { 
    name: 'Distance Formula', 
    latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', 
    category: 'Algebra',
    description: 'Calculates the straight-line Cartesian distance between two geometric coordinates (x₁, y₁) and (x₂, y₂).' 
  },
  { 
    name: 'Volume of a Sphere', 
    latex: 'V = \\frac{4}{3}\\pi r^3', 
    category: 'Geometry',
    description: 'Determines the total 3D space occupied inside a perfectly round sphere with radius r.' 
  },
  { 
    name: "Euler's Formula", 
    latex: 'e^{ix} = \\cos x + i \\sin x', 
    category: 'Trigonometry',
    description: 'A deep bridge in complex analysis establishing the fundamental relationship between complex exponentials and trigonometric waves.' 
  },
  { 
    name: "Euler's Identity", 
    latex: 'e^{i\\pi} + 1 = 0', 
    category: 'Trigonometry',
    description: 'Often called the most beautiful mathematical equation, seamlessly blending the five core mathematical constants: e, i, π, 1, and 0.' 
  },
  { 
    name: 'Trigonometric Pythagorean Identity', 
    latex: '\\sin^2 \\theta + \\cos^2 \\theta = 1', 
    category: 'Trigonometry',
    description: 'The fundamental trigonometric identity deriving directly from the unit circle and the Pythagorean theorem.' 
  },
  { 
    name: 'Double-Angle Sine Identity', 
    latex: '\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta', 
    category: 'Trigonometry',
    description: 'Simplifies trigonometric terms involving double angles into single-angle factors.' 
  },
  { 
    name: 'Law of Cosines', 
    latex: 'c^2 = a^2 + b^2 - 2ab\\cos C', 
    category: 'Geometry',
    description: "Generalizes the Pythagorean theorem for any arbitrary triangle, relating the side lengths to the cosine of an opposite angle." 
  },
  { 
    name: 'Fundamental Theorem of Calculus', 
    latex: '\\int_a^b f(x)\\,dx = F(b) - F(a)', 
    category: 'Calculus',
    description: 'Links accumulation of quantities to rates of change, showing that integration and differentiation are exact inverse operations.' 
  },
  { 
    name: 'Power Rule of Differentiation', 
    latex: '\\frac{d}{dx}(x^n) = n x^{n-1}', 
    category: 'Calculus',
    description: 'Determines the instantaneous rate of change of any variable raised to a constant power.' 
  },
  { 
    name: 'Limit Definition of Derivative', 
    latex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}", 
    category: 'Calculus',
    description: 'Formally defines the derivative as the limit of a secant line slope as interval h approaches zero.' 
  },
  { 
    name: 'Integration by Parts', 
    latex: '\\int u\\,dv = uv - \\int v\\,du', 
    category: 'Calculus',
    description: "A crucial integration technique based on translating the product rule of differentiation backwards." 
  },
  { 
    name: 'Eigenvalue & Eigenvector Equation', 
    latex: 'A\\mathbf{v} = \\lambda\\mathbf{v}', 
    category: 'Linear Algebra',
    description: 'Describes scalar stretching where a linear transformation/matrix A on vector v results in simple multiplication by scalar λ.' 
  },
  { 
    name: 'Determinant of 2x2 Matrix', 
    latex: '\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc', 
    category: 'Linear Algebra',
    description: 'Computes the scalar area scaling factor and invertibility of a two-dimensional linear matrix.' 
  },
  { 
    name: 'Logarithm Product Property', 
    latex: '\\log_b(xy) = \\log_b(x) + \\log_b(y)', 
    category: 'Algebra',
    description: 'States that the logarithm of a product of variables is equal to the sum of their individual logarithms.' 
  },
  { 
    name: "Bayes' Theorem", 
    latex: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}', 
    category: 'Probability',
    description: 'Formulates conditional probability, calculating the likelihood of event A occurring given that event B has occurred.' 
  },
  { 
    name: 'Normal Distribution (Gaussian PDF)', 
    latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}', 
    category: 'Probability',
    description: 'The probability density function for the classic symmetrical symmetric bell curve around mean μ and deviation σ.' 
  }
];

const categories = ['All', 'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Linear Algebra', 'Probability'];

const FormulaDashboard: React.FC<{ focusMode?: boolean }> = ({ focusMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load bookmarks from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bookmarked_formulas');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading bookmarks from scale local:', e);
    }
  }, []);

  // Update bookmarked formulas
  const toggleBookmark = (name: string) => {
    let next: string[];
    if (bookmarks.includes(name)) {
      next = bookmarks.filter(b => b !== name);
    } else {
      next = [...bookmarks, name];
    }
    setBookmarks(next);
    localStorage.setItem('bookmarked_formulas', JSON.stringify(next));
  };

  // Filter formulas based on search, selected category, and bookmarks toggle
  const filteredFormulas = formulas.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesBookmarks = !showBookmarksOnly || bookmarks.includes(f.name);
    
    return matchesSearch && matchesCategory && matchesBookmarks;
  });

  return (
    <div className={`transition-all duration-500 ${focusMode ? 'max-w-4xl mx-auto' : ''} bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full`}>
      {/* Top Banner Header */}
      <div className={`p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${focusMode ? 'hidden' : ''}`}>
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <LayoutGrid size={18} className="text-blue-600" />
          General Math Handbook
        </h3>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest self-start sm:self-auto">
          {formulas.length} Theoretical Targets
        </span>
      </div>

      {/* Advanced Interactive Search, Filters, and Options Bar */}
      <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-100 space-y-4">
        {/* Search Input Block */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            id="formula-search-input"
            type="text"
            placeholder="ស្វែងរកទ្រឹស្ដីបទ រូបមន្ត ឬនិយមន័យ (e.g. Euler, Fundamental, Pythagorean, Matrix...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 active:scale-90 transition-transform"
              title="Clear Search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categories Scroller & Bookmark Filter Options */}
        <div className="flex flex-col gap-3">
          {/* Quick Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <Filter size={13} className="text-slate-400 shrink-0 hidden sm:block" />
            <div className="flex gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-bold transition-all px-3 py-1.5 rounded-lg whitespace-nowrap active:scale-95 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-100'
                      : 'text-slate-500 bg-white hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'All Units 🌍' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bookmarks Toggle Switch */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/55 gap-4">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {filteredFormulas.length === formulas.length 
                ? 'Showing all items' 
                : `Matched ${filteredFormulas.length} of ${formulas.length} entries`}
            </p>
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                showBookmarksOnly 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Star size={12} className={`transition-all ${showBookmarksOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
              Bookmarked Only ({bookmarks.length})
            </button>
          </div>
        </div>
      </div>
      
      {/* Formulas Content Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/10">
        <AnimatePresence mode="popLayout">
          {filteredFormulas.length > 0 ? (
            <div className={`grid grid-cols-1 ${focusMode ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              {filteredFormulas.map((f, i) => {
                const isBookmarked = bookmarks.includes(f.name);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    key={f.name}
                    className="p-4 rounded-xl border border-slate-200/60 bg-white hover:border-blue-200 hover:shadow-md transition-all group flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden"
                  >
                    {/* Corner Tag/Category and Bookmark Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {f.category}
                      </span>
                      <button 
                        onClick={() => toggleBookmark(f.name)}
                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                          isBookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark formula"}
                      >
                        <Star size={14} className={isBookmarked ? 'fill-amber-400' : ''} />
                      </button>
                    </div>

                    {/* Formula Name */}
                    <h4 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug">
                      {f.name}
                    </h4>

                    {/* Math Block Container */}
                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex items-center justify-center overflow-x-auto min-h-[95px] select-all group-hover:bg-blue-50/20 transition-all duration-300">
                      <BlockMath math={f.latex} />
                    </div>

                    {/* Description Paragraph */}
                    {f.description && (
                      <p className="text-xs text-slate-500 leading-relaxed mt-1 flex items-start gap-1.5 bg-slate-50/40 p-2.5 rounded-lg border border-slate-100/50">
                        <Info size={12} className="text-blue-400 shrink-0 mt-0.5" />
                        <span>{f.description}</span>
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-4 bg-white border border-slate-100 rounded-2xl p-6"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <Search size={32} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-700 text-sm">No formulas matched your search</h4>
                <p className="text-xs text-slate-400 max-w-sm">Try broadening your search keywords or switching the current filter unit category.</p>
              </div>
              <div className="flex gap-2">
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl active:scale-95 transition-all"
                  >
                    Clear Search Input
                  </button>
                )}
                {(selectedCategory !== 'All' || showBookmarksOnly) && (
                  <button 
                    onClick={() => { setSelectedCategory('All'); setShowBookmarksOnly(false); }}
                    className="mt-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl active:scale-95 transition-all"
                  >
                    Reset Filter Categories
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormulaDashboard;
