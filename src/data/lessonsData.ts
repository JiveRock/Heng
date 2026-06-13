export interface LessonQuiz {
  question: string;
  options?: string[]; // Multiple choice options
  correctAnswer: string; // The exact answer or choice
  points: number; // XP points rewarded
  hint: string;
}

export interface SyllabusLesson {
  id: string;
  title: string;
  englishTitle: string;
  grade: number; // 1 to 12
  summaryKh: string;
  summaryEn: string;
  formula?: string; // KaTeX format
  descriptionKh: string;
  exampleKh: string;
  quiz: LessonQuiz;
}

export const syllabusLessons: SyllabusLesson[] = [
  // Grade 1
  {
    id: 'g1-add',
    title: 'ប្រមាណវិធីបូកនិងដកមូលដ្ឋាន',
    englishTitle: 'Basic Addition & Subtraction (Grade 1)',
    grade: 1,
    summaryKh: 'ការស្វែងយល់ពីរបៀបបូកបញ្ចូលគ្នា និងដកយកចេញនៃចំនួនពី ១ ដល់ ២០។',
    summaryEn: 'Understanding how to combine and subtract numbers from 1 to 20.',
    formula: '5 + 3 = 8 \\quad \\text{និង} \\quad 8 - 3 = 5',
    descriptionKh: 'ការបូកគឺការយករបស់ពីរក្រុមមកបញ្ចូលគ្នាដើម្បីដឹងចំនួនសរុប។ ការដកគឺការយកចេញពីក្រុមដើម្បីដឹងចំនួនដែលនៅសល់។',
    exampleKh: 'បើប្អូនមានផ្លែប៉ោម ៥ ផ្លែ ហើយម៉ាក់ឲ្យ ៣ ផ្លែទៀត ប្អូនសរុបមាន ៨ ផ្លែ៖ 5 + 3 = 8។',
    quiz: {
      question: 'តើចម្លើយនៃលំហាត់គណនា 7 + 4 ស្មើនឹងប៉ុន្មាន?',
      correctAnswer: '11',
      points: 20,
      hint: 'បូកបន្ថែម ៤ ទៅលើចំនួន ៧។'
    }
  },
  // Grade 2
  {
    id: 'g2-mult',
    title: 'វិធីគុណបឋម',
    englishTitle: 'Introduction to Multiplication (Grade 2)',
    grade: 2,
    summaryKh: 'ស្វែងយល់អំពីការគុណជាការបូកដដែលៗនៃចំនួនតែមួយ។',
    summaryEn: 'Learning multiplication as repeated addition of the same quantity.',
    formula: '3 \\times 4 = 12 \\quad (4 + 4 + 4 = 12)',
    descriptionKh: 'ការគុណជួយបង្កើនល្បឿនក្នុងការបូកចំនួនដដែលៗ។ ឧទាហរណ៍ ៣ គុណនឹង ៤ មានន័យថាមានលេខ ៤ ចំនួន ៣ដង បូកបញ្ចូលគ្នា។',
    exampleKh: 'មានកន្ត្រក ៣ ក្នុងកន្ត្រកនីមួយៗមានកូនសោ ៤ នាំឲ្យមានកូនសោសរុប ១២៖ 3 x 4 = 12។',
    quiz: {
      question: 'តើ 5 គុណនឹង 3 ស្មើនឹងប៉ុន្មាន?',
      correctAnswer: '15',
      points: 20,
      hint: 'បូកលេខ ៥ ចំនួន ៣ដងបញ្ចូលគ្នា (5 + 5 + 5)។'
    }
  },
  // Grade 3
  {
    id: 'g3-div',
    title: 'វិធីចែក និងការបែងចែកស្មើគ្នា',
    englishTitle: 'Division & Equal Sharing (Grade 3)',
    grade: 3,
    summaryKh: 'ការយល់ដឹងអំពីវិធីចែកជាការបំបែកក្រុមធំជាក្រុមតូចៗស្មើគ្នា។',
    summaryEn: 'Understanding division as partitioning a large group into equal smaller groups.',
    formula: '15 \\div 3 = 5',
    descriptionKh: 'វិធីចែកគឺជាទម្រង់ផ្ទុយពីវិធីគុណ។ វាជួយឲ្យយើងដឹងថាបើបែងចែករបស់សរុបទៅឲ្យមនុស្សប៉ុន្មាននាក់ស្មើៗគ្នា ថាតើម្នាក់ៗទទួលបានប៉ុន្មាន។',
    exampleKh: 'មានស្ករគ្រាប់ ១៥ គ្រាប់ ចែកឲ្យក្មេង ៣ នាក់ស្មើគ្នា នាំឲ្យក្មេងម្នាក់ៗបាន ៥ គ្រាប់៖ 15 / 3 = 5។',
    quiz: {
      question: 'តើ 24 ចែកនឹង 4 ស្មើនឹងប៉ុន្មាន?',
      correctAnswer: '6',
      points: 25,
      hint: 'តើចំនួនអ្វីគុណនឹង ៤ បានស្មើនឹង ២៤?'
    }
  },
  // Grade 4
  {
    id: 'g4-frac',
    title: 'ប្រភាគ និងចំណែកគណិត',
    englishTitle: 'Introduction to Fractions (Grade 4)',
    grade: 4,
    summaryKh: 'ស្វែងយល់អំពីភាគបែង និងភាគយក ដែលតំណាងឲ្យចំណែកនៃវត្ថុទាំងមូល។',
    summaryEn: 'Discovering numerators and denominators representing parts of a whole.',
    formula: '\\frac{3}{4} \\quad \\text{(ភាគយក 3, ភាគបែង 4)}',
    descriptionKh: 'ប្រភាគតំណាងឲ្យផ្នែកមួយនៃចំនួនទាំងមូល។ លេខខាងលើហៅថាភាគយក (ផ្នែកដែលយើងយក) លេខខាងក្រោមហៅថាភាគបែង (ចំណែកសរុប)។',
    exampleKh: 'នំខេកមួយវ័ន្តកាត់ជា ៤ ចំណែកស្មើគ្នា បើយើងញ៉ាំអស់ ៣ ចំណែក នោះមានន័យថាយើងញ៉ាំអស់ 3/4 នៃនំ។',
    quiz: {
      question: 'តើប្រភាគ 4/8 សម្រួលរួចស្មើនឹងប្រភាគមូលដ្ឋានមួយណា?',
      options: ['1/2', '1/4', '1/3', '2/3'],
      correctAnswer: '1/2',
      points: 25,
      hint: 'សម្រួលចែកភាគយក និងភាគបែងនឹងលេខ ៤។'
    }
  },
  // Grade 5
  {
    id: 'g5-dec',
    title: 'ចំនួនទសភាគ',
    englishTitle: 'Decimals & Percentages (Grade 5)',
    grade: 5,
    summaryKh: 'រៀនអំពីការប្រើប្រាស់លេខក្បៀស ចំនួនទសភាគ និងបំណែករយ (%)។',
    summaryEn: 'Using decimal points, tenths, hundredths, and percentages.',
    formula: '0.75 = \\frac{75}{100} = 75\\%',
    descriptionKh: 'ចំនួនទសភាគគឺជាវិធីមួយទៀតសម្រាប់តំណាងឲ្យចំនួនដែលតូចជាង ១ ឬចំនួនដែលមានកំទេចក្បៀស។ វាទាក់ទងយ៉ាងជិតស្និទ្ធនឹងប្រភាគ និងភាគរយ។',
    exampleKh: 'ប្រាក់កាក់ ០.៥០ ដុល្លារ គឺស្មើនឹងកន្លះដុល្លារ (0.50$ ឬ 50%)។',
    quiz: {
      question: 'តើចំនួនទសភាគ 0.25 ស្មើនឹងប៉ុន្មានភាគរយ (%)?',
      correctAnswer: '25',
      points: 30,
      hint: 'គុណចំនួនទសភាគនឹង ១០០ ដើម្បីបំប្លែងទៅជាភាគរយ។'
    }
  },
  // Grade 6
  {
    id: 'g6-area',
    title: 'រូបមន្តផ្ទៃក្រឡា និងបរិមាត្រមូលដ្ឋាន',
    englishTitle: 'Perimeter & Area Basics (Grade 6)',
    grade: 6,
    summaryKh: 'គណនាក្រឡាផ្ទៃ និងប្រវែងជុំវិញនៃ ចតុកោណកែង ត្រីកោណ និងរង្វង់។',
    summaryEn: 'Calculating perimeter and area for rectangles, triangles, and simple circles.',
    formula: 'A = L \\times W \\quad \\text{(ផ្ទៃក្រឡាចតុកោណកែង)}',
    descriptionKh: 'បរិមាត្រគឺជាប្រវែងរង្វាស់ជុំវិញនៃរាង جیូមេទ្រី។ ផ្ទៃក្រឡាគឺជាទំហំក្រាលគ្របលើផ្ទៃរាបខាងក្នុងនៃរូបនោះ។',
    exampleKh: 'ចតុកោណកែងមួយមានបណ្ដោយ ៦សង់ទីម៉ែត្រ និងទទឹង ៤សង់ទីម៉ែត្រ នាំឲ្យមានផ្ទៃក្រឡា ២៤ សង់ទីម៉ែត្រការ៉េ៖ 6 x 4 = 24។',
    quiz: {
      question: 'ចតុកោណកែងមួយមានបណ្ដោយ 8cm និងទទឹង 5cm។ តើផ្ទៃក្រឡាសរុបស្មើប៉ុន្មាន cm²?',
      correctAnswer: '40',
      points: 30,
      hint: 'ប្រើរូបមន្ត៖ ផ្ទៃក្រឡា = បណ្ដោយ x ទទឹង។'
    }
  },
  // Grade 7
  {
    id: 'g7-integers',
    title: 'ចំនួនវិជ្ជមាន ចំនួនអវិជ្ជមាន និងអថេរ',
    englishTitle: 'Negative Numbers & Variables (Grade 7)',
    grade: 7,
    summaryKh: 'ការគណនាជាមួយចំនួនគត់រុឡាទីប និងការណែនាំអថេរជើងឯក x, y។',
    summaryEn: 'Working with signed directed integers and introduction of variables x and y.',
    formula: '(-5) + 3 = -2 \\quad \\text{និង} \\quad (-3) \\times (-4) = 12',
    descriptionKh: 'ចំនួនអវិជ្ជមានតំណាងឲ្យតម្លៃដែលតូចជាងសូន្យ (ដូចជាសីតុណ្ហភាពក្រោមត្រជាក់ ឬជំពាក់ប្រាក់)។ កាលណាដកគុណនឹងដក ចេញបូក។',
    exampleKh: 'បើប្អូនជំពាក់គេ ៥ដុល្លារ (-5$) ហើយប្អូនសងវិញបាន ៣ដុល្លារ (+3$) នោះប្អូននៅតែជំពាក់គេ ២ដុល្លារទៀត (-2$)។',
    quiz: {
      question: 'គណនាតម្លៃផលគុណ៖ (-6) x (-3)',
      correctAnswer: '18',
      points: 35,
      hint: 'សញ្ញាដកគុណសញ្ញាដក ចេញសញ្ញាបូក។'
    }
  },
  // Grade 8
  {
    id: 'g8-linear',
    title: 'សមីការលីនេអ៊ែរមានមួយអថេរ',
    englishTitle: 'Linear Equations with One Variable (Grade 8)',
    grade: 8,
    summaryKh: 'របៀបដោះសមីការដើម្បីស្វែងរកតម្លៃអថេរអាថ៌កំបាំង x។',
    summaryEn: 'Solving algebraic equations to isolate the unknown variable x.',
    formula: 'ax + b = c \\implies x = \\frac{c - b}{a}',
    descriptionKh: 'សមីការគណិតវិទ្យាប្រៀបដូចជាជញ្ជីងថ្លឹងដែលរក្សាតុល្យភាពសងខាង។ ដើម្បីរកតម្លៃ x យើងត្រូវផ្លាស់ប្ដូរតម្លៃលេខផ្សេងទៀតទៅម្ខាងទៀតដោយប្ដូរសញ្ញា។',
    exampleKh: 'ដោះសមីការ 2x + 4 = 10 នាំឲ្យបាន 2x = 6 នាំឲ្យ x = 3។',
    quiz: {
      question: 'ដោះស្រាយសមីការដើម្បីរកតម្លៃ x ៖ 3x - 5 = 10',
      correctAnswer: '5',
      points: 35,
      hint: 'បោះលេខ -៥ ទៅស្ដាំទៅជាបូក ៥ (10+5 = 15) រួចចែកនឹង ៣។'
    }
  },
  // Grade 9
  {
    id: 'g9-pyth',
    title: 'ទ្រឹស្ដីបទពីតាករ',
    englishTitle: 'Pythagorean Theorem (Grade 9)',
    grade: 9,
    summaryKh: 'ទំនាក់ទំនងប្រវែងជ្រុងក្នុងត្រីកោណកែង។',
    summaryEn: 'The core geometric rule relating the sides of a right-angled triangle.',
    formula: 'a^2 + b^2 = c^2',
    descriptionKh: 'នៅក្នុងត្រីកោណកែងណាក៏ដោយ ផលបូកការ៉េនៃជ្រុងជាប់មុំកែងទាំងពីរ គឺស្មើនឹងការ៉េនៃជ្រុងអ៊ីប៉ូតែនូស (ជ្រុងទល់មុខមុំកែង)។',
    exampleKh: 'ត្រីកោណកែងមួយមានជ្រុងកែងប្រវែង ៣សង់ទីម៉ែត្រ និង ៤សង់ទីម៉ែត្រ ជ្រុងអ៊ីប៉ូតែនូសគឺស្មើនឹង ៥សង់ទីម៉ែត្រព្រោះ 9 + 16 = 25 (ឫសការ៉េនៃ 25 គឺ 5)។',
    quiz: {
      question: 'ក្នុងត្រីកោណកែងមួយ បើជ្រុងជាប់មុំកែង a = 6, b = 8 តើជ្រុងអ៊ីប៉ូតែនូស c មានតម្លៃស្មើនឹងប៉ុន្មាន?',
      correctAnswer: '10',
      points: 40,
      hint: 'គណនា a² + b² = 36 + 64 = 100 រួចទាញឫសការ៉េនៃ ១០០។'
    }
  },
  // Grade 10
  {
    id: 'g10-quad',
    title: 'សមីការដឺក្រេទី២ និងឌីសគ្រីមីណង់ ឌែលតា',
    englishTitle: 'Quadratic Equations & Discriminant (Grade 10)',
    grade: 10,
    summaryKh: 'ការស្វែងរកឫសនៃសមីការដឺក្រេទី២តាមរយៈរូបមន្តឌីសគ្រីមីណង់ ឌែលតា (Delta)។',
    summaryEn: 'Finding roots of second-degree quadratic equations using Discriminant Delta.',
    formula: '\\Delta = b^2 - 4ac \\quad , \\quad x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
    descriptionKh: 'សមីការដឺក្រេទី២មានទម្រង់ទូទៅ ax² + bx + c = 0។ តម្លៃ Delta (Δ) ជួយកំណត់ចំនួនឫស៖ បើ Δ > 0 មានឫសពីរផ្សេងគ្នា បើ Δ = 0 មានឫសឌុប បើ Δ < 0 គ្មានឫសជាចំនួនពិតទេ។',
    exampleKh: 'ចំពោះសមីការ x² - 5x + 6 = 0 យើងបាន a=1, b=-5, c=6 នាំឲ្យ Δ = 25 - 24 = 1 នាំឲ្យឫសមានតម្លៃ ២ និង ៣។',
    quiz: {
      question: 'គណនាតម្លៃឌីសគ្រីមីណង់ Delta (Δ) នៃសមីការ x² - 4x + 3 = 0',
      correctAnswer: '4',
      points: 40,
      hint: 'ប្រើរូបមន្ត Δ = b² - 4ac ជាមួយ a = 1, b = -4, c = 3។'
    }
  },
  // Grade 11
  {
    id: 'g11-limits',
    title: 'លីមីតនៃអនុគមន៍',
    englishTitle: 'Limits of Functions (Grade 11)',
    grade: 11,
    summaryKh: 'ស្វែងយល់ពីតម្លៃដែលអនុគមន៍ខិតជិត នៅពេលអថេរ x ខិតទៅជិតតម្លៃណាមួយ ឬអនន្ត។',
    summaryEn: 'Analyzing values that a function approaches as x gets closer to a target state.',
    formula: '\\lim_{x \\to a} f(x) = L',
    descriptionKh: 'លីមីតគឺជាឧបករណ៍គ្រឹះនៃគណិតវិទ្យាវិភាគ និងកាលគីឡូស។ វាសិក្សាពីឥរិយាបថនៃអនុគមន៍នៅចំណុចដែលមិនអាចគណនាផ្ទាល់បាន។',
    exampleKh: 'លីមីតនៃ (x² - 1) / (x - 1) ពេល x ខិតជិត ១ គឺស្មើនឹង ២ ព្រោះយើងសម្រួល x-1 ចោលបានសល់ x+1។',
    quiz: {
      question: 'គណនាលីមីត៖ lim (x -> 3) នៃកន្សោម (2x + 1)',
      correctAnswer: '7',
      points: 45,
      hint: 'ជំនួសតម្លៃ x ដោយលេខ ៣ ចូលក្នុងកន្សោមដោយផ្ទាល់។'
    }
  },
  // Grade 12
  {
    id: 'g12-derivs',
    title: 'ដេរីវេ និងការអនុវត្ត',
    englishTitle: 'Derivatives & Applications (Grade 12)',
    grade: 12,
    summaryKh: 'គណនាមេគុណប្រាប់ទិស បម្រែបម្រួលភ្លាមៗ និងអត្រាកំណើននៃអនុគមន៍។',
    summaryEn: 'Calculating instant rates of change and slopes of tangent lines.',
    formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    descriptionKh: 'ដេរីវេគណនាល្បឿនផ្លាស់ប្ដូរនៃអនុគមន៍មួយនៅខណៈពេលណាមួយ។ អនុវត្តក្នុងការរកចំណុចខ្ពស់បំផុត (Maximum) និងទាបបំផុត (Minimum) នៃក្រាហ្វ។',
    exampleKh: 'ដេរីវេនៃអនុគមន៍ f(x) = x³ គឺ f\'(x) = 3x²។ ដេរីវេនៃល្បឿនធៀបនឹងពេល គឺជាស្ទុះ។',
    quiz: {
      question: 'តើដេរីវេនៃអនុគមន៍ f(x) = 5x² មានតម្លៃស្មើនឹងប៉ុន្មាន?',
      correctAnswer: '10x',
      points: 50,
      hint: 'ប្រើរូបមន្ត៖ (xⁿ)\' = n xⁿ⁻¹។ ទម្លាក់លេខ២ចុះមកគុណនឹង ៥។'
    }
  }
];
