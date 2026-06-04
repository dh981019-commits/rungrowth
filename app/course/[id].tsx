import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';

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
import { hiTheme } from '@/theme/theme';

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(value));
}

function getInitialRegion(course: Course | null) {
  const firstCoordinate = course?.routeCoordinates[0];

  return {
    latitude: firstCoordinate?.latitude ?? 37.5665,
    longitude: firstCoordinate?.longitude ?? 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };
}

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    localCourseRepository.findById(id).then((nextCourse) => {
      if (isMounted) {
        setCourse(nextCourse);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const initialRegion = useMemo(() => getInitialRegion(course), [course]);

  if (isLoading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator color={hiTheme.colors.green} />
        <Text style={styles.body}>코스를 불러오는 중이에요</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerScreen}>
        <HiCharacter size="md" mood="sad" />
        <Text style={styles.cardTitle}>코스를 찾지 못했어요</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.kicker}>저장 코스</Text>
          <Text style={styles.title}>{course.name}</Text>
        </View>
        <HiCharacter size="sm" mood="run" />
      </View>

      <View style={styles.mapWrap}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {course.routeCoordinates.length > 0 ? (
            <Marker coordinate={course.routeCoordinates[0]} title="시작" />
          ) : null}
          {course.routeCoordinates.length > 1 ? (
            <>
              <Polyline coordinates={course.routeCoordinates} strokeColor={hiTheme.colors.green} strokeWidth={5} />
              <Marker coordinate={course.routeCoordinates[course.routeCoordinates.length - 1]} title="종료" />
            </>
          ) : null}
        </MapView>
      </View>

      <View style={styles.statGrid}>
        <HiStatCard label="거리" value={formatDistance(course.distanceMeters)} />
        <HiStatCard label="시간" value={formatElapsedTime(course.durationSeconds)} />
      </View>
      <HiStatCard label="평균 페이스" value={formatPace(course.averagePaceSecondsPerKm)} />

      <HiCard>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={20} color={hiTheme.colors.green} />
          <View>
            <Text style={styles.label}>저장일</Text>
            <Text style={styles.recordValue}>{formatSavedDate(course.createdAt)}</Text>
          </View>
        </View>
      </HiCard>

      <HiButton
        label="이 코스로 달리기"
        onPress={() =>
          router.push({
            pathname: '/run',
            params: {
              courseId: course.id
            }
          } as Href)
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 16,
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 34,
    backgroundColor: hiTheme.colors.background
  },
  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: hiTheme.colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  flex: {
    flex: 1
  },
  kicker: {
    color: hiTheme.colors.green,
    fontSize: 14,
    fontWeight: '900'
  },
  title: {
    color: hiTheme.colors.text,
    fontSize: 27,
    fontWeight: '900'
  },
  mapWrap: {
    height: 340,
    overflow: 'hidden',
    borderRadius: hiTheme.radius.lg,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  map: {
    flex: 1
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  label: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    fontWeight: '900'
  },
  cardTitle: {
    color: hiTheme.colors.text,
    fontSize: 20,
    fontWeight: '900'
  },
  body: {
    color: hiTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  recordValue: {
    color: hiTheme.colors.text,
    fontSize: 15,
    fontWeight: '900'
  }
});
