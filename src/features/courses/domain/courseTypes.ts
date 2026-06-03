import { RunCoordinate } from '@/features/runs/domain/runTypes';

export type Course = {
  id: string;
  name: string;
  distanceMeters: number;
  durationSeconds: number;
  averagePaceSecondsPerKm: number | null;
  routeCoordinates: RunCoordinate[];
  sourceRunId: string;
  createdAt: string;
};

export type CourseInput = Omit<Course, 'id' | 'createdAt'>;
