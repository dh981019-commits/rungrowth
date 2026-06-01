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
      <ScreenHeader eyebrow="Today" title="Runner's Hi" />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>Daily mission</Text>
            <Text style={commonStyles.cardTitle}>{homeSummary.dailyMission}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="flash" size={24} color={colors.primary} />
          </View>
        </View>
        <Text style={commonStyles.bodyText}>
          Keep the effort light, finish feeling better, and protect your weekly rhythm.
        </Text>
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="Current streak" value={`${homeSummary.currentStreak} days`} />
        <StatPill label="Week distance" value={homeSummary.weekDistance} />
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardLabel}>Recommended course</Text>
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
          <Text style={commonStyles.cardTitle}>Weekly goal</Text>
          <Text style={commonStyles.metric}>{homeSummary.weeklyGoal.label}</Text>
        </View>
        <ProgressBar progress={homeSummary.weeklyGoal.current / homeSummary.weeklyGoal.goal} />
      </View>

      <Pressable style={commonStyles.primaryButton}>
        <Ionicons name="play" size={20} color="white" />
        <Text style={commonStyles.primaryButtonText}>Start Planned Run</Text>
      </Pressable>
    </ScrollView>
  );
}
