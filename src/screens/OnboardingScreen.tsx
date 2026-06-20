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
import { hapticTap } from '../utils/feedback';
import { FlagIcon, GlobeIcon, TrophyIcon, CompassIcon, PlayIcon, ChevronDownIcon } from '../components/Icons';
import FlagImage from '../components/FlagImage';
import { RootStackParamList } from '../types/navigation';
import { GameConfig } from '../types';
import { t } from '../utils/i18n';
import ScreenContainer from '../components/ScreenContainer';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// Recognizable flags for the hero mosaic
const HERO_FLAGS = ['jp', 'br', 'gb', 'za'];

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

export default function OnboardingScreen({ navigation }: Props) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Whether the optional "pick your own level" section is expanded
  const [showLevels, setShowLevels] = useState(false);

  // Animations
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(20)).current;
  const ctaFade = useRef(new Animated.Value(0)).current;
  const ctaSlide = useRef(new Animated.Value(16)).current;
  const cardAnims = useRef(SKILL_OPTIONS.map(() => new Animated.Value(0))).current;
  const flagAnims = useRef(HERO_FLAGS.map(() => new Animated.Value(0))).current;
  const chevronRot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Phase 1: Hero slides in
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();

    // Phase 2: Flag mosaic stagger in
    setTimeout(() => {
      Animated.stagger(
        120,
        flagAnims.map((a) =>
          Animated.spring(a, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        ),
      ).start();
    }, 300);

    // Phase 3: Primary play CTA fades up into focus
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(ctaFade, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(ctaSlide, { toValue: 0, friction: 7, tension: 70, useNativeDriver: true }),
      ]).start();
    }, 450);
  }, []);

  const startGame = async (level: SkillLevel) => {
    await saveSkillLevel(level);
    await skipOnboarding();

    // Launch a 10-question game immediately at the chosen level.
    // Reset the nav stack so Home is the root and Game is on top.
    // When Game -> Results -> popToTop or goBack, user lands on Home.
    const config = buildGameConfig(level);
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Home' },
        { name: 'Game', params: { config } },
      ],
    });
  };

  // Primary path: one tap to start playing, kept nice and easy.
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
      // Reset and stagger the cards in each time the section opens
      cardAnims.forEach((a) => a.setValue(0));
      Animated.stagger(
        90,
        cardAnims.map((a) =>
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
          {/* Hero section with flag mosaic */}
          <Animated.View style={[styles.hero, { opacity: heroFade, transform: [{ translateY: heroSlide }] }]}>
            <View>
              <Text style={styles.welcomeText}>{t('onboarding.welcome')}</Text>
              <View style={styles.wordmarkRow}>
                <Text style={styles.wmFlag}>Flag</Text>
                <Text style={styles.wmThat}>That</Text>
              </View>
              <Text style={styles.tagline}>{t('onboarding.tagline')}</Text>
            </View>

            {/* Flag mosaic - 4 small flags fanned */}
            <View style={styles.flagMosaic}>
              {HERO_FLAGS.map((code, i) => (
                <Animated.View
                  key={code}
                  style={[
                    styles.flagThumb,
                    {
                      opacity: flagAnims[i],
                      transform: [
                        { scale: flagAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                        { rotate: `${-8 + i * 5}deg` },
                        { translateX: i * 6 },
                      ],
                    },
                  ]}
                >
                  <FlagImage countryCode={code} size="small" />
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Primary action: one tap to start playing */}
          <Animated.View style={[styles.ctaWrap, { opacity: ctaFade, transform: [{ translateY: ctaSlide }] }]}>
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

          {/* Optional: pick your own level */}
          <Animated.View style={[styles.levelsSection, { opacity: ctaFade }]}>
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
                        opacity: cardAnims[index],
                        transform: [{
                          translateY: cardAnims[index].interpolate({
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

    // ── Hero section
    hero: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.md,
      marginTop: spacing.xl,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      paddingVertical: spacing.xxl,
      overflow: 'hidden',
      ...shadows.large,
    },
    flagMosaic: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      alignSelf: 'flex-end',
      marginTop: spacing.md,
    },
    flagThumb: {
      width: 48,
      height: 32,
      borderRadius: 4,
      overflow: 'hidden',
      marginLeft: -12,
      borderWidth: 1.5,
      borderColor: colors.whiteAlpha20,
    },
    welcomeText: {
      ...typography.body,
      color: colors.whiteAlpha60,
      marginBottom: spacing.xs,
    },
    wordmarkRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: spacing.xs,
      marginBottom: spacing.md,
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
      color: colors.whiteAlpha70,
      lineHeight: 24,
    },

    // ── Primary play CTA
    ctaWrap: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.xl,
    },
    playBtn: {
      ...btn.primary,
      flexDirection: 'row',
      justifyContent: 'center',
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
