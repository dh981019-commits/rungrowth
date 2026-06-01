import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ProgressBar } from '@/components/ProgressBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatPill } from '@/components/StatPill';
import { progressSummary } from '@/data/mockData';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

export default function ProgressScreen() {
  return (
    <ScrollView contentContainerStyle={commonStyles.screen}>
      <ScreenHeader eyebrow="성장" title="이번 주 요약" />

      <View style={commonStyles.heroCard}>
        <View style={commonStyles.rowBetween}>
          <View style={commonStyles.flex}>
            <Text style={commonStyles.cardLabel}>거리 목표</Text>
            <Text style={commonStyles.cardTitle}>{progressSummary.weeklyGoal.label}</Text>
          </View>
          <View style={commonStyles.iconBadge}>
            <Ionicons name="footsteps" size={24} color={colors.primary} />
          </View>
        </View>
        <ProgressBar progress={progressSummary.weeklyGoal.current / progressSummary.weeklyGoal.goal} />
      </View>

      <View style={commonStyles.statGrid}>
        <StatPill label="편안한 러닝" value={`${progressSummary.easyPaceMinutes}분`} />
        <StatPill label="러닝한 날" value={`${progressSummary.activeDays}일`} />
      </View>

      <View style={commonStyles.card}>
        <View style={commonStyles.rowBetween}>
          <Text style={commonStyles.cardTitle}>꾸준함</Text>
          <Text style={commonStyles.metric}>{Math.round(progressSummary.consistency * 100)}%</Text>
        </View>
        <ProgressBar progress={progressSummary.consistency} />
        <Text style={commonStyles.bodyText}>{progressSummary.nextMilestone}</Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>주간 요약</Text>
        {progressSummary.weeklyRuns.map((run) => (
          <View key={run.id} style={commonStyles.recordRow}>
            <View>
              <Text style={commonStyles.runnerName}>{run.day}</Text>
              <Text style={commonStyles.bodyText}>{run.label}</Text>
            </View>
            <View style={commonStyles.runStatus}>
              <Text style={commonStyles.recordValue}>{run.distance}</Text>
              <Ionicons
                name={run.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={run.completed ? colors.primary : colors.muted}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
