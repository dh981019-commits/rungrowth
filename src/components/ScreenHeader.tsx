import { Text, View } from 'react-native';

import { commonStyles } from '@/theme/commonStyles';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
};

export function ScreenHeader({ eyebrow, title }: ScreenHeaderProps) {
  return (
    <View style={commonStyles.header}>
      <Text style={commonStyles.eyebrow}>{eyebrow}</Text>
      <Text style={commonStyles.screenTitle}>{title}</Text>
    </View>
  );
}
