import AsyncStorage from '@react-native-async-storage/async-storage';

import { NewRunRecord, RunRecord } from '../domain/runTypes';

const RUNS_STORAGE_KEY = 'runners-hi:runs';

export type RunPersistenceService = {
  save: (run: NewRunRecord) => Promise<RunRecord>;
  findById: (id: string) => Promise<RunRecord | null>;
};

export type SupabaseRunInsert = {
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  distance_meters: number;
  average_pace_seconds_per_km: number;
  route_coordinates: RunRecord['routeCoordinates'];
  note?: string | null;
};

export function toSupabaseRunInsert(run: NewRunRecord): SupabaseRunInsert {
  return {
    started_at: run.startedAt,
    ended_at: run.endedAt,
    duration_seconds: run.durationSeconds,
    distance_meters: run.distanceMeters,
    average_pace_seconds_per_km: run.averagePaceSecondsPerKm,
    route_coordinates: run.routeCoordinates,
    note: run.note ?? null
  };
}

function createLocalId() {
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readRuns() {
  const rawRuns = await AsyncStorage.getItem(RUNS_STORAGE_KEY);

  if (!rawRuns) {
    return [];
  }

  try {
    return JSON.parse(rawRuns) as RunRecord[];
  } catch {
    return [];
  }
}

async function writeRuns(runs: RunRecord[]) {
  await AsyncStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(runs));
}

export const localRunRepository: RunPersistenceService = {
  async save(run) {
    const runs = await readRuns();
    const savedRun = { ...run, id: createLocalId() };

    await writeRuns([savedRun, ...runs]);
    return savedRun;
  },

  async findById(id) {
    const runs = await readRuns();
    return runs.find((run) => run.id === id) ?? null;
  }
};

export const runRepository = localRunRepository;
