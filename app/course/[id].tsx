import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { localCourseRepository } from '@/features/courses/data/localCourseRepository';
import { Course } from '@/features/courses/domain/courseTypes';
import {
  formatDistance,
  formatElapsedTime,
  formatPace
} from '@/features/runs/domain/runCalculations';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

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
        <ActivityIndicator color={colors.primary} />
        <Text style={commonStyles.supportingText}>코스를 불러오는 중이에요</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerScreen}>
        <Ionicons name="alert-circle-outline" size={30} color={colors.primary} />
        <Text style={commonStyles.cardTitle}>코스를 찾지 못했어요</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.eyebrow}>저장 코스</Text>
        <Text style={commonStyles.screenTitle}>{course.name}</Text>
      </View>

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>코스 요약</Text>
            <Text style={commonStyles.cardTitle}>{formatDistance(course.distanceMeters)}</Text>
            <Text style={commonStyles.bodyText}>{formatSavedDate(course.createdAt)} 저장</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="map" size={24} color={colors.primary} />
          </View>
        </View>
        <View style={commonStyles.metricRow}>
          <Text style={commonStyles.metric}>{formatElapsedTime(course.durationSeconds)}</Text>
          <Text style={commonStyles.metric}>{formatPace(course.averagePaceSecondsPerKm)}</Text>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {course.routeCoordinates.length > 0 ? (
            <Marker coordinate={course.routeCoordinates[0]} title="시작" />
          ) : null}
          {course.routeCoordinates.length > 1 ? (
            <>
              <Polyline
                coordinates={course.routeCoordinates}
                strokeColor={colors.primary}
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

      <View style={commonStyles.card}>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>거리</Text>
          <Text style={commonStyles.recordValue}>{formatDistance(course.distanceMeters)}</Text>
        </View>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>시간</Text>
          <Text style={commonStyles.recordValue}>{formatElapsedTime(course.durationSeconds)}</Text>
        </View>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>평균 페이스</Text>
          <Text style={commonStyles.recordValue}>{formatPace(course.averagePaceSecondsPerKm)}</Text>
        </View>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>저장일</Text>
          <Text style={commonStyles.recordValue}>{formatSavedDate(course.createdAt)}</Text>
        </View>
      </View>

      <Pressable
        style={commonStyles.primaryButton}
        onPress={() =>
          router.push({
            pathname: '/run',
            params: {
              courseId: course.id
            }
          } as Href)
        }
      >
        <Ionicons name="play" size={20} color="white" />
        <Text style={commonStyles.primaryButtonText}>이 코스로 달리기</Text>
      </Pressable>
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
    height: 360,
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt
  },
  map: {
    flex: 1
  }
});
