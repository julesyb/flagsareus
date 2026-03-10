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
          <Text style={styles.logo}>Flags</Text>
          <Text style={styles.logoAccent}>Are Us</Text>
          <Text style={styles.subtitle}>
            {totalFlags} country flags to master
          </Text>
        </View>

        <View style={styles.menuSection}>
          {/* Quick Play - one tap to start */}
          <TouchableOpacity
            style={[styles.menuCard, styles.quickPlayCard]}
            onPress={quickPlay}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>⚡</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, styles.lightText]}>Quick Play</Text>
                <Text style={[styles.cardDescription, styles.lightTextDim]}>
                  10 famous flags, 50/50
                </Text>
              </View>
            </View>
            <Text style={[styles.cardArrow, styles.lightText]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuCard, styles.playCard]}
            onPress={() => { hapticTap(); navigation.navigate('GameSetup'); }}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>🎮</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, styles.lightText]}>Custom Game</Text>
                <Text style={[styles.cardDescription, styles.lightTextDim]}>
                  Choose mode, category & more
                </Text>
              </View>
            </View>
            <Text style={[styles.cardArrow, styles.lightText]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => { hapticTap(); navigation.navigate('Stats'); }}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>📊</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Statistics</Text>
                <Text style={styles.cardDescription}>
                  Track your progress
                </Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => { hapticTap(); navigation.navigate('Browse'); }}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>🌍</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Browse Flags</Text>
                <Text style={styles.cardDescription}>
                  Explore all {totalFlags} flags
                </Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>→</Text>
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
  logo: {
    ...typography.hero,
    fontSize: 48,
    color: colors.primary,
  },
  logoAccent: {
    ...typography.hero,
    fontSize: 48,
    color: colors.accent,
    marginTop: -8,
  },
  subtitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.sm,
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
  cardEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
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
