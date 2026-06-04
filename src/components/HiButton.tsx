import { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { hiTheme } from '@/theme/theme';

type HiButtonProps = PropsWithChildren<{
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: StyleProp<ViewStyle>;
}>;

export function HiButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  style
}: HiButtonProps) {
  return (
    <Pressable
      style={[styles.button, styles[variant], disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: hiTheme.spacing.lg,
    borderRadius: hiTheme.radius.pill
  },
  primary: {
    backgroundColor: hiTheme.colors.green
  },
  secondary: {
    backgroundColor: hiTheme.colors.blue
  },
  danger: {
    backgroundColor: hiTheme.colors.red
  },
  ghost: {
    borderWidth: 1,
    borderColor: hiTheme.colors.border,
    backgroundColor: hiTheme.colors.surface
  },
  disabled: {
    opacity: 0.55
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900'
  },
  ghostLabel: {
    color: hiTheme.colors.text
  }
});
