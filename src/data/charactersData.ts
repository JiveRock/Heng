export interface StudyCharacter {
  id: string;
  name: string;
  category: 'Cute Animal Scholars' | 'Chibi Student Buds' | 'Living Study Tools';
  description: string;
  suggested_ui_state: string;
  emoji: string;
  gradient: string;
  textColor: string;
  borderColor: string;
}

export const studyCharacters: StudyCharacter[] = [
  {
    id: "char_01",
    name: "Leo the Math Lion",
    category: "Cute Animal Scholars",
    description: "កូនសិង្ហតូចរោមទន់ល្មើយ ពាក់វែនតាវង់មូលធំៗ និងកាន់បន្ទាត់ត្រីកោណកែង។",
    suggested_ui_state: "Math Lesson Screen / Geometry Section",
    emoji: "🦁",
    gradient: "from-amber-400 to-orange-500",
    textColor: "text-amber-900",
    borderColor: "border-amber-200"
  },
  {
    id: "char_02",
    name: "Pip the Coding Penguin",
    category: "Cute Animal Scholars",
    description: "សត្វភេនឃ្វីនតូចពាក់កាសត្រចៀក កំពុងវាយកូដយ៉ាងរវល់លើកុំព្យូទ័រយួរដៃតូចមួយ។",
    suggested_ui_state: "Computer Science / Programming Section",
    emoji: "🐧",
    gradient: "from-sky-400 to-blue-600",
    textColor: "text-sky-950",
    borderColor: "border-sky-200"
  },
  {
    id: "char_03",
    name: "Mochi the Bunny",
    category: "Cute Animal Scholars",
    description: "កូនទន្សាយពណ៌សក្បុសរាងដូចនំម៉ូឈី កំពុងឱបសៀវភៅសិក្សាដ៏ធំមួយ។",
    suggested_ui_state: "Reading Room / Vocabulary List",
    emoji: "🐰",
    gradient: "from-pink-300 to-rose-400",
    textColor: "text-rose-900",
    borderColor: "border-pink-200"
  },
  {
    id: "char_04",
    name: "Hooty the Owl",
    category: "Cute Animal Scholars",
    description: "កូនមេអំបៅរាងមូល ពាក់មួកបញ្ចប់ការសិក្សា តែងតែងងុយដេកខណៈពេលអានសៀវភៅ។",
    suggested_ui_state: "History / Science Section",
    emoji: "🦉",
    gradient: "from-purple-400 to-indigo-600",
    textColor: "text-purple-950",
    borderColor: "border-purple-200"
  },
  {
    id: "char_05",
    name: "Coco the Bear",
    category: "Cute Animal Scholars",
    description: "សត្វខ្លាឃ្មុំពណ៌ត្នោតធាត់ទ្រលុក ខាំខ្មៅដៃពេលកំពុងគិត លេចថ្ពាល់ផ្កាឈូកក្រហមព្រឿងៗ។",
    suggested_ui_state: "Quiz / Hard Question Screen",
    emoji: "🐻",
    gradient: "from-amber-600 to-amber-800",
    textColor: "text-amber-50",
    borderColor: "border-amber-500"
  },
  {
    id: "char_06",
    name: "Pippin the Squirrel",
    category: "Cute Animal Scholars",
    description: "សត្វកំប្រុកកន្ទុយសំពោង កាន់គ្រាប់ធញ្ញជាតិឆ្លាក់សញ្ញាគណិតវិទ្យា (+, -, ×, ÷)។",
    suggested_ui_state: "Basic Arithmetic Level Selection",
    emoji: "🐿️",
    gradient: "from-orange-400 to-amber-600",
    textColor: "text-orange-950",
    borderColor: "border-orange-200"
  },
  {
    id: "char_07",
    name: "Bubbles the Otter",
    category: "Cute Animal Scholars",
    description: "ភេទឹកសមុទ្រកំពុងអណ្តែតផ្កាប់ផ្កửa កាន់ក្តារខៀនតូចមួយដែលមានរូបមន្ត។",
    suggested_ui_state: "Formula Cheat Sheet / Quick Reference",
    emoji: "🦦",
    gradient: "from-teal-400 to-emerald-500",
    textColor: "text-teal-950",
    borderColor: "border-teal-200"
  },
  {
    id: "char_08",
    name: "Foxy the Reader",
    category: "Cute Animal Scholars",
    description: "សត្វកញ្ជ្រោងពណ៌ទឹកក្រូចភ្លឺ ដេកផ្ទាល់ដីគ្រវីកន្ទុយយ៉ាងសប្បាយពេលកំពុងអានសៀវភៅ។",
    suggested_ui_state: "Story Mode / Literature Section",
    emoji: "🦊",
    gradient: "from-orange-500 to-red-500",
    textColor: "text-orange-100",
    borderColor: "border-orange-300"
  },
  {
    id: "char_09",
    name: "Panda Pan",
    category: "Cute Animal Scholars",
    description: "កូនខ្លាឃ្មុំប៉ង់ដាកំពុងញ៉ាំឫស្សី ភ្នែកសម្លឹងមើលសន្លឹកកត់ត្រាមេរៀនគណិត។",
    suggested_ui_state: "Break Time / Study Timer Screen",
    emoji: "🐼",
    gradient: "from-gray-500 to-gray-800",
    textColor: "text-white",
    borderColor: "border-gray-400"
  },
  {
    id: "char_10",
    name: "Chippy the Chick",
    category: "Cute Animal Scholars",
    description: "កូនមាន់ពណ៌លឿងគួរឲ្យស្រលាញ់ ពាក់សំបកស៊ុតលើក្បាល កាន់សញ្ញាសួរដ៏ធំមួយ។",
    suggested_ui_state: "Help / FAQ / Tutorial Screen",
    emoji: "🐥",
    gradient: "from-yellow-300 to-amber-400",
    textColor: "text-amber-950",
    borderColor: "border-yellow-200"
  },
  {
    id: "char_11",
    name: "Sora",
    category: "Chibi Student Buds",
    description: "ក្មេងប្រុសសក់ខៀវ ភ្នែកធំៗចែងចាំង ញញឹមបក់ដៃរាក់ទាក់យ៉ាងរស់រវើក។",
    suggested_ui_state: "Welcome / Dashboard Screen",
    emoji: "👦🏻",
    gradient: "from-indigo-400 to-blue-500",
    textColor: "text-indigo-950",
    borderColor: "border-indigo-200"
  },
  {
    id: "char_12",
    name: "Mei",
    category: "Chibi Student Buds",
    description: "សិស្សស្រីចងសក់ពីរចំហៀង លើកដៃឡើងដោយទំនុកចិត្តដើម្បីឆ្លើយសំណួររបស់គ្រូ។",
    suggested_ui_state: "Leaderboard / Top Student List",
    emoji: "👧🏻",
    gradient: "from-pink-400 to-purple-500",
    textColor: "text-pink-950",
    borderColor: "border-pink-200"
  },
  {
    id: "char_13",
    name: "Kenji",
    category: "Chibi Student Buds",
    description: "កុមារសក់រួញ ទ្រចង្កាគិត ភ្នែកវិលវល់ហាក់ដូចជាកំពុងវង្វេងក្នុងមហាសមុទ្រលេខ។",
    suggested_ui_state: "Error Screen / Wrong Answer Warning",
    emoji: "🤔",
    gradient: "from-slate-400 to-slate-600",
    textColor: "text-slate-100",
    borderColor: "border-slate-300"
  },
  {
    id: "char_14",
    name: "Hana",
    category: "Chibi Student Buds",
    description: "កូនក្មេងស្រីភ្នែកធំៗ កាន់ផ្កាជួយលើកទឹកចិត្ត លោតកញ្ឆេងអបអរសាទរជោគជ័យ។",
    suggested_ui_state: "Success Screen / 100% Score Celebration",
    emoji: "🙌",
    gradient: "from-amber-400 to-red-400",
    textColor: "text-red-950",
    borderColor: "border-amber-300"
  },
  {
    id: "char_15",
    name: "Taku",
    category: "Chibi Student Buds",
    description: "សិស្សប្រុសពាក់អាវរលុងក្រៅធំ គេងហៀរទឹកមាត់ផ្កាប់មុខលើសៀវភៅពុម្ព។",
    suggested_ui_state: "Inactivity Reminder / Daily Streak Lost",
    emoji: "💤",
    gradient: "from-violet-400 to-indigo-800",
    textColor: "text-violet-50",
    borderColor: "border-violet-500"
  },
  {
    id: "char_16",
    name: "Yuki",
    category: "Chibi Student Buds",
    description: "កូនស្រីអៀនប្រៀន អើតក្បាលលបមើលពិន្ទុរបស់ខ្លួនពីក្រោយសៀវភៅធំមួយក្បាល។",
    suggested_ui_state: "Report Card / Grade Overview Screen",
    emoji: "🙈",
    gradient: "from-fuchsia-400 to-pink-600",
    textColor: "text-fuchsia-950",
    borderColor: "border-fuchsia-200"
  },
  {
    id: "char_17",
    name: "Ren",
    category: "Chibi Student Buds",
    description: "សិស្សឆ្លាតវៃពាក់វែនតា កាន់ថេប្លេតទំនើបបង្ហាញតារាងទិន្នន័យវឌ្ឍនភាព។",
    suggested_ui_state: "User Profile / Learning Analytics",
    emoji: "🧑‍💻",
    gradient: "from-emerald-400 to-teal-600",
    textColor: "text-emerald-950",
    borderColor: "border-emerald-200"
  },
  {
    id: "char_18",
    name: "Aria",
    category: "Chibi Student Buds",
    description: "សិស្សស្រីសក់ផ្កាឈូក កាន់ជក់ថ្នាំពណ៌ កំពុងគូរវាលខ្សាច់ក្នុងសៀវភៅគណិត។",
    suggested_ui_state: "Creative Mode / Customization Shop",
    emoji: "🎨",
    gradient: "from-orange-300 to-rose-500",
    textColor: "text-orange-950",
    borderColor: "border-orange-200"
  },
  {
    id: "char_19",
    name: "Kou",
    category: "Chibi Student Buds",
    description: "ក្មេងប្រុសស្វាហាប់ពាក់មួកបង្វែរទៅក្រោយ ហក់ឡើងលើដាល់ខ្យល់យ៉ាងរីករាយ។",
    suggested_ui_state: "Level Up Notification",
    emoji: "✊",
    gradient: "from-yellow-400 to-gold text-yellow-950",
    textColor: "text-amber-950",
    borderColor: "border-yellow-300"
  },
  {
    id: "char_20",
    name: "Lina",
    category: "Chibi Student Buds",
    description: "សិស្សស្រីស្ពាយកាតាបស្ពាយធំជាងខ្លួន ឆ្លុះមើលរូបមន្តតាមកញ្ចក់កែវពង្រីក។",
    suggested_ui_state: "Search Bar / Quest Exploration Screen",
    emoji: "🔍",
    gradient: "from-cyan-400 to-blue-500",
    textColor: "text-cyan-950",
    borderColor: "border-cyan-200"
  },
  {
    id: "char_21",
    name: "Pencil Pete",
    category: "Living Study Tools",
    description: "កូនខ្មៅដៃពណ៌លឿង ពាក់មួកខាត់ពណ៌ស្អាត លេចចេញស្នាមញញឹមធ្មេញជំពើសគួរឲ្យខ្នាញ់។",
    suggested_ui_state: "Drafting Note / Scratchpad Input",
    emoji: "✏️",
    gradient: "from-yellow-300 to-orange-400",
    textColor: "text-slate-800",
    borderColor: "border-yellow-100"
  },
  {
    id: "char_22",
    name: "Eraser Emmy",
    category: "Living Study Tools",
    description: "កូនជ័រលុបពណ៌ផ្កាឈូករាងចតុកោណ មានជើងតូចៗកំពុងរត់លុបរាល់ខុសឆ្គង។",
    suggested_ui_state: "Clear Canvas / Delete Action Button",
    emoji: "🧼",
    gradient: "from-pink-200 to-rose-300",
    textColor: "text-rose-900",
    borderColor: "border-pink-100"
  },
  {
    id: "char_23",
    name: "Ruler Rick",
    category: "Living Study Tools",
    description: "បន្ទាត់ឈើតូចមានភ្នែកតុក្កតាមួយ ច ایستឈរត្រង់ខ្លួនយ៉ាងមានមោទនភាពបំផុត។",
    suggested_ui_state: "Measurements / Settings Calibration",
    emoji: "📏",
    gradient: "from-amber-200 to-yellow-500",
    textColor: "text-amber-900",
    borderColor: "border-amber-300"
  },
  {
    id: "char_24",
    name: "Booky Book",
    category: "Living Study Tools",
    description: "សៀវភៅសិក្សាក្រាស់ដែលមានភ្នែកលើគម្រប បញ្ចេញពន្លឺផ្កាយមន្តអាគមពេលបើក។",
    suggested_ui_state: "Main Library / Subject Catalog",
    emoji: "📘",
    gradient: "from-blue-400 to-indigo-500",
    textColor: "text-blue-950",
    borderColor: "border-blue-200"
  },
  {
    id: "char_25",
    name: "Calculator Cal",
    category: "Living Study Tools",
    description: "ម៉ាស៊ីនគិតលេខតូចបង្ហាញអារម្មណ៍បែបភីកសែល (Pixel Emotion) លើអេក្រង់ LCD។",
    suggested_ui_state: "Math Formula Solver Component",
    emoji: "🧮",
    gradient: "from-lime-400 to-emerald-600",
    textColor: "text-emerald-950",
    borderColor: "border-lime-200"
  },
  {
    id: "char_26",
    name: "Inkpot Ian",
    category: "Living Study Tools",
    description: "ដបទឹកខ្មៅតូចជំពប់ជើងដួល សាចទឹកខ្មៅចេញជារូបបេះដូងពោរពេញដោយក្តីស្រលាញ់។",
    suggested_ui_state: "Writing Practice / Theme Selection",
    emoji: "✒️",
    gradient: "from-sky-500 to-slate-800",
    textColor: "text-white",
    borderColor: "border-sky-300"
  },
  {
    id: "char_27",
    name: "Compass Cora",
    category: "Living Study Tools",
    description: "ដែកឈូសគូររង្វង់មានរាងស្អាត កំពុងបង្វិលខ្លួនថ្នមៗដូចជាអ្នករាំរបាំដើម្បីគូររង្វង់ឥតខ្ចោះ។",
    suggested_ui_state: "Progress Ring / Loading Circle",
    emoji: "🧭",
    gradient: "from-teal-300 to-cyan-500",
    textColor: "text-teal-950",
    borderColor: "border-teal-100"
  },
  {
    id: "char_28",
    name: "Baggy Backpack",
    category: "Living Study Tools",
    description: "កាតាបស្ពាយពណ៌បៃតងបើកខ្សែរ៉ូតធំ ញញឹមសើចសប្បាយហៀរសន្លឹកកិច្ចការ។",
    suggested_ui_state: "Inventory / Achievements Bag",
    emoji: "🎒",
    gradient: "from-emerald-400 to-teal-600",
    textColor: "text-emerald-950",
    borderColor: "border-emerald-200"
  },
  {
    id: "char_29",
    name: "Clip Chloe",
    category: "Living Study Tools",
    description: "ដង្កៀបសន្លឹកកិច្ចការលោតចុះលោតឡើង រង់ចាំកៀបភ្ជាប់ក្រដាសប្រឡងដែលសិស្សធ្វើរួច។",
    suggested_ui_state: "Task Completed / Submit Homework Button",
    emoji: "📎",
    gradient: "from-rose-400 to-pink-500",
    textColor: "text-rose-950",
    borderColor: "border-rose-100"
  },
  {
    id: "char_30",
    name: "Globe Glen",
    category: "Living Study Tools",
    description: "ដែនដីសកលលោកតូច ពាក់វែនតាការពារកម្តៅថ្ងៃយ៉ាងឡូយ បង្វិលខ្លួនយឺតៗ។",
    suggested_ui_state: "App Loading Screen / Geography Mode",
    emoji: "🌐",
    gradient: "from-blue-300 to-teal-400",
    textColor: "text-blue-900",
    borderColor: "border-blue-100"
  }
];
