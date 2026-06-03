export type RunStatus = 'idle' | 'running' | 'paused' | 'saving' | 'finished';

export type RunCoordinate = {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  speed?: number | null;
  timestamp: string;
};

export type RunRecord = {
  id: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceMeters: number;
  averagePaceSecondsPerKm: number | null;
  routeCoordinates: RunCoordinate[];
  sourceCourseId?: string;
  note?: string;
};

export type NewRunRecord = Omit<RunRecord, 'id'>;
