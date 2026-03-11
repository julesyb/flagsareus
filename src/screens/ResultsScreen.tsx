import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, typography, fontFamily, fontSize, buttons, borderRadius } from '../utils/theme';
import { calculateAccuracy, getStreakFromResults, getGrade, generateDailyShareGrid, getDailyNumber } from '../utils/gameEngine';
import { updateStats, updateFlagResults, saveDailyChallenge, incrementDailyChallenges, updateLastGameBadgeFlags, markShared, getStats, getFlagStats, getDayStreak, getBadgeData, getMissedFlagIds, FlagStats } from '../utils/storage';
import { t } from '../utils/i18n';
import { hapticCorrect, playCelebrationSound } from '../utils/feedback';
import { FlagImageSmall } from '../components/FlagImage';
import { CheckIcon, CrossIcon, ChevronRightIcon, BarChartIcon, FlagIcon, GlobeIcon, PlayIcon, LightningIcon, CalendarIcon, ClockIcon, CrosshairIcon, LinkIcon } from '../components/Icons';
import BottomNav from '../components/BottomNav';
import { UserStats, GameMode } from '../types';
import { RootStackParamList } from '../types/navigation';
import { evaluateBadges, BADGES, TIER_COLORS, BadgeIcon, EarnedBadge } from '../utils/badges';
import { getTotalFlagCount } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

// Modes worth showing in the mode bar on stats
const VISIBLE_MODES: { key: GameMode; label: string }[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Med' },
  { key: 'hard', label: 'Hard' },
  { key: 'timeattack', label: '60s' },
  { key: 'daily', label: 'Daily' },
];

