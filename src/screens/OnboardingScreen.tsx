import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fontFamily, fontSize, spacing, borderRadius, shadows, typography, buildButtons, ThemeColors } from '../utils/theme';
import { useTheme } from '../contexts/ThemeContext';
import { skipOnboarding, saveSkillLevel, SkillLevel } from '../utils/storage';
import { hapticTap, hapticCorrect, hapticWrong } from '../utils/feedback';
import { FlagIcon, GlobeIcon, TrophyIcon, CompassIcon, PlayIcon, ChevronDownIcon } from '../components/Icons';
import FlagImage from '../components/FlagImage';
import { RootStackParamList } from '../types/navigation';
import { GameConfig, GameQuestion } from '../types';
import { generateQuestions } from '../utils/gameEngine';
import { flagName, translateName } from '../data/countryNames';
import { t } from '../utils/i18n';
import ScreenContainer from '../components/ScreenContainer';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// Each skill level maps to a specific first-game experience
function buildGameConfig(level: SkillLevel): GameConfig {
  switch (level) {
    case 'beginner':
      // 10 easy questions from famous/popular flags only
      return { mode: 'easy', category: 'easy_flags', questionCount: 10, displayMode: 'flag' };
    case 'intermediate':
      // 10 medium questions (4 choices) from all flags
      return { mode: 'medium', category: 'all', questionCount: 10, displayMode: 'flag' };
    case 'advanced':
      // 10 hard questions with autocomplete hints enabled
      return { mode: 'hard', category: 'all', questionCount: 10, displayMode: 'flag', autocomplete: true };
    case 'expert':
      // Map display with 4 flag choices, the real challenge
      return { mode: 'medium', category: 'all', questionCount: 10, displayMode: 'map' };
  }
}

interface SkillOption {
  level: SkillLevel;
  titleKey: string;
  descKey: string;
  tagKey: string;
  icon: (size: number, color: string) => React.ReactNode;
  colorKey: keyof ThemeColors;
  bgKey: keyof ThemeColors;
  borderKey: keyof ThemeColors;
}

const SKILL_OPTIONS: SkillOption[] = [
  {
    level: 'beginner',
    titleKey: 'onboarding.skillBeginner',
    descKey: 'onboarding.skillBeginnerDesc',
    tagKey: 'onboarding.skillBeginnerTag',
    icon: (size, color) => <FlagIcon size={size} color={color} />,
    colorKey: 'diffEasy',
    bgKey: 'diffEasyBg',
    borderKey: 'diffEasyBorder',
  },
  {
    level: 'intermediate',
    titleKey: 'onboarding.skillIntermediate',
    descKey: 'onboarding.skillIntermediateDesc',
    tagKey: 'onboarding.skillIntermediateTag',
    icon: (size, color) => <GlobeIcon size={size} color={color} />,
    colorKey: 'diffMedium',
    bgKey: 'diffMediumBg',
    borderKey: 'diffMediumBorder',
  },
  {
    level: 'advanced',
    titleKey: 'onboarding.skillAdvanced',
    descKey: 'onboarding.skillAdvancedDesc',
    tagKey: 'onboarding.skillAdvancedTag',
    icon: (size, color) => <TrophyIcon size={size} color={color} />,
    colorKey: 'diffHard',
    bgKey: 'diffHardBg',
    borderKey: 'diffHardBorder',
  },
  {
    level: 'expert',
    titleKey: 'onboarding.skillExpert',
    descKey: 'onboarding.skillExpertDesc',
    tagKey: 'onboarding.skillExpertTag',
    icon: (size, color) => <CompassIcon size={size} color={color} />,
    colorKey: 'modePurple',
    bgKey: 'expertBg',
    borderKey: 'expertBorder',
  },
];

// Generate a single easy, recognizable flag question with 4 choices.
// Medium mode over the famous-flags category gives a friendly first taste.
function buildTasterQuestion(): GameQuestion | null {
  const questions = generateQuestions({
    mode: 'medium',
    category: 'easy_flags',
    questionCount: 1,
    displayMode: 'flag',
  });
  return questions[0] ?? null;
}

