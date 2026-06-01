import { FlatList, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenHeader } from '@/components/ScreenHeader';
import { recommendedCourses } from '@/data/mockData';
import { commonStyles } from '@/theme/commonStyles';
import { colors } from '@/theme/colors';

export default function CoursesScreen() {
  return (
    <FlatList
      data={recommendedCourses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={commonStyles.screen}
      ListHeaderComponent={<ScreenHeader eyebrow="코스" title="추천 러닝 코스" />}
      renderItem={({ item }) => (
        <View style={commonStyles.card}>
          <View style={commonStyles.rowBetween}>
            <View style={commonStyles.flex}>
              <Text style={commonStyles.cardTitle}>{item.name}</Text>
              <Text style={commonStyles.bodyText}>{item.area}</Text>
            </View>
            <View style={commonStyles.iconBadge}>
              <Ionicons name="navigate" size={22} color={colors.primary} />
            </View>
          </View>
          <View style={commonStyles.metricRow}>
            <Text style={commonStyles.metric}>{item.distance}</Text>
            <Text style={commonStyles.metric}>{item.difficulty}</Text>
            <Text style={commonStyles.metric}>{item.elevation}</Text>
            <Text style={commonStyles.metric}>{item.duration}</Text>
          </View>
          <Text style={commonStyles.supportingText}>{item.focus} 중심</Text>
        </View>
      )}
    />
  );
}
