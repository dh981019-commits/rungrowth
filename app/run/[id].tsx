import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { HiButton } from '@/components/HiButton';
import { HiCard } from '@/components/HiCard';
import { HiCharacter } from '@/components/HiCharacter';
import { HiProgressBar } from '@/components/HiProgressBar';
import { HiStatCard } from '@/components/HiStatCard';
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
import { hiTheme } from '@/theme/theme';

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
        <ActivityIndicator color={hiTheme.colors.green} />
        <Text style={styles.body}>러닝 기록을 불러오는 중이에요</Text>
      </View>
    );
  }

  if (!run) {
    return (
      <View style={styles.centerScreen}>
        <Ionicons name="alert-circle-outline" size={30} color={hiTheme.colors.green} />
        <Text style={styles.cardTitle}>기록을 찾지 못했어요</Text>
      </View>
    );
  }

  const canSaveCourse = run.routeCoordinates.length >= 2;
  const isCourseSaveDisabled = isCourseSaved || isSavingCourse || !canSaveCourse;
  const achievedBadges = runResult?.stats.badges.filter((badge) => badge.achieved).slice(0, 3) ?? [];

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>러닝 완료!</Text>
          <Text style={styles.title}>정말 잘했어요!</Text>
        </View>
        <HiCharacter size="sm" mood="champion" />
      </View>

      <View style={styles.statsGrid}>
        <HiStatCard label="거리" value={formatDistance(run.distanceMeters)} />
        <HiStatCard label="시간" value={formatElapsedTime(run.durationSeconds)} />
        <HiStatCard label="평균 페이스" value={formatPace(run.averagePaceSecondsPerKm)} />
      </View>

      <View style={styles.mapWrap}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {run.routeCoordinates.length > 0 ? (
            <Marker coordinate={run.routeCoordinates[0]} title="시작" />
          ) : null}
          {run.routeCoordinates.length > 1 ? (
            <>
              <Polyline coordinates={run.routeCoordinates} strokeColor={hiTheme.colors.green} strokeWidth={5} />
              <Marker coordinate={run.routeCoordinates[run.routeCoordinates.length - 1]} title="종료" />
            </>
          ) : null}
        </MapView>
      </View>

      <HiCard tone="green">
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>획득 Hi Point</Text>
            <Text style={styles.hp}>+{runResult?.achievement.earnedHp ?? 0} HP</Text>
          </View>
          <View style={styles.medal}>
            <Ionicons name="sparkles" size={26} color={hiTheme.colors.yellow} />
          </View>
        </View>
        <Text style={styles.body}>{runResult?.stats.currentTier ?? '브론즈 러너'}</Text>
        <HiProgressBar progress={runResult?.stats.tierProgress ?? 0} />
        <Text style={styles.helper}>{runResult?.stats.nextTierMessage ?? '다음 티어까지 성장 기록을 쌓아보세요'}</Text>
      </HiCard>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>연속 러닝</Text>
            <Text style={styles.cardTitle}>{runResult?.stats.streak.label ?? '첫 연속 러닝'}</Text>
          </View>
          <Ionicons name="flame" size={26} color={hiTheme.colors.green} />
        </View>
        <Text style={styles.body}>{runResult?.stats.streak.message ?? '오늘의 러닝이 성장에 쌓였어요.'}</Text>
      </HiCard>

      <HiCard>
        {runResult?.achievement.pbUpdates.length ? (
          <>
            <Text style={styles.cardTitle}>개인 최고기록 갱신!</Text>
            {runResult.achievement.messages.map((message) => (
              <View key={message} style={styles.iconRow}>
                <Ionicons name="trophy" size={20} color={hiTheme.colors.yellow} />
                <Text style={styles.body}>{message}</Text>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>이번 러닝도 성장에 쌓였어요</Text>
            <Text style={styles.body}>꾸준한 완주가 다음 기록을 만드는 중이에요.</Text>
          </>
        )}
      </HiCard>

      {achievedBadges.length ? (
        <HiCard style={styles.compactCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>획득 배지</Text>
              <Text style={styles.cardTitle}>{achievedBadges[0].title}</Text>
            </View>
            <Ionicons name="medal" size={26} color={hiTheme.colors.yellow} />
          </View>
          <View style={styles.badgeRow}>
            {achievedBadges.map((badge) => (
              <View key={badge.key} style={styles.badgePill}>
                <Text style={styles.badgePillText}>{badge.title}</Text>
              </View>
            ))}
          </View>
        </HiCard>
      ) : null}

      <HiCard tone="green" style={styles.courseCtaCard}>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <Text style={styles.label}>코스 저장</Text>
            <Text style={styles.cardTitle}>{isCourseSaved ? '저장된 코스예요' : '마음에 든 경로를 남겨요'}</Text>
            <Text style={styles.body}>
              {canSaveCourse
                ? '이 경로를 코스로 저장하면 다음에 바로 다시 달릴 수 있어요.'
                : '지도 경로가 충분히 기록되지 않아 코스로 저장할 수 없어요.'}
            </Text>
          </View>
          <HiCharacter size="sm" mood="happy" />
        </View>
        {isCourseNameVisible && !isCourseSaved ? (
          <View style={styles.courseNameField}>
            <Text style={styles.label}>코스 이름</Text>
            <TextInput
              style={styles.courseNameInput}
              value={courseName}
              onChangeText={setCourseName}
              editable={!isSavingCourse}
            />
          </View>
        ) : null}
        {courseSaveMessage ? <Text style={styles.helper}>{courseSaveMessage}</Text> : null}
        <HiButton
          label={isCourseSaved ? '저장된 코스' : isSavingCourse ? '저장 중' : '이 경로를 코스로 저장'}
          onPress={handleSaveCourse}
          disabled={isCourseSaveDisabled}
        />
      </HiCard>

      {run.sourceCourseId ? (
        <HiCard>
          <Text style={styles.label}>코스 러닝</Text>
          <Text style={styles.cardTitle}>
            {sourceCourse ? '저장 코스로 달렸어요' : '저장 코스 기반 러닝 기록이에요'}
          </Text>
          {sourceCourse ? (
            <View style={styles.statsGrid}>
              <HiStatCard label="코스 거리" value={formatDistance(sourceCourse.distanceMeters)} />
              <HiStatCard label="이번 거리" value={formatDistance(run.distanceMeters)} />
            </View>
          ) : (
            <Text style={styles.body}>
              {hasSourceCourseLookupFinished
                ? '연결된 코스를 찾지 못했지만 러닝 기록은 정상적으로 저장됐어요.'
                : '저장 코스 정보를 불러오는 중이에요.'}
            </Text>
          )}
        </HiCard>
      ) : null}

      <HiCard>
        <View style={styles.recordRow}>
          <Text style={styles.body}>시작 시간</Text>
          <Text style={styles.recordValue}>{formatDateTime(run.startedAt)}</Text>
        </View>
        <View style={styles.recordRow}>
          <Text style={styles.body}>종료 시간</Text>
          <Text style={styles.recordValue}>{formatDateTime(run.endedAt)}</Text>
        </View>
        {run.note ? (
          <View>
            <Text style={styles.label}>메모</Text>
            <Text style={styles.body}>{run.note}</Text>
          </View>
        ) : null}
      </HiCard>

      <HiButton label="확인" onPress={() => router.replace('/' as Href)} />
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
    justifyContent: 'space-between'
  },
  kicker: {
    color: hiTheme.colors.text,
    fontSize: 16,
    fontWeight: '900'
  },
  title: {
    color: hiTheme.colors.text,
    fontSize: 28,
    fontWeight: '900'
  },
  mapWrap: {
    height: 210,
    overflow: 'hidden',
    borderRadius: hiTheme.radius.lg,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  map: {
    flex: 1
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14
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
  hp: {
    color: hiTheme.colors.green,
    fontSize: 32,
    fontWeight: '900'
  },
  body: {
    color: hiTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  helper: {
    color: hiTheme.colors.greenDark,
    fontSize: 13,
    fontWeight: '800'
  },
  medal: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#fff7d6'
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  compactCard: {
    paddingVertical: 14
  },
  courseCtaCard: {
    gap: 12
  },
  flex: {
    flex: 1
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: hiTheme.radius.pill,
    backgroundColor: hiTheme.colors.surface
  },
  badgePillText: {
    color: hiTheme.colors.greenDark,
    fontSize: 12,
    fontWeight: '900'
  },
  courseNameField: {
    gap: 8
  },
  courseNameInput: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: hiTheme.radius.md,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    color: hiTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  recordRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  recordValue: {
    color: hiTheme.colors.text,
    fontSize: 14,
    fontWeight: '900'
  }
});
