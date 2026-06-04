import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HiCard } from '@/components/HiCard';
import { HiCharacter } from '@/components/HiCharacter';
import { HiProgressBar } from '@/components/HiProgressBar';
import { HiStatCard } from '@/components/HiStatCard';
import { useRunStats } from '@/features/runs/presentation/useRunStats';
import { hiTheme } from '@/theme/theme';

export default function ProfileScreen() {
  const { stats } = useRunStats();
  const showPreparingAlert = () => {
    Alert.alert('준비 중이에요', '이 기능은 다음 업데이트에서 제공할 예정이에요.');
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <HiCard tone="green" style={styles.hero}>
        <HiCharacter size="md" mood={stats.hasRuns ? 'champion' : 'happy'} />
        <View style={styles.heroText}>
          <Text style={styles.kicker}>프로필</Text>
          <Text style={styles.title}>{stats.currentTier}</Text>
          <Text style={styles.body}>{stats.nextTierMessage}</Text>
        </View>
      </HiCard>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>총 Hi Point</Text>
            <Text style={styles.hp}>{stats.totalHp} HP</Text>
          </View>
          <View style={styles.iconBubble}>
            <Ionicons name="flash" size={24} color={hiTheme.colors.green} />
          </View>
        </View>
        <HiProgressBar progress={stats.tierProgress} />
      </HiCard>

      <View style={styles.statGrid}>
        <HiStatCard label="총 러닝 횟수" value={`${stats.totalRuns}회`} />
        <HiStatCard label="누적 거리" value={stats.totalDistance} />
      </View>
      <View style={styles.statGrid}>
        <HiStatCard label="현재 스트릭" value={stats.streak.label} />
        <HiStatCard label="최고 PB" value={stats.bestPb} />
      </View>

      <HiCard style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>배지 수집 현황</Text>
            <Text style={styles.body}>
              배지 {stats.badgeCollection.achievedCount} / {stats.badgeCollection.totalCount}개 획득
            </Text>
          </View>
          <Text style={styles.badgeCount}>{Math.round(stats.badgeCollection.progress * 100)}%</Text>
        </View>
        <HiProgressBar progress={stats.badgeCollection.progress} color={hiTheme.colors.yellow} />
        <View style={styles.nextBadgeBox}>
          <Text style={styles.label}>다음 목표</Text>
          <Text style={styles.badgeTitle}>{stats.badgeCollection.nextGoal.title}</Text>
          <Text style={styles.body}>{stats.badgeCollection.nextGoal.progressLabel}</Text>
          <HiProgressBar progress={stats.badgeCollection.nextGoal.progress} color={hiTheme.colors.blue} />
        </View>
        {stats.recentBadge ? (
          <Text style={styles.helper}>최근 획득 배지: {stats.recentBadge.title}</Text>
        ) : (
          <Text style={styles.helper}>첫 러닝을 완료하면 첫 배지를 받을 수 있어요</Text>
        )}
        {stats.badges.slice(0, 5).map((badge) => (
          <View key={badge.key} style={[styles.badgeRow, !badge.achieved && styles.locked]}>
            <View style={styles.badgeIcon}>
              <Ionicons
                name={badge.achieved ? 'medal' : 'lock-closed'}
                size={20}
                color={badge.achieved ? hiTheme.colors.yellow : hiTheme.colors.muted}
              />
            </View>
            <View style={styles.flex}>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              <Text style={styles.body}>{badge.description}</Text>
            </View>
            <Text style={styles.status}>{badge.statusText}</Text>
          </View>
        ))}
      </HiCard>

      <HiCard style={styles.compactCard}>
        <Text style={styles.cardTitle}>설정 / 데이터 관리</Text>
        <Pressable style={styles.settingRow} onPress={showPreparingAlert}>
          <Ionicons name="settings-outline" size={20} color={hiTheme.colors.text} />
          <Text style={styles.settingText}>앱 설정</Text>
          <Ionicons name="chevron-forward" size={18} color={hiTheme.colors.muted} />
        </Pressable>
        <Pressable style={styles.settingRow} onPress={showPreparingAlert}>
          <Ionicons name="server-outline" size={20} color={hiTheme.colors.text} />
          <Text style={styles.settingText}>저장 데이터 관리</Text>
          <Ionicons name="chevron-forward" size={18} color={hiTheme.colors.muted} />
        </Pressable>
      </HiCard>

      <HiCard tone="blue" style={styles.compactCard}>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>저장 상태</Text>
            <Text style={styles.body}>
              현재 러닝 기록과 코스는 AsyncStorage 기반 로컬 저장으로 유지돼요.
            </Text>
          </View>
          <Ionicons name="phone-portrait" size={24} color={hiTheme.colors.blue} />
        </View>
        <Text style={styles.helper}>Supabase 동기화는 추후 업데이트 예정이에요.</Text>
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
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16
  },
  heroText: {
    flex: 1
  },
  kicker: {
    color: hiTheme.colors.greenDark,
    fontSize: 13,
    fontWeight: '900'
  },
  title: {
    color: hiTheme.colors.text,
    fontSize: 27,
    fontWeight: '900'
  },
  body: {
    color: hiTheme.colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  label: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    fontWeight: '900'
  },
  hp: {
    color: hiTheme.colors.green,
    fontSize: 26,
    fontWeight: '900'
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  compactCard: {
    gap: 12,
    paddingVertical: 14
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10
  },
  cardTitle: {
    color: hiTheme.colors.text,
    fontSize: 19,
    fontWeight: '900'
  },
  helper: {
    color: hiTheme.colors.blue,
    fontSize: 13,
    fontWeight: '900'
  },
  iconBubble: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: hiTheme.colors.greenSoft
  },
  badgeCount: {
    color: hiTheme.colors.green,
    fontSize: 18,
    fontWeight: '900'
  },
  nextBadgeBox: {
    gap: 6,
    padding: 12,
    borderRadius: hiTheme.radius.md,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  badgeRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: hiTheme.colors.border
  },
  locked: {
    opacity: 0.55
  },
  badgeIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: hiTheme.colors.surfaceSoft
  },
  flex: {
    flex: 1
  },
  badgeTitle: {
    color: hiTheme.colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  status: {
    color: hiTheme.colors.greenDark,
    fontSize: 12,
    fontWeight: '900'
  },
  settingRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  settingText: {
    flex: 1,
    color: hiTheme.colors.text,
    fontSize: 15,
    fontWeight: '900'
  }
});
