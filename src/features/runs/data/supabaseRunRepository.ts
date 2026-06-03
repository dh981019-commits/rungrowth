import { supabase } from '@/lib/supabase';

import { NewRunRecord, RunRecord } from '../domain/runTypes';
import { RunPersistenceService } from './runRepository';

export type SupabaseRunInsert = {
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  distance_meters: number;
  average_pace_seconds_per_km: number | null;
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

export const supabaseRunRepository: RunPersistenceService = {
  async save() {
    throw new Error('Supabase 러닝 저장은 아직 활성화되지 않았어요.');
  },

  async findById() {
    if (!supabase) {
      return null;
    }

    return null;
  },

  async findAll() {
    if (!supabase) {
      return [];
    }

    return [];
  }
};
