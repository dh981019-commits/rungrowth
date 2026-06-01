import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { runRepository } from '../data/runRepository';
import { buildRunStats, RunStats } from '../domain/runStats';

export function useRunStats() {
  const [stats, setStats] = useState<RunStats>(() => buildRunStats([]));
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      runRepository.findAll().then((runs) => {
        if (isMounted) {
          setStats(buildRunStats(runs));
          setIsLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return { stats, isLoading };
}
