import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HiCard } from '@/components/HiCard';
import { HiCharacter } from '@/components/HiCharacter';
import { HiProgressBar } from '@/components/HiProgressBar';
import { HiStatCard } from '@/components/HiStatCard';
import { useRunStats } from '@/features/runs/presentation/useRunStats';
import { hiTheme } from '@/theme/theme';

export default function ProgressScreen() {
  const { stats } = useRunStats();
  const achievedBadges = stats.badges.filter((badge) => badge.achieved);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.kicker}>성장</Text>
          <Text style={styles.title}>성장</Text>
          <Text style={styles.body}>HP, PB, 배지로 러닝 성장을 확인해요</Text>
        </View>
        <HiCharacter size="sm" mood={stats.hasRuns ? 'pb' : 'sad'} />
      </View>

      <HiCard tone="green" style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>현재 티어</Text>
            <Text style={styles.bigValue}>{stats.currentTier}</Text>
          </View>
          <View style={styles.iconBubble}>
            <Ionicons name="flash" size={24} color={hiTheme.colors.green} />
          </View>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.hp}>{stats.totalHp} HP</Text>
          <Text style={styles.helper}>{stats.nextTierMessage}</Text>
        </View>
        <HiProgressBar progress={stats.tierProgress} />
      </HiCard>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>이번 주 목표</Text>
          <Text style={styles.weekBadge}>{stats.weeklyGoal.message}</Text>
        </View>
        <View style={styles.statGrid}>
          <HiStatCard label="러닝 횟수" value={stats.weeklyGoal.runCountLabel} />
          <HiStatCard label="거리" value={stats.weeklyGoal.distanceLabel} />
        </View>
        <HiProgressBar progress={stats.weeklyGoal.overallProgress} color={hiTheme.colors.blue} />
      </HiCard>

      <View style={styles.statGrid}>
        <HiStatCard label="연속 러닝" value={stats.streak.label} />
        <HiStatCard label="총 러닝" value={`${stats.totalRuns}회`} />
      </View>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>PB 기록</Text>
          <Text style={styles.helper}>{stats.recentPbText}</Text>
        </View>
        <View style={styles.pbGrid}>
          {stats.pbRows.map((record) => (
            <View key={record.key} style={styles.pbCard}>
              <Text style={styles.pbLabel}>{record.label.replace(' PB', '')}</Text>
              <Text style={styles.pbValue}>{record.value}</Text>
            </View>
          ))}
        </View>
      </HiCard>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>배지 요약</Text>
            <Text style={styles.body}>
              {achievedBadges.length} / {stats.badges.length}개 획득
            </Text>
          </View>
          <View style={styles.badgeIcon}>
            <Ionicons name="trophy" size={24} color={hiTheme.colors.yellow} />
          </View>
        </View>
        <HiProgressBar
          progress={stats.badges.length ? achievedBadges.length / stats.badges.length : 0}
          color={hiTheme.colors.yellow}
        />
        <Text style={styles.helper}>
          최근 배지: {stats.recentBadge ? stats.recentBadge.title : '아직 달성 전'}
        </Text>
      </HiCard>

      {!stats.hasRuns ? (
        <HiCard style={styles.empty}>
          <HiCharacter size="md" mood="sad" />
          <Text style={styles.cardTitle}>러닝 기록이 쌓이면 성장 데이터가 표시돼요</Text>
          <Text style={styles.emptyBody}>첫 러닝을 완료하면 HP, PB, 배지가 이 화면에 채워져요.</Text>
        </HiCard>
      ) : null}
    </ScrollView>
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
    gap: 14
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
  label: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    fontWeight: '900'
  },
  bigValue: {
    color: hiTheme.colors.text,
    fontSize: 24,
    fontWeight: '900'
  },
  hp: {
    color: hiTheme.colors.green,
    fontSize: 18,
    fontWeight: '900'
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
  helper: {
    color: hiTheme.colors.greenDark,
    fontSize: 12,
    fontWeight: '900'
  },
  compactCard: {
    gap: 12,
    paddingVertical: 14
  },
  iconBubble: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: hiTheme.colors.surface
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10
  },
  weekBadge: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: hiTheme.radius.pill,
    color: hiTheme.colors.blue,
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: hiTheme.colors.blueSoft
  },
  pbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  pbCard: {
    width: '47%',
    gap: 4,
    padding: 14,
    borderRadius: hiTheme.radius.md,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  pbLabel: {
    color: hiTheme.colors.greenDark,
    fontSize: 12,
    fontWeight: '900'
  },
  pbValue: {
    color: hiTheme.colors.text,
    fontSize: 17,
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
  empty: {
    alignItems: 'center'
  }
});
