import { supabase } from '@/lib/supabase';

import { NewRunRecord, RunCoordinate, RunRecord } from '../domain/runTypes';
import { RunPersistenceService } from './runRepository';

export type SupabaseRunInsert = {
  id: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  distance_meters: number;
  average_pace_seconds_per_km: number | null;
  earned_hp: number;
  note?: string | null;
};

export type SupabaseRunPointInsert = {
  run_id: string;
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  speed?: number | null;
  recorded_at: string;
  sequence: number;
};

export function toSupabaseRunInsert(run: RunRecord, earnedHp = 0): SupabaseRunInsert {
  return {
    id: run.id,
    started_at: run.startedAt,
    ended_at: run.endedAt,
    duration_seconds: run.durationSeconds,
    distance_meters: run.distanceMeters,
    average_pace_seconds_per_km: run.averagePaceSecondsPerKm,
    earned_hp: earnedHp,
    note: run.note ?? null
  };
}

export function toSupabaseRunPointInserts(
  runId: string,
  routeCoordinates: RunCoordinate[]
): SupabaseRunPointInsert[] {
  return routeCoordinates.map((coordinate, index) => ({
    run_id: runId,
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    altitude: coordinate.altitude ?? null,
    accuracy: coordinate.accuracy ?? null,
    speed: coordinate.speed ?? null,
    recorded_at: coordinate.timestamp,
    sequence: index
  }));
}

export const supabaseRunRepository: RunPersistenceService = {
  async save(run: NewRunRecord) {
    throw new Error('Supabase 저장은 로컬 저장 이후 저장된 러닝 ID가 필요해요.');
  },

  async findById(id: string) {
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

export async function syncRunToSupabase(run: RunRecord, earnedHp = 0) {
  if (!supabase) {
    return;
  }

  const { error: runError } = await supabase.from('runs').insert(toSupabaseRunInsert(run, earnedHp));

  if (runError) {
    throw runError;
  }

  const runPoints = toSupabaseRunPointInserts(run.id, run.routeCoordinates);

  if (runPoints.length === 0) {
    return;
  }

  const { error: pointsError } = await supabase.from('run_points').insert(runPoints);

  if (pointsError) {
    throw pointsError;
  }
}
