import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

import {
  calculateAveragePace,
  calculateDistanceMeters
} from '../domain/runCalculations';
import { RunCoordinate, RunStatus } from '../domain/runTypes';
import { runRepository } from '../data/runRepository';

function toRunCoordinate(location: Location.LocationObject): RunCoordinate {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    altitude: location.coords.altitude,
    accuracy: location.coords.accuracy,
    timestamp: new Date(location.timestamp).toISOString()
  };
}

export function useRunTracker() {
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [status, setStatus] = useState<RunStatus>('idle');
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<RunCoordinate[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const elapsedSecondsRef = useRef(0);
  const distanceMetersRef = useRef(0);
  const routeCoordinatesRef = useRef<RunCoordinate[]>([]);
  const lastTickRef = useRef<number | null>(null);

  const stopWatching = useCallback(() => {
    watchRef.current?.remove();
    watchRef.current = null;
  }, []);

  const startWatching = useCallback(async () => {
    stopWatching();

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 3000
      },
      (location) => {
        const nextCoordinate = toRunCoordinate(location);
        const previousCoordinate = routeCoordinatesRef.current.at(-1);
        const nextRoute = [...routeCoordinatesRef.current, nextCoordinate];
        let nextDistance = distanceMetersRef.current;

        if (previousCoordinate) {
          nextDistance += calculateDistanceMeters(previousCoordinate, nextCoordinate);
        }

        routeCoordinatesRef.current = nextRoute;
        distanceMetersRef.current = nextDistance;
        setRouteCoordinates(nextRoute);
        setDistanceMeters(nextDistance);
      }
    );
  }, [stopWatching]);

  const startRun = useCallback(async () => {
    setErrorMessage(null);
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== Location.PermissionStatus.GRANTED) {
      setPermissionDenied(true);
      return;
    }

    const now = new Date();
    startedAtRef.current = now;
    elapsedSecondsRef.current = 0;
    distanceMetersRef.current = 0;
    routeCoordinatesRef.current = [];
    lastTickRef.current = Date.now();

    setStartedAt(now);
    setElapsedSeconds(0);
    setDistanceMeters(0);
    setRouteCoordinates([]);
    setPermissionDenied(false);
    setStatus('running');
    await startWatching();
  }, [startWatching]);

  const pauseRun = useCallback(() => {
    if (status !== 'running') {
      return;
    }

    setStatus('paused');
    lastTickRef.current = null;
    stopWatching();
  }, [status, stopWatching]);

  const resumeRun = useCallback(async () => {
    if (status !== 'paused') {
      return;
    }

    setStatus('running');
    lastTickRef.current = Date.now();
    await startWatching();
  }, [startWatching, status]);

  const finishRun = useCallback(
    async (note?: string) => {
      if (!startedAtRef.current || status === 'saving') {
        return null;
      }

      stopWatching();
      setStatus('saving');

      const endedAt = new Date();
      const durationSeconds = elapsedSecondsRef.current;
      const distance = Math.round(distanceMetersRef.current);

      const savedRun = await runRepository.save({
        startedAt: startedAtRef.current.toISOString(),
        endedAt: endedAt.toISOString(),
        durationSeconds,
        distanceMeters: distance,
        averagePaceSecondsPerKm: calculateAveragePace(durationSeconds, distance),
        routeCoordinates: routeCoordinatesRef.current,
        note: note?.trim() || undefined
      });

      setStatus('finished');
      return savedRun;
    },
    [status, stopWatching]
  );

  useEffect(() => {
    if (status !== 'running') {
      return undefined;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const lastTick = lastTickRef.current ?? now;
      const deltaSeconds = Math.floor((now - lastTick) / 1000);

      if (deltaSeconds > 0) {
        const nextElapsed = elapsedSecondsRef.current + deltaSeconds;
        elapsedSecondsRef.current = nextElapsed;
        lastTickRef.current = now;
        setElapsedSeconds(nextElapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => stopWatching, [stopWatching]);

  return {
    permissionDenied,
    status,
    startedAt,
    elapsedSeconds,
    distanceMeters,
    averagePaceSecondsPerKm: calculateAveragePace(elapsedSeconds, distanceMeters),
    routeCoordinates,
    errorMessage,
    startRun,
    pauseRun,
    resumeRun,
    finishRun,
    setErrorMessage
  };
}
