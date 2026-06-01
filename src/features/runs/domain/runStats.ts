import {
  PB_TARGETS,
  PbUpdate,
  buildRunAchievementMap,
  calculatePersonalBests
} from './runAchievements';
import { formatDistance, formatElapsedTime, formatPace } from './runCalculations';
import { getNextTierProgress } from './runTier';
import { RunRecord } from './runTypes';

export type RunStats = ReturnType<typeof buildRunStats>;

function sortRunsByLatest(runs: RunRecord[]) {
  return [...runs].sort(
    (firstRun, secondRun) =>
      new Date(secondRun.endedAt).getTime() - new Date(firstRun.endedAt).getTime()
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric'
  }).format(new Date(value));
}

function getRecentPbText(pbUpdates: PbUpdate[]) {
  const firstUpdate = pbUpdates[0];
  return firstUpdate ? `${firstUpdate.label} 개인 최고기록` : '아직 PB가 없어요';
}

export function buildRunStats(runs: RunRecord[]) {
  const latestRuns = sortRunsByLatest(runs);
  const achievementMap = buildRunAchievementMap(runs);
  const personalBests = calculatePersonalBests(runs);
  const totalHp = runs.reduce(
    (sum, run) => sum + (achievementMap.get(run.id)?.earnedHp ?? 0),
    0
  );
  const tierProgress = getNextTierProgress(totalHp);
  const totalDistanceMeters = runs.reduce((sum, run) => sum + run.distanceMeters, 0);
  const latestRun = latestRuns[0] ?? null;
  const latestAchievement = latestRun ? achievementMap.get(latestRun.id) ?? null : null;

  const pbRows = PB_TARGETS.map((target) => {
    const personalBest = personalBests.get(target.key);

    return {
      key: target.key,
      label: `${target.label} PB`,
      value: personalBest ? formatElapsedTime(personalBest.seconds) : '기록 없음',
      achievedAt: personalBest?.achievedAt ?? null
    };
  });

  const bestPb = pbRows.find((row) => row.value !== '기록 없음') ?? null;
  const recentPb = latestAchievement?.pbUpdates[0] ?? null;
  const hpToNextTier = tierProgress.hpToNextTier;

  return {
    hasRuns: runs.length > 0,
    totalRuns: runs.length,
    totalDistance: formatDistance(totalDistanceMeters),
    totalDistanceMeters,
    totalHp,
    currentTier: tierProgress.currentTier.name,
    nextTier: tierProgress.nextTier?.name ?? null,
    hpToNextTier,
    tierProgress: tierProgress.progress,
    nextTierMessage: tierProgress.nextTier
      ? `다음 티어까지 ${hpToNextTier} HP 남았어요`
      : '최고 티어에 도달했어요',
    recentPbText: recentPb ? `${recentPb.label} 기록 갱신` : getRecentPbText([]),
    growthMessage: latestAchievement?.pbUpdates.length
      ? '개인 최고기록 갱신! 한 단계 더 성장했어요'
      : runs.length
        ? '러닝이 쌓일수록 성장도 선명해져요'
        : '첫 러닝을 시작해보세요',
    pbRows,
    bestPb: bestPb
      ? `${bestPb.label.replace(' PB', '')} ${bestPb.value}`
      : '첫 PB를 만들어보세요',
    recentRuns: latestRuns.slice(0, 5).map((run) => {
      const achievement = achievementMap.get(run.id);

      return {
        id: run.id,
        date: formatDate(run.endedAt),
        distance: formatDistance(run.distanceMeters),
        duration: formatElapsedTime(run.durationSeconds),
        pace: formatPace(run.averagePaceSecondsPerKm),
        earnedHp: achievement?.earnedHp ?? 0,
        pbText: achievement?.pbUpdates.length
          ? `${achievement.pbUpdates[0].label} 개인 최고기록`
          : '완주 기록'
      };
    }),
    achievementMap
  };
}
