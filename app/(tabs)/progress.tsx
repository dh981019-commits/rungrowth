import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HiButton } from '@/components/HiButton';
import { HiCard } from '@/components/HiCard';
import { HiCharacter } from '@/components/HiCharacter';
import { HiProgressBar } from '@/components/HiProgressBar';
import { HiStatCard } from '@/components/HiStatCard';
import { useRunStats } from '@/features/runs/presentation/useRunStats';
import { hiTheme } from '@/theme/theme';

export default function ProgressScreen() {
  const { stats } = useRunStats();
  const [isBadgeListVisible, setIsBadgeListVisible] = useState(false);
  const achievedBadges = stats.badges.filter((badge) => badge.achieved);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.kicker}>성장</Text>
          <Text style={styles.title}>이번 주 성장 리포트</Text>
          <Text style={styles.body}>{stats.weeklyReport.summaryMessage}</Text>
        </View>
        <HiCharacter size="sm" mood={stats.hasRuns ? 'pb' : 'sad'} />
      </View>

      <HiCard tone="blue" style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>이번 주 획득 HP</Text>
            <Text style={styles.bigValue}>+{stats.weeklyReport.earnedHp} HP</Text>
          </View>
          <View style={styles.iconBubble}>
            <Ionicons name="sparkles" size={24} color={hiTheme.colors.blue} />
          </View>
        </View>
        <View style={styles.statGrid}>
          <HiStatCard label="러닝 횟수" value={stats.weeklyGoal.runCountLabel} />
          <HiStatCard label="누적 거리" value={stats.weeklyGoal.distanceLabel} />
        </View>
      </HiCard>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>주간 목표 진행률</Text>
          <Text style={styles.weekBadge}>{stats.weeklyGoal.message}</Text>
        </View>
        <HiProgressBar progress={stats.weeklyGoal.overallProgress} color={hiTheme.colors.blue} />
        <View style={styles.statGrid}>
          <HiStatCard label="횟수 진행률" value={`${Math.round(stats.weeklyGoal.runProgress * 100)}%`} />
          <HiStatCard label="거리 진행률" value={`${Math.round(stats.weeklyGoal.distanceProgress * 100)}%`} />
        </View>
      </HiCard>

      <HiCard style={styles.compactCard}>
        <Text style={styles.cardTitle}>요일별 러닝 기록</Text>
        <View style={styles.weekdayRow}>
          {stats.weeklyReport.dayRows.map((day) => (
            <View key={day.label} style={styles.weekdayItem}>
              <View style={[styles.weekdayDot, day.hasRun && styles.activeWeekdayDot]}>
                <Text style={[styles.weekdayLabel, day.hasRun && styles.activeWeekdayLabel]}>{day.label}</Text>
              </View>
              <Text style={styles.weekdayDistance}>{day.distanceLabel}</Text>
            </View>
          ))}
        </View>
      </HiCard>

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
        <View style={styles.tierPath}>
          {stats.tierRows.map((tier) => (
            <View key={tier.fullName} style={[styles.tierStep, tier.state === 'current' && styles.currentTierStep]}>
              <Ionicons
                name={tier.state === 'completed' ? 'checkmark-circle' : tier.state === 'current' ? 'radio-button-on' : 'lock-closed'}
                size={15}
                color={tier.state === 'locked' ? hiTheme.colors.muted : hiTheme.colors.green}
              />
              <Text style={[styles.tierStepText, tier.state === 'locked' && styles.lockedText]}>{tier.name}</Text>
            </View>
          ))}
        </View>
      </HiCard>

      <View style={styles.statGrid}>
        <HiStatCard label="연속 러닝" value={stats.streak.label} />
        <HiStatCard label="총 러닝" value={`${stats.totalRuns}회`} />
      </View>

      <HiCard style={styles.compactCard}>
        <Text style={styles.cardTitle}>다음 행동 추천</Text>
        <Text style={styles.actionMessage}>{stats.weeklyReport.actionMessage}</Text>
      </HiCard>

      {!stats.hasRuns ? (
        <HiCard style={styles.empty}>
          <HiCharacter size="md" mood="sad" />
          <Text style={styles.cardTitle}>이번 주 러닝 기록이 아직 없어요</Text>
          <Text style={styles.emptyBody}>첫 러닝을 하면 주간 리포트가 생성돼요.</Text>
        </HiCard>
      ) : null}

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
        <HiButton
          label={isBadgeListVisible ? '배지 목록 접기' : '전체 배지 보기'}
          variant="secondary"
          onPress={() => setIsBadgeListVisible((current) => !current)}
          style={styles.compactButton}
        />
        {isBadgeListVisible ? (
          <View style={styles.badgeList}>
            {stats.badges.map((badge) => (
              <View key={badge.key} style={[styles.badgeItem, !badge.achieved && styles.lockedBadge]}>
                <View style={[styles.badgeMark, badge.achieved && styles.achievedBadgeMark]}>
                  <Ionicons
                    name={badge.achieved ? 'medal' : 'lock-closed'}
                    size={20}
                    color={badge.achieved ? hiTheme.colors.yellow : hiTheme.colors.muted}
                  />
                </View>
                <View style={styles.badgeText}>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDescription}>{badge.description}</Text>
                </View>
                <Text style={styles.badgeStatus}>{badge.statusText}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </HiCard>

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
  actionMessage: {
    color: hiTheme.colors.greenDark,
    fontSize: 15,
    fontWeight: '900'
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6
  },
  weekdayItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6
  },
  weekdayDot: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hiTheme.radius.pill,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  activeWeekdayDot: {
    backgroundColor: hiTheme.colors.green
  },
  weekdayLabel: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    fontWeight: '900'
  },
  activeWeekdayLabel: {
    color: '#ffffff'
  },
  weekdayDistance: {
    color: hiTheme.colors.muted,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center'
  },
  tierPath: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tierStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: hiTheme.radius.pill,
    backgroundColor: hiTheme.colors.surface
  },
  currentTierStep: {
    backgroundColor: '#d8f5df'
  },
  tierStepText: {
    color: hiTheme.colors.greenDark,
    fontSize: 11,
    fontWeight: '900'
  },
  lockedText: {
    color: hiTheme.colors.muted
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
  compactButton: {
    minHeight: 48
  },
  badgeList: {
    gap: 8
  },
  badgeItem: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: hiTheme.colors.border
  },
  lockedBadge: {
    opacity: 0.45
  },
  badgeMark: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  achievedBadgeMark: {
    backgroundColor: '#fff7d6'
  },
  badgeText: {
    flex: 1
  },
  badgeTitle: {
    color: hiTheme.colors.text,
    fontSize: 14,
    fontWeight: '900'
  },
  badgeDescription: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    lineHeight: 18
  },
  badgeStatus: {
    color: hiTheme.colors.greenDark,
    fontSize: 12,
    fontWeight: '900'
  },
  empty: {
    alignItems: 'center'
  }
});
