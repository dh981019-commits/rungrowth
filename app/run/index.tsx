import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { type Href, router, useLocalSearchParams } from 'expo-router';

import { HiButton } from '@/components/HiButton';
import { HiCard } from '@/components/HiCard';
import { HiCharacter } from '@/components/HiCharacter';
import { HiStatCard } from '@/components/HiStatCard';
import { localCourseRepository } from '@/features/courses/data/localCourseRepository';
import { Course } from '@/features/courses/domain/courseTypes';
import {
  formatDistance,
  formatElapsedTime,
  formatPace
} from '@/features/runs/domain/runCalculations';
import { RunCoordinate } from '@/features/runs/domain/runTypes';
import { useRunTracker } from '@/features/runs/presentation/useRunTracker';
import { hiTheme } from '@/theme/theme';

const fallbackRegion = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01
};

function getMapRegion(routeCoordinates: RunCoordinate[]) {
  const currentCoordinate = routeCoordinates.at(-1);

  if (!currentCoordinate) {
    return fallbackRegion;
  }

  return {
    latitude: currentCoordinate.latitude,
    longitude: currentCoordinate.longitude,
    latitudeDelta: 0.006,
    longitudeDelta: 0.006
  };
}

function getCourseMapRegion(course: Course | null) {
  const firstCoordinate = course?.routeCoordinates[0];

  if (!firstCoordinate) {
    return fallbackRegion;
  }

  return {
    latitude: firstCoordinate.latitude,
    longitude: firstCoordinate.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };
}

function estimateCalories(distanceMeters: number) {
  return Math.max(0, Math.round((distanceMeters / 1000) * 68));
}

