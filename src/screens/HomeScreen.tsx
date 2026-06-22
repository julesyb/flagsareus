import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { fontFamily, fontSize, spacing, borderRadius, buildButtons, typography } from '../utils/theme';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../utils/theme';
import { getCategoryCount } from '../data';
import { initAudio, hapticTap, setSoundsEnabled, setHapticsEnabled } from '../utils/feedback';
import { getStats, getSettings, getMissedFlagIds, getBaselineData, isDailyCompleteToday, BaselineData, getFlagStats, getBadgeData, getDayStreakInfo, getPersistedLevel, persistLevel } from '../utils/storage';
import { getDailyConfig, getDailyVariant } from '../utils/gameEngine';
import { RootStackParamList } from '../types/navigation';
import { GameMode, CategoryId, BASELINE_REGIONS } from '../types';
import { PlayIcon, ChevronRightIcon, CheckIcon, LinkIcon, CalendarIcon, GlobeIcon, CrosshairIcon, CompassIcon, FlagIcon, ClockIcon } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import ScreenContainer from '../components/ScreenContainer';
import FactOfDay from '../components/FactOfDay';
import { useNavTabs } from '../hooks/useNavTabs';
import { computeLevelProgress, LevelProgress } from '../utils/levels';
import { t } from '../utils/i18n';
import { UNLIMITED_QUESTIONS, TIMEATTACK_DEFAULT_TIME } from '../utils/config';

// The "Test" quick-play always launches the same friendly default: 10 flags, medium.
const TEST_MODE: GameMode = 'medium';
const TEST_COUNT = 10;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// One of the four primary action squares on the home grid.
interface ActionSquare {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  onPress: () => void;
  a11yLabel: string;
  a11yHint?: string;
}

