import { calculateDistanceMeters } from './runCalculations';
import { RunCoordinate } from './runTypes';

const MAX_ACCEPTED_ACCURACY_METERS = 50;
const MIN_MOVEMENT_METERS = 5;
const MAX_JUMP_DISTANCE_METERS = 300;
const MAX_RUNNING_SPEED_METERS_PER_SECOND = 8;
const MIN_MOVING_SPEED_METERS_PER_SECOND = 0.5;

export type LocationFilterInput = {
  previousCoordinate?: RunCoordinate | null;
  nextCoordinate: RunCoordinate;
  distanceMeters?: number;
  elapsedSeconds?: number | null;
  accuracy?: number | null;
  speed?: number | null;
};

export type LocationFilterResult = {
  accepted: boolean;
  reason?: 'lowAccuracy' | 'tooClose' | 'gpsJump' | 'tooFast' | 'stationary';
};

function toFiniteNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function calculateElapsedSeconds(previousCoordinate: RunCoordinate, nextCoordinate: RunCoordinate) {
  const previousTime = new Date(previousCoordinate.timestamp).getTime();
  const nextTime = new Date(nextCoordinate.timestamp).getTime();
  const elapsedSeconds = (nextTime - previousTime) / 1000;

  return Number.isFinite(elapsedSeconds) && elapsedSeconds > 0 ? elapsedSeconds : null;
}

export function shouldAcceptLocationUpdate({
  previousCoordinate,
  nextCoordinate,
  distanceMeters,
  elapsedSeconds,
  accuracy,
  speed
}: LocationFilterInput): LocationFilterResult {
  const providedAccuracy = toFiniteNumber(accuracy);

  if (providedAccuracy !== null && providedAccuracy > MAX_ACCEPTED_ACCURACY_METERS) {
    return { accepted: false, reason: 'lowAccuracy' };
  }

  const providedSpeed = toFiniteNumber(speed);

  if (providedSpeed !== null && providedSpeed > MAX_RUNNING_SPEED_METERS_PER_SECOND) {
    return { accepted: false, reason: 'tooFast' };
  }

  if (providedSpeed !== null && providedSpeed < MIN_MOVING_SPEED_METERS_PER_SECOND) {
    return { accepted: false, reason: 'stationary' };
  }

  if (!previousCoordinate) {
    return { accepted: true };
  }

  const movementDistance =
    distanceMeters ?? calculateDistanceMeters(previousCoordinate, nextCoordinate);

  if (movementDistance < MIN_MOVEMENT_METERS) {
    return { accepted: false, reason: 'tooClose' };
  }

  if (movementDistance > MAX_JUMP_DISTANCE_METERS) {
    return { accepted: false, reason: 'gpsJump' };
  }

  const movementElapsedSeconds =
    elapsedSeconds ?? calculateElapsedSeconds(previousCoordinate, nextCoordinate);
  const calculatedSpeed =
    movementElapsedSeconds && movementElapsedSeconds > 0
      ? movementDistance / movementElapsedSeconds
      : null;
  const effectiveSpeed = providedSpeed ?? calculatedSpeed;

  if (effectiveSpeed !== null && effectiveSpeed > MAX_RUNNING_SPEED_METERS_PER_SECOND) {
    return { accepted: false, reason: 'tooFast' };
  }

  if (effectiveSpeed !== null && effectiveSpeed < MIN_MOVING_SPEED_METERS_PER_SECOND) {
    return { accepted: false, reason: 'stationary' };
  }

  return { accepted: true };
}
