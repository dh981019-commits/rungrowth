import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenHeader } from '@/components/ScreenHeader';
import { StatPill } from '@/components/StatPill';
import { useRunStats } from '@/features/runs/presentation/useRunStats';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  const { stats } = useRunStats();

  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <ScreenHeader eyebrow="러너" title="나의 기록" />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>현재 티어</Text>
            <Text style={commonStyles.cardTitle}>{stats.currentTier}</Text>
            <Text style={commonStyles.bodyText}>{stats.nextTierMessage}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="medal" size={24} color={colors.primary} />
          </View>
        </View>
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="Hi Point" value={`${stats.totalHp} HP`} />
        <StatPill label="총 러닝" value={`${stats.totalRuns}회`} />
      </View>

      <StatPill label="누적 거리" value={stats.totalDistance} />
      <StatPill label="최고 PB" value={stats.bestPb} />

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>개인 최고기록</Text>
        {stats.pbRows.map((record) => (
          <View key={record.key} style={commonStyles.recordRow}>
            <Text style={commonStyles.bodyText}>{record.label}</Text>
            <Text style={commonStyles.recordValue}>{record.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
