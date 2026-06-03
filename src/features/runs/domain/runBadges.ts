import { calculateRunStreak } from './runStreak';
import { RunRecord } from './runTypes';

export type RunBadgeKey = 'first-run' | 'first-5k' | 'first-10k' | 'total-50k' | 'streak-7';

export type RunBadge = {
  key: RunBadgeKey;
  title: string;
  description: string;
  achieved: boolean;
  achievedAt: string | null;
  statusText: string;
};

type BadgeDefinition = {
  key: RunBadgeKey;
  title: string;
  description: string;
  getAchievedAt: (runs: RunRecord[]) => string | null;
};

function sortRunsByEndTime(runs: RunRecord[]) {
  return [...runs].sort(
    (firstRun, secondRun) =>
      new Date(firstRun.endedAt).getTime() - new Date(secondRun.endedAt).getTime()
  );
}

function findFirstRunAtDistance(runs: RunRecord[], distanceMeters: number) {
  return sortRunsByEndTime(runs).find((run) => run.distanceMeters >= distanceMeters)?.endedAt ?? null;
}

function findCumulativeDistanceAchievedAt(runs: RunRecord[], targetDistanceMeters: number) {
  let totalDistanceMeters = 0;

  for (const run of sortRunsByEndTime(runs)) {
    totalDistanceMeters += run.distanceMeters;

    if (totalDistanceMeters >= targetDistanceMeters) {
      return run.endedAt;
    }
  }

  return null;
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: 'first-run',
    title: '첫 러닝 완료',
    description: "Runner's Hi의 첫 러닝을 기록했어요",
    getAchievedAt: (runs) => sortRunsByEndTime(runs)[0]?.endedAt ?? null
  },
  {
    key: 'first-5k',
    title: '첫 5km 달성',
    description: '한 번에 5km 이상 달렸어요',
    getAchievedAt: (runs) => findFirstRunAtDistance(runs, 5000)
  },
  {
    key: 'first-10k',
    title: '첫 10km 달성',
    description: '한 번에 10km 이상 달렸어요',
    getAchievedAt: (runs) => findFirstRunAtDistance(runs, 10000)
  },
  {
    key: 'total-50k',
    title: '누적 50km 달성',
    description: '쌓인 러닝 거리가 50km를 넘었어요',
    getAchievedAt: (runs) => findCumulativeDistanceAchievedAt(runs, 50000)
  },
  {
    key: 'streak-7',
    title: '7일 연속 러닝 달성',
    description: '7일 동안 러닝 리듬을 이어갔어요',
    getAchievedAt: (runs) => {
      const streak = calculateRunStreak(runs);

      if (streak.currentStreak < 7) {
        return null;
      }

      return sortRunsByEndTime(runs).at(-1)?.endedAt ?? null;
    }
  }
];

export function calculateRunBadges(runs: RunRecord[]) {
  return BADGE_DEFINITIONS.map((badgeDefinition) => {
    const achievedAt = badgeDefinition.getAchievedAt(runs);

    return {
      key: badgeDefinition.key,
      title: badgeDefinition.title,
      description: badgeDefinition.description,
      achieved: achievedAt !== null,
      achievedAt,
      statusText: achievedAt ? '달성 완료' : '아직 달성 전'
    };
  });
}

export function getRecentAchievedBadge(badges: RunBadge[]) {
  return [...badges]
    .filter((badge) => badge.achieved && badge.achievedAt)
    .sort(
      (firstBadge, secondBadge) =>
        new Date(secondBadge.achievedAt as string).getTime() -
        new Date(firstBadge.achievedAt as string).getTime()
    )[0] ?? null;
}
