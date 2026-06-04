import {
  PB_TARGETS,
  PbUpdate,
  buildRunAchievementMap,
  calculatePersonalBests
} from './runAchievements';
import { calculateRunBadges, getRecentAchievedBadge } from './runBadges';
import {
  calculateAveragePace,
  formatDistance,
  formatElapsedTime,
  formatPace
} from './runCalculations';
import { calculateRunStreak } from './runStreak';
import { RUNNER_TIERS, getNextTierProgress } from './runTier';
import { RunRecord } from './runTypes';
import { calculateWeeklyGoal } from './runWeeklyGoal';

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

function getStartOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getStartOfWeek(date: Date) {
  const startOfDay = getStartOfLocalDay(date);
  const day = startOfDay.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  startOfDay.setDate(startOfDay.getDate() + mondayOffset);
  return startOfDay;
}

function getWeekdayKey(date: Date) {
  const day = getStartOfLocalDay(date).getDay();
  return day === 0 ? 6 : day - 1;
}

function buildWeeklyDayRows(runs: RunRecord[], now = new Date()) {
  const weekStart = getStartOfWeek(now);
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(weekStart.getDate() + 7);
  const labels = ['월', '화', '수', '목', '금', '토', '일'];
  const rows = labels.map((label) => ({
    label,
    distanceMeters: 0,
    runCount: 0,
    hasRun: false
  }));

  runs
    .filter((run) => {
      const endedAt = new Date(run.endedAt);
      return endedAt >= weekStart && endedAt < nextWeekStart;
    })
    .forEach((run) => {
      const row = rows[getWeekdayKey(new Date(run.endedAt))];
      row.distanceMeters += run.distanceMeters;
      row.runCount += 1;
      row.hasRun = true;
    });

  return rows.map((row) => ({
    ...row,
    distanceLabel: row.hasRun ? formatDistance(row.distanceMeters) : '휴식'
  }));
}

function buildTierRows(totalHp: number) {
  const currentTier = getNextTierProgress(totalHp).currentTier;
  const currentIndex = RUNNER_TIERS.findIndex((tier) => tier.name === currentTier.name);

  return RUNNER_TIERS.slice(0, 5).map((tier, index) => ({
    name: tier.name.replace(' 러너', ''),
    fullName: tier.name,
    hpRequired: tier.minHp,
    state: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'locked'
  }));
}

function getNextActionMessage(hasRuns: boolean, weeklyGoal: ReturnType<typeof calculateWeeklyGoal>, streak: ReturnType<typeof calculateRunStreak>) {
  if (!hasRuns) {
    return '첫 러닝을 시작하면 HP와 배지가 쌓여요';
  }

  if (streak.currentStreak > 0) {
    return '오늘 1km만 뛰어도 스트릭을 이어갈 수 있어요';
  }

  if (weeklyGoal.remainingDistanceMeters > 0) {
    return `이번 주 목표까지 ${formatDistance(weeklyGoal.remainingDistanceMeters)} 남았어요`;
  }

  return '오늘도 러닝을 쌓으면 다음 보상이 가까워져요';
}

function getNextBadgeGoal(runs: RunRecord[], badges: ReturnType<typeof calculateRunBadges>, totalDistanceMeters: number, streak: ReturnType<typeof calculateRunStreak>) {
  const nextBadge = badges.find((badge) => !badge.achieved);

  if (!nextBadge) {
    return {
      title: '모든 배지 달성',
      progressLabel: '배지 컬렉션을 완성했어요',
      progress: 1
    };
  }

  const maxRunDistanceMeters = runs.reduce((maxDistance, run) => Math.max(maxDistance, run.distanceMeters), 0);

  if (nextBadge.key === 'first-run') {
    return {
      title: nextBadge.title,
      progressLabel: `${runs.length ? 1 : 0} / 1회`,
      progress: runs.length ? 1 : 0
    };
  }

  if (nextBadge.key === 'first-5k') {
    return {
      title: nextBadge.title,
      progressLabel: `${formatDistance(maxRunDistanceMeters)} / 5km`,
      progress: Math.min(maxRunDistanceMeters / 5000, 1)
    };
  }

  if (nextBadge.key === 'first-10k') {
    return {
      title: nextBadge.title,
      progressLabel: `${formatDistance(maxRunDistanceMeters)} / 10km`,
      progress: Math.min(maxRunDistanceMeters / 10000, 1)
    };
  }

  if (nextBadge.key === 'total-50k') {
    return {
      title: nextBadge.title,
      progressLabel: `${formatDistance(totalDistanceMeters)} / 50km`,
      progress: Math.min(totalDistanceMeters / 50000, 1)
    };
  }

  return {
    title: nextBadge.title,
    progressLabel: `${streak.currentStreak} / 7일`,
    progress: Math.min(streak.currentStreak / 7, 1)
  };
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
  const totalDurationSeconds = runs.reduce((sum, run) => sum + run.durationSeconds, 0);
  const latestRun = latestRuns[0] ?? null;
  const latestAchievement = latestRun ? achievementMap.get(latestRun.id) ?? null : null;
  const weeklyGoal = calculateWeeklyGoal(runs);
  const streak = calculateRunStreak(runs);
  const badges = calculateRunBadges(runs);
  const recentBadge = getRecentAchievedBadge(badges);
  const weeklyRuns = runs.filter((run) => {
    const endedAt = new Date(run.endedAt);
    const weekStart = getStartOfWeek(new Date());
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(weekStart.getDate() + 7);
    return endedAt >= weekStart && endedAt < nextWeekStart;
  });
  const weeklyEarnedHp = weeklyRuns.reduce(
    (sum, run) => sum + (achievementMap.get(run.id)?.earnedHp ?? 0),
    0
  );

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
    averagePace: formatPace(calculateAveragePace(totalDurationSeconds, totalDistanceMeters)),
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
    nextActionMessage: getNextActionMessage(runs.length > 0, weeklyGoal, streak),
    pbRows,
    bestPb: bestPb
      ? `${bestPb.label.replace(' PB', '')} ${bestPb.value}`
      : '첫 PB를 만들어보세요',
    weeklyGoal,
    weeklyReport: {
      earnedHp: weeklyEarnedHp,
      dayRows: buildWeeklyDayRows(runs),
      summaryMessage: weeklyRuns.length
        ? `이번 주 ${weeklyGoal.runGoal}회 중 ${weeklyGoal.runCount}회 달렸어요`
        : '이번 주 러닝 기록이 아직 없어요',
      actionMessage: weeklyGoal.isComplete
        ? '주간 목표 달성! 다음 보상을 향해 가볼까요?'
        : weeklyGoal.remainingDistanceMeters > 0
          ? `목표 거리까지 ${formatDistance(weeklyGoal.remainingDistanceMeters)} 남았어요`
          : `이번 주 목표까지 ${weeklyGoal.remainingRuns}회 남았어요`
    },
    streak,
    badges,
    recentBadge,
    badgeCollection: {
      achievedCount: badges.filter((badge) => badge.achieved).length,
      totalCount: badges.length,
      progress: badges.length
        ? badges.filter((badge) => badge.achieved).length / badges.length
        : 0,
      nextGoal: getNextBadgeGoal(runs, badges, totalDistanceMeters, streak)
    },
    tierRows: buildTierRows(totalHp),
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
