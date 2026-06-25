import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fontFamily, fontSize, spacing, borderRadius, typography, ThemeColors } from '../utils/theme';
import { useTheme } from '../contexts/ThemeContext';

interface ConfigRowProps {
  label: string;
  children: React.ReactNode;
  showDivider?: boolean;
  /** Tighter vertical padding for dense layouts (e.g. the Home config). */
  compact?: boolean;
}

/**
 * Compact config row for settings-style controls.
 * Shared between HomeScreen and GameSetupScreen.
 */
export default function ConfigRow({ label, children, showDivider = true, compact = false }: ConfigRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <>
      {showDivider && <View style={styles.divider} />}
      <View style={[styles.row, compact && styles.rowCompact]}>
        <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
        <View style={styles.controls}>{children}</View>
      </View>
    </>
  );
}

/** Card wrapper for groups of ConfigRows. */
export function ConfigCard({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return <View style={[styles.card, compact && styles.cardCompact]}>{children}</View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.rule,
    overflow: 'hidden',
  },
  cardCompact: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.rule,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  rowCompact: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.ink,
    minWidth: 58,
    flexShrink: 0,
  },
  labelCompact: {
    fontSize: fontSize.xs,
    minWidth: 48,
  },
  controls: {
    flexDirection: 'row',
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'flex-end',
  },
});

