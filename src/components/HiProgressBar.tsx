import { DimensionValue, StyleSheet, View } from 'react-native';

import { hiTheme } from '@/theme/theme';

type HiProgressBarProps = {
  progress: number;
  color?: string;
};

export function HiProgressBar({ progress, color = hiTheme.colors.green }: HiProgressBarProps) {
  const width: DimensionValue = `${Math.min(Math.max(progress, 0), 1) * 100}%`;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    overflow: 'hidden',
    borderRadius: hiTheme.radius.pill,
    backgroundColor: '#edf0ec'
  },
  fill: {
    height: '100%',
    borderRadius: hiTheme.radius.pill
  }
});
