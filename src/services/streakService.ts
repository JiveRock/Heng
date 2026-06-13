export interface StreakBadge {
  id: string;
  titleKh: string;
  titleEn: string;
  requiredStreak: number;
  xpReward: number;
  descriptionKh: string;
  descriptionEn: string;
  emoji: string;
}

export const STREAK_BADGES: StreakBadge[] = [
  {
    id: "badge_streak_3",
    titleKh: "អ្នកតស៊ូ ៣ ថ្ងៃ",
    titleEn: "3-Day Streak Warrior",
    requiredStreak: 3,
    xpReward: 100,
    descriptionKh: "បានសិក្សាគណិតវិទ្យាជាប់គ្នា ៣ ថ្ងៃមិនដែលដាច់។",
    descriptionEn: "Studied mathematics for 3 consecutive days without interruption.",
    emoji: "🔥"
  },
  {
    id: "badge_streak_7",
    titleKh: "អ្នកប្រាជ្ញព្យាយាម ៧ ថ្ងៃ",
    titleEn: "7-Day Consistent Scholar",
    requiredStreak: 7,
    xpReward: 300,
    descriptionKh: "បានសិក្សាគណិតវិទ្យាជាប់គ្នា ៧ ថ្ងៃ ក្លាយជាទម្លាប់ដ៏ល្អ។",
    descriptionEn: "Studied mathematics for 7 consecutive days, building a great habit.",
    emoji: "⚡"
  },
  {
    id: "badge_streak_15",
    titleKh: "កំពូលគណិតករ ១៥ ថ្ងៃ",
    titleEn: "15-Day Unstoppable Master",
    requiredStreak: 15,
    xpReward: 800,
    descriptionKh: "បានសិក្សាគណិតវិទ្យាជាប់គ្នា ១៥ ថ្ងៃ ឆ្លាតវៃអស្ចារ្យ។",
    descriptionEn: "Studied mathematics for 15 consecutive days, showing incredible mastery.",
    emoji: "👑"
  }
];

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todaySessionCompleted: boolean;
  unlockedBadgeIds: string[];
}

// Get local date string YYYY-MM-DD
export function getLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
}

// Check if two date strings are consecutive days
export function isConsecutiveDay(prevDateStr: string, currentDateStr: string): boolean {
  if (!prevDateStr) return false;
  try {
    const p = new Date(prevDateStr);
    const c = new Date(currentDateStr);
    
    // Normalize times to midnight for date-only comparison
    p.setHours(0, 0, 0, 0);
    c.setHours(0, 0, 0, 0);
    
    const diffTime = c.getTime() - p.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1;
  } catch (e) {
    return false;
  }
}

// Check streak stats on load and return streak object
export function loadStreakState(): StreakState {
  const todayStr = getLocalDateString();
  
  const savedStreak = localStorage.getItem('kh_daily_streak_count');
  const savedLongest = localStorage.getItem('kh_daily_streak_longest');
  const savedLastDate = localStorage.getItem('kh_daily_streak_last_date');
  const savedUnlockedBadges = localStorage.getItem('kh_daily_streak_unlocked_badges');

  let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;
  let longestStreak = savedLongest ? parseInt(savedLongest, 10) : 0;
  let lastActiveDate = savedLastDate || '';
  let unlockedBadgeIds: string[] = [];

  try {
    if (savedUnlockedBadges) {
      unlockedBadgeIds = JSON.parse(savedUnlockedBadges);
    }
  } catch (e) {
    console.error(e);
  }

  let todaySessionCompleted = (lastActiveDate === todayStr);

  // If we missed yesterday, and it's not today, public streak can reset on first action.
  // We don't reset immediately on load, only when we inspect compared to yesterday.
  if (lastActiveDate && lastActiveDate !== todayStr && !isConsecutiveDay(lastActiveDate, todayStr)) {
    // Streak is stale (missed at least one whole day), so if they do an action, it will be 1
    // We update currentStreak to 0 here to indicate that the ongoing streak from the past is gone.
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
    todaySessionCompleted,
    unlockedBadgeIds
  };
}

