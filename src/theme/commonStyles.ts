import { StyleSheet } from 'react-native';

import { colors } from './colors';

export const commonStyles = StyleSheet.create({
  screen: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 28,
    backgroundColor: colors.background
  },
  header: {
    gap: 4,
    marginBottom: 2
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  screenTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0
  },
  heroCard: {
    gap: 16,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  card: {
    gap: 14,
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  },
  flex: {
    flex: 1
  },
  iconBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt
  },
  cardLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0
  },
  bodyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21
  },
  statGrid: {
    flexDirection: 'row',
    gap: 12
  },
  statPill: {
    flex: 1,
    gap: 4,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900'
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700'
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  metric: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
    backgroundColor: colors.surfaceAlt
  },
  supportingText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700'
  },
  progressTrack: {
    height: 12,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#dbeafe'
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.primary
  },
  primaryButton: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 8,
    backgroundColor: colors.primary
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '900'
  },
  rankRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  rankBadge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f5f9'
  },
  promotionBadge: {
    backgroundColor: colors.success
  },
  rankText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '900'
  },
  promotionText: {
    color: colors.primaryDark
  },
  runnerName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900'
  },
  xpText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  displayValue: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 0
  },
  recordRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  recordValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  runStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});
