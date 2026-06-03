import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { hiTheme } from '@/theme/theme';

type HiCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'green' | 'blue';
}>;

export function HiCard({ children, style, tone = 'default' }: HiCardProps) {
  return <View style={[styles.card, styles[tone], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    gap: hiTheme.spacing.md,
    padding: hiTheme.spacing.lg,
    borderRadius: hiTheme.radius.lg,
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surface,
    shadowColor: hiTheme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2
  },
  default: {},
  green: {
    borderColor: '#d9f1de',
    backgroundColor: hiTheme.colors.greenSoft
  },
  blue: {
    borderColor: '#d9eaff',
    backgroundColor: hiTheme.colors.blueSoft
  }
});
