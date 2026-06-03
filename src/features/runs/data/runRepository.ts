import { buildRunAchievementMap } from '../domain/runAchievements';
import { NewRunRecord, RunRecord } from '../domain/runTypes';
import { localRunRepository } from './localRunRepository';
import { syncRunToSupabase } from './supabaseRunRepository';

export type RunPersistenceService = {
  save: (run: NewRunRecord) => Promise<RunRecord>;
  findById: (id: string) => Promise<RunRecord | null>;
  findAll: () => Promise<RunRecord[]>;
};

export const runRepository: RunPersistenceService = {
  async save(run) {
    const savedRun = await localRunRepository.save(run);
    const runs = await localRunRepository.findAll();
    const earnedHp = buildRunAchievementMap(runs).get(savedRun.id)?.earnedHp ?? 0;

    syncRunToSupabase(savedRun, earnedHp).catch((error) => {
      console.warn('Supabase 러닝 동기화에 실패했어요.', error);
    });

    return savedRun;
  },

  findById(id) {
    return localRunRepository.findById(id);
  },

  findAll() {
    return localRunRepository.findAll();
  }
};
