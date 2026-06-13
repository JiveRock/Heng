import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Download, 
  Printer, 
  User, 
  CheckCircle, 
  Lock, 
  X, 
  Star, 
  Trophy, 
  Compass, 
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
  Sparkles,
  Gem,
  Crown
} from 'lucide-react';
import { loadStreakState, STREAK_BADGES } from '../services/streakService';

const khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩', '១០', '១១', '១២'];

interface PremiumStoreItem {
  level: number;
  id: string;
  titleKh: string;
  titleEn: string;
  cost: number;
  emoji: string;
  descriptionKh: string;
  descriptionEn: string;
}

const PREMIUM_STORE_ITEMS: PremiumStoreItem[] = [
  {
    level: 1,
    id: "prem-1",
    titleKh: "ពានអ្នកចាប់ផ្តើមគណិត",
    titleEn: "Math Novice Trophy",
    cost: 50,
    emoji: "🥉",
    descriptionKh: "ពិភពលោកនៃលេខទើបតែចាប់ផ្តើម! វិញ្ញាបនប័ត្រសម្រាប់អ្នកតស៊ូរៀនដំបូង។",
    descriptionEn: "The world of numbers has just begun! Award for active beginners."
  },
  {
    level: 2,
    id: "prem-2",
    titleKh: "ពានអ្នកស្រឡាញ់លេខ",
    titleEn: "Number Explorer Trophy",
    cost: 150,
    emoji: "🥈",
    descriptionKh: "មេដាយកិត្តិយសសម្រាប់ការរុករកលេខ និងរូបមន្តដំបូងៗ។",
    descriptionEn: "Honorable medal for exploring early formulas and arithmetic."
  },
  {
    level: 3,
    id: "prem-3",
    titleKh: "ពានអ្នកដោះស្រាយរហ័ស",
    titleEn: "Speed Calculator Trophy",
    cost: 350,
    emoji: "🥇",
    descriptionKh: "កិត្តិយសសម្រេចបានការគណនាបានរហ័ស និងត្រឹមត្រូវបំផុត។",
    descriptionEn: "Awarded for exceptional speed and accuracy in basic levels."
  },
  {
    level: 4,
    id: "prem-4",
    titleKh: "ពានគំនិតឆ្លាតវៃ",
    titleEn: "Smart Thinker Trophy",
    cost: 600,
    emoji: "🔮",
    descriptionKh: "ការគិតបែបស៊ីជម្រៅ សាកសមសម្រាប់សិស្សដែលមានភាពវៃឆ្លាតខ្ពស់។",
    descriptionEn: "Deep thinking dedication, suitable for students with great mathematical logic."
  },
  {
    level: 5,
    id: "prem-5",
    titleKh: "ពានជើងឯកប្រភាគ",
    titleEn: "Fraction Master Trophy",
    cost: 1000,
    emoji: "🍕",
    descriptionKh: "ជើងឯកក្នុងការបំបែក និងបូកដកប្រភាគស្មុគស្មាញ។",
    descriptionEn: "Champion in decomposing and solving complex rational fractions."
  },
  {
    level: 6,
    id: "prem-6",
    titleKh: "ពានស្ដេចដោះស្រាយសមីការ",
    titleEn: "Equation King Trophy",
    cost: 1500,
    emoji: "⚔️",
    descriptionKh: "រាជវង្សសមីការ! ដោះស្រាយរាល់គ្រប់អថេរស្មុគស្មាញទាំងអស់។",
    descriptionEn: "Equation supreme leader! High versatility in variable calculations."
  },
  {
    level: 7,
    id: "prem-7",
    titleKh: "ពានអ្នកវិភាគធរណីមាត្រ",
    titleEn: "Geometry Architect Trophy",
    cost: 2200,
    emoji: "📐",
    descriptionKh: "ស្ថាបត្យករគំនូរធរណីមាត្រ កូអរដោណេស្វ៊ែរ និងស៊ីឡាំង។",
    descriptionEn: "Architect of geometric coordinates, spheres, and dimensional curves."
  },
  {
    level: 8,
    id: "prem-8",
    titleKh: "សញ្ញាបត្រឧត្តមភាពគណិតវិទ្យា",
    titleEn: "Math Excellence Diploma",
    cost: 3000,
    emoji: "📜",
    descriptionKh: "សញ្ញាបត្រកម្រិតខ្ពស់តំណាងឱ្យចំណេះដឹងទូទៅគណិតវិទ្យារឹងមាំ។",
    descriptionEn: "Advanced diploma certifying solid foundational math competency."
  },
  {
    level: 9,
    id: "prem-9",
    titleKh: "ពានជើងឯកវិភាគអនុគមន៍",
    titleEn: "Function Analyst Trophy",
    cost: 4000,
    emoji: "📈",
    descriptionKh: "ស្វែងយល់ច្បាស់ពីរលកក្រាហ្វិក ការអថេរភាពអនុគមន៍ស្មុគស្មាញ។",
    descriptionEn: "Expertise in variations of limits, trigonometric graphing, and functions."
  },
  {
    level: 10,
    id: "prem-10",
    titleKh: "សញ្ញាបត្របញ្ញវន្តវ័យក្មេង",
    titleEn: "Young Mathematician Diploma",
    cost: 5500,
    emoji: "💎",
    descriptionKh: "សញ្ញាបត្របញ្ជាក់ពីភាពជាបញ្ញវន្តឆ្នើមនៅក្នុងសហគមន៍វិទ្យាសាស្ត្រ។",
    descriptionEn: "Prestigous diploma certifying scientific researcher potential."
  },
  {
    level: 11,
    id: "prem-11",
    titleKh: "ពានលីមីត និងដេរីវេកំពូល",
    titleEn: "Master of Calculus Trophy",
    cost: 7500,
    emoji: "🌀",
    descriptionKh: "ស្ទាត់ជំនាញខ្ពស់បំផុតក្នុងការដេរីវេ អាំងតេក្រាល និងរជ្ជកាលលីមីត។",
    descriptionEn: "Master of transcendental derivatives, integrals, and high mathematics."
  },
  {
    level: 12,
    id: "prem-12",
    titleKh: "សហស្សវត្សរ៍គណិតវិទ្យាកំពូល",
    titleEn: "Millennium Grandmaster Crown",
    cost: 10000,
    emoji: "👑",
    descriptionKh: "កម្រិតខ្ពស់បំផុតក្នុងចក្រភព! រង្វាន់កិត្តិយសរបស់ស្ដេចគណិតវិទ្យាខ្ពស់បំផុត! 🏆🔥",
    descriptionEn: "The Absolute Summit. Legend of the Math Empire. Maximum honor bestowed."
  }
];

