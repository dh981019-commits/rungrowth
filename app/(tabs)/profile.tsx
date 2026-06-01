import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenHeader } from '@/components/ScreenHeader';
import { StatPill } from '@/components/StatPill';
import { profileStats } from '@/data/mockData';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <ScreenHeader eyebrow="러너" title={profileStats.name} />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>현재 플랜</Text>
            <Text style={commonStyles.cardTitle}>{profileStats.plan}</Text>
            <Text style={commonStyles.bodyText}>5K를 더 편하게 달리기 위한 차근차근 빌드업.</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="medal" size={24} color={colors.primary} />
          </View>
        </View>
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="연속 러닝" value={`${profileStats.streakDays}일`} />
        <StatPill label="총 러닝" value={`${profileStats.totalRuns}회`} />
      </View>

      <StatPill label="누적 거리" value={profileStats.totalDistance} />

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>개인 최고기록</Text>
        {profileStats.bestRecords.map((record) => (
          <View key={record.label} style={commonStyles.recordRow}>
            <Text style={commonStyles.bodyText}>{record.label}</Text>
            <Text style={commonStyles.recordValue}>{record.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
