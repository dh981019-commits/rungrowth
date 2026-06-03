import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router, useFocusEffect } from 'expo-router';

import { HiCard } from '@/components/HiCard';
import { HiButton } from '@/components/HiButton';
import { HiCharacter } from '@/components/HiCharacter';
import { HiProgressBar } from '@/components/HiProgressBar';
import { HiStatCard } from '@/components/HiStatCard';
import { localCourseRepository } from '@/features/courses/data/localCourseRepository';
import { Course } from '@/features/courses/domain/courseTypes';
import { formatDistance, formatElapsedTime, formatPace } from '@/features/runs/domain/runCalculations';
import { useRunStats } from '@/features/runs/presentation/useRunStats';
import { useRunTracker } from '@/features/runs/presentation/useRunTracker';
import { hiTheme } from '@/theme/theme';

export default function HomeScreen() {
  const { stats } = useRunStats();
  const {
    status,
    elapsedSeconds,
    distanceMeters,
    averagePaceSecondsPerKm,
    routeCoordinates,
    finishRun
  } = useRunTracker();
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const recentRun = stats.recentRuns[0] ?? null;
  const recentBadges = stats.badges.filter((badge) => badge.achieved).slice(0, 3);
  const hasActiveRun = status === 'running' || status === 'paused';

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      localCourseRepository.findAll().then((courses) => {
        if (isMounted) {
          setRecentCourses(courses.slice(0, 3));
        }
      });

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const goToRunScreen = () => {
    router.push('/run' as Href);
  };

  const confirmFinishRun = () => {
    Alert.alert('러닝을 종료할까요?', '현재까지 기록된 러닝을 저장하고 결과 화면으로 이동해요.', [
      {
        text: '취소',
        style: 'cancel'
      },
      {
        text: '종료하기',
        style: 'destructive',
        onPress: async () => {
          const savedRun = await finishRun();

          if (savedRun) {
            router.push(`/run/${savedRun.id}` as Href);
          }
        }
      }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>러너님,</Text>
          <Text style={styles.title}>오늘도 달릴 좋은 날이에요</Text>
        </View>
        <View style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color={hiTheme.colors.text} />
        </View>
      </View>

      <HiCard tone="green" style={styles.ctaCard}>
        <View style={styles.ctaText}>
          <Text style={styles.kicker}>{"Runner's Hi"}</Text>
          <Text style={styles.ctaTitle}>지금 바로 기록을 시작해요</Text>
          <HiButton
            label={hasActiveRun ? '진행 중인 러닝 보기' : '달리기 시작'}
            onPress={goToRunScreen}
            style={styles.ctaButton}
          />
        </View>
        <HiCharacter size="sm" mood="run" />
      </HiCard>

      {hasActiveRun ? (
        <HiCard tone="blue" style={styles.ongoingCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>진행 중인 러닝</Text>
              <Text style={styles.cardTitle}>{status === 'paused' ? '일시정지' : '러닝 중'}</Text>
            </View>
            <Ionicons
              name={status === 'paused' ? 'pause-circle' : 'radio-button-on'}
              size={26}
              color={hiTheme.colors.blue}
            />
          </View>
          <View style={styles.statRow}>
            <HiStatCard label="경과 시간" value={formatElapsedTime(elapsedSeconds)} />
            <HiStatCard label="거리" value={formatDistance(distanceMeters)} />
            <HiStatCard label="평균 페이스" value={formatPace(averagePaceSecondsPerKm)} />
          </View>
          {routeCoordinates.length > 0 ? (
            <Text style={styles.helper}>경로 좌표 {routeCoordinates.length}개가 유지되고 있어요</Text>
          ) : (
            <Text style={styles.helper}>GPS 신호를 기다리는 중이에요</Text>
          )}
          <View style={styles.ongoingActions}>
            <HiButton label="계속 보기" variant="secondary" onPress={goToRunScreen} style={styles.actionButton} />
            <HiButton label="러닝 종료" variant="danger" onPress={confirmFinishRun} style={styles.actionButton} />
          </View>
        </HiCard>
      ) : null}

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>최근 코스</Text>
          <Text style={styles.linkText}>{recentCourses.length ? `${recentCourses.length}개` : '저장 전'}</Text>
        </View>
        {recentCourses.length ? (
          <View style={styles.courseList}>
            {recentCourses.map((course) => (
              <View key={course.id} style={styles.courseRow}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseMeta}>
                    {formatDistance(course.distanceMeters)} · {formatPace(course.averagePaceSecondsPerKm)}
                  </Text>
                </View>
                <Pressable
                  style={styles.smallButton}
                  onPress={() => {
                    if (hasActiveRun) {
                      goToRunScreen();
                      return;
                    }

                    router.push({ pathname: '/run', params: { courseId: course.id } });
                  }}
                >
                  <Text style={styles.smallButtonText}>{hasActiveRun ? '진행 중 보기' : '다시 달리기'}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.body}>러닝 완료 후 마음에 드는 경로를 코스로 저장해보세요.</Text>
        )}
      </HiCard>

      <HiCard style={styles.weekCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>이번 주</Text>
          <Text style={styles.weekBadge}>{stats.weeklyGoal.message}</Text>
        </View>
        <View style={styles.statRow}>
          <HiStatCard label="러닝 횟수" value={stats.weeklyGoal.runCountLabel.split(' ')[0]} />
          <HiStatCard label="거리" value={stats.weeklyGoal.distanceLabel.split(' ')[0]} />
          <HiStatCard label="연속" value={stats.streak.label} />
        </View>
        <HiProgressBar progress={stats.weeklyGoal.overallProgress} color={hiTheme.colors.blue} />
      </HiCard>

      <HiCard style={styles.tierCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>내 티어</Text>
            <Text style={styles.tier}>{stats.currentTier}</Text>
          </View>
          <Text style={styles.hp}>{stats.totalHp} HP</Text>
        </View>
        <HiProgressBar progress={stats.tierProgress} />
        <Text style={styles.helper}>{stats.nextTierMessage}</Text>
      </HiCard>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>최근 러닝</Text>
          {recentRun ? <Text style={styles.linkText}>{recentRun.date}</Text> : null}
        </View>
        {recentRun ? (
          <View style={styles.recentRun}>
            <HiStatCard label="거리" value={recentRun.distance} />
            <HiStatCard label="시간" value={recentRun.duration} />
            <HiStatCard label="페이스" value={recentRun.pace} />
          </View>
        ) : (
          <Text style={styles.body}>첫 러닝을 완료하면 최근 기록이 여기에 보여요.</Text>
        )}
      </HiCard>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>최근 배지</Text>
            <Text style={styles.cardTitle}>
              {stats.recentBadge ? stats.recentBadge.title : '아직 달성 전'}
            </Text>
          </View>
          <View style={styles.badgeIcon}>
            <Ionicons name="trophy" size={24} color={hiTheme.colors.yellow} />
          </View>
        </View>
        {recentBadges.length ? (
          <View style={styles.badgeRow}>
            {recentBadges.map((badge) => (
              <View key={badge.key} style={styles.badgePill}>
                <Ionicons name="medal" size={14} color={hiTheme.colors.yellow} />
                <Text style={styles.badgePillText}>{badge.title}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.body}>첫 러닝을 완료하면 첫 배지를 받을 수 있어요.</Text>
        )}
      </HiCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 34,
    backgroundColor: hiTheme.colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  },
  headerText: {
    flex: 1
  },
  greeting: {
    color: hiTheme.colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  title: {
    color: hiTheme.colors.text,
    fontSize: 24,
    fontWeight: '900'
  },
  bell: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hiTheme.radius.md,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surface
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    overflow: 'hidden'
  },
  ctaText: {
    flex: 1,
    gap: 8
  },
  kicker: {
    color: hiTheme.colors.greenDark,
    fontSize: 13,
    fontWeight: '900'
  },
  ctaTitle: {
    color: hiTheme.colors.text,
    fontSize: 19,
    fontWeight: '900'
  },
  ctaButton: {
    alignSelf: 'flex-start',
    minHeight: 50,
    paddingHorizontal: 28
  },
  body: {
    color: hiTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20
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
  tier: {
    color: hiTheme.colors.text,
    fontSize: 21,
    fontWeight: '900'
  },
  medal: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#fff7d6'
  },
  hp: {
    color: hiTheme.colors.green,
    fontSize: 18,
    fontWeight: '900'
  },
  helper: {
    color: hiTheme.colors.greenDark,
    fontSize: 13,
    fontWeight: '800'
  },
  cardTitle: {
    color: hiTheme.colors.text,
    fontSize: 17,
    fontWeight: '900'
  },
  weekBadge: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: hiTheme.radius.pill,
    color: hiTheme.colors.greenDark,
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: hiTheme.colors.greenSoft
  },
  statRow: {
    flexDirection: 'row',
    gap: 10
  },
  recentRun: {
    flexDirection: 'row',
    gap: 10
  },
  linkText: {
    color: hiTheme.colors.blue,
    fontSize: 13,
    fontWeight: '900'
  },
  badgeIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#fff7d6'
  },
  compactCard: {
    gap: 10,
    paddingVertical: 14
  },
  ongoingCard: {
    gap: 10,
    paddingVertical: 14
  },
  ongoingActions: {
    flexDirection: 'row',
    gap: 10
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12
  },
  weekCard: {
    gap: 10,
    paddingVertical: 14
  },
  tierCard: {
    gap: 10,
    paddingVertical: 14
  },
  courseList: {
    gap: 8
  },
  courseRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: hiTheme.colors.border
  },
  courseInfo: {
    flex: 1
  },
  courseName: {
    color: hiTheme.colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  courseMeta: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    fontWeight: '800'
  },
  smallButton: {
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: hiTheme.radius.pill,
    backgroundColor: hiTheme.colors.blue
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900'
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: hiTheme.radius.pill,
    backgroundColor: hiTheme.colors.greenSoft
  },
  badgePillText: {
    color: hiTheme.colors.greenDark,
    fontSize: 12,
    fontWeight: '900'
  }
});
