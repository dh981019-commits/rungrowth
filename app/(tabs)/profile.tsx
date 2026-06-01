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
      <ScreenHeader eyebrow="Runner" title={profileStats.name} />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>Current plan</Text>
            <Text style={commonStyles.cardTitle}>{profileStats.plan}</Text>
            <Text style={commonStyles.bodyText}>A steady build toward confident 5K efforts.</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="medal" size={24} color={colors.primary} />
          </View>
        </View>
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="Streak days" value={`${profileStats.streakDays}`} />
        <StatPill label="Total runs" value={`${profileStats.totalRuns}`} />
      </View>

      <StatPill label="Total distance" value={profileStats.totalDistance} />

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Best records</Text>
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
