import { RunRecord } from './runTypes';

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function shiftDate(date: Date, dayOffset: number) {
  const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  nextDate.setDate(nextDate.getDate() + dayOffset);
  return nextDate;
}

export function calculateRunStreak(runs: RunRecord[], now = new Date()) {
  const runDateKeys = new Set(runs.map((run) => getDateKey(new Date(run.endedAt))));
  const todayKey = getDateKey(now);
  const yesterdayKey = getDateKey(shiftDate(now, -1));

  if (!runDateKeys.has(todayKey) && !runDateKeys.has(yesterdayKey)) {
    return {
      currentStreak: 0,
      label: '0일 연속',
      message: runs.length ? '오늘도 달리면 연속 기록이 이어져요' : '첫 연속 러닝을 만들어보세요'
    };
  }

  let currentStreak = 0;
  let cursor = runDateKeys.has(todayKey) ? new Date(now) : shiftDate(now, -1);

  while (runDateKeys.has(getDateKey(cursor))) {
    currentStreak += 1;
    cursor = shiftDate(cursor, -1);
  }

  return {
    currentStreak,
    label: `${currentStreak}일 연속`,
    message:
      currentStreak > 0
        ? `${currentStreak}일 연속 러닝 중이에요`
        : '첫 연속 러닝을 만들어보세요'
  };
}
