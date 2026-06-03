import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router, useFocusEffect } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { ScreenHeader } from '@/components/ScreenHeader';
import { localCourseRepository } from '@/features/courses/data/localCourseRepository';
import { Course } from '@/features/courses/domain/courseTypes';
import {
  formatDistance,
  formatElapsedTime,
  formatPace
} from '@/features/runs/domain/runCalculations';
import { RunCoordinate } from '@/features/runs/domain/runTypes';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

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
  return (
    <Pressable
      style={commonStyles.card}
      onPress={() => router.push(`/course/${course.id}` as Href)}
    >
      <View style={commonStyles.rowBetween}>
        <View style={commonStyles.flex}>
          <Text style={commonStyles.cardTitle}>{course.name}</Text>
          <Text style={commonStyles.bodyText}>{formatSavedDate(course.createdAt)} 저장</Text>
        </View>
        <View style={commonStyles.iconBadge}>
          <Ionicons name="map" size={22} color={colors.primary} />
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

      <View style={commonStyles.metricRow}>
        <Text style={commonStyles.metric}>{formatDistance(course.distanceMeters)}</Text>
        <Text style={commonStyles.metric}>{formatElapsedTime(course.durationSeconds)}</Text>
        <Text style={commonStyles.metric}>{formatPace(course.averagePaceSecondsPerKm)}</Text>
      </View>
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
      contentContainerStyle={commonStyles.screen}
      ListHeaderComponent={<ScreenHeader eyebrow="코스" title="저장한 러닝 코스" />}
      ListEmptyComponent={
        <View style={commonStyles.card}>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="map-outline" size={24} color={colors.primary} />
          </View>
          <Text style={commonStyles.cardTitle}>아직 저장된 코스가 없어요</Text>
          <Text style={commonStyles.bodyText}>
            러닝 완료 후 마음에 드는 경로를 코스로 저장해보세요
          </Text>
        </View>
      }
      renderItem={({ item }) => <CoursePreview course={item} />}
    />
  );
}

const styles = StyleSheet.create({
  previewMapWrap: {
    height: 180,
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt
  },
  previewMap: {
    flex: 1
  }
});