export default function OnboardingScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // The instant first question, generated once.
  const [question] = useState<GameQuestion | null>(buildTasterQuestion);
  // The option the player tapped (null until they answer).
  const [answered, setAnswered] = useState<string | null>(null);
  // Whether the optional "pick your own level" section is expanded.
  const [showLevels, setShowLevels] = useState(false);

  // Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(20)).current;
  const resultFade = useRef(new Animated.Value(0)).current;
  const levelAnims = useRef(SKILL_OPTIONS.map(() => new Animated.Value(0))).current;
  const chevronRot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(cardFade, { toValue: 1, duration: 500, delay: 150, useNativeDriver: true }),
      Animated.spring(cardSlide, { toValue: 0, friction: 8, tension: 60, delay: 150, useNativeDriver: true }),
    ]).start();
  }, []);

  const startGame = async (level: SkillLevel) => {
    await saveSkillLevel(level);
    await skipOnboarding();

    // Launch a 10-question game at the chosen level. Reset the nav stack so
    // Home is the root and Game sits on top, so leaving Game lands on Home.
    const config = buildGameConfig(level);
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'Game', params: { config } },
      ],
    });
  };

  const isCorrect = !!answered && !!question && answered === question.flag.name;

  const handleAnswer = (option: string) => {
    if (answered || !question) return;
    const correct = option === question.flag.name;
    if (correct) hapticCorrect(); else hapticWrong();
    setAnswered(option);
    // Reveal the feedback + continue CTA.
    Animated.timing(resultFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  };

  // Primary path: continue into a full easy game after the taster.
  const handleKeepPlaying = () => {
    hapticTap();
    startGame('beginner');
  };

  // Fallback if no taster question could be built: a plain one-tap play.
  const handlePlay = () => {
    hapticTap();
    startGame('beginner');
  };

  // Optional path: player picks a specific level.
  const handleSkillSelect = (level: SkillLevel) => {
    hapticTap();
    startGame(level);
  };

  const handleToggleLevels = () => {
    hapticTap();
    const next = !showLevels;
    setShowLevels(next);
    Animated.timing(chevronRot, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    if (next) {
      levelAnims.forEach((a) => a.setValue(0));
      Animated.stagger(
        90,
        levelAnims.map((a) =>
          Animated.spring(a, { toValue: 1, friction: 7, tension: 70, useNativeDriver: true }),
        ),
      ).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenContainer>
          {/* Compact header */}
          <Animated.View style={[styles.header, { opacity: headerFade }]}>
            <View style={styles.wordmarkRow}>
              <Text style={styles.wmFlag}>Flag</Text>
              <Text style={styles.wmThat}>That</Text>
            </View>
            <Text style={styles.tagline}>{t('onboarding.tagline')}</Text>
          </Animated.View>

          {question ? (
            <>
              {/* Instant playable question */}
              <Animated.View style={[styles.questionCard, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}>
                <Text style={styles.questionPrompt}>{t('onboarding.whichCountry')}</Text>
                <View style={styles.flagWrap}>
                  <FlagImage countryCode={question.flag.id} size="hero" transition={0} />
                </View>

                <View style={styles.optionsGrid}>
                  {question.options.map((option) => {
                    const optionIsAnswer = option === question.flag.name;
                    const optionIsSelected = answered === option;

                    let optionStyle = styles.option;
                    let optionTextStyle = styles.optionText;
                    if (answered) {
                      if (optionIsAnswer) {
                        optionStyle = { ...styles.option, ...styles.optionCorrect };
                        optionTextStyle = { ...styles.optionText, ...styles.optionTextFeedback };
                      } else if (optionIsSelected) {
                        optionStyle = { ...styles.option, ...styles.optionWrong };
                        optionTextStyle = { ...styles.optionText, ...styles.optionTextFeedback };
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={option}
                        style={optionStyle}
                        onPress={() => handleAnswer(option)}
                        disabled={!!answered}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel={translateName(option)}
                        accessibilityState={{ disabled: !!answered }}
                      >
                        <Text style={optionTextStyle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                          {translateName(option)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>

              {/* Result + continue */}
              {answered && (
                <Animated.View style={[styles.resultWrap, { opacity: resultFade }]}>
                  <Text style={[styles.resultText, { color: isCorrect ? colors.success : colors.error }]}>
                    {isCorrect ? t('common.correct') : `${t('onboarding.notQuite')} ${flagName(question.flag)}`}
                  </Text>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={handleKeepPlaying}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={t('onboarding.keepPlaying')}
                  >
                    <Text style={styles.playBtnText}>{t('onboarding.keepPlaying')}</Text>
                    <PlayIcon size={14} color={colors.playText} />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </>
          ) : (
            /* Fallback: plain one-tap play if no question could be built */
            <Animated.View style={[styles.ctaWrap, { opacity: cardFade }]}>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={handlePlay}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={t('onboarding.playCta')}
              >
                <Text style={styles.playBtnText}>{t('onboarding.playCta')}</Text>
                <PlayIcon size={14} color={colors.playText} />
              </TouchableOpacity>
              <Text style={styles.ctaSub}>{t('onboarding.playCtaSub')}</Text>
            </Animated.View>
          )}

          {/* Optional: pick your own level (hidden once the taster is answered) */}
          {!answered && (
            <Animated.View style={[styles.levelsSection, { opacity: cardFade }]}>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={handleToggleLevels}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t('onboarding.orPickLevel')}
                accessibilityState={{ expanded: showLevels }}
              >
                <Text style={styles.toggleText}>{t('onboarding.orPickLevel')}</Text>
                <Animated.View
                  style={{
                    transform: [{
                      rotate: chevronRot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }),
                    }],
                  }}
                >
                  <ChevronDownIcon size={18} color={colors.textTertiary} />
                </Animated.View>
              </TouchableOpacity>

              {showLevels && (
                <View style={styles.cardList}>
                  {SKILL_OPTIONS.map((option, index) => {
                    const accentColor = colors[option.colorKey];
                    const bgColor = colors[option.bgKey] || 'transparent';
                    const borderColor = colors[option.borderKey] || accentColor;

                    return (
                      <Animated.View
                        key={option.level}
                        style={{
                          opacity: levelAnims[index],
                          transform: [{
                            translateY: levelAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [24, 0],
                            }),
                          }],
                        }}
                      >
                        <TouchableOpacity
                          style={[styles.skillCard, { backgroundColor: bgColor, borderColor }]}
                          onPress={() => handleSkillSelect(option.level)}
                          activeOpacity={0.8}
                          accessibilityRole="button"
                          accessibilityLabel={t(option.titleKey)}
                          accessibilityHint={t(option.descKey)}
                        >
                          <View style={[styles.skillIcon, { backgroundColor: accentColor }]}>
                            {option.icon(20, colors.white)}
                          </View>
                          <View style={styles.skillTextWrap}>
                            <Text style={[styles.skillTitle, { color: accentColor }]}>
                              {t(option.titleKey)}
                            </Text>
                            <Text style={styles.skillDesc}>{t(option.descKey)}</Text>
                          </View>
                          <View style={[styles.skillTag, { backgroundColor: accentColor }]}>
                            <Text style={styles.skillTagText}>{t(option.tagKey)}</Text>
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          )}
        </ScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => {
  const btn = buildButtons(colors);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacing.xxl + spacing.lg,
    },

    // ── Header
    header: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    wordmarkRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    wmFlag: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.display,
      lineHeight: 44,
      color: colors.text,
      letterSpacing: -0.5,
    },
    wmThat: {
      fontFamily: fontFamily.displayItalic,
      fontSize: fontSize.display,
      lineHeight: 44,
      color: colors.accentLight,
    },
    tagline: {
      ...typography.label,
      color: colors.textSecondary,
      lineHeight: 24,
    },

    // ── Question card
    questionCard: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.md,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.large,
    },
    questionPrompt: {
      fontFamily: fontFamily.bodyBold,
      fontSize: fontSize.lg,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    flagWrap: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    option: {
      flexGrow: 1,
      flexBasis: '47%',
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
    },
    optionCorrect: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    optionWrong: {
      backgroundColor: colors.error,
      borderColor: colors.error,
    },
    optionText: {
      ...typography.bodyBold,
      color: colors.text,
    },
    optionTextFeedback: {
      color: colors.white,
    },

    // ── Result + continue
    resultWrap: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
      alignItems: 'center',
      gap: spacing.md,
    },
    resultText: {
      ...typography.heading,
      textAlign: 'center',
    },

    // ── Primary CTA
    ctaWrap: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.xl,
    },
    playBtn: {
      ...btn.primary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignSelf: 'stretch',
      gap: spacing.sm,
      paddingVertical: 16,
    },
    playBtnText: {
      ...btn.primaryText,
    },
    ctaSub: {
      ...typography.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },

    // ── Optional level picker
    levelsSection: {
      marginTop: spacing.lg,
      paddingHorizontal: spacing.md,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    toggleText: {
      fontFamily: fontFamily.bodyMedium,
      fontSize: fontSize.sm,
      color: colors.textTertiary,
    },

    // ── Skill cards
    cardList: {
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    skillCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      paddingVertical: spacing.lg,
      gap: spacing.md,
      ...shadows.small,
    },
    skillIcon: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    skillTextWrap: {
      flex: 1,
    },
    skillTitle: {
      fontFamily: fontFamily.uiLabel,
      fontSize: fontSize.body,
      letterSpacing: 0.3,
      marginBottom: 3,
    },
    skillDesc: {
      ...typography.caption,
      color: colors.textTertiary,
      lineHeight: 18,
    },
    skillTag: {
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
    },
    skillTagText: {
      fontFamily: fontFamily.uiLabel,
      fontSize: fontSize.xs,
      color: colors.white,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
  });
};
