export type RunStatus = 'idle' | 'running' | 'paused' | 'saving' | 'finished';

export type RunCoordinate = {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  timestamp: string;
};

export type RunRecord = {
  id: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceMeters: number;
  averagePaceSecondsPerKm: number;
  routeCoordinates: RunCoordinate[];
  note?: string;
};

export type NewRunRecord = Omit<RunRecord, 'id'>;