export default function HomeScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const onNavigate = useNavTabs();
  const [weakFlagCount, setWeakFlagCount] = useState(0);
  const [dailyDone, setDailyDone] = useState(false);
  const dailyVariant = useMemo(() => getDailyVariant(), []);
  const dailyTagText = useMemo(() => {
    const diffLabel = t(`common.${dailyVariant.difficulty}`).toLowerCase();
    if (dailyVariant.gameType === 'flagpuzzle') {
      return t('home.dailyVariant', { mode: t('setup.flagPuzzle').toLowerCase() });
    }
    if (dailyVariant.gameType === 'capitalconnection') {
      return t('home.dailyVariant', { mode: `${t('setup.capitalQuiz').toLowerCase()} - ${diffLabel}` });
    }
    const modeStr = dailyVariant.displayMode === 'map'
      ? `${diffLabel} ${t('setup.displayMap').toLowerCase()}`
      : diffLabel;
    return t('home.dailyVariant', { mode: modeStr });
  }, [dailyVariant]);
  const [baseline, setBaseline] = useState<BaselineData | null>(null);
  const [levelProgress, setLevelProgress] = useState<LevelProgress | null>(null);

  useEffect(() => {
    initAudio();
    getSettings().then((s) => {
      setSoundsEnabled(s.soundEnabled);
      setHapticsEnabled(s.hapticsEnabled);
    }).catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      getMissedFlagIds().then((ids) => setWeakFlagCount(ids.length)).catch(() => {});
      isDailyCompleteToday().then(setDailyDone).catch(() => {});
      getBaselineData().then(setBaseline).catch(() => {});
      Promise.all([getStats(), getFlagStats(), getBadgeData(), getDayStreakInfo(), getPersistedLevel()]).then(
        ([s, fs, bd, dsi, pl]) => {
          const lp = computeLevelProgress({ stats: s, flagStats: fs, badgeData: bd, dayStreakInfo: dsi }, pl);
          setLevelProgress(lp);
          persistLevel(lp.currentLevel);
        },
      ).catch(() => {});
    }, []),
  );

  // ── "Test" quick-play: straight into 10 medium flags ──
  const playTest = () => {
    hapticTap();
    navigation.navigate('Game', {
      config: { mode: TEST_MODE, category: 'all', questionCount: TEST_COUNT, displayMode: 'flag' },
    });
  };

  // ── Baseline ("See Where You Stand") state ──
  const baselineComplete = baseline?.completedAt != null;
  const baselineDoneCount = baseline ? BASELINE_REGIONS.filter((r) => baseline.regions[r]).length : 0;
  const nextRegion = baseline
    ? BASELINE_REGIONS.find((r) => !baseline.regions[r]) ?? BASELINE_REGIONS[0]
    : BASELINE_REGIONS[0];
  const baselineOverallPct = useMemo(() => {
    if (!baseline) return 0;
    let correct = 0;
    let total = 0;
    for (const r of BASELINE_REGIONS) {
      const result = baseline.regions[r];
      if (result) {
        correct += result.correct;
        total += result.total;
      }
    }
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [baseline]);

  const startBaseline = () => {
    hapticTap();
    if (baselineComplete) {
      navigation.navigate('Stats');
      return;
    }
    const count = getCategoryCount(nextRegion as CategoryId);
    navigation.navigate('Game', {
      config: { mode: 'baseline', category: nextRegion as CategoryId, questionCount: count, displayMode: 'flag' },
    });
  };

  // ── Primary action squares (data-driven) ──
  const squares: ActionSquare[] = [
    {
      key: 'baseline',
      title: t('onboarding.baselineProgress'),
      subtitle: baselineComplete
        ? t('home.baselineOverall', { pct: baselineOverallPct })
        : t('onboarding.regionsComplete', { count: baselineDoneCount, total: BASELINE_REGIONS.length }),
      icon: <CrosshairIcon size={22} color={colors.modeBlue} />,
      accent: colors.modeBlue,
      onPress: startBaseline,
      a11yLabel: t('onboarding.baselineProgress'),
      a11yHint: baselineComplete ? t('a11y.opensStats') : t('a11y.beginsBaseline'),
    },
    {
      key: 'choose',
      title: t('home.chooseYourGame'),
      subtitle: t('home.chooseYourGameDesc'),
      icon: <CompassIcon size={22} color={colors.modePurple} />,
      accent: colors.modePurple,
      onPress: () => {
        hapticTap();
        navigation.navigate('GameSetup');
      },
      a11yLabel: t('home.chooseYourGame'),
      a11yHint: t('a11y.opensMode'),
    },
    {
      key: 'practice',
      title: t('home.practice'),
      subtitle: t('home.practiceDesc'),
      icon: <FlagIcon size={22} color={colors.modeGreen} />,
      accent: colors.modeGreen,
      onPress: () => {
        hapticTap();
        navigation.navigate('Browse');
      },
      a11yLabel: t('home.practice'),
      a11yHint: t('home.practiceDesc'),
    },
    {
      key: 'timed',
      title: t('home.timedQuiz'),
      subtitle: t('home.timedQuizTag'),
      icon: <ClockIcon size={22} color={colors.modeRed} />,
      accent: colors.modeRed,
      onPress: () => {
        hapticTap();
        navigation.navigate('Game', {
          config: { mode: 'timeattack', category: 'all', questionCount: UNLIMITED_QUESTIONS, timeLimit: TIMEATTACK_DEFAULT_TIME, displayMode: 'flag' },
        });
      },
      a11yLabel: t('a11y.playMode', { mode: t('home.timedQuiz') }),
      a11yHint: t('a11y.opensMode'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenContainer>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>
            <Text style={styles.wmFlag}>Flag</Text>
            <Text style={styles.wmThat}>That</Text>
          </Text>
          {levelProgress && (
            <TouchableOpacity
              style={styles.levelBadge}
              onPress={() => navigation.navigate('Stats')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t('stats.level', { level: levelProgress.currentLevel })}
              accessibilityHint={t('a11y.opensStats')}
            >
              <Text style={styles.levelBadgeLabel}>{t('stats.levelLabel')}</Text>
              <Text style={styles.levelBadgeNum}>{levelProgress.currentLevel}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── TEST (primary quick-play) ── */}
        <View style={styles.testWrap}>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={playTest}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('home.test')}
            accessibilityHint={t('home.testSub')}
          >
            <Text style={styles.testBtnText}>{t('home.test')}</Text>
            <PlayIcon size={15} color={colors.playText} />
          </TouchableOpacity>
          <Text style={styles.testSub}>{t('home.testSub')}</Text>
        </View>

        {/* ── ACTION SQUARES ── */}
        <View style={styles.grid}>
          {squares.map((sq) => (
            <TouchableOpacity
              key={sq.key}
              style={styles.square}
              onPress={sq.onPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={sq.a11yLabel}
              accessibilityHint={sq.a11yHint}
            >
              <View style={[styles.squareIcon, { backgroundColor: sq.accent + '22' }]}>
                {sq.icon}
              </View>
              <Text style={styles.squareTitle} numberOfLines={2}>{sq.title}</Text>
              <Text style={styles.squareSub} numberOfLines={2}>{sq.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── FACT OF THE DAY ── */}
        <View style={{ marginHorizontal: spacing.md, marginTop: spacing.lg }}>
          <FactOfDay />
        </View>

        {/* ── GAME MODES ── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionLbl}>{t('home.gameModes')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('GameSetup')} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={t('common.seeAllModes')}>
              <Text style={styles.sectionAll}>{t('common.all')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modeList}>
            <TouchableOpacity
              style={[styles.modeRow, dailyDone && styles.modeRowDisabled]}
              activeOpacity={dailyDone ? 1 : 0.85}
              disabled={dailyDone}
              onPress={() => {
                hapticTap();
                const config = getDailyConfig();
                if (dailyVariant.gameType === 'flagpuzzle') {
                  navigation.navigate('FlagPuzzle', { config });
                } else if (dailyVariant.gameType === 'capitalconnection') {
                  navigation.navigate('CapitalConnection', { config });
                } else {
                  navigation.navigate('Game', { config });
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={dailyDone ? t('home.comeBackTomorrow') : t('home.daily')}
              accessibilityHint={dailyDone ? undefined : t('a11y.opensMode')}
              accessibilityState={{ disabled: dailyDone }}
            >
              <View style={[styles.modeBar, { backgroundColor: dailyDone ? colors.dim : colors.modeGold }]} />
              <CalendarIcon size={15} color={dailyDone ? colors.textTertiary : colors.goldBright} />
              <Text style={[styles.modeTitle, dailyDone ? styles.modeTitleDisabled : { color: colors.goldBright }]}>
                {t('home.daily')}
              </Text>
              <Text style={styles.modeTag}>
                {dailyDone ? t('home.comeBackTomorrow') : dailyTagText}
              </Text>
              {dailyDone ? <CheckIcon size={14} color={colors.success} /> : <ChevronRightIcon size={14} color={colors.dim} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeRow}
              activeOpacity={0.85}
              onPress={() => {
                hapticTap();
                navigation.navigate('FlagImpostor', {
                  config: { mode: 'impostor', category: 'all', questionCount: 10, displayMode: 'flag' },
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.playMode', { mode: t('home.flagImpostor') })}
              accessibilityHint={t('a11y.opensMode')}
            >
              <View style={[styles.modeBar, { backgroundColor: colors.modeGreen }]} />
              <Text style={styles.modeTitle}>{t('home.flagImpostor')}</Text>
              <Text style={styles.modeTag}>{t('home.flagImpostorDesc')}</Text>
              <ChevronRightIcon size={14} color={colors.dim} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeRow}
              activeOpacity={0.85}
              onPress={() => {
                hapticTap();
                navigation.navigate('FlagPuzzle', {
                  config: { mode: 'flagpuzzle', category: 'all', questionCount: 10, timeLimit: 15, displayMode: 'flag' },
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.playMode', { mode: t('setup.flagPuzzle') })}
              accessibilityHint={t('a11y.opensMode')}
            >
              <View style={[styles.modeBar, { backgroundColor: colors.modePurple }]} />
              <Text style={styles.modeTitle}>{t('setup.flagPuzzle')}</Text>
              <Text style={styles.modeTag}>{t('setup.flagPuzzleDesc')}</Text>
              <ChevronRightIcon size={14} color={colors.dim} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeRow}
              activeOpacity={0.85}
              onPress={() => {
                hapticTap();
                navigation.navigate('GeoFacts');
              }}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.playMode', { mode: t('home.geoFacts') })}
              accessibilityHint={t('a11y.opensMode')}
            >
              <View style={[styles.modeBar, { backgroundColor: colors.modeBlue }]} />
              <GlobeIcon size={15} color={colors.modeBlue} />
              <Text style={styles.modeTitle}>{t('home.geoFacts')}</Text>
              <Text style={styles.modeTag}>{t('home.geoFactsDesc')}</Text>
              <ChevronRightIcon size={14} color={colors.dim} />
            </TouchableOpacity>

            {weakFlagCount > 0 && (
              <TouchableOpacity
                style={styles.modeRow}
                activeOpacity={0.85}
                onPress={() => {
                  hapticTap();
                  navigation.navigate('Game', {
                    config: { mode: 'practice', category: 'all', questionCount: weakFlagCount, displayMode: 'flag' },
                  });
                }}
                accessibilityRole="button"
                accessibilityLabel={t('a11y.playMode', { mode: t('home.practiceWeak') })}
                accessibilityHint={t('a11y.opensPractice')}
              >
                <View style={[styles.modeBar, { backgroundColor: colors.modeRed }]} />
                <Text style={[styles.modeTitle, { color: colors.red }]}>{t('home.practiceWeak')}</Text>
                <Text style={styles.modeTag}>{weakFlagCount === 1 ? t('home.flagsToReview', { count: weakFlagCount }) : t('home.flagsToReviewPlural', { count: weakFlagCount })}</Text>
                <ChevronRightIcon size={14} color={colors.dim} />
              </TouchableOpacity>
            )}

            {/* ── JOIN A CHALLENGE ── */}
            <TouchableOpacity
              style={styles.modeRow}
              activeOpacity={0.85}
              onPress={() => {
                hapticTap();
                navigation.navigate('JoinChallenge');
              }}
              accessibilityRole="button"
              accessibilityLabel={t('challenge.joinTitle')}
              accessibilityHint={t('challenge.codeHint')}
            >
              <View style={[styles.modeBar, { backgroundColor: colors.modeGold }]} />
              <LinkIcon size={15} color={colors.goldBright} />
              <Text style={[styles.modeTitle, { color: colors.goldBright }]}>{t('challenge.joinTitle')}</Text>
              <Text style={styles.modeTag}>{t('challenge.codeHint')}</Text>
              <ChevronRightIcon size={14} color={colors.dim} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: spacing.md }} />
        </ScreenContainer>
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <BottomNav activeTab="Home" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const createStyles = (colors: ThemeColors) => { const btn = buildButtons(colors); return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  wordmark: {
    lineHeight: 28,
  },
  wmFlag: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.title,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  wmThat: {
    fontFamily: fontFamily.displayItalic,
    fontSize: fontSize.title,
    color: colors.goldBright,
  },
  levelBadge: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.goldBright,
    backgroundColor: colors.surface,
  },
  levelBadgeLabel: {
    fontFamily: fontFamily.uiLabel,
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelBadgeNum: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.body,
    color: colors.goldBright,
    letterSpacing: -0.5,
  },

  // ── Test (primary quick-play)
  testWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  testBtn: {
    ...btn.primary,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  testBtnText: {
    ...btn.primaryText,
  },
  testSub: {
    ...typography.micro,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Action squares grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  square: {
    flexGrow: 1,
    flexBasis: '47%',
    minHeight: 116,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    justifyContent: 'flex-start',
  },
  squareIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  squareTitle: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.body,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  squareSub: {
    ...typography.micro,
    color: colors.textTertiary,
    marginTop: spacing.xxs,
  },

  // ── Game modes
  sectionWrap: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionLbl: {
    ...typography.heading,
    color: colors.ink,
  },
  sectionAll: {
    ...typography.microMedium,
    color: colors.textTertiary,
  },
  modeList: {},
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: spacing.xxs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modeBar: {
    width: 3,
    height: 18,
    borderRadius: borderRadius.xs,
  },
  modeTitle: {
    flex: 1,
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.sm,
    color: colors.ink,
    letterSpacing: -0.1,
  },
  modeRowDisabled: {
    opacity: 0.6,
  },
  modeTitleDisabled: {
    color: colors.textTertiary,
  },
  modeTag: {
    ...typography.micro,
    color: colors.textTertiary,
  },

}); };
