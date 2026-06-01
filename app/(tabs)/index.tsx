import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ProgressBar } from '@/components/ProgressBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatPill } from '@/components/StatPill';
import { homeSummary } from '@/data/mockData';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <ScreenHeader eyebrow="오늘" title="Runner's Hi" />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>성장 카드</Text>
            <Text style={commonStyles.cardTitle}>{homeSummary.growth.period}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="trending-up" size={24} color={colors.primary} />
          </View>
        </View>
        <View style={commonStyles.recordRow}>
          <Text style={commonStyles.bodyText}>{homeSummary.growth.recordLabel}</Text>
          <Text style={commonStyles.recordValue}>
            {homeSummary.growth.beforeRecord} → {homeSummary.growth.afterRecord}
          </Text>
        </View>
        <View style={commonStyles.metricRow}>
          <Text style={commonStyles.metric}>{homeSummary.growth.improvement}</Text>
          <Text style={commonStyles.metric}>성장지수 {homeSummary.growth.growthIndex}</Text>
        </View>
        <Text style={commonStyles.bodyText}>
          {homeSummary.growth.message}
        </Text>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>러너 등급</Text>
            <Text style={commonStyles.cardTitle}>{homeSummary.runnerTier.tier}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="ribbon" size={24} color={colors.primary} />
          </View>
        </View>
        <View style={commonStyles.rowBetween}>
          <Text style={commonStyles.bodyText}>Hi Point</Text>
          <Text style={commonStyles.recordValue}>
            {homeSummary.runnerTier.hiPoint} / {homeSummary.runnerTier.hiPointGoal}
          </Text>
        </View>
        <ProgressBar progress={homeSummary.runnerTier.hiPoint / homeSummary.runnerTier.hiPointGoal} />
        <Text style={commonStyles.bodyText}>
          다음 등급까지 {homeSummary.runnerTier.nextTierGap} HP
        </Text>
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="연속 러닝" value={`${homeSummary.currentStreak}일`} />
        <StatPill label="이번 주 거리" value={homeSummary.weekDistance} />
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>오늘의 러닝</Text>
            <Text style={commonStyles.cardTitle}>{homeSummary.dailyMission}</Text>
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
        <Text style={commonStyles.cardTitle}>{homeSummary.recommendedCourse.name}</Text>
        <View style={commonStyles.metricRow}>
          <Text style={commonStyles.metric}>{homeSummary.recommendedCourse.distance}</Text>
          <Text style={commonStyles.metric}>{homeSummary.recommendedCourse.difficulty}</Text>
          <Text style={commonStyles.metric}>{homeSummary.recommendedCourse.elevation}</Text>
          <Text style={commonStyles.metric}>{homeSummary.recommendedCourse.duration}</Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <Text style={commonStyles.cardTitle}>주간 목표</Text>
          <Text style={commonStyles.metric}>{homeSummary.weeklyGoal.label}</Text>
        </View>
        <ProgressBar progress={homeSummary.weeklyGoal.current / homeSummary.weeklyGoal.goal} />
      </View>

      <Pressable style={commonStyles.primaryButton}>
        <Ionicons name="play" size={20} color="white" />
        <Text style={commonStyles.primaryButtonText}>달리기 시작</Text>
      </Pressable>
    </ScrollView>
  );
}
