import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { ProgressBar } from '@/components/ProgressBar';
import { localCourseRepository } from '@/features/courses/data/localCourseRepository';
import { Course } from '@/features/courses/domain/courseTypes';
import {
  formatDistance,
  formatElapsedTime,
  formatPace
} from '@/features/runs/domain/runCalculations';
import { calculateRunAchievement } from '@/features/runs/domain/runAchievements';
import { buildRunStats } from '@/features/runs/domain/runStats';
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
  const [allRuns, setAllRuns] = useState<RunRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseName, setCourseName] = useState('내 러닝 코스');
  const [isCourseNameVisible, setIsCourseNameVisible] = useState(false);
  const [isCourseSaved, setIsCourseSaved] = useState(false);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [courseSaveMessage, setCourseSaveMessage] = useState<string | null>(null);
  const [sourceCourse, setSourceCourse] = useState<Course | null>(null);
  const [hasSourceCourseLookupFinished, setHasSourceCourseLookupFinished] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([runRepository.findById(id), runRepository.findAll()]).then(([nextRun, nextRuns]) => {
      if (isMounted) {
        setRun(nextRun);
        setAllRuns(nextRuns);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!run) {
      return;
    }

    let isMounted = true;

    localCourseRepository.existsBySourceRunId(run.id).then((exists) => {
      if (isMounted) {
        setIsCourseSaved(exists);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [run]);

  useEffect(() => {
    if (!run?.sourceCourseId) {
      setSourceCourse(null);
      setHasSourceCourseLookupFinished(false);
      return;
    }

    let isMounted = true;

    setHasSourceCourseLookupFinished(false);
    localCourseRepository.findById(run.sourceCourseId).then((course) => {
      if (isMounted) {
        setSourceCourse(course);
        setHasSourceCourseLookupFinished(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [run]);

  const initialRegion = useMemo(() => getInitialRegion(run), [run]);
  const runResult = useMemo(() => {
    if (!run) {
      return null;
    }

    const previousRuns = allRuns.filter(
      (previousRun) =>
        previousRun.id !== run.id &&
        new Date(previousRun.endedAt).getTime() < new Date(run.endedAt).getTime()
    );
    const stats = buildRunStats(allRuns);

    return {
      achievement: calculateRunAchievement(run, previousRuns),
      stats
    };
  }, [allRuns, run]);

  const handleSaveCourse = async () => {
    if (!run || isCourseSaved || isSavingCourse) {
      return;
    }

    if (run.routeCoordinates.length < 2) {
      setCourseSaveMessage('경로가 충분히 기록된 러닝만 코스로 저장할 수 있어요.');
      return;
    }

    if (!isCourseNameVisible) {
      setIsCourseNameVisible(true);
      setCourseSaveMessage('코스 이름을 확인한 뒤 한 번 더 저장해 주세요.');
      return;
    }

    setIsSavingCourse(true);
    setCourseSaveMessage(null);

    try {
      await localCourseRepository.save({
        name: courseName.trim() || '내 러닝 코스',
        distanceMeters: run.distanceMeters,
        durationSeconds: run.durationSeconds,
        averagePaceSecondsPerKm: run.averagePaceSecondsPerKm,
        routeCoordinates: run.routeCoordinates,
        sourceRunId: run.id
      });

      setIsCourseSaved(true);
      setCourseSaveMessage('코스로 저장했어요. 코스 탭에서 다시 볼 수 있어요.');
    } catch {
      setCourseSaveMessage('코스를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSavingCourse(false);
    }
  };

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

  const canSaveCourse = run.routeCoordinates.length >= 2;
  const isCourseSaveDisabled = isCourseSaved || isSavingCourse || !canSaveCourse;

  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.eyebrow}>러닝 결과</Text>
        <Text style={commonStyles.screenTitle}>러닝 완료!</Text>
      </View>

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>성장 결과</Text>
            <Text style={styles.resultTitle}>+{runResult?.achievement.earnedHp ?? 0} HP</Text>
            <Text style={commonStyles.bodyText}>{runResult?.stats.currentTier ?? '브론즈 러너'}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="sparkles" size={24} color={colors.primary} />
          </View>
        </View>
        <View style={styles.resultMetricRow}>
          <View style={styles.resultMetric}>
            <Text style={commonStyles.cardLabel}>총 거리</Text>
            <Text style={styles.resultMetricValue}>{formatDistance(run.distanceMeters)}</Text>
          </View>
          <View style={styles.resultMetric}>
            <Text style={commonStyles.cardLabel}>총 시간</Text>
            <Text style={styles.resultMetricValue}>{formatElapsedTime(run.durationSeconds)}</Text>
          </View>
          <View style={styles.resultMetric}>
            <Text style={commonStyles.cardLabel}>평균 페이스</Text>
            <Text style={styles.resultMetricValue}>{formatPace(run.averagePaceSecondsPerKm)}</Text>
          </View>
        </View>
        <Text style={commonStyles.bodyText}>
          {runResult?.stats.nextTierMessage ?? '다음 티어까지 성장 기록을 쌓아보세요'}
        </Text>
        <ProgressBar progress={runResult?.stats.tierProgress ?? 0} />
      </View>

      {run.sourceCourseId ? (
        <View style={commonStyles.card}>
          <View style={commonStyles.rowBetween}>
            <View style={commonStyles.flex}>
              <Text style={commonStyles.cardLabel}>코스 러닝</Text>
              <Text style={commonStyles.cardTitle}>
                {sourceCourse ? '저장 코스로 달렸어요' : '저장 코스 기반 러닝 기록이에요'}
              </Text>
            </View>
            <View style={commonStyles.iconBadge}>
              <Ionicons name="map" size={24} color={colors.primary} />
            </View>
          </View>
          {sourceCourse ? (
            <>
              <Text style={commonStyles.bodyText}>{sourceCourse.name}</Text>
              <View style={styles.resultMetricRow}>
                <View style={styles.resultMetric}>
                  <Text style={commonStyles.cardLabel}>코스 거리</Text>
                  <Text style={styles.resultMetricValue}>{formatDistance(sourceCourse.distanceMeters)}</Text>
                </View>
                <View style={styles.resultMetric}>
                  <Text style={commonStyles.cardLabel}>이번 러닝 거리</Text>
                  <Text style={styles.resultMetricValue}>{formatDistance(run.distanceMeters)}</Text>
                </View>
                <View style={styles.resultMetric}>
                  <Text style={commonStyles.cardLabel}>평균 페이스</Text>
                  <Text style={styles.resultMetricValue}>{formatPace(run.averagePaceSecondsPerKm)}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={commonStyles.bodyText}>
              {hasSourceCourseLookupFinished
                ? '연결된 코스를 찾지 못했지만 러닝 기록은 정상적으로 저장됐어요.'
                : '저장 코스 정보를 불러오는 중이에요.'}
            </Text>
          )}
        </View>
      ) : null}

      <View style={commonStyles.card}>
        {runResult?.achievement.pbUpdates.length ? (
          <>
            <Text style={commonStyles.cardTitle}>개인 최고기록 갱신!</Text>
            {runResult.achievement.messages.map((message) => (
              <View key={message} style={styles.celebrationRow}>
                <Ionicons name="trophy" size={20} color={colors.accent} />
                <Text style={[commonStyles.bodyText, styles.celebrationText]}>{message}</Text>
              </View>
            ))}
            <Text style={commonStyles.metric}>+50 HP 보너스를 받았어요</Text>
          </>
        ) : (
          <>
            <Text style={commonStyles.cardTitle}>이번 러닝도 성장에 쌓였어요</Text>
            <Text style={commonStyles.bodyText}>꾸준한 완주가 다음 기록을 만드는 중이에요.</Text>
          </>
        )}
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>획득 HP 내역</Text>
        {runResult?.achievement.hpBreakdown.map((item) => (
          <View key={item.label} style={commonStyles.recordRow}>
            <Text style={commonStyles.bodyText}>{item.label}</Text>
            <Text style={commonStyles.recordValue}>+{item.hp} HP</Text>
          </View>
        ))}
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>티어 진행도</Text>
            <Text style={commonStyles.cardTitle}>{runResult?.stats.currentTier ?? '브론즈 러너'}</Text>
          </View>
          <Text style={commonStyles.metric}>{runResult?.stats.totalHp ?? 0} HP</Text>
        </View>
        <ProgressBar progress={runResult?.stats.tierProgress ?? 0} />
        <Text style={commonStyles.bodyText}>
          {runResult?.stats.nextTierMessage ?? '다음 티어까지 성장 기록을 쌓아보세요'}
        </Text>
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

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>코스 저장</Text>
            <Text style={commonStyles.cardTitle}>
              {isCourseSaved ? '저장된 코스' : '이 경로를 코스로 저장'}
            </Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="map" size={24} color={colors.primary} />
          </View>
        </View>
        <Text style={commonStyles.bodyText}>
          {canSaveCourse
            ? '마음에 드는 러닝 경로를 저장해두고 코스 탭에서 다시 확인할 수 있어요.'
            : '지도 경로가 충분히 기록되지 않아 코스로 저장할 수 없어요.'}
        </Text>
        {isCourseNameVisible && !isCourseSaved ? (
          <View style={styles.courseNameField}>
            <Text style={commonStyles.cardLabel}>코스 이름</Text>
            <TextInput
              style={styles.courseNameInput}
              value={courseName}
              onChangeText={setCourseName}
              placeholder="내 러닝 코스"
              placeholderTextColor={colors.muted}
              editable={!isSavingCourse}
            />
          </View>
        ) : null}
        {courseSaveMessage ? (
          <Text style={isCourseSaved ? styles.successText : styles.courseSaveMessage}>
            {courseSaveMessage}
          </Text>
        ) : null}
        <Pressable
          style={[
            commonStyles.primaryButton,
            isCourseSaveDisabled && styles.disabledButton
          ]}
          onPress={handleSaveCourse}
          disabled={isCourseSaveDisabled}
        >
          <Ionicons name={isCourseSaved ? 'checkmark' : 'bookmark'} size={20} color="white" />
          <Text style={commonStyles.primaryButtonText}>
            {isCourseSaved ? '저장된 코스' : isSavingCourse ? '저장 중' : '이 경로를 코스로 저장'}
          </Text>
        </Pressable>
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
  resultTitle: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '900'
  },
  resultMetricRow: {
    flexDirection: 'row',
    gap: 10
  },
  resultMetric: {
    flex: 1,
    gap: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt
  },
  resultMetricValue: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900'
  },
  celebrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  celebrationText: {
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
  },
  courseNameField: {
    gap: 8
  },
  courseNameInput: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    backgroundColor: colors.surfaceAlt
  },
  courseSaveMessage: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800'
  },
  successText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '900'
  },
  disabledButton: {
    opacity: 0.6
  }
});
