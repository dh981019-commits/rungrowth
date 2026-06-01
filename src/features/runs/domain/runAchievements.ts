import { formatElapsedTime } from './runCalculations';
import { RunRecord } from './runTypes';

export const PB_TARGETS = [
  { key: '1k', label: '1km', distanceMeters: 1000 },
  { key: '3k', label: '3km', distanceMeters: 3000 },
  { key: '5k', label: '5km', distanceMeters: 5000 },
  { key: '10k', label: '10km', distanceMeters: 10000 }
] as const;

export type PbTargetKey = (typeof PB_TARGETS)[number]['key'];

export type PersonalBest = {
  key: PbTargetKey;
  label: string;
  seconds: number;
  runId: string;
  achievedAt: string;
};

export type PbUpdate = {
  key: PbTargetKey;
  label: string;
  seconds: number;
  previousSeconds: number | null;
};

export type RunAchievement = {
  earnedHp: number;
  distanceHp: number;
  pbBonusHp: number;
  hpBreakdown: { label: string; hp: number }[];
  pbUpdates: PbUpdate[];
  messages: string[];
};

function sortRunsByEndTime(runs: RunRecord[]) {
  return [...runs].sort(
    (firstRun, secondRun) =>
      new Date(firstRun.endedAt).getTime() - new Date(secondRun.endedAt).getTime()
  );
}

export function estimateTargetSeconds(run: RunRecord, targetDistanceMeters: number) {
  if (
    run.distanceMeters < targetDistanceMeters ||
    run.distanceMeters <= 0 ||
    run.durationSeconds <= 0
  ) {
    return null;
  }

  const estimatedSeconds = Math.round(
    (run.durationSeconds * targetDistanceMeters) / run.distanceMeters
  );

  return Number.isFinite(estimatedSeconds) && estimatedSeconds > 0 ? estimatedSeconds : null;
}

export function calculatePersonalBests(runs: RunRecord[]) {
  const personalBests = new Map<PbTargetKey, PersonalBest>();

  sortRunsByEndTime(runs).forEach((run) => {
    PB_TARGETS.forEach((target) => {
      const seconds = estimateTargetSeconds(run, target.distanceMeters);

      if (seconds === null) {
        return;
      }

      const previousBest = personalBests.get(target.key);

      if (!previousBest || seconds < previousBest.seconds) {
        personalBests.set(target.key, {
          key: target.key,
          label: target.label,
          seconds,
          runId: run.id,
          achievedAt: run.endedAt
        });
      }
    });
  });

  return personalBests;
}

export function calculateRunAchievement(run: RunRecord, previousRuns: RunRecord[]): RunAchievement {
  const previousBests = calculatePersonalBests(previousRuns);
  const pbUpdates: PbUpdate[] = [];

  PB_TARGETS.forEach((target) => {
    const seconds = estimateTargetSeconds(run, target.distanceMeters);

    if (seconds === null) {
      return;
    }

    const previousBest = previousBests.get(target.key);

    if (!previousBest || seconds < previousBest.seconds) {
      pbUpdates.push({
        key: target.key,
        label: target.label,
        seconds,
        previousSeconds: previousBest?.seconds ?? null
      });
    }
  });

  let distanceHp = 0;

  if (run.distanceMeters >= 10000) {
    distanceHp = 40;
  } else if (run.distanceMeters >= 5000) {
    distanceHp = 20;
  } else if (run.distanceMeters >= 3000) {
    distanceHp = 10;
  }

  const pbBonusHp = pbUpdates.length > 0 ? 50 : 0;
  const messages = pbUpdates.map((pbUpdate) => {
    if (!pbUpdate.previousSeconds) {
      return `첫 ${pbUpdate.label} 기록을 만들었어요 (${formatElapsedTime(pbUpdate.seconds)})`;
    }

    return `${pbUpdate.label} 기록이 새로워졌어요 (${formatElapsedTime(pbUpdate.previousSeconds)} → ${formatElapsedTime(pbUpdate.seconds)})`;
  });
  const distanceLabel = distanceHp === 40 ? '10km 이상' : distanceHp === 20 ? '5km 이상' : '3km 이상';
  const hpBreakdown = [
    { label: '러닝 완료', hp: 10 },
    ...(distanceHp > 0 ? [{ label: distanceLabel, hp: distanceHp }] : []),
    ...(pbBonusHp > 0 ? [{ label: 'PB 갱신 보너스', hp: pbBonusHp }] : [])
  ];

  return {
    earnedHp: 10 + distanceHp + pbBonusHp,
    distanceHp,
    pbBonusHp,
    hpBreakdown,
    pbUpdates,
    messages
  };
}

export function buildRunAchievementMap(runs: RunRecord[]) {
  const achievementMap = new Map<string, RunAchievement>();
  const sortedRuns = sortRunsByEndTime(runs);
  const previousRuns: RunRecord[] = [];

  sortedRuns.forEach((run) => {
    achievementMap.set(run.id, calculateRunAchievement(run, previousRuns));
    previousRuns.push(run);
  });

  return achievementMap;
}
