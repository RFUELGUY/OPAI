export const referralLink =
  "https://user.ordinarypeopleai.com/register?sponsor=OPAI";

export const allowedPackages = [5, 10, 25, 50] as const;

export const leadershipRanks = [
  { rank: "GOLD", volume: "1,000", points: 10, virtues: ["Active", "Helpful", "Honest"] },
  { rank: "SAPPHIRE", volume: "2,000", points: 20, virtues: ["Active", "Helpful", "Honest"] },
  { rank: "EMERALD", volume: "4,000", points: 80, virtues: ["Active", "Helpful", "Honest"] },
  { rank: "RUBY", volume: "8,000", points: 160, virtues: ["Active", "Helpful", "Honest"] },
  { rank: "DIAMOND", volume: "16,000", points: 320, virtues: ["Active", "Helpful", "Honest"] },
];

export const vipStars = [
  { level: "VIP 1", directs: 10, team: 1_000, points: 100 },
  { level: "VIP 2", directs: 20, team: 2_000, points: 200 },
  { level: "VIP 3", directs: 30, team: 3_000, points: 300 },
  { level: "VIP 4", directs: 40, team: 4_000, points: 400 },
  { level: "VIP 5", directs: 50, team: 5_000, points: 500 },
];

export const earningPlans = [
  { code: "OP05", min: 5, totalPotential: 524_894 },
  { code: "OP10", min: 10, totalPotential: 1_049_787 },
  { code: "OP25", min: 25, totalPotential: 2_624_468 },
  { code: "OP50", min: 50, totalPotential: 5_248_935 },
];

export const badgeCounts = [
  { label: "ACTIVE", count: 1, color: "text-amber-600" },
  { label: "HELPFUL", count: 1, color: "text-sky-600" },
  { label: "HONEST", count: 1, color: "text-orange-600" },
];

export const leaderboardData = [
  { sr: 1, userId: "USER1001", rank: "DIAMOND", vipLevel: 1 },
  { sr: 2, userId: "USER1002", rank: "EMERALD", vipLevel: 1 },
  { sr: 3, userId: "USER1003", rank: "GOLD", vipLevel: 2 },
  { sr: 4, userId: "USER1004", rank: "RUBY", vipLevel: 1 },
  { sr: 5, userId: "USER1005", rank: "SAPPHIRE", vipLevel: 3 },
];

export const levelData = [
  { level: 1, bonus: "35.0%", network: 10, netWorth: 18, referralsNeeded: 1, unlocked: true },
  { level: 2, bonus: "10.0%", network: 20, netWorth: 10, referralsNeeded: 2, unlocked: true },
  { level: 3, bonus: "5.0%", network: 40, netWorth: 10, referralsNeeded: 3, unlocked: false },
  { level: 4, bonus: "4.0%", network: 80, netWorth: 16, referralsNeeded: 4, unlocked: false },
  { level: 5, bonus: "3.0%", network: 160, netWorth: 24, referralsNeeded: 5, unlocked: false },
];
