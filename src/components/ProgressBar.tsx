import { DimensionValue, View } from 'react-native';

import { commonStyles } from '@/theme/commonStyles';

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const width: DimensionValue = `${Math.min(Math.max(progress, 0), 1) * 100}%`;

  return (
    <View style={commonStyles.progressTrack}>
      <View style={[commonStyles.progressFill, { width }]} />
    </View>
  );
}
