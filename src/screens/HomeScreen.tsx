import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fontFamily, spacing } from '../utils/theme';
import { getTotalFlagCount } from '../data';
import { initAudio, hapticTap } from '../utils/feedback';
import { getStats } from '../utils/storage';
import { RootStackParamList } from '../types/navigation';
import { GameMode, UserStats } from '../types';
import { LightningIcon, BarChartIcon, GlobeIcon } from '../components/Icons';
import FlagImage from '../components/FlagImage';

const MODES: { key: GameMode; label: string; desc: string }[] = [
  { key: 'easy', label: '2', desc: '50/50' },
  { key: 'medium', label: '4', desc: 'Pick from 4' },
  { key: 'hard', label: 'Type', desc: 'Type it' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const GRID_SPACING = 80;

// Some well-known flags for the preview
const PREVIEW_FLAG = 'br';
const PREVIEW_OPTIONS = ['Brazil', 'Colombia', 'Argentina', 'Venezuela'];

// ─── Background Grid ─────────────────────────────────────────
function GridLines() {
  const screenWidth = Dimensions.get('window').width;
  const lineCount = Math.floor(screenWidth / GRID_SPACING);

  return (
    <View style={styles.gridContainer} pointerEvents="none">
      {Array.from({ length: lineCount }, (_, i) => (
        <View
          key={i}
          style={[styles.gridLine, { left: (i + 1) * GRID_SPACING }]}
        />
      ))}
    </View>
  );
}

// ─── Fade-up wrapper ─────────────────────────────────────────
function FadeUp({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────
export default function HomeScreen({ navigation }: Props) {
  const totalFlags = getTotalFlagCount();
  const [mode, setMode] = useState<GameMode>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [questionCountAll, setQuestionCountAll] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    initAudio();
  }, []);

  // Reload stats every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getStats().then(setStats);
    }, [])
  );

  const play = () => {
    hapticTap();
    navigation.navigate('Game', {
      config: { mode, category: 'all', questionCount: questionCountAll ? totalFlags : questionCount, displayMode: 'flag' },
    });
  };

  const hasPlayed = stats !== null && stats.totalGamesPlayed > 0;
  const accuracy = stats && stats.totalAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GridLines />

      <View style={styles.content}>
        {/* ── HEADER ── */}
        <FadeUp delay={0}>
          <View style={styles.headerTopRule} />
          <View style={styles.headerInner}>
            <View>
              <Text style={styles.logotypeMain}>
                Flag{'\n'}
                <Text style={styles.logotypeItalic}>That</Text>
              </Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.countNumber}>{totalFlags}</Text>
              <Text style={styles.countLabel}>Countries</Text>
            </View>
          </View>
        </FadeUp>

        {/* ── HOOK HEADLINE ── */}
        <FadeUp delay={120}>
          <Text style={styles.hookLine}>
            {hasPlayed ? 'Think you can do better?' : 'How many can you name?'}
          </Text>
        </FadeUp>

        {/* ── BIG PLAY BUTTON ── */}
        <FadeUp delay={220}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={play}
            activeOpacity={0.85}
          >
            <View style={styles.playButtonBar} />
            <View style={styles.playButtonInner}>
              <View style={styles.playIcon}>
                <LightningIcon size={26} color={colors.white} filled />
              </View>
              <Text style={styles.playButtonText}>Play</Text>
            </View>
            <Text style={styles.playArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        </FadeUp>

        {/* ── RETURNING USER STATS ── */}
        {hasPlayed && (
          <FadeUp delay={300}>
            <View style={styles.statsTeaser}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats!.totalGamesPlayed}</Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{accuracy}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats!.bestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </View>
          </FadeUp>
        )}

        {/* ── CUSTOMIZE TOGGLE ── */}
        <FadeUp delay={hasPlayed ? 380 : 300}>
          <TouchableOpacity
            style={styles.customizeToggle}
            onPress={() => { hapticTap(); setShowCustomize(!showCustomize); }}
            activeOpacity={0.7}
          >
            <Text style={styles.customizeToggleText}>
              {showCustomize ? 'Hide options' : 'Customize'}
            </Text>
            <Text style={styles.customizeArrow}>{showCustomize ? '\u2191' : '\u2193'}</Text>
          </TouchableOpacity>

          {showCustomize && (
            <View style={styles.customizePanel}>
              {/* ── QUESTION COUNT PICKER ── */}
              <View style={styles.modeSwitcher}>
                <Text style={styles.modeSwitcherLabel}>Cards</Text>
                <View style={styles.modeSwitcherRow}>
                  {QUESTION_COUNTS.map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[styles.modeChip, !questionCountAll && questionCount === count && styles.modeChipActive]}
                      onPress={() => { hapticTap(); setQuestionCount(count); setQuestionCountAll(false); }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.modeChipText, !questionCountAll && questionCount === count && styles.modeChipTextActive]}>
                        {count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.modeChip, questionCountAll && styles.modeChipActive]}
                    onPress={() => { hapticTap(); setQuestionCountAll(true); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modeChipText, questionCountAll && styles.modeChipTextActive]}>
                      All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── MODE SWITCHER ── */}
              <View style={styles.modeSwitcher}>
                <Text style={styles.modeSwitcherLabel}>Mode</Text>
                <View style={styles.modeSwitcherRow}>
                  {MODES.map((m) => (
                    <TouchableOpacity
                      key={m.key}
                      style={[styles.modeChip, mode === m.key && styles.modeChipActive]}
                      onPress={() => { hapticTap(); setMode(m.key); }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.modeChipText, mode === m.key && styles.modeChipTextActive]}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </FadeUp>

        {/* ── GAME PREVIEW ── */}
        <FadeUp delay={hasPlayed ? 440 : 360}>
          <View style={styles.previewSection}>
            <View style={styles.previewCard}>
              <View style={styles.previewFlagWrap}>
                <FlagImage countryCode={PREVIEW_FLAG} size="medium" />
              </View>
              <View style={styles.previewOptions}>
                {PREVIEW_OPTIONS.map((opt, i) => (
                  <View
                    key={opt}
                    style={[
                      styles.previewOption,
                      i === 0 && styles.previewOptionCorrect,
                    ]}
                  >
                    <Text
                      style={[
                        styles.previewOptionText,
                        i === 0 && styles.previewOptionTextCorrect,
                      ]}
                    >
                      {i === 0 ? opt : '\u2022\u2022\u2022\u2022\u2022\u2022'}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.previewOverlay} />
            </View>
            <Text style={styles.previewCaption}>See a flag. Name the country.</Text>
          </View>
        </FadeUp>
      </View>

      {/* ── BOTTOM NAV BAR ── */}
      <View style={styles.bottomNav}>
        <View style={styles.bottomNavTopRule} />
        <View style={styles.bottomNavInner}>
          <TouchableOpacity
            style={styles.bottomNavItem}
            onPress={play}
            activeOpacity={0.7}
          >
            <LightningIcon size={16} color={colors.ink} filled />
            <Text style={styles.bottomNavLabel}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomNavItem}
            onPress={() => { hapticTap(); navigation.navigate('Browse'); }}
            activeOpacity={0.7}
          >
            <GlobeIcon size={16} color={colors.ink} />
            <Text style={styles.bottomNavLabel}>Browse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomNavItem}
            onPress={() => { hapticTap(); navigation.navigate('Stats'); }}
            activeOpacity={0.7}
          >
            <BarChartIcon size={16} color={colors.ink} />
            <Text style={styles.bottomNavLabel}>Stats</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },

  // Grid
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.rule,
    opacity: 0.35,
  },

  // Header
  headerTopRule: {
    width: '100%',
    height: 3,
    backgroundColor: colors.accent,
    marginBottom: spacing.md,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  logotypeMain: {
    fontFamily: fontFamily.display,
    fontSize: 64,
    lineHeight: 58,
    color: colors.ink,
    letterSpacing: -1.3,
  },
  logotypeItalic: {
    fontFamily: fontFamily.displayItalic,
    color: colors.accent,
  },
  headerRight: {
    alignItems: 'flex-end',
    paddingBottom: spacing.xs,
  },
  countNumber: {
    fontFamily: fontFamily.display,
    fontSize: 52,
    lineHeight: 52,
    color: colors.ink,
    letterSpacing: -1.6,
  },
  countLabel: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.slate,
    marginTop: spacing.xxs,
  },

  // Hook headline
  hookLine: {
    fontFamily: fontFamily.displayItalic,
    fontSize: 22,
    color: colors.slate,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },

  // Big play button
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.ink,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    position: 'relative',
  },
  playButtonBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.accent,
  },
  playButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playIcon: {
    width: 52,
    height: 52,
    borderWidth: 1,
    borderColor: colors.whiteAlpha20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 38,
    letterSpacing: 4,
    textTransform: 'uppercase',
    lineHeight: 38,
    color: colors.white,
  },
  playArrow: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 24,
    color: colors.whiteAlpha45,
  },

  // Stats teaser
  statsTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.rule,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamily.display,
    fontSize: 24,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.slate,
    marginTop: spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.rule,
  },

  // Customize toggle
  customizeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  customizeToggleText: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.slate,
  },
  customizeArrow: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.slate,
  },

  // Customize panel
  customizePanel: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
  },

  // Mode switcher (reused for cards & mode)
  modeSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  modeSwitcherLabel: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 9,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: colors.slate,
  },
  modeSwitcherRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.white,
  },
  modeChipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  modeChipText: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.slate,
  },
  modeChipTextActive: {
    color: colors.white,
  },

  // Game preview
  previewSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.rule,
    padding: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  previewFlagWrap: {
    opacity: 0.85,
  },
  previewOptions: {
    flex: 1,
    gap: spacing.xs,
  },
  previewOption: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.background,
  },
  previewOptionCorrect: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  previewOptionText: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textTertiary,
  },
  previewOptionTextCorrect: {
    color: colors.white,
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(249,250,251,0.25)',
  },
  previewCaption: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },

  // Bottom nav
  bottomNav: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  bottomNavTopRule: {
    height: 2,
    backgroundColor: colors.ink,
  },
  bottomNavInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  bottomNavLabel: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.ink,
  },
});