// Register a study/learning session (when student completes any lesson, quiz, or gets XP)
export interface SessionResult {
  streakIncremented: boolean;
  newStreak: number;
  xpBonus: number;
  streakMilestoneUnlocked: StreakBadge | null;
  messageKh: string;
}

export function registerStudySession(currentXP: number): SessionResult {
  const todayStr = getLocalDateString();
  const state = loadStreakState();
  
  let newStreak = state.currentStreak;
  let xpBonus = 0;
  let streakMilestoneUnlocked: StreakBadge | null = null;
  let messageKh = "";
  let streakIncremented = false;

  if (state.lastActiveDate === todayStr) {
    // Already did standard checkpoint today, just maintain
    return {
      streakIncremented: false,
      newStreak: state.currentStreak || 1,
      xpBonus: 0,
      streakMilestoneUnlocked: null,
      messageKh: "ប្អូនបានចុះឈ្មោះសិក្សាសម្រាប់ការរួចរាល់សម្រាប់ថ្ងៃនេះហើយ! ស្វាហាប់រៀនបន្តទៀត!"
    };
  }

  // Determine if it was consecutive
  if (state.lastActiveDate === "") {
    // First time studying
    newStreak = 1;
    xpBonus = 50; // Welcome first-day bonus
    messageKh = "អបអរសាទរ! ប្អូនបានចាប់ផ្ដើមថ្ងៃសិក្សាថ្ងៃដំបូង ទទួលបាន +៥០ XP! 🎉";
    streakIncremented = true;
  } else if (isConsecutiveDay(state.lastActiveDate, todayStr)) {
    // Consecutive day
    newStreak = state.currentStreak + 1;
    xpBonus = 50 + (newStreak * 5); // Base 50 + extra streak multiplying index
    messageKh = `អបអរសាទរ! ប្អូនបានរក្សាការសិក្សាបន្តបន្ទាប់ ${newStreak} ថ្ងៃជាប់គ្នា! ទទួលបាន +${xpBonus} XP! 🔥`;
    streakIncremented = true;
  } else {
    // Broken streak, reset to 1
    newStreak = 1;
    xpBonus = 30;
    messageKh = "អូហូ! ប្អូនខានសិក្សាមួយរយៈ តែមិនអីទេ! តោះចាប់ផ្ដើមរក្សាថ្ងៃជាប់គ្នាសារជាថ្មី! ទទួលបាន +៣០ XP! ⚡";
    streakIncremented = true;
  }

  // Update longest streak if applicable
  const newLongest = Math.max(newStreak, state.longestStreak);
  
  localStorage.setItem('kh_daily_streak_count', newStreak.toString());
  localStorage.setItem('kh_daily_streak_longest', newLongest.toString());
  localStorage.setItem('kh_daily_streak_last_date', todayStr);

  // Check for badge achievements milestones
  const newlyUnlockedBadgeIds = [...state.unlockedBadgeIds];
  
  for (const badge of STREAK_BADGES) {
    if (newStreak >= badge.requiredStreak && !state.unlockedBadgeIds.includes(badge.id)) {
      newlyUnlockedBadgeIds.push(badge.id);
      streakMilestoneUnlocked = badge;
      xpBonus += badge.xpReward;
      messageKh = `🏆 អស្ចារ្យវិសេសវិសាល! ប្អូនទទួលបានមេដាយការសិក្សាថ្មី៖ "${badge.titleKh}" (${badge.requiredStreak} ថ្ងៃជាប់គ្នា) និងទទួលបានរង្វាន់បន្ថែម +${badge.xpReward} XP! 🎉`;
    }
  }

  localStorage.setItem('kh_daily_streak_unlocked_badges', JSON.stringify(newlyUnlockedBadgeIds));

  // Add the earned XP to the student's score
  const totalEarnedXP = currentXP + xpBonus;
  localStorage.setItem('kh_student_xp', totalEarnedXP.toString());

  // Notify any active event listeners that the streak stats or XP updated
  window.dispatchEvent(new Event('studentStreakUpdated'));
  window.dispatchEvent(new Event('xpChanged'));

  return {
    streakIncremented,
    newStreak,
    xpBonus,
    streakMilestoneUnlocked,
    messageKh
  };
}
