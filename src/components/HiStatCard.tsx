import { StyleSheet, Text, View } from 'react-native';

import { hiTheme } from '@/theme/theme';

type HiStatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function HiStatCard({ label, value, helper }: HiStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 88,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: hiTheme.spacing.sm,
    borderRadius: hiTheme.radius.md,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surface
  },
  value: {
    color: hiTheme.colors.text,
    fontSize: 20,
    fontWeight: '900'
  },
  label: {
    color: hiTheme.colors.muted,
    fontSize: 12,
    fontWeight: '800'
  },
  helper: {
    color: hiTheme.colors.greenDark,
    fontSize: 11,
    fontWeight: '800'
  }
});
