import { NewRunRecord, RunRecord } from '../domain/runTypes';
import { localRunRepository } from './localRunRepository';

export type RunPersistenceService = {
  save: (run: NewRunRecord) => Promise<RunRecord>;
  findById: (id: string) => Promise<RunRecord | null>;
  findAll: () => Promise<RunRecord[]>;
};

export const runRepository = localRunRepository;
