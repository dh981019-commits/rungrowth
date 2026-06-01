import { Text, View } from 'react-native';

import { commonStyles } from '@/theme/commonStyles';

type StatPillProps = {
  label: string;
  value: string;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <View style={commonStyles.statPill}>
      <Text style={commonStyles.statValue}>{value}</Text>
      <Text style={commonStyles.statLabel}>{label}</Text>
    </View>
  );
}
