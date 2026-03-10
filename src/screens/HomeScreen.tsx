import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { getTotalFlagCount } from '../data';
import { initAudio, hapticTap } from '../utils/feedback';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const totalFlags = getTotalFlagCount();

  useEffect(() => {
    initAudio();
  }, []);

  const quickPlay = () => {
    hapticTap();
    navigation.navigate('Game', {
      config: { mode: 'easy', category: 'easy_flags', questionCount: 10 },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>F</Text>
            </View>
            <View>
              <Text style={styles.logo}>Flags</Text>
              <Text style={styles.logoAccent}>Are Us</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            {totalFlags} flags to master
          </Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuCard, styles.quickPlayCard]}
            onPress={quickPlay}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardIconBox}>
                <Text style={styles.cardIconText}>Q</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, styles.lightText]}>Quick Play</Text>
                <Text style={[styles.cardDescription, styles.lightTextDim]}>
                  10 famous flags, 50/50
                </Text>
              </View>
            </View>
            <Text style={[styles.cardArrow, styles.lightText]}>{'\u2192'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuCard, styles.playCard]}
            onPress={() => { hapticTap(); navigation.navigate('GameSetup'); }}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIconBox, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Text style={styles.cardIconText}>+</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, styles.lightText]}>Custom Game</Text>
                <Text style={[styles.cardDescription, styles.lightTextDim]}>
                  Choose mode, category & more
                </Text>
              </View>
            </View>
            <Text style={[styles.cardArrow, styles.lightText]}>{'\u2192'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => { hapticTap(); navigation.navigate('Stats'); }}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIconBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={[styles.cardIconText, { color: colors.text }]}>#</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Statistics</Text>
                <Text style={styles.cardDescription}>
                  Track your progress
                </Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>{'\u2192'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => { hapticTap(); navigation.navigate('Browse'); }}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={[styles.cardIconBox, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={[styles.cardIconText, { color: colors.text }]}>{'\u2261'}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Browse Flags</Text>
                <Text style={styles.cardDescription}>
                  Explore all {totalFlags} flags
                </Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  logoMarkText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  logo: {
    ...typography.hero,
    fontSize: 40,
    color: colors.primary,
  },
  logoAccent: {
    ...typography.hero,
    fontSize: 40,
    color: colors.accent,
    marginTop: -6,
  },
  subtitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  menuSection: {
    gap: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.small,
  },
  quickPlayCard: {
    backgroundColor: colors.accent,
  },
  playCard: {
    backgroundColor: colors.primary,
  },
  lightText: {
    color: colors.white,
  },
  lightTextDim: {
    color: 'rgba(255,255,255,0.6)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.text,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardArrow: {
    ...typography.heading,
    color: colors.textTertiary,
  },
});
