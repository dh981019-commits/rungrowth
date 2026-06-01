import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';

import {
  formatDistance,
  formatElapsedTime,
  formatPace
} from '@/features/runs/domain/runCalculations';
import { RunRecord } from '@/features/runs/domain/runTypes';
import { runRepository } from '@/features/runs/data/runRepository';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function getInitialRegion(run: RunRecord | null) {
  const firstCoordinate = run?.routeCoordinates[0];

  return {
    latitude: firstCoordinate?.latitude ?? 37.5665,
    longitude: firstCoordinate?.longitude ?? 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };
}

export default function RunDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [run, setRun] = useState<RunRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    runRepository.findById(id).then((nextRun) => {
      if (isMounted) {
        setRun(nextRun);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const initialRegion = useMemo(() => getInitialRegion(run), [run]);

  if (isLoading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator color={colors.primary} />
        <Text style={commonStyles.supportingText}>러닝 기록을 불러오는 중이에요</Text>
      </View>
    );
  }

  if (!run) {
    return (
      <View style={styles.centerScreen}>
        <Ionicons name="alert-circle-outline" size={30} color={colors.primary} />
        <Text style={commonStyles.cardTitle}>기록을 찾지 못했어요</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.eyebrow}>러닝 기록</Text>
        <Text style={commonStyles.screenTitle}>기록 상세</Text>
      </View>

      <View style={styles.mapWrap}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {run.routeCoordinates.length > 0 ? (
            <Marker coordinate={run.routeCoordinates[0]} title="시작" />
          ) : null}
          {run.routeCoordinates.length > 1 ? (
            <>
              <Polyline coordinates={run.routeCoordinates} strokeColor={colors.primary} strokeWidth={5} />
              <Marker
                coordinate={run.routeCoordinates[run.routeCoordinates.length - 1]}
                title="종료"
              />
            </>
          ) : null}
        </MapView>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={commonStyles.cardLabel}>거리</Text>
          <Text style={styles.summaryValue}>{formatDistance(run.distanceMeters)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={commonStyles.cardLabel}>시간</Text>
          <Text style={styles.summaryValue}>{formatElapsedTime(run.durationSeconds)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={commonStyles.cardLabel}>평균 페이스</Text>
          <Text style={styles.summaryValue}>{formatPace(run.averagePaceSecondsPerKm)}</Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>시작 시간</Text>
          <Text style={commonStyles.recordValue}>{formatDateTime(run.startedAt)}</Text>
        </View>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>종료 시간</Text>
          <Text style={commonStyles.recordValue}>{formatDateTime(run.endedAt)}</Text>
        </View>
        {run.note ? (
          <View>
            <Text style={commonStyles.cardLabel}>메모</Text>
            <Text style={commonStyles.bodyText}>{run.note}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.background
  },
  mapWrap: {
    height: 320,
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt
  },
  map: {
    flex: 1
  },
  summaryGrid: {
    gap: 12
  },
  summaryCard: {
    gap: 4,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  summaryValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900'
  }
});
