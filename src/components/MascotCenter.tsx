import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Smile, 
  BookOpen, 
  UserCheck, 
  MessageCircle, 
  Volume2, 
  Search, 
  Check, 
  HelpCircle,
  Clock,
  ThumbsUp,
  Award
} from 'lucide-react';
import { studyCharacters, StudyCharacter } from '../data/charactersData';
import { explainConceptWithAI } from '../services/geminiService';

interface MascotCenterProps {
  onMascotSelected?: (mascot: StudyCharacter) => void;
  activeMascotId?: string;
}

const customGreetings: Record<string, string[]> = {
  char_01: [
    "សួស្ដីប្អូនៗ! ខ្ញុំគឺ Leo ជាស្ដេចសិង្ហគណិតវិទ្យា! តោះគណនាមុំ និងជ្រុងរូបធរណីមាត្រជាមួយគ្នា!",
    "កុំខ្លាចរូបមន្តពិបាក! ពួកយើងនឹងហែករូបមន្តធំៗឲ្យទៅជាតូចៗងាយយល់!"
  ],
  char_02: [
    "Pip មកហើយ! តោះសរសេររូបមន្តគណិតវិទ្យា និងដោះស្រាយសមីការកូដឲ្យចេញក្បាលចេញកន្ទុយ!",
    "គណិតវិទ្យាមានសណ្តាប់ធ្នាប់ដូចជាកូដកម្មវិធីកុំព្យូទ័រអញ្ចឹងដែរ! តោះសាកល្បង!"
  ],
  char_03: [
    "សួស្ដីចា៎! ខ្ញុំ Mochi ចូលចិត្តឱបសៀវភៅគណិតវិទ្យាបំផុត! ចង់អានរូបមន្តជាមួយគ្នាទេ?",
    "រៀនគណនាបន្តិចម្តងៗរាល់ថ្ងៃ នឹងធ្វើឲ្យខួរក្បាលរបស់ពួកយើងឆ្លាតវៃ!"
  ],
  char_04: [
    "ស្ងាត់ៗ! Hooty កំពុងសញ្ជឹងគិតពីអាថ៌កំបាំងនៃប្រវត្តិលេខសូន្យ... អូ! ងងុយដេកបន្តិចហើយ តែតោះរៀន!",
    "ការគិតស៊ីជម្រៅគឺជាគន្លឹះដើម្បីយល់ដឹងពីសកលលោកគណិតវិទ្យា។"
  ],
  char_05: [
    "សួស្ដីគណិត! ខ្ញុំ Coco ចូលចិត្តខាំខ្មៅដៃក្បែរលំហាត់ពិបាកៗ។ តោះជួយខ្ញុំដោះស្រាយវាផង!",
    "លំហាត់កាន់តែពិបាក ពេលដោះស្រាយចេញកាន់តែសប្បាយ!"
  ],
  char_21: [
    "តោះគូសវាស! ខ្ញុំ Pencil Pete រួចរាល់ក្នុងការព្រាងរូបមន្តលើក្រដាសព្រាងរបស់ប្អូនៗហើយ!",
    "ចាំកាលទៀត! កាន់ខ្មៅដៃឡើង ហើយចាប់ផ្តើមគណនា!"
  ],
  char_25: [
    "តោះគិតលេខ! Cal គណនាបានលឿនដូចផ្លេកបន្ទោរ! ចាំខ្ញុំជួយផ្ទៀងផ្ទាត់ចម្លើយឲ្យប្អូនៗណា!",
    "គណនាដោយប្រុងប្រយ័ត្ន គឺជារូបមន្តជោគជ័យ!"
  ]
};

const defaultGreetings = [
  "សួស្ដីប្អូនៗ! តោះរៀនគណិតវិទ្យា លេងលំហាត់ និងសន្សំពិន្ទុ XP ជាមួយគ្នា!",
  "ការព្យាយាមគង់បានសម្រេច! គ្មានលំហាត់ណាដែលពួកយើងដោះស្រាយមិនចេញនោះទេ!",
  "តោះសួរ AI ពន្យល់បន្ថែមបើយើងមានកន្លែងមិនទាន់ច្បាស់លាស់!"
];

