import { formatDistance } from './runCalculations';
import { RunRecord } from './runTypes';

const WEEKLY_RUN_GOAL = 3;
const WEEKLY_DISTANCE_GOAL_METERS = 10000;

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

function isInCurrentWeek(value: string, now: Date) {
  const runDate = new Date(value);
  const weekStart = getStartOfWeek(now);
  const nextWeekStart = new Date(weekStart);
  nextWeekStart.setDate(weekStart.getDate() + 7);

  return runDate >= weekStart && runDate < nextWeekStart;
}

export function calculateWeeklyGoal(runs: RunRecord[], now = new Date()) {
  const weeklyRuns = runs.filter((run) => isInCurrentWeek(run.endedAt, now));
  const runCount = weeklyRuns.length;
  const distanceMeters = weeklyRuns.reduce((sum, run) => sum + run.distanceMeters, 0);
  const remainingRuns = Math.max(WEEKLY_RUN_GOAL - runCount, 0);
  const remainingDistanceMeters = Math.max(WEEKLY_DISTANCE_GOAL_METERS - distanceMeters, 0);
  const isRunGoalComplete = runCount >= WEEKLY_RUN_GOAL;
  const isDistanceGoalComplete = distanceMeters >= WEEKLY_DISTANCE_GOAL_METERS;
  const isComplete = isRunGoalComplete && isDistanceGoalComplete;

  let message = '주간 목표 달성!';

  if (!isComplete && remainingRuns > 0) {
    message = `이번 주 목표까지 ${remainingRuns}회 남았어요`;
  } else if (!isComplete && remainingDistanceMeters > 0) {
    message = `주간 10km까지 ${formatDistance(remainingDistanceMeters)} 남았어요`;
  }

  return {
    runGoal: WEEKLY_RUN_GOAL,
    distanceGoalMeters: WEEKLY_DISTANCE_GOAL_METERS,
    runCount,
    distanceMeters,
    remainingRuns,
    remainingDistanceMeters,
    isComplete,
    runCountLabel: `${Math.min(runCount, WEEKLY_RUN_GOAL)} / ${WEEKLY_RUN_GOAL}회 완료`,
    distanceLabel: `${(distanceMeters / 1000).toFixed(1)} / 10km 완료`,
    message,
    runProgress: Math.min(runCount / WEEKLY_RUN_GOAL, 1),
    distanceProgress: Math.min(distanceMeters / WEEKLY_DISTANCE_GOAL_METERS, 1),
    overallProgress: Math.min(
      (runCount / WEEKLY_RUN_GOAL + distanceMeters / WEEKLY_DISTANCE_GOAL_METERS) / 2,
      1
    )
  };
}
