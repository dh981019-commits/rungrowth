import AsyncStorage from '@react-native-async-storage/async-storage';

import { NewRunRecord, RunRecord } from '../domain/runTypes';
import { RunPersistenceService } from './runRepository';

const RUNS_STORAGE_KEY = 'runners-hi:runs';

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
  async save(run: NewRunRecord) {
    const runs = await readRuns();
    const savedRun = { ...run, id: createLocalId() };

    await writeRuns([savedRun, ...runs]);
    return savedRun;
  },

  async findById(id: string) {
    const runs = await readRuns();
    return runs.find((run) => run.id === id) ?? null;
  },

  async findAll() {
    return readRuns();
  }
};
