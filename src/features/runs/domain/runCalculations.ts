import { RunCoordinate } from './runTypes';

const EARTH_RADIUS_METERS = 6371000;
const MIN_PACE_DISTANCE_METERS = 10;
const MIN_PACE_DURATION_SECONDS = 1;
const PACE_PENDING_LABEL = '측정 중';

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceMeters(from: RunCoordinate, to: RunCoordinate) {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(distanceMeters: number) {
  return `${(distanceMeters / 1000).toFixed(2)} km`;
}

export function formatElapsedTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}

export function formatPace(paceSecondsPerKm: number | null): string {
  if (paceSecondsPerKm === null || !Number.isFinite(paceSecondsPerKm) || paceSecondsPerKm <= 0) {
    return PACE_PENDING_LABEL;
  }

  const roundedPaceSeconds = Math.round(paceSecondsPerKm);
  const minutes = Math.floor(roundedPaceSeconds / 60);
  const seconds = roundedPaceSeconds % 60;

  return `${minutes}'${String(seconds).padStart(2, '0')}" /km`;
}

export function calculateAveragePace(durationSeconds: number, distanceMeters: number): number | null {
  const distanceKm = distanceMeters / 1000;

  if (
    !Number.isFinite(durationSeconds) ||
    !Number.isFinite(distanceMeters) ||
    !Number.isFinite(distanceKm) ||
    durationSeconds < MIN_PACE_DURATION_SECONDS ||
    distanceMeters < MIN_PACE_DISTANCE_METERS
  ) {
    return null;
  }

  const paceSecondsPerKm = durationSeconds / distanceKm;

  if (!Number.isFinite(paceSecondsPerKm)) {
    return null;
  }

  return Math.round(paceSecondsPerKm);
}