const gradeCompletionIds: Record<number, string> = {
  1: 'g1-add',
  2: 'g2-mult',
  3: 'g3-div',
  4: 'g4-frac',
  5: 'g5-dec',
  6: 'g6-area',
  7: 'g7-integers',
  8: 'g8-linear',
  9: 'g9-pyth',
  10: 'g10-quad',
  11: 'g11-limits',
  12: 'g12-derivs'
};

const gradeTitlesEn: Record<number, string> = {
  1: 'Basic Addition & Subtraction',
  2: 'Introduction to Multiplication',
  3: 'Division & Equal Sharing',
  4: 'Introduction to Fractions',
  5: 'Decimals & Percentages',
  6: 'Perimeter & Area Basics',
  7: 'Negative Numbers & Variables',
  8: 'Linear Equations with One Variable',
  9: 'Pythagorean Theorem',
  10: 'Quadratic Equations & Discriminant Delta',
  11: 'Limits of Functions',
  12: 'Derivatives & Applications'
};

export default function HonorCertificate() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [studentName, setStudentName] = useState('សុខ សាន្ត');
  const [selectedGradeCert, setSelectedGradeCert] = useState<number | null>(null);
  const [activeMascotEmoji, setActiveMascotEmoji] = useState('🦁');
  const [activeMascotName, setActiveMascotName] = useState('Leo the Math Lion');
  const [unlockedStreakBadges, setUnlockedStreakBadges] = useState<string[]>([]);
  const [currentStreakCount, setCurrentStreakCount] = useState(0);

  // Premium Store States
  const [studentXP, setStudentXP] = useState<number>(0);
  const [purchasedPremiumIds, setPurchasedPremiumIds] = useState<string[]>([]);
  const [selectedPremiumItem, setSelectedPremiumItem] = useState<PremiumStoreItem | null>(null);
  const [purchaseErrorMessage, setPurchaseErrorMessage] = useState<string | null>(null);
  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState<PremiumStoreItem | null>(null);

  const printAreaRef = useRef<HTMLDivElement>(null);
  const premiumPrintAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load completed state
    const savedCompleted = localStorage.getItem('kh_completed_lessons');
    if (savedCompleted) {
      try {
        setCompletedLessons(JSON.parse(savedCompleted));
      } catch (e) {
        console.error(e);
      }
    }

    // Load student name from auth cache
    const savedAuth = localStorage.getItem('kh_math_user_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed && parsed.name) {
          setStudentName(parsed.name);
        }
      } catch (e) {}
    }

    // Load streak stats
    const initStreak = loadStreakState();
    setUnlockedStreakBadges(initStreak.unlockedBadgeIds);
    setCurrentStreakCount(initStreak.currentStreak);

    // Load XP and Premium Purchases
    const loadXPAndStore = () => {
      const savedXP = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);
      setStudentXP(savedXP);

      const savedPremiumPurchases = localStorage.getItem('kh_purchased_premium_ids');
      if (savedPremiumPurchases) {
        try {
          setPurchasedPremiumIds(JSON.parse(savedPremiumPurchases));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadXPAndStore();

    // Load active mascot
    const handleMascotCheck = () => {
      const activeId = localStorage.getItem('active_study_mascot') || 'char_01';
      import('../data/charactersData').then(({ studyCharacters }) => {
        const match = studyCharacters.find(c => c.id === activeId);
        if (match) {
          setActiveMascotEmoji(match.emoji);
          setActiveMascotName(match.name);
        }
      });
    };
    handleMascotCheck();

    // Streak update sync
    const handleStreakChange = () => {
      const updatedState = loadStreakState();
      setUnlockedStreakBadges(updatedState.unlockedBadgeIds);
      setCurrentStreakCount(updatedState.currentStreak);
    };

    window.addEventListener('mascotChanged', handleMascotCheck);
    window.addEventListener('studentStreakUpdated', handleStreakChange);
    window.addEventListener('xpChanged', loadXPAndStore);

    return () => {
      window.removeEventListener('mascotChanged', handleMascotCheck);
      window.removeEventListener('studentStreakUpdated', handleStreakChange);
      window.removeEventListener('xpChanged', loadXPAndStore);
    };
  }, []);

  const handlePurchasePremiumItem = (item: PremiumStoreItem) => {
    setPurchaseErrorMessage(null);
    setPurchaseSuccessItem(null);

    // Read latest XP value to prevent race conditions
    const latestXP = parseInt(localStorage.getItem('kh_student_xp') || '0', 10);
    if (latestXP < item.cost) {
      setPurchaseErrorMessage(`ពិន្ទុសន្សំ (XP) របស់អ្នកមិនគ្រប់គ្រាន់ទេ! ប្អូនត្រូវការ ${item.cost} XP ដើម្បីជាវពាននេះ ប៉ុន្តែបច្ចុប្បន្នប្អូនមានតែ ${latestXP} XP ប៉ុណ្ណោះ។ សូមបន្តប្រឹងប្រែងសិក្សាបន្ថែមទៀតណា៎!`);
      return;
    }

    // Deduct cost and update local state
    const newXP = latestXP - item.cost;
    localStorage.setItem('kh_student_xp', newXP.toString());
    setStudentXP(newXP);

    // Record purchase and update local state
    const updatedPurchased = [...purchasedPremiumIds, item.id];
    localStorage.setItem('kh_purchased_premium_ids', JSON.stringify(updatedPurchased));
    setPurchasedPremiumIds(updatedPurchased);

    // Trigger success notification modal/card
    setPurchaseSuccessItem(item);

    // Fire custom event to refresh UI points header immediately
    window.dispatchEvent(new Event('xpChanged'));
  };

  const handlePrintPremium = () => {
    const printContent = premiumPrintAreaRef.current?.innerHTML;
    if (printContent) {
      const printWindow = window.open('', '', 'width=900,height=650');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>បណ្ណសរសេរពានរង្វាន់ពិសេស - ${selectedPremiumItem?.titleKh}</title>
              <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap" rel="stylesheet">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body {
                  font-family: 'Kantumruy Pro', Arial, sans-serif;
                  background: #0f172a; /* Dark bg for majestic look */
                  color: white;
                  padding: 20px;
                  -webkit-print-color-adjust: exact;
                }
                .decor-border {
                  border: 24px solid #1e3a8a; /* Deep Royal blue border */
                  outline: 10px double #ca8a04; /* Gold double inner outline */
                }
                .khmer-serif {
                  font-family: 'Moul', serif;
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              <div class="w-[850px] h-[550px] mx-auto p-10 relative overflow-hidden bg-slate-950 text-white decor-border rounded-xl flex flex-col justify-between">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const isGradeCompleted = (grade: number): boolean => {
    const requiredId = gradeCompletionIds[grade];
    return completedLessons.includes(requiredId);
  };

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      const printWindow = window.open('', '', 'width=900,height=650');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>បណ្ណសរសើរ - ថ្នាក់ទី${khmerNumbers[selectedGradeCert || 1]}</title>
              <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap" rel="stylesheet">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body {
                  font-family: 'Kantumruy Pro', Arial, sans-serif;
                  background: white;
                  padding: 20px;
                  -webkit-print-color-adjust: exact;
                }
                .decor-border {
                  border: 24px solid #b45309; /* Amber border */
                  outline: 10px double #ca8a04; /* Gold double inner outline */
                }
                .khmer-serif {
                  font-family: 'Moul', serif;
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              <div class="w-[850px] h-[550px] mx-auto p-8 relative overflow-hidden bg-amber-50/50 decor-border rounded-xl">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  // Get count of completed certificates
  const unlockedCount = Array.from({ length: 12 }, (_, i) => i + 1).filter(g => isGradeCompleted(g)).length;

  return (
    <div className="bg-slate-50/55 rounded-3xl border border-slate-200 p-6 space-y-6">
      
      {/* Header Info Block */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="space-y-1.5 z-10 text-center md:text-left">
          <span className="bg-white/20 text-amber-100 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            បណ្ណសរសើរជោគជ័យ (Honorary Merit Certificates)
          </span>
          <h2 className="text-xl font-black">បណ្ណសរសើរគណិតវិទ្យាថ្នាក់ទី១ ដល់ ១២ 🏆</h2>
          <p className="text-xs text-amber-100/90 max-w-xl leading-relaxed">
            ពង្រឹងការសិក្សាឱ្យបានល្អ និងដោះស្រាយប្រឡងលំហាត់ (Practice Quiz) របស់ថ្នាក់នីមួយៗឲ្យបានត្រឹមត្រូវ ដើម្បីបើកសោទាញយក <span className="text-amber-300 font-extrabold">បណ្ណសរសើរ</span> ជាផ្លូវការពីប្រព័ន្ធគណិតឆ្លាតវៃ AI!
          </p>
        </div>

        {/* Counter of certifications */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 text-center shrink-0 w-full md:w-auto z-10 font-bold">
          <p className="text-[10px] text-amber-200 uppercase tracking-widest">បណ្ណសរសើរសម្រេចបាន</p>
          <p className="text-2xl font-black text-amber-300 font-mono mt-1">{unlockedCount} / ១២ <span className="text-xs text-white">កម្រិត</span></p>
        </div>
      </div>

      {/* Grid of Certificates - 12 Grades */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <Trophy size={14} className="text-amber-500" />
          កាតាឡុកបណ្ណសរសើរតាមកម្រិតថ្នាក់ (Grades Certificate Vault)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => {
            const unlocked = isGradeCompleted(grade);
            return (
              <button
                key={grade}
                disabled={!unlocked}
                onClick={() => setSelectedGradeCert(grade)}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-3 min-h-[160px] active:scale-95 relative overflow-hidden group ${
                  unlocked
                    ? 'border-amber-400 bg-amber-50/15 hover:bg-amber-50/30 shadow-md shadow-amber-50'
                    : 'border-slate-200/70 bg-slate-50 cursor-not-allowed opacity-80'
                }`}
              >
                {unlocked && (
                  <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white p-0.5 rounded-full text-[7px] font-black flex items-center justify-center animate-pulse" title="រួចរាល់">
                    <Star size={10} className="fill-white" />
                  </span>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">ថ្នាក់ទី</span>
                  <span className="text-2xl font-black font-mono text-slate-700">{khmerNumbers[grade]}</span>
                </div>

                <div className="my-1 shrink-0 relative">
                  {unlocked ? (
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-300">
                      <Award size={26} className="fill-amber-200" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300">
                      <Lock size={22} className="stroke-[2.5]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 w-full mt-1">
                  <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">
                    {gradeTitlesEn[grade]}
                  </p>
                  <p className={`text-[10px] font-black leading-none ${unlocked ? 'text-amber-700' : 'text-slate-500'}`}>
                    {unlocked ? 'ចុចបើកមើល 🎓' : 'ជាប់សោ (Locked)'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* XP Premium Trophies & Certificates Store - 12 Levels */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5 w-fit">
              <Sparkles size={11} className="animate-spin text-amber-400" />
              ហាងលក់ពានរង្វាន់ពិសេស (XP Grand Trophy & Diploma Store)
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Crown size={20} className="text-amber-400 fill-amber-300" />
              ដោះសោពានរង្វាន់ និងសញ្ញាបត្រកំពូលទាំង ១២កម្រិត
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              ប្រមូលពិន្ទុ <span className="text-blue-400 font-extrabold font-mono">XP</span> ពីការសិក្សា និងការធ្វើលំហាត់ក្នុងកម្មវិធី ដើម្បីផ្លាស់ប្តូរយក ពានរង្វាន់កម្រិតធម្មតា រហូតដល់កម្រិតកំពូលវិសេសវិសាល!
            </p>
          </div>

          {/* Current balance display */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shrink-0 shadow-lg justify-between sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl font-bold">
              🪙
            </div>
            <div>
              <p className="text-[9px] text-slate-450 uppercase font-black tracking-widest">ពិន្ទុសន្សំរបស់អ្នក (Your Balance)</p>
              <p className="text-lg font-black text-blue-400 font-mono mt-0.5">{studentXP} <span className="text-xs text-slate-400 font-sans">XP</span></p>
            </div>
          </div>
        </div>

        {/* 12 Levels Store Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREMIUM_STORE_ITEMS.map((item) => {
            const isPurchased = purchasedPremiumIds.includes(item.id);
            const canAfford = studentXP >= item.cost;
            return (
              <div 
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-5 relative overflow-hidden group ${
                  isPurchased
                    ? 'border-indigo-500/40 bg-slate-950/40 hover:bg-slate-950/60 shadow-lg shadow-indigo-950/20'
                    : 'border-slate-800 bg-slate-950/25'
                }`}
              >
                {/* Level Tag floating */}
                <div className="absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                  LEVEL {item.level}
                </div>

                <div className="flex gap-4">
                  {/* Huge Trophy / Item Emoji */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md ${
                    isPurchased 
                      ? 'bg-gradient-to-br from-indigo-500/20 to-blue-600/30 border border-indigo-400/50' 
                      : 'bg-slate-900 border border-slate-800'
                  }`}>
                    {item.emoji}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-100 truncate flex items-center gap-1.5">
                      {item.titleKh}
                    </h4>
                    <p className="text-[10px] text-indigo-400 uppercase font-extrabold tracking-wider truncate">
                      {item.titleEn}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed select-text">
                      {item.descriptionKh}
                    </p>
                  </div>
                </div>

                {/* Purchase Actions Footer */}
                <div className="flex items-center justify-between border-t border-slate-900/40 pt-4 mt-auto">
                  <div className="flex items-center gap-1 font-mono">
                    <span className="text-[9px] text-slate-400 uppercase font-bold mr-1">តម្លៃ៖</span>
                    <span className="text-xs font-black text-blue-400">{item.cost} XP</span>
                  </div>

                  {isPurchased ? (
                    <button
                      onClick={() => setSelectedPremiumItem(item)}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[11px] font-black shadow-md shadow-indigo-950 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>បើកមើល & បោះពុម្ព</span>
                      <Printer size={11} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchasePremiumItem(item)}
                      disabled={!canAfford}
                      className={`px-4 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer active:scale-95 hover:shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={11} />
                      <span>ជាវទិញពាននេះ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Beautiful Certificate Creator Modal */}
      <AnimatePresence>
        {selectedGradeCert !== null && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 p-6 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedGradeCert(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-100 hover:bg-slate-200 rounded-full"
                title="បិទ"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Award size={16} className="text-amber-500" />
                    បង្កើតជម្រើសបណ្ណសរសើររបស់ប្អូន (Customize Your Certificate)
                  </h3>
                  <p className="text-xs text-slate-400">វាយបញ្ចូលឈ្មោះពេញរបស់អ្នក ដើម្បីបោះពុម្ពបណ្ណសរសើរផ្លូវការជាភាសាខ្មែរ!</p>
                </div>

                {/* Name personalization input */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs w-full md:w-64">
                  <User size={13} className="text-slate-400" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="ឈ្មោះសិស្ស (Student Name)"
                    className="bg-transparent font-bold text-slate-700 placeholder-slate-400 focus:outline-none w-full text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Printable Certificate Template Section */}
              <div className="p-1 bg-slate-100 rounded-2xl overflow-x-auto max-w-full">
                <div 
                  ref={printAreaRef}
                  id="certificate-print-area"
                  className="w-[800px] h-[500px] mx-auto bg-amber-50/40 p-10 relative flex flex-col justify-between select-none font-sans overflow-hidden"
                  style={{
                    border: '18px solid #b45309 border-amber-700',
                    outline: '6px double #ca8a04',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Decorative golden corner vectors or styles */}
                  <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
                  <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-500/50 pointer-events-none"></div>
                  <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
                  <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-500/50 pointer-events-none"></div>

                  <div className="text-center space-y-1 w-full">
                    {/* Cambodian National Motto */}
                    <p className="text-[12px] font-extrabold uppercase tracking-widest text-amber-900 leading-none">
                      ព្រះរាជាណាចក្រកម្ពុជា
                    </p>
                    <p className="text-[10px] font-bold text-amber-800 leading-none">
                      ជាតិ សាសនា ព្រះមហាក្សត្រ
                    </p>
                    
                    {/* Ministry style header */}
                    <div className="pt-2 border-b-2 border-amber-500/25 max-w-[280px] mx-auto pb-1.5 text-center">
                      <p className="text-[10px] text-amber-950 font-black tracking-wide leading-none">
                        សាលាគណិតឆ្លាតវៃ (AI SMART SCHOOL)
                      </p>
                    </div>
                  </div>

                  <div className="text-center space-y-3.5 my-2">
                    {/* MAIN TITLE WITH EMBELLISHMENTS */}
                    <div className="space-y-0.5">
                      <h1 className="text-2xl font-black tracking-widest text-amber-700" style={{ letterSpacing: '2px' }}>
                        បណ្ណសរសើរ
                      </h1>
                      <p className="text-[9px] text-amber-500 font-extrabold tracking-widest font-mono uppercase">
                        CERTIFICATE OF COMPLETION & MERIT
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] text-amber-900 uppercase font-extrabold leading-none">
                        បណ្ណសរសើរនេះមានមោទនភាពក្រៃលែងក្នុងការប្រគល់ជូន៖
                      </p>
                      
                      {/* Personal student name with nice cursive/display styling */}
                      <div className="max-w-[420px] mx-auto border-b-2 border-amber-600/60 pb-1 flex justify-center items-center">
                        <span className="text-xl font-bold font-serif text-slate-800">
                          {studentName || 'សិស្សឆ្លាតវៃ AI'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 max-w-xl mx-auto font-medium leading-relaxed">
                      ដែលបានខិតខំប្រឹងប្រែងសិក្សា រៀនសូត្រស្វែងរកគន្លឹះគណនា និងបានឆ្លងកាត់ការវាស់ស្ទង់សមត្ថភាព ព្រមទាំងសម្រេចបានការសិក្សាគ្រប់មេរៀនទាំងអស់ប្រចាំ <strong className="font-extrabold text-amber-700">ថ្នាក់ទី ${khmerNumbers[selectedGradeCert]}</strong> នៃជំនាញ {gradeTitlesEn[selectedGradeCert]} យ៉ាងជោគជ័យ!
                    </p>
                  </div>

                  {/* Stamp & Verification Footer */}
                  <div className="flex items-end justify-between px-6 pt-1">
                    {/* Mascot active representative stamp */}
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center text-2xl bg-amber-100">
                        {activeMascotEmoji}
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Verified Companion</p>
                        <p className="text-[10px] text-amber-800 font-extrabold mt-0.5">{activeMascotName}</p>
                        <span className="flex items-center gap-0.5 text-[8px] text-emerald-600/90 font-bold">
                          <CheckCircle size={8} className="fill-emerald-50" /> Official Partner Stamp
                        </span>
                      </div>
                    </div>

                    {/* Official Signatures */}
                    <div className="text-center space-y-1 relative">
                      {/* Fake signee vector line or seal */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-red-600/10 rounded-full border-3 border-red-600/30 flex items-center justify-center text-[7px] text-red-600 font-extrabold uppercase scale-75 select-none rotate-12" style={{ textShadow: '0.5px 0.5px #fca5a5' }}>
                        APPROVED
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold tracking-tight">រាជធានីភ្នំពេញ ថ្ងៃទី {new Date().toLocaleDateString('kh-KH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-[9px] text-amber-950 font-black tracking-wide">ប្រធានបូកសម្រួលរៀបចំជម្រើស</p>
                      <p className="text-[10px] font-serif text-slate-800/80 italic font-semibold pt-1">គ្រូបង្រៀនគណិតវិទ្យា AI (AI Tutor)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <Printer size={15} /> បោះពុម្ពបណ្ណសរសើរ (Print / Download PDF)
                </button>
                <button
                  onClick={() => setSelectedGradeCert(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all"
                >
                  បិទត្រឡប់ក្រោយ
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Streak Badges & Milestone Rewards Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Star size={14} className="text-orange-500 fill-orange-200" />
            មេដាយសម្រេចបានការសិក្សាប្រចាំថ្ងៃ (Daily Streak Achievement Medals)
          </h3>
          <span className="text-[10px] bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-100 font-extrabold self-start sm:self-auto flex items-center gap-1">
            🔥 សកម្មភាពបច្ចុប្បន្ន៖ {currentStreakCount} ថ្ងៃជាប់គ្នា
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STREAK_BADGES.map((badge) => {
            const isUnlocked = unlockedStreakBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border flex items-start gap-4 transition-all relative overflow-hidden ${
                  isUnlocked
                    ? "border-orange-200 bg-gradient-to-br from-orange-50/10 to-amber-50/20 shadow-md shadow-orange-50/30"
                    : "border-slate-100 bg-slate-50 opacity-75"
                }`}
              >
                {/* Visual badge state circle */}
                <div className={`p-3 rounded-full flex items-center justify-center text-3xl font-bold shrink-0 shadow-sm relative ${
                  isUnlocked ? "bg-gradient-to-br from-orange-400 to-amber-5050 text-white border-2 border-white" : "bg-slate-200 text-slate-400"
                }`}>
                  <span className="select-none">{badge.emoji}</span>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-slate-950/5 rounded-full flex items-center justify-center">
                      <Lock size={12} className="text-slate-400 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 w-full min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs font-black truncate  ${isUnlocked ? "text-orange-950 font-black" : "text-slate-500"}`}>
                      {badge.titleKh}
                    </h4>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                      isUnlocked ? "bg-orange-100 text-orange-850" : "bg-slate-200 text-slate-500"
                    }`}>
                      {badge.requiredStreak} Days
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{badge.titleEn}</p>
                  
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed pt-1 select-text">
                    {badge.descriptionKh}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      isUnlocked ? "bg-amber-100 text-amber-800 border border-amber-250 font-bold" : "bg-slate-200 text-slate-500"
                    }`}>
                      🏆 Reward: +{badge.xpReward} XP
                    </span>
                    {isUnlocked && (
                      <span className="text-[9px] font-black text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle size={10} className="fill-emerald-50 text-emerald-500" /> Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Trophy / Certificate Customizer Modal */}
      <AnimatePresence>
        {selectedPremiumItem !== null && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-slate-905 bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-800 p-6 space-y-5 shadow-2xl relative text-white"
            >
              <button
                onClick={() => setSelectedPremiumItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer flex items-center justify-center"
                title="បិទ"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-indigo-950 pb-4">
                <div className="space-y-1">
                  <span className="bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    PREMIUM TROPHY SYSTEM (LEVEL {selectedPremiumItem.level})
                  </span>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide flex items-center gap-1.5 mt-1">
                    <Crown size={16} className="text-amber-400" />
                    កែសម្រួលបណ្ណពានរង្វាន់ពិសេស (Customize Premium Trophy)
                  </h3>
                  <p className="text-xs text-slate-400">វាយបញ្ចូលឈ្មោះពេញរបស់អ្នក ដើម្បីទទួលបានពានកិត្តិយសផ្លូវការ!</p>
                </div>

                {/* Name personalization input inside premium modal */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs w-full md:w-64">
                  <User size={13} className="text-slate-400" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="ឈ្មោះសិស្ស (Student Name)"
                    className="bg-transparent font-bold text-slate-250 placeholder-slate-500 focus:outline-none w-full text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Printable Premium Stamp / Certificate Wrapper */}
              <div className="p-1 bg-slate-950 rounded-2xl overflow-x-auto max-w-full border border-slate-800">
                <div 
                  ref={premiumPrintAreaRef}
                  id="premium-trophy-print-area"
                  className="w-[800px] h-[500px] mx-auto bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-10 relative flex flex-col justify-between select-none font-sans overflow-hidden text-white border-8 border-amber-500"
                  style={{
                    border: '18px solid #1e3a8a',
                    outline: '6px double #ca8a04',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Decorative golden corner vectors or styles */}
                  <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
                  <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-500/50 pointer-events-none"></div>
                  <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
                  <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-500/50 pointer-events-none"></div>

                  {/* Absolute subtle background logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-[150px]">
                    {selectedPremiumItem.emoji}
                  </div>

                  <div className="text-center space-y-1 w-full">
                    <p className="text-[12px] font-extrabold uppercase tracking-widest text-amber-500 leading-none" style={{ letterSpacing: '1.5px' }}>
                      ព្រះរាជាណាចក្រកម្ពុជា
                    </p>
                    <p className="text-[10px] font-bold text-slate-350 leading-none">
                      ជាតិ សាសនា ព្រះមហាក្សត្រ
                    </p>
                    
                    <div className="pt-2 border-b border-indigo-500/20 max-w-[280px] mx-auto pb-1.5 text-center">
                      <p className="text-[10px] text-blue-300 font-black tracking-wide leading-none">
                        សាលាគណិតឆ្លាតវៃ (AI SMART SCHOOL)
                      </p>
                    </div>
                  </div>

                  <div className="text-center space-y-3.5 my-2 z-10">
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-indigo-400 font-black tracking-widest uppercase font-mono">
                        HONORARY SCHOLASTIC TROPHY & CERTIFICATION (LEVEL {selectedPremiumItem.level})
                      </p>
                      <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-250 to-amber-500" style={{ letterSpacing: '2px' }}>
                        {selectedPremiumItem.titleKh}
                      </h1>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-300 uppercase font-extrabold leading-none">
                        បណ្ណពានរង្វាន់ឧត្តមភាពនេះត្រូវបានប្រគល់ជូនជាផ្លូវការដើម្បីជាសាក្សីដល់៖
                      </p>
                      
                      <div className="max-w-[420px] mx-auto border-b-2 border-amber-500/40 pb-1 flex justify-center items-center">
                        <span className="text-xl font-bold font-serif text-amber-300" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                          {studentName || 'សិស្សឆ្លាតវៃ AI'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 max-w-xl mx-auto font-medium leading-relaxed select-text">
                      ដែលបានប្រឹងប្រែងយកចិត្តទុកដាក់ស្វះស្វែងស្វែងយល់ការគណនា ដោយប្រើប្រាស់ពិន្ទុសន្សំ XP សរុបចំនួន <strong className="font-extrabold text-amber-400 font-mono">{selectedPremiumItem.cost} XP</strong> ដើម្បីជាវនិងគ្រប់គ្រងពាន <strong className="font-extrabold text-blue-400">{selectedPremiumItem.titleKh}</strong> នៃកម្រិតដ៏ឧត្តុង្គឧត្តមនេះ!
                    </p>
                  </div>

                  {/* Stamp & Verification Footer */}
                  <div className="flex items-end justify-between px-6 pt-1 z-10">
                    {/* Mascot active representative stamp */}
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-full border border-indigo-500/30 flex items-center justify-center text-2xl bg-slate-900">
                        {activeMascotEmoji}
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] text-indigo-300 font-bold uppercase tracking-wider leading-none">Companion Stamp</p>
                        <p className="text-[10px] text-amber-400 font-extrabold mt-0.5">{activeMascotName}</p>
                        <span className="flex items-center gap-0.5 text-[8px] text-emerald-400 font-bold">
                          <CheckCircle size={8} className="text-emerald-400 fill-emerald-950" /> Official Verification Signet
                        </span>
                      </div>
                    </div>

                    {/* Official Signatures */}
                    <div className="text-center space-y-1 relative">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-600/10 rounded-full border-3 border-red-500/30 flex items-center justify-center text-[7px] text-red-500 font-extrabold uppercase scale-75 select-none rotate-12" style={{ textShadow: '0.5px 0.5px #7f1d1d' }}>
                        SUPREME AWARDED
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold tracking-tight">រាជធានីភ្នំពេញ ថ្ងៃទី {new Date().toLocaleDateString('kh-KH', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-[9px] text-amber-400 font-black tracking-wide">គ្រូបង្រៀនគណិតវិទ្យា AI (AI Smart Tutor)</p>
                      <p className="text-[10px] font-serif text-slate-350 italic font-semibold pt-0.5">ម្ចាស់ព្រឹត្តិការណ៍ និងពានរង្វាន់គំនិតឆ្លាតវៃ</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions toolbar */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrintPremium}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Printer size={15} /> បោះពុម្ពពានរង្វាន់ពិសេស (Print / Download Award PDF)
                </button>
                <button
                  onClick={() => setSelectedPremiumItem(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
                >
                  បិទត្រឡប់ក្រោយ
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast notifications / Overlay dialogue for Purchase Success / Error */}
      <AnimatePresence>
        {purchaseSuccessItem && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-indigo-500/30 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden text-white"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"></div>
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-4xl mx-auto shadow-md shadow-amber-950 animate-bounce">
                {purchaseSuccessItem.emoji}
              </div>

              <div className="space-y-1">
                <span className="bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-500/30">
                  ជាវបានសម្រេច (Purchase Successful)
                </span>
                <h3 className="text-sm font-black text-white pt-2">ប្អូនទទួលបាន៖ {purchaseSuccessItem.titleKh}</h3>
                <p className="text-[10px] text-indigo-400 uppercase font-bold">{purchaseSuccessItem.titleEn}</p>
                <p className="text-xs text-slate-300 pt-2 selection:bg-indigo-900 leading-relaxed select-text">
                  អបអរសាទរ! ប្អូនបានតស៊ូរៀនសូត្ររហូតអាចជាវ និងគ្រប់គ្រងពានរង្វាន់ពិសេសនេះ។ ប្អូនអាចបើកមើល កំណត់ឈ្មោះ និងបោះពុម្ពបណ្ណពានផ្លូវការបានភ្លាមៗ!
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const target = purchaseSuccessItem;
                    setPurchaseSuccessItem(null);
                    setSelectedPremiumItem(target);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
                >
                  បើកពានរង្វាន់ 🏆
                </button>
                <button
                  onClick={() => setPurchaseSuccessItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
                >
                  បិទ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {purchaseErrorMessage && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-red-500/30 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl relative text-white"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
              
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-2xl mx-auto text-red-500 font-extrabold animate-pulse">
                ⚠️
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-black text-red-400 uppercase tracking-wider">ពិន្ទុកាក់របស់អ្នកមិនគ្រប់គ្រាន់ (Insufficient XP)</h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  {purchaseErrorMessage}
                </p>
              </div>

              <button
                onClick={() => setPurchaseErrorMessage(null)}
                className="w-full py-2 bg-slate-850 hover:bg-slate-750 text-white font-black text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                យល់ព្រម (OK)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

