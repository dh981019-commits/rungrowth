import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router, useFocusEffect } from 'expo-router';
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
import { RunCoordinate } from '@/features/runs/domain/runTypes';
import { hiTheme } from '@/theme/theme';

function formatSavedDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric'
  }).format(new Date(value));
}

function getMapRegion(routeCoordinates: RunCoordinate[]) {
  const firstCoordinate = routeCoordinates[0];

  return {
    latitude: firstCoordinate?.latitude ?? 37.5665,
    longitude: firstCoordinate?.longitude ?? 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };
}

function CoursePreview({ course }: { course: Course }) {
  const openDetail = () => router.push(`/course/${course.id}` as Href);
  const startCourseRun = () => router.push({ pathname: '/run', params: { courseId: course.id } });

  return (
    <Pressable onPress={openDetail}>
      <HiCard style={styles.courseCard}>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{course.name}</Text>
            <Text style={styles.body}>{formatSavedDate(course.createdAt)} 저장</Text>
          </View>
          <View style={styles.mapBadge}>
            <Ionicons name="map" size={22} color={hiTheme.colors.green} />
          </View>
        </View>

        <View style={styles.previewMapWrap}>
          <MapView
            style={styles.previewMap}
            initialRegion={getMapRegion(course.routeCoordinates)}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {course.routeCoordinates.length > 0 ? (
              <Marker coordinate={course.routeCoordinates[0]} title="시작" />
            ) : null}
            {course.routeCoordinates.length > 1 ? (
              <>
                <Polyline
                  coordinates={course.routeCoordinates}
                  strokeColor={hiTheme.colors.green}
                  strokeWidth={5}
                />
                <Marker
                  coordinate={course.routeCoordinates[course.routeCoordinates.length - 1]}
                  title="종료"
                />
              </>
            ) : null}
          </MapView>
        </View>

        <View style={styles.statGrid}>
          <HiStatCard label="거리" value={formatDistance(course.distanceMeters)} />
          <HiStatCard label="시간" value={formatElapsedTime(course.durationSeconds)} />
          <HiStatCard label="평균 페이스" value={formatPace(course.averagePaceSecondsPerKm)} />
        </View>

        <HiButton
          label="다시 달리기"
          variant="secondary"
          onPress={startCourseRun}
          style={styles.courseButton}
        />
      </HiCard>
    </Pressable>
  );
}

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      localCourseRepository.findAll().then((nextCourses) => {
        if (isMounted) {
          setCourses(nextCourses);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.screen}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>코스</Text>
            <Text style={styles.title}>내 코스</Text>
            <Text style={styles.body}>마음에 드는 러닝 경로를 다시 달려보세요</Text>
          </View>
          <HiCharacter size="sm" mood="run" />
        </View>
      }
      ListEmptyComponent={
        <HiCard style={styles.empty}>
          <HiCharacter size="md" mood="sad" />
          <Text style={styles.cardTitle}>아직 저장한 코스가 없어요</Text>
          <Text style={styles.emptyBody}>러닝 완료 후 이 경로를 코스로 저장할 수 있어요</Text>
          <HiButton label="러닝 시작하기" onPress={() => router.push('/run' as Href)} />
        </HiCard>
      }
      renderItem={({ item }) => <CoursePreview course={item} />}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 34,
    backgroundColor: hiTheme.colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 4
  },
  headerText: {
    flex: 1
  },
  kicker: {
    color: hiTheme.colors.green,
    fontSize: 14,
    fontWeight: '900'
  },
  title: {
    color: hiTheme.colors.text,
    fontSize: 28,
    fontWeight: '900'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  flex: {
    flex: 1
  },
  cardTitle: {
    color: hiTheme.colors.text,
    fontSize: 19,
    fontWeight: '900'
  },
  body: {
    color: hiTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  emptyBody: {
    color: hiTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center'
  },
  courseCard: {
    gap: 12,
    paddingVertical: 14
  },
  mapBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: hiTheme.colors.greenSoft
  },
  previewMapWrap: {
    height: 152,
    overflow: 'hidden',
    borderRadius: hiTheme.radius.lg,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  previewMap: {
    flex: 1
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10
  },
  courseButton: {
    minHeight: 48
  },
  empty: {
    alignItems: 'center'
  }
});