export default function RunTrackingScreen() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseLoading, setIsCourseLoading] = useState(Boolean(courseId));
  const hasRequestedStartRef = useRef(false);
  const {
    permissionDenied,
    status,
    elapsedSeconds,
    distanceMeters,
    averagePaceSecondsPerKm,
    routeCoordinates,
    errorMessage,
    gpsSignalMessage,
    activeSourceCourseId,
    startRun,
    pauseRun,
    resumeRun,
    finishRun,
    setErrorMessage
  } = useRunTracker();

  const effectiveCourseId = courseId ?? activeSourceCourseId ?? undefined;

  const mapRegion = useMemo(
    () => (routeCoordinates.length > 0 ? getMapRegion(routeCoordinates) : getCourseMapRegion(selectedCourse)),
    [routeCoordinates, selectedCourse]
  );
  const calories = estimateCalories(distanceMeters);
  const isSavingRun = status === 'saving';

  useEffect(() => {
    if (!effectiveCourseId) {
      setSelectedCourse(null);
      setIsCourseLoading(false);
      return;
    }

    let isMounted = true;

    setIsCourseLoading(true);
    localCourseRepository.findById(effectiveCourseId).then((course) => {
      if (isMounted) {
        setSelectedCourse(course);
        setIsCourseLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [effectiveCourseId]);

  useEffect(() => {
    if (status === 'running' || status === 'paused' || status === 'saving') {
      return;
    }

    if (hasRequestedStartRef.current) {
      return;
    }

    if (effectiveCourseId && isCourseLoading) {
      return;
    }

    hasRequestedStartRef.current = true;
    startRun(selectedCourse?.id).catch(() => {
      setErrorMessage('GPS를 시작하지 못했어요. 잠시 후 다시 시도해 주세요.');
    });
  }, [effectiveCourseId, isCourseLoading, selectedCourse, setErrorMessage, startRun, status]);

  const handleFinish = async () => {
    const savedRun = await finishRun(undefined, selectedCourse?.id);

    if (savedRun) {
      router.replace(`/run/${savedRun.id}` as Href);
    }
  };

  if (permissionDenied) {
    return (
      <View style={styles.permissionScreen}>
        <HiCharacter size="md" mood="sleep" />
        <Text style={styles.title}>GPS 권한이 필요해요</Text>
        <Text style={styles.body}>러닝 거리와 경로를 자동으로 기록하려면 위치 권한을 허용해 주세요.</Text>
        <HiButton label="권한 다시 요청" onPress={startRun} />
      </View>
    );
  }

  const isPaused = status === 'paused';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.topRow}>
          <Text style={styles.gpsText}>
            GPS <Ionicons name="cellular" size={16} color={hiTheme.colors.green} />
          </Text>
        </View>

        {effectiveCourseId ? (
          <HiCard tone={selectedCourse ? 'green' : 'default'} style={styles.courseCard}>
            <Text style={styles.label}>선택한 코스</Text>
            <Text style={styles.cardTitle}>
              {selectedCourse?.name ?? (isCourseLoading ? '코스를 불러오는 중이에요' : '코스를 찾지 못했어요')}
            </Text>
            <Text style={styles.body}>
              {selectedCourse
                ? '저장된 코스를 따라 달리는 중이에요'
                : '저장된 코스를 불러오지 못해 일반 러닝으로 기록해요.'}
            </Text>
          </HiCard>
        ) : null}

        <View style={styles.timerBlock}>
          <Text style={styles.modeText}>{isPaused ? '일시정지' : '러닝 중'}</Text>
          <Text style={styles.timer}>{formatElapsedTime(elapsedSeconds)}</Text>
        </View>

        <View style={styles.statsGrid}>
          <HiStatCard label="거리(km)" value={formatDistance(distanceMeters).replace(' km', '')} />
          <HiStatCard label="평균 페이스" value={formatPace(averagePaceSecondsPerKm)} />
          <HiStatCard label="칼로리(kcal)" value={`${calories}`} />
        </View>

        <View style={styles.mapWrap}>
          <MapView style={styles.map} region={mapRegion} showsUserLocation>
            {selectedCourse?.routeCoordinates.length ? (
              <Marker coordinate={selectedCourse.routeCoordinates[0]} title="코스 시작" />
            ) : null}
            {selectedCourse && selectedCourse.routeCoordinates.length > 1 ? (
              <>
                <Polyline
                  coordinates={selectedCourse.routeCoordinates}
                  strokeColor="#9aa3a0"
                  strokeWidth={4}
                />
                <Marker
                  coordinate={selectedCourse.routeCoordinates[selectedCourse.routeCoordinates.length - 1]}
                  title="코스 종료"
                />
              </>
            ) : null}
            {routeCoordinates.length > 0 ? (
              <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="현재 위치" />
            ) : null}
            {routeCoordinates.length > 1 ? (
              <Polyline coordinates={routeCoordinates} strokeColor={hiTheme.colors.green} strokeWidth={5} />
            ) : null}
          </MapView>
          {routeCoordinates.length === 0 ? (
            <View style={styles.mapHint}>
              <ActivityIndicator color={hiTheme.colors.green} />
              <Text style={styles.helper}>GPS 신호를 찾는 중이에요</Text>
            </View>
          ) : null}
        </View>

        {gpsSignalMessage ? (
          <View style={styles.notice}>
            <Ionicons name="warning-outline" size={18} color={hiTheme.colors.greenDark} />
            <Text style={styles.noticeText}>{gpsSignalMessage}</Text>
          </View>
        ) : null}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {isPaused ? (
          <HiCard style={styles.pausePanel}>
            <HiCharacter size="sm" mood="sleep" />
            <Text style={styles.cardTitle}>잠깐 쉬어가요</Text>
            <HiButton label="계속하기" onPress={resumeRun} />
            <HiButton label="종료하기" variant="danger" onPress={handleFinish} disabled={isSavingRun} />
            <HiButton label="홈으로" variant="ghost" onPress={() => router.replace('/' as Href)} />
          </HiCard>
        ) : (
          <View style={styles.controlRow}>
            <Pressable style={styles.pauseButton} onPress={pauseRun}>
              <Ionicons name="pause" size={32} color="#ffffff" />
            </Pressable>
            <Pressable style={styles.sideButton} onPress={handleFinish} disabled={status === 'saving'}>
              <Ionicons name="stop" size={22} color={hiTheme.colors.text} />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: hiTheme.colors.background
  },
  screen: {
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 44,
    backgroundColor: hiTheme.colors.background
  },
  permissionScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
    backgroundColor: hiTheme.colors.background
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  gpsText: {
    color: hiTheme.colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  title: {
    color: hiTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center'
  },
  modeText: {
    color: hiTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center'
  },
  timerBlock: {
    gap: 2,
    alignItems: 'center'
  },
  timer: {
    color: hiTheme.colors.text,
    fontSize: 52,
    fontWeight: '900'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10
  },
  mapWrap: {
    height: 300,
    overflow: 'hidden',
    borderRadius: hiTheme.radius.lg,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  map: {
    flex: 1
  },
  mapHint: {
    position: 'absolute',
    right: 16,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: hiTheme.radius.md,
    backgroundColor: hiTheme.colors.surface
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: hiTheme.radius.md,
    backgroundColor: hiTheme.colors.greenSoft
  },
  noticeText: {
    flex: 1,
    color: hiTheme.colors.greenDark,
    fontSize: 14,
    fontWeight: '800'
  },
  label: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    fontWeight: '900'
  },
  cardTitle: {
    color: hiTheme.colors.text,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center'
  },
  body: {
    color: hiTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center'
  },
  helper: {
    color: hiTheme.colors.muted,
    fontSize: 13,
    fontWeight: '800'
  },
  errorText: {
    color: hiTheme.colors.red,
    fontSize: 14,
    fontWeight: '800'
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 4
  },
  sideButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hiTheme.radius.pill,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surface
  },
  pauseButton: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hiTheme.radius.pill,
    backgroundColor: hiTheme.colors.green
  },
  pausePanel: {
    alignItems: 'center'
  },
  courseCard: {
    paddingVertical: 12
  }
});
