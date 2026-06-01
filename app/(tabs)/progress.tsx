import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ProgressBar } from '@/components/ProgressBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatPill } from '@/components/StatPill';
import { useRunStats } from '@/features/runs/presentation/useRunStats';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

export default function ProgressScreen() {
  const { stats } = useRunStats();

  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <ScreenHeader eyebrow="성장" title="러닝 성장 요약" />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>현재 티어</Text>
            <Text style={commonStyles.cardTitle}>{stats.currentTier}</Text>
            <Text style={commonStyles.bodyText}>{stats.nextTierMessage}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="footsteps" size={24} color={colors.primary} />
          </View>
        </View>
        <ProgressBar progress={stats.tierProgress} />
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="총 러닝" value={`${stats.totalRuns}회`} />
        <StatPill label="누적 거리" value={stats.totalDistance} />
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <Text style={commonStyles.cardTitle}>Hi Point</Text>
          <Text style={commonStyles.metric}>{stats.totalHp} HP</Text>
        </View>
        <Text style={commonStyles.bodyText}>{stats.growthMessage}</Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>개인 최고기록</Text>
        {stats.pbRows.map((record) => (
          <View key={record.key} style={commonStyles.recordRow}>
            <Text style={commonStyles.bodyText}>{record.label}</Text>
            <Text style={commonStyles.recordValue}>{record.value}</Text>
          </View>
        ))}
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>최근 러닝</Text>
        {stats.recentRuns.length ? (
          stats.recentRuns.map((run) => (
            <View key={run.id} style={commonStyles.recordRow}>
              <View>
                <Text style={commonStyles.runnerName}>{run.date}</Text>
                <Text style={commonStyles.bodyText}>{run.pbText}</Text>
              </View>
              <View style={commonStyles.runStatus}>
                <Text style={commonStyles.recordValue}>{run.distance}</Text>
                <Text style={commonStyles.metric}>+{run.earnedHp} HP</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={commonStyles.bodyText}>첫 러닝을 시작하면 성장 기록이 여기에 쌓여요.</Text>
        )}
      </View>
    </ScrollView>
  );
}
