export type RunnerTier = {
  name: string;
  minHp: number;
  maxHp: number | null;
};

export const RUNNER_TIERS: RunnerTier[] = [
  { name: '브론즈 러너', minHp: 0, maxHp: 99 },
  { name: '실버 러너', minHp: 100, maxHp: 299 },
  { name: '골드 러너', minHp: 300, maxHp: 699 },
  { name: '플래티넘 러너', minHp: 700, maxHp: 1499 },
  { name: '다이아 러너', minHp: 1500, maxHp: 2999 },
  { name: '마스터 러너', minHp: 3000, maxHp: null }
];

export function getRunnerTier(totalHp: number) {
  return (
    RUNNER_TIERS.find((tier) => {
      const isAboveMinimum = totalHp >= tier.minHp;
      const isBelowMaximum = tier.maxHp === null || totalHp <= tier.maxHp;
      return isAboveMinimum && isBelowMaximum;
    }) ?? RUNNER_TIERS[0]
  );
}

export function getNextTierProgress(totalHp: number) {
  const currentTier = getRunnerTier(totalHp);
  const currentIndex = RUNNER_TIERS.findIndex((tier) => tier.name === currentTier.name);
  const nextTier = RUNNER_TIERS[currentIndex + 1] ?? null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      hpToNextTier: 0,
      progress: 1
    };
  }

  const tierSpan = nextTier.minHp - currentTier.minHp;
  const earnedInTier = Math.max(totalHp - currentTier.minHp, 0);

  return {
    currentTier,
    nextTier,
    hpToNextTier: Math.max(nextTier.minHp - totalHp, 0),
    progress: tierSpan > 0 ? Math.min(earnedInTier / tierSpan, 1) : 1
  };
}
