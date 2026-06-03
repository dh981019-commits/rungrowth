import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';

import { ProgressBar } from '@/components/ProgressBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatPill } from '@/components/StatPill';
import { useRunStats } from '@/features/runs/presentation/useRunStats';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

export default function HomeScreen() {
  const { stats } = useRunStats();
  const hasRuns = stats.hasRuns;

  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <ScreenHeader eyebrow="오늘" title="Runner's Hi" />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>성장 카드</Text>
            <Text style={commonStyles.cardTitle}>
              {hasRuns ? stats.currentTier : '첫 러닝을 시작해보세요'}
            </Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="trending-up" size={24} color={colors.primary} />
          </View>
        </View>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>최근 PB</Text>
          <Text style={commonStyles.recordValue}>{hasRuns ? stats.recentPbText : '기록 없음'}</Text>
        </View>
        <View style={commonStyles.metricRow}>
          <Text style={commonStyles.metric}>Hi Point {stats.totalHp} HP</Text>
          <Text style={commonStyles.metric}>{stats.nextTierMessage}</Text>
        </View>
        <Text style={commonStyles.bodyText}>{stats.growthMessage}</Text>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>러너 등급</Text>
            <Text style={commonStyles.cardTitle}>{stats.currentTier}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="ribbon" size={24} color={colors.primary} />
          </View>
        </View>
        <View style={commonStyles.rowBetween}>
          <Text style={commonStyles.bodyText}>Hi Point</Text>
          <Text style={commonStyles.recordValue}>{stats.totalHp} HP</Text>
        </View>
        <ProgressBar progress={stats.tierProgress} />
        <Text style={commonStyles.bodyText}>{stats.nextTierMessage}</Text>
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="총 러닝" value={`${stats.totalRuns}회`} />
        <StatPill label="누적 거리" value={stats.totalDistance} />
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>연속 러닝</Text>
            <Text style={commonStyles.cardTitle}>{stats.streak.label}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="flame" size={24} color={colors.primary} />
          </View>
        </View>
        <Text style={commonStyles.bodyText}>{stats.streak.message}</Text>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>최근 획득 배지</Text>
            <Text style={commonStyles.cardTitle}>
              {stats.recentBadge ? stats.recentBadge.title : '아직 달성 전'}
            </Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="trophy" size={24} color={colors.primary} />
          </View>
        </View>
        <Text style={commonStyles.bodyText}>
          {stats.recentBadge
            ? stats.recentBadge.description
            : '첫 러닝을 완료하면 첫 배지를 받을 수 있어요'}
        </Text>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>오늘의 러닝</Text>
            <Text style={commonStyles.cardTitle}>가볍게 리듬 만들기</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="flash" size={24} color={colors.primary} />
          </View>
        </View>
        <Text style={commonStyles.bodyText}>
          무리하지 않고 기분 좋게, 이번 주 러닝 리듬을 이어가요.
        </Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardLabel}>추천 코스</Text>
        <Text style={commonStyles.cardTitle}>가까운 평지 코스</Text>
        <View style={commonStyles.metricRow}>
          <Text style={commonStyles.metric}>3km 전후</Text>
          <Text style={commonStyles.metric}>쉬움</Text>
          <Text style={commonStyles.metric}>회복</Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <Text style={commonStyles.cardTitle}>주간 목표</Text>
          <Text style={commonStyles.metric}>{stats.weeklyGoal.message}</Text>
        </View>
        <Text style={commonStyles.bodyText}>{stats.weeklyGoal.runCountLabel}</Text>
        <ProgressBar progress={stats.weeklyGoal.runProgress} />
        <Text style={commonStyles.bodyText}>{stats.weeklyGoal.distanceLabel}</Text>
        <ProgressBar progress={stats.weeklyGoal.distanceProgress} />
        <Text style={commonStyles.supportingText}>{stats.streak.message}</Text>
      </View>

      <Pressable style={commonStyles.primaryButton} onPress={() => router.push('/run' as Href)}>
        <Ionicons name="play" size={20} color="white" />
        <Text style={commonStyles.primaryButtonText}>달리기 시작</Text>
      </Pressable>
    </ScrollView>
  );
}