export default function MascotCenter({ onMascotSelected, activeMascotId }: MascotCenterProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'Cute Animal Scholars' | 'Chibi Student Buds' | 'Living Study Tools'>('all');
  const [selectedChar, setSelectedChar] = useState<StudyCharacter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mascotQuote, setMascotQuote] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [localActiveId, setLocalActiveId] = useState(activeMascotId || studyCharacters[0].id);

  useEffect(() => {
    const saved = localStorage.getItem('active_study_mascot');
    if (saved) {
      setLocalActiveId(saved);
      const match = studyCharacters.find(c => c.id === saved);
      if (match && !selectedChar) {
        setSelectedChar(match);
      }
    } else {
      setSelectedChar(studyCharacters[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedChar) {
      const quotes = customGreetings[selectedChar.id] || defaultGreetings;
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setMascotQuote(randomQuote);
    }
  }, [selectedChar]);

  const handleSelectMascot = (char: StudyCharacter) => {
    setLocalActiveId(char.id);
    localStorage.setItem('active_study_mascot', char.id);
    if (onMascotSelected) {
      onMascotSelected(char);
    }
    
    // Quick custom greeting state trigger
    const quotes = customGreetings[char.id] || defaultGreetings;
    setMascotQuote(quotes[0]);

    // Dispatch custom event for real-time sync across widgets
    window.dispatchEvent(new Event('mascotChanged'));
  };

  // Filtered list
  const filtered = studyCharacters.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.includes(searchQuery) ||
                          item.suggested_ui_state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-slate-50/55 rounded-3xl border border-slate-200 p-6 space-y-6">
      
      {/* Banner design */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 rounded-2xl p-6 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-1.5 justify-center md:justify-start">
            <span className="bg-sky-500/30 text-sky-100 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              Study Partners Library (៣០ ដៃគូសិក្សាដ៏គួរឲ្យស្រលាញ់)
            </span>
          </div>
          <h2 className="text-xl font-black">ជ្រើសរើសដៃគូសិក្សា និងតុក្កតាគណិតវិទ្យា 🧸</h2>
          <p className="text-xs text-sky-100/90 leading-relaxed max-w-lg">
            ជ្រើសរើសតួអង្គ mascot មួយដ៏គួរឲ្យស្រលាញ់ ដើម្បីអមដំណើរ ស្នាក់នៅជាមិត្ត និងជួយពន្យល់ណែនាំប្អូនៗក្នុងការរៀនគណនា សមីការ និងរូបមន្តលំបាកៗទាំងអស់!
          </p>
        </div>
        <div className="text-4xl animate-bounce shrink-0 select-none z-10">
          {selectedChar ? selectedChar.emoji : "🦁"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Selected Mascot interaction details (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            ដៃគូរួមដំណើរបច្ចុប្បន្ន (Active Mascot Profile)
          </h3>

          {selectedChar ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${selectedChar.gradient}`}></div>
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-4xl border-3 border-transparent group-hover:scale-105 transition-transform">
                  {selectedChar.emoji}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm leading-none">{selectedChar.name}</h4>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider block mt-2 mx-auto w-max">
                    {selectedChar.category}
                  </span>
                </div>
              </div>

              {/* Character speech bubble */}
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/60 relative">
                <div className="absolute top-4 -left-2 w-4 h-4 bg-blue-50 border-l border-b border-blue-100/60 rotate-45"></div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed select-text italic">
                  "{mascotQuote}"
                </p>
                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-blue-100/30">
                  <span className="text-[9px] font-bold text-blue-500/90 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Volume2 size={10} /> Voice of Mascot
                  </span>
                  <button
                    onClick={() => {
                      const quotes = customGreetings[selectedChar.id] || defaultGreetings;
                      const next = quotes[Math.floor(Math.random() * quotes.length)];
                      setMascotQuote(next);
                    }}
                    className="text-[9px] font-black text-blue-600 hover:underline active:scale-95"
                  >
                    ផ្លាស់ប្ដូរពាក្យពេចន៍ ➡️
                  </button>
                </div>
              </div>

              {/* Description & suggestions */}
              <div className="text-xs space-y-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">✍️ ការពិពណ៌នា៖</p>
                  <p className="text-slate-600 font-medium leading-relaxed mt-1 text-xs">{selectedChar.description}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🌟 កន្លែងដែលណែនាំឲ្យនៅ៖</p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100/40">
                    {selectedChar.suggested_ui_state}
                  </span>
                </div>
              </div>

              {localActiveId === selectedChar.id ? (
                <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                  <Check size={14} className="stroke-[3]" /> កំពុងរួមដំណើរជាមួយប្អូន (Selected Sponsor)
                </div>
              ) : (
                <button
                  onClick={() => handleSelectMascot(selectedChar)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-50 active:scale-95 transition-all text-center"
                >
                  ជ្រើសរើសយកដៃគូនេះ (Join study with {selectedChar.name})
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              សូមចុចលើតួអង្គណាមួយខាងស្តាំ ដើម្បីពិនិត្យមើលលម្អិត និងជ្រើសរើសជាដៃគូសិក្សា!
            </div>
          )}
        </div>

        {/* Right column: Browse 30 Chibi/Animal Mascots (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={14} className="text-blue-500" />
              បញ្ជីតួអង្គតុក្កតាទាំងអស់ ({filtered.length} នាក់)
            </h3>

            {/* Quick Search filter bar */}
            <div className="relative shrink-0 sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={12} />
              </span>
              <input
                type="text"
                placeholder="ស្វែងរកឈ្មោះ ឬការណែនាំ (e.g. Lion, laptop...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Tab Categories selection pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'ទាំងអស់ (All 🌍)' },
              { id: 'Cute Animal Scholars', label: 'សត្វឆ្លាតវៃ (Animals 🦁)' },
              { id: 'Chibi Student Buds', label: 'សិស្ស Chibi (Chibi 👦🏻)' },
              { id: 'Living Study Tools', label: 'ឧបករណ៍រស់រវើក (Tools ✏️)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`text-[10px] font-black transition-all px-3 py-1.5 rounded-lg whitespace-nowrap active:scale-95 border ${
                  activeTab === t.id
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'text-slate-500 bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[460px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => {
                const isSelected = selectedChar?.id === item.id;
                const isActivePartner = localActiveId === item.id;
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.93 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    key={item.id}
                    onClick={() => setSelectedChar(item)}
                    className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center justify-between gap-2 active:scale-95 relative group overflow-hidden ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                        : 'border-slate-200/70 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Tiny badges on top corner of item */}
                    {isActivePartner && (
                      <span className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full text-[6px] shrink-0 font-extrabold" title="ដៃគូធំ">
                        <Check size={8} className="stroke-[4]" />
                      </span>
                    )}

                    <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </div>

                    <div className="space-y-0.5 w-full">
                      <p className="text-[10px] font-black text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[8px] text-slate-400 uppercase font-bold tracking-tight truncate">
                        {item.suggested_ui_state.split('/')[0]}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 text-xs">
                រកមិនឃើញតួអង្គណាដែលត្រូវនឹងពាក្យស្វែងរករបស់អ្នកឡើយ!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