export default function ResultsScreen({ route, navigation }: Props) {
  const { results, config, reviewOnly } = route.params;
  const correct = results.filter((r) => r.correct).length;
  const accuracy = calculateAccuracy(results);
  const streak = getStreakFromResults(results);
  const grade = getGrade(accuracy);
  const avgTime = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.timeTaken, 0) / results.length / 1000 * 10) / 10
    : 0;
  const isPerfect = accuracy === 100 && results.length > 0;
  const isDaily = config.mode === 'daily';

  // Find fastest correct answer
  const fastestCorrect = results
    .filter((r) => r.correct)
    .reduce<{ name: string; time: number } | null>((best, r) => {
      const t = r.timeTaken;
      if (!best || t < best.time) return { name: r.question.flag.name, time: t };
      return best;
    }, null);

  // Animations
  const gradeScale = useRef(new Animated.Value(0)).current;
  const confettiOpacity = useRef(new Animated.Value(0)).current;
  const insightsOpacity = useRef(new Animated.Value(0)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const reviewAnims = useRef(results.map(() => new Animated.Value(0))).current;
  const timelineOpacity = useRef(new Animated.Value(0)).current;

  // Progress data loaded after stats update
  const [overallStats, setOverallStats] = useState<UserStats | null>(null);
  const [countriesSeen, setCountriesSeen] = useState(0);
  const [totalFlags, setTotalFlags] = useState(0);
  const [dayStreakCount, setDayStreakCount] = useState(0);
  const [newBadges, setNewBadges] = useState<EarnedBadge[]>([]);
  const [totalBadgesEarned, setTotalBadgesEarned] = useState(0);
  const [isNewBestStreak, setIsNewBestStreak] = useState(false);
  const [newCountriesCount, setNewCountriesCount] = useState(0);
  const [prevAccuracy, setPrevAccuracy] = useState<number | null>(null);
  const [weakFlagCount, setWeakFlagCount] = useState(0);

  useEffect(() => {
    async function processResults() {
      // Snapshot pre-game state
      const [preStats, preFlagStats, preDayStreak, preBadgeData, preMissed] = await Promise.all([
        getStats(), getFlagStats(), getDayStreak(), getBadgeData(), getMissedFlagIds(),
      ]);
      const preBadgeIds = new Set(evaluateBadges({
        stats: preStats,
        flagStats: preFlagStats,
        dayStreak: preDayStreak,
        dailyChallengesCompleted: preBadgeData.dailyChallengesCompleted,
        hasShared: preBadgeData.hasShared,
        lastGamePerfect10: preBadgeData.lastGamePerfect10,
        lastGameSRank: preBadgeData.lastGameSRank,
        weakFlagCount: preMissed.length,
      }).map((b) => b.id));

      const wasNewBestStreak = streak > preStats.bestStreak;
      const prevAcc = preStats.totalAnswered > 0
        ? Math.round((preStats.totalCorrect / preStats.totalAnswered) * 100)
        : null;

      // Count new countries learned this game
      let newCountries = 0;
      for (const r of results) {
        if (r.correct) {
          const prev = preFlagStats[r.question.flag.id];
          if (!prev || prev.right === 0) newCountries++;
        }
      }

      // Update stats
      if (!reviewOnly) {
        await updateStats(correct, results.length, streak, config.mode, config.category);
        await updateFlagResults(results);
        await updateLastGameBadgeFlags(correct, results.length);
        if (isDaily) {
          await saveDailyChallenge(results);
          await incrementDailyChallenges();
        }
      }

      // Load post-game state
      const [postStats, postFlagStats, postDayStreak, postBadgeData, postMissed] = await Promise.all([
        getStats(), getFlagStats(), getDayStreak(), getBadgeData(), getMissedFlagIds(),
      ]);

      const postBadges = evaluateBadges({
        stats: postStats,
        flagStats: postFlagStats,
        dayStreak: postDayStreak,
        dailyChallengesCompleted: postBadgeData.dailyChallengesCompleted,
        hasShared: postBadgeData.hasShared,
        lastGamePerfect10: postBadgeData.lastGamePerfect10,
        lastGameSRank: postBadgeData.lastGameSRank,
        weakFlagCount: postMissed.length,
      });

      setOverallStats(postStats);
      setDayStreakCount(postDayStreak);
      setTotalFlags(getTotalFlagCount());
      setCountriesSeen(Object.values(postFlagStats).filter((fs) => fs.right > 0).length);
      setNewBadges(postBadges.filter((b) => !preBadgeIds.has(b.id)));
      setTotalBadgesEarned(postBadges.length);
      setIsNewBestStreak(wasNewBestStreak && !reviewOnly);
      setNewCountriesCount(reviewOnly ? 0 : newCountries);
      setPrevAccuracy(prevAcc);
      setWeakFlagCount(postMissed.length);
    }

    processResults();

    // Staggered entrance animations
    Animated.spring(gradeScale, {
      toValue: 1, friction: 4, tension: 80, delay: 200, useNativeDriver: true,
    }).start();

    Animated.timing(timelineOpacity, {
      toValue: 1, duration: 400, delay: 450, useNativeDriver: true,
    }).start();

    Animated.timing(insightsOpacity, {
      toValue: 1, duration: 400, delay: 600, useNativeDriver: true,
    }).start();

    Animated.timing(progressOpacity, {
      toValue: 1, duration: 400, delay: 800, useNativeDriver: true,
    }).start();

    Animated.stagger(
      50,
      reviewAnims.map((a) =>
        Animated.timing(a, { toValue: 1, duration: 250, delay: 1000, useNativeDriver: true }),
      ),
    ).start();

    if (isPerfect) {
      hapticCorrect();
      playCelebrationSound();
      const loopAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(confettiOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(confettiOpacity, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        ]),
      );
      loopAnim.start();
      return () => { loopAnim.stop(); };
    }
  }, []);

  const categoryLabel = config.category === 'all'
    ? t('categories.all') : t(`categories.${config.category}`);
  const modeLabel = t(`modes.${config.mode}`);

  const handleShare = async () => {
    const message = isDaily
      ? generateDailyShareGrid(results)
      : `Flag That\n${modeLabel} - ${categoryLabel}\nScore: ${correct}/${results.length} (${accuracy}%)\nGrade: ${grade.label} | Streak: ${streak}\n${isPerfect ? t('results.perfectShareNote') + '\n' : ''}${t('results.shareFooter')}`;
    try {
      await Share.share({ message });
      markShared();
    } catch { /* cancelled */ }
  };

  const dailyNumber = isDaily ? getDailyNumber() : 0;
  const goHome = () => navigation.popToTop();

  const playAgain = () => {
    if (isDaily) { navigation.popToTop(); return; }
    const modeScreenMap: Partial<Record<GameMode, keyof RootStackParamList>> = {
      flagflash: 'FlagFlash', flagpuzzle: 'FlagPuzzle', neighbors: 'Neighbors',
      impostor: 'FlagImpostor', capitalconnection: 'CapitalConnection',
    };
    const screen = modeScreenMap[config.mode] || 'Game';
    navigation.replace(screen as 'Game', { config });
  };

  const progressPct = totalFlags > 0 ? Math.round((countriesSeen / totalFlags) * 100) : 0;

  // Accuracy vs average insight
  const accDiff = prevAccuracy !== null ? accuracy - prevAccuracy : null;
  const accInsight = prevAccuracy === null
    ? t('results.firstGame')
    : accDiff !== null && accDiff > 0
      ? t('results.aboveAverage', { pct: accDiff })
      : accDiff !== null && accDiff < 0
        ? t('results.belowAverage', { pct: Math.abs(accDiff) })
        : null;

  const renderBadgeIcon = (icon: BadgeIcon, tierColor: string) => {
    const size = 18;
    switch (icon) {
      case 'flag': return <FlagIcon size={size} color={tierColor} />;
      case 'globe': return <GlobeIcon size={size} color={tierColor} />;
      case 'check': return <CheckIcon size={size} color={tierColor} />;
      case 'play': return <PlayIcon size={size} color={tierColor} />;
      case 'lightning': return <LightningIcon size={size} color={tierColor} />;
      case 'calendar': return <CalendarIcon size={size} color={tierColor} />;
      case 'clock': return <ClockIcon size={size} color={tierColor} />;
      case 'crosshair': return <CrosshairIcon size={size} color={tierColor} />;
      case 'link': return <LinkIcon size={size} color={tierColor} />;
      default: return <FlagIcon size={size} color={tierColor} />;
    }
  };

  return (
    <SafeAreaView style={st.container}>
      <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
        {/* ── PERFECT BANNER ── */}
        {isPerfect && (
          <Animated.View style={[st.celebrationBanner, { opacity: confettiOpacity }]}>
            <Text style={st.celebrationText}>{t('results.perfectScore')}</Text>
          </Animated.View>
        )}

        {/* ── HERO GRADE ── */}
        <Animated.View style={[st.heroCard, { transform: [{ scale: gradeScale }] }]}>
          <Text style={st.heroEyebrow}>
            {isDaily ? t('results.dailyTitle', { number: dailyNumber }) : `${modeLabel} / ${categoryLabel}`}
          </Text>
          <View style={st.heroCenter}>
            <Text style={[st.heroGrade, { color: grade.color }]}>{grade.label}</Text>
            <View style={st.heroNumbers}>
              <Text style={st.heroAccuracy}>{accuracy}%</Text>
              <Text style={st.heroScoreText}>{correct}/{results.length} {t('results.correct').toLowerCase()}</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── STREAK TIMELINE ── */}
        <Animated.View style={[st.timelineCard, { opacity: timelineOpacity }]}>
          <View style={st.timelineDots}>
            {results.map((r, i) => (
              <View
                key={i}
                style={[
                  st.timelineDot,
                  r.correct ? st.timelineDotCorrect : st.timelineDotWrong,
                ]}
              />
            ))}
          </View>
          <View style={st.timelineStats}>
            <View style={st.timelineStat}>
              <Text style={st.timelineStatValue}>{streak}</Text>
              <Text style={st.timelineStatLabel}>{t('results.bestStreak')}</Text>
              {isNewBestStreak && (
                <View style={st.newBestPill}>
                  <Text style={st.newBestPillText}>{t('results.newBest')}</Text>
                </View>
              )}
            </View>
            <View style={st.timelineDivider} />
            <View style={st.timelineStat}>
              <Text style={st.timelineStatValue}>{avgTime}<Text style={st.timelineStatUnit}>s</Text></Text>
              <Text style={st.timelineStatLabel}>{t('results.avgTime')}</Text>
            </View>
            {fastestCorrect && (
              <>
                <View style={st.timelineDivider} />
                <View style={st.timelineStat}>
                  <Text style={st.timelineStatValue}>
                    {Math.round(fastestCorrect.time / 100) / 10}<Text style={st.timelineStatUnit}>s</Text>
                  </Text>
                  <Text style={st.timelineStatLabel}>{t('results.fastest')}</Text>
                </View>
              </>
            )}
          </View>
        </Animated.View>

        {/* ── DAILY GRID ── */}
        {isDaily && (
          <View style={st.dailyGridCard}>
            <Text style={st.dailyGridTitle}>{t('results.shareTitle', { number: dailyNumber })}</Text>
            <View style={st.dailyGrid}>
              <View style={st.dailyGridRow}>
                {results.slice(0, 5).map((r, i) => (
                  <View key={i} style={[st.dailyCell, r.correct ? st.dailyCellCorrect : st.dailyCellWrong]} />
                ))}
              </View>
              <View style={st.dailyGridRow}>
                {results.slice(5, 10).map((r, i) => (
                  <View key={i} style={[st.dailyCell, r.correct ? st.dailyCellCorrect : st.dailyCellWrong]} />
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ── INSIGHT CHIPS ── */}
        {!reviewOnly && (
          <Animated.View style={[st.insightRow, { opacity: insightsOpacity }]}>
            {newCountriesCount > 0 && (
              <View style={st.insightChip}>
                <GlobeIcon size={13} color={colors.success} />
                <Text style={[st.insightText, { color: colors.success }]}>
                  {t('results.newCountries', { count: newCountriesCount })}
                </Text>
              </View>
            )}
            {accInsight && (
              <View style={st.insightChip}>
                <BarChartIcon size={13} color={accDiff !== null && accDiff >= 0 ? colors.success : colors.textTertiary} />
                <Text style={[st.insightText, accDiff !== null && accDiff > 0 && { color: colors.success }]}>
                  {accInsight}
                </Text>
              </View>
            )}
            {dayStreakCount > 0 && (
              <View style={st.insightChip}>
                <CalendarIcon size={13} color={colors.accent} />
                <Text style={[st.insightText, { color: colors.accent }]}>{dayStreakCount} {t('stats.dayStreak').toLowerCase()}</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* ── ACTION BUTTONS ── */}
        <View style={st.buttonRow}>
          <TouchableOpacity style={st.secondaryButton} onPress={handleShare} activeOpacity={0.7}>
            <Text style={st.secondaryButtonText}>{t('common.share')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={st.primaryButton} onPress={playAgain} activeOpacity={0.7}>
            <Text style={st.primaryButtonText}>{isDaily ? t('common.home') : t('common.play')}</Text>
          </TouchableOpacity>
          {!isDaily && (
            <TouchableOpacity style={st.secondaryButton} onPress={goHome} activeOpacity={0.7}>
              <Text style={st.secondaryButtonText}>{t('common.home')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── NEWLY EARNED BADGES ── */}
        {newBadges.length > 0 && (
          <View style={st.badgesSection}>
            <View style={st.sectionHeader}>
              <Text style={st.sectionTitle}>{t('results.badgesUnlocked')}</Text>
              <Text style={st.sectionMeta}>
                {t('stats.badgesEarned', { earned: totalBadgesEarned, total: BADGES.length })}
              </Text>
            </View>
            {newBadges.map((badge) => {
              const tierColor = TIER_COLORS[badge.tier];
              return (
                <View key={badge.id} style={st.badgeRow}>
                  <View style={[st.badgeIconWrap, { backgroundColor: tierColor + '18' }]}>
                    {renderBadgeIcon(badge.icon, tierColor)}
                  </View>
                  <View style={st.badgeContent}>
                    <Text style={st.badgeName}>{badge.name}</Text>
                    <Text style={st.badgeDesc}>{badge.description}</Text>
                  </View>
                  <View style={[st.badgeTierPill, { backgroundColor: tierColor + '18' }]}>
                    <Text style={[st.badgeTierText, { color: tierColor }]}>{badge.tier}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── YOUR PROGRESS ── */}
        {overallStats && !reviewOnly && (
          <Animated.View style={[st.progressSection, { opacity: progressOpacity }]}>
            <View style={st.sectionHeader}>
              <Text style={st.sectionTitle}>{t('results.yourProgress')}</Text>
            </View>
            <View style={st.progressCard}>
              <View style={st.progressTopRow}>
                <View style={st.progressStat}>
                  <Text style={st.progressStatValue}>{countriesSeen}</Text>
                  <Text style={st.progressStatLabel}>
                    {t('stats.countriesOf', { seen: countriesSeen, total: totalFlags })}
                  </Text>
                </View>
                <View style={st.progressStat}>
                  <Text style={st.progressStatValue}>{overallStats.totalGamesPlayed}</Text>
                  <Text style={st.progressStatLabel}>{t('stats.gamesPlayed')}</Text>
                </View>
              </View>
              <View style={st.progressBarWrap}>
                <View style={[st.progressBarFill, { width: `${progressPct}%` }]} />
              </View>
              <Text style={st.progressPctLabel}>
                {t('stats.percentComplete', { pct: progressPct })}
              </Text>
            </View>

            {/* Practice weak CTA */}
            {weakFlagCount > 0 && (
              <TouchableOpacity
                style={st.practiceButton}
                onPress={() => {
                  navigation.replace('Game', {
                    config: { mode: 'practice', category: 'all', questionCount: weakFlagCount, displayMode: 'flag' },
                  });
                }}
                activeOpacity={0.7}
              >
                <CrosshairIcon size={16} color={colors.accent} />
                <Text style={st.practiceButtonText}>{t('results.practiceWeak')}</Text>
                <Text style={st.practiceButtonMeta}>{t('results.flagsToReview', { count: weakFlagCount })}</Text>
                <ChevronRightIcon size={14} color={colors.accent} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={st.viewStatsButton}
              onPress={() => navigation.navigate('Stats')}
              activeOpacity={0.7}
            >
              <BarChartIcon size={16} color={colors.ink} />
              <Text style={st.viewStatsText}>{t('results.viewAllStats')}</Text>
              <ChevronRightIcon size={14} color={colors.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── REVIEW ── */}
        <View style={st.sectionHeader}>
          <Text style={st.sectionTitle}>{t('common.review')}</Text>
          <Text style={st.sectionMeta}>{correct}/{results.length} {t('results.correct').toLowerCase()}</Text>
        </View>
        {results.map((result, index) => {
          const itemTime = Math.round(result.timeTaken / 100) / 10;
          const isFastest = fastestCorrect && result.correct && result.timeTaken === fastestCorrect.time;
          return (
            <Animated.View
              key={index}
              style={[
                st.reviewItem,
                result.correct ? st.reviewCorrect : st.reviewWrong,
                {
                  opacity: reviewAnims[index],
                  transform: [{
                    translateY: reviewAnims[index].interpolate({
                      inputRange: [0, 1], outputRange: [12, 0],
                    }),
                  }],
                },
              ]}
            >
              <Text style={[st.reviewIndex, result.correct ? st.reviewIndexCorrect : st.reviewIndexWrong]}>
                {index + 1}
              </Text>
              <FlagImageSmall countryCode={result.question.flag.id} emoji={result.question.flag.emoji} />
              <View style={st.reviewContent}>
                <Text style={st.reviewName}>{result.question.flag.name}</Text>
                {!result.correct && result.userAnswer !== 'SKIPPED' && (
                  <Text style={st.reviewAnswer}>{t('results.youSaid', { answer: result.userAnswer })}</Text>
                )}
                {result.userAnswer === 'SKIPPED' && (
                  <Text style={st.reviewAnswer}>{t('results.skipped')}</Text>
                )}
              </View>
              <View style={st.reviewRight}>
                <Text style={[st.reviewTime, isFastest && st.reviewTimeFastest]}>{itemTime}s</Text>
                {result.correct
                  ? <CheckIcon size={18} color={colors.success} />
                  : <CrossIcon size={18} color={colors.error} />
                }
              </View>
            </Animated.View>
          );
        })}

        <View style={{ height: spacing.lg }} />
      </ScrollView>
      <BottomNav
        activeTab="Play"
        onNavigate={(tab) => {
          if (tab === 'Play') navigation.popToTop();
          else if (tab === 'Modes') navigation.navigate('GameSetup');
          else if (tab === 'Stats') navigation.navigate('Stats');
          else if (tab === 'Browse') navigation.navigate('Browse');
        }}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  // ── Celebration
  celebrationBanner: {
    backgroundColor: colors.warning,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
  },
  celebrationText: { ...typography.headingUpper, color: colors.primary },

  // ── Hero Grade
  heroCard: {
    backgroundColor: colors.ink,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroEyebrow: {
    fontFamily: fontFamily.uiLabel,
    fontSize: fontSize.xxs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.whiteAlpha45,
    marginBottom: spacing.md,
  },
  heroCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  heroGrade: {
    fontSize: fontSize.grade,
    fontFamily: fontFamily.display,
    letterSpacing: -1,
  },
  heroNumbers: {
    alignItems: 'flex-start',
  },
  heroAccuracy: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.stat,
    color: colors.white,
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  heroScoreText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.caption,
    color: colors.whiteAlpha60,
    marginTop: spacing.xxs,
  },

  // ── Streak Timeline
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  timelineDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: spacing.md,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  timelineDotCorrect: {
    backgroundColor: colors.success,
  },
  timelineDotWrong: {
    backgroundColor: colors.error,
  },
  timelineStats: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineStat: {
    flex: 1,
    alignItems: 'center',
  },
  timelineDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  timelineStatValue: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.heading,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  timelineStatUnit: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.caption,
    color: colors.textTertiary,
  },
  timelineStatLabel: {
    fontFamily: fontFamily.uiLabel,
    fontSize: fontSize.xxs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textTertiary,
    marginTop: spacing.xxs,
  },
  newBestPill: {
    backgroundColor: colors.accentBg,
    borderRadius: borderRadius.full,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: spacing.xxs,
  },
  newBestPillText: {
    fontFamily: fontFamily.uiLabel,
    fontSize: fontSize.xxs,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.accent,
  },

  // ── Daily Grid
  dailyGridCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dailyGridTitle: {
    fontFamily: fontFamily.uiLabel,
    fontSize: fontSize.sm,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.whiteAlpha45,
    marginBottom: spacing.md,
  },
  dailyGrid: { gap: 6 },
  dailyGridRow: { flexDirection: 'row', gap: 6 },
  dailyCell: { width: 44, height: 44, borderRadius: borderRadius.sm },
  dailyCellCorrect: { backgroundColor: colors.success },
  dailyCellWrong: { backgroundColor: colors.whiteAlpha20 },

  // ── Insight Chips
  insightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.sm,
  },
  insightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  insightText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  // ── Buttons
  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  secondaryButton: { ...buttons.secondary, flex: 1, justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { ...buttons.secondaryText, textAlign: 'center' },
  primaryButton: { ...buttons.primary, flex: 1, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { ...buttons.primaryText, textAlign: 'center' },

  // ── Badges
  badgesSection: { marginBottom: spacing.md },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 6,
    gap: 12,
  },
  badgeIconWrap: {
    width: 36, height: 36, borderRadius: borderRadius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeContent: { flex: 1 },
  badgeName: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.caption, color: colors.ink, marginBottom: 2 },
  badgeDesc: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.textSecondary },
  badgeTierPill: { borderRadius: borderRadius.full, paddingVertical: 3, paddingHorizontal: 10 },
  badgeTierText: { fontFamily: fontFamily.uiLabel, fontSize: fontSize.xxs, letterSpacing: 0.8, textTransform: 'uppercase' },

  // ── Progress
  progressSection: { marginBottom: spacing.md },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  progressTopRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: 14 },
  progressStat: { alignItems: 'center', flex: 1 },
  progressStatValue: { fontFamily: fontFamily.display, fontSize: fontSize.heading, color: colors.ink, letterSpacing: -0.5 },
  progressStatLabel: {
    fontFamily: fontFamily.uiLabel, fontSize: fontSize.xxs, letterSpacing: 0.8,
    textTransform: 'uppercase', color: colors.textTertiary, marginTop: spacing.xxs, textAlign: 'center',
  },
  progressBarWrap: {
    height: 7, backgroundColor: colors.border,
    borderRadius: borderRadius.full, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: colors.accent, borderRadius: borderRadius.full },
  progressPctLabel: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.sm, color: colors.ink, marginTop: 6 },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accentBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.accent,
    padding: 14,
    marginTop: 8,
  },
  practiceButtonText: {
    fontFamily: fontFamily.uiLabel, fontSize: fontSize.caption,
    letterSpacing: 0.8, textTransform: 'uppercase', color: colors.accent,
  },
  practiceButtonMeta: {
    fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.textTertiary, flex: 1, textAlign: 'right',
  },
  viewStatsButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border,
    padding: 14, marginTop: 8,
  },
  viewStatsText: {
    fontFamily: fontFamily.uiLabel, fontSize: fontSize.caption,
    letterSpacing: 0.8, textTransform: 'uppercase', color: colors.ink, flex: 1,
  },

  // ── Sections
  sectionHeader: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    marginTop: spacing.md, marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fontFamily.uiLabel, fontSize: fontSize.xxs,
    letterSpacing: 1.2, textTransform: 'uppercase', color: colors.textTertiary,
  },
  sectionMeta: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.textTertiary },

  // ── Review
  reviewItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    padding: 12, paddingHorizontal: 14, marginBottom: 6,
    borderLeftWidth: 4, borderRadius: borderRadius.md, gap: 12,
  },
  reviewCorrect: { borderLeftColor: colors.success },
  reviewWrong: { borderLeftColor: colors.error },
  reviewIndex: { fontFamily: fontFamily.display, fontSize: fontSize.caption, minWidth: 18, textAlign: 'center' },
  reviewIndexCorrect: { color: colors.success },
  reviewIndexWrong: { color: colors.error },
  reviewContent: { flex: 1 },
  reviewName: { fontFamily: fontFamily.bodyBold, fontSize: fontSize.body, color: colors.text },
  reviewAnswer: { fontFamily: fontFamily.body, fontSize: fontSize.sm, color: colors.error, marginTop: spacing.xxs },
  reviewRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewTime: { fontFamily: fontFamily.bodyMedium, fontSize: fontSize.sm, color: colors.textTertiary },
  reviewTimeFastest: { color: colors.success },
});
