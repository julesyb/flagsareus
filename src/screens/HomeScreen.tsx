import React, { useEffect, useState } from 'react';
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
import { colors, spacing, fontFamily } from '../utils/theme';
import { getTotalFlagCount } from '../data';
import { initAudio, hapticTap } from '../utils/feedback';
import { getStats } from '../utils/storage';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const totalFlags = getTotalFlagCount();
  const [mastered, setMastered] = useState(0);

  useEffect(() => {
    initAudio();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStats().then((stats) => {
        setMastered(stats.totalCorrect);
      });
    });
    return unsubscribe;
  }, [navigation]);

  const progressPct = totalFlags > 0 ? Math.round((mastered / totalFlags) * 100) : 0;
  const progressWidth = totalFlags > 0 ? ((mastered / totalFlags) * 100).toFixed(1) : '0';

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
        {/* HEADER */}
        <View style={styles.headerTopRule} />
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.eyebrow}>Flag Identification {'\u00B7'} {totalFlags} Countries</Text>
            <Text style={styles.logotypeMain}>Flag{'\n'}<Text style={styles.logotypeItalic}>That</Text></Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.countNumber}>{totalFlags}</Text>
            <Text style={styles.countLabel}>Countries</Text>
          </View>
        </View>

        {/* BYLINE */}
        <View style={styles.byline}>
          <Text style={styles.bylineText}>Geography {'\u00B7'} Cartography {'\u00B7'} Mastery</Text>
          <View style={styles.bylineDots}>
            <View style={styles.bylineDot} />
            <View style={styles.bylineDot} />
            <View style={styles.bylineDot} />
            <View style={styles.bylineDot} />
            <View style={styles.bylineDot} />
          </View>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressBlock}>
          <View style={styles.progressLeft}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Mastery Progress</Text>
              <Text style={styles.progressFraction}>{mastered} of {totalFlags}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
            </View>
          </View>
          <View style={styles.progressPctBox}>
            <Text style={styles.progressPctNumber}>{progressPct}%</Text>
            <Text style={styles.progressPctLabel}>Complete</Text>
          </View>
        </View>

        {/* PLAY SECTION */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionLabel}>Play</Text>
          <View style={styles.sectionRule} />
        </View>

        {/* Quick Play — Hero Card */}
        <TouchableOpacity
          style={styles.cardHero}
          onPress={quickPlay}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeroBar} />
          <View style={styles.heroLeft}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>Q</Text>
            </View>
            <View>
              <Text style={styles.heroTitle}>Quick Play</Text>
              <Text style={styles.heroSub}>10 famous flags {'\u00B7'} 50/50</Text>
            </View>
          </View>
          <Text style={styles.heroArrow}>{'\u2192'}</Text>
        </TouchableOpacity>

        {/* Custom Game */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => { hapticTap(); navigation.navigate('GameSetup'); }}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeft}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>+</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Custom Game</Text>
              <Text style={styles.cardSub}>Choose mode, category & more</Text>
            </View>
          </View>
          <Text style={styles.cardArrow}>{'\u2192'}</Text>
        </TouchableOpacity>

        {/* EXPLORE SECTION */}
        <View style={[styles.sectionHead, { marginTop: spacing.lg }]}>
          <Text style={styles.sectionLabel}>Explore</Text>
          <View style={styles.sectionRule} />
        </View>

        {/* Statistics */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => { hapticTap(); navigation.navigate('Stats'); }}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeft}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>#</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Statistics</Text>
              <Text style={styles.cardSub}>Track your progress</Text>
            </View>
          </View>
          <Text style={styles.cardArrow}>{'\u2192'}</Text>
        </TouchableOpacity>

        {/* Browse Flags */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => { hapticTap(); navigation.navigate('Browse'); }}
          activeOpacity={0.85}
        >
          <View style={styles.cardLeft}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>{'\u2261'}</Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>Browse Flags</Text>
              <Text style={styles.cardSub}>Explore all {totalFlags} flags</Text>
            </View>
          </View>
          <Text style={styles.cardArrow}>{'\u2192'}</Text>
        </TouchableOpacity>
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
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },

  // HEADER
  headerTopRule: {
    width: '100%',
    height: 3,
    backgroundColor: colors.accent,
    marginTop: 56,
    marginBottom: 24,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
  },
  eyebrow: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.slate,
    marginBottom: 8,
  },
  logotypeMain: {
    fontFamily: fontFamily.display,
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 58,
    color: colors.ink,
    letterSpacing: -1,
  },
  logotypeItalic: {
    fontFamily: fontFamily.displayItalic,
    fontWeight: '400',
    color: colors.accent,
  },
  headerRight: {
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  countNumber: {
    fontFamily: fontFamily.display,
    fontSize: 52,
    fontWeight: '700',
    lineHeight: 52,
    color: colors.ink,
    letterSpacing: -1,
  },
  countLabel: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.slate,
    marginTop: 2,
  },

  // BYLINE
  byline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
    marginBottom: 40,
  },
  bylineText: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.slate,
  },
  bylineDots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  bylineDot: {
    width: 4,
    height: 4,
    backgroundColor: colors.rule2,
  },

  // PROGRESS
  progressBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.rule,
    borderBottomWidth: 1,
    borderBottomColor: colors.rule,
    marginBottom: 40,
  },
  progressLeft: {
    flex: 1,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  progressLabel: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: colors.slate,
  },
  progressFraction: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: colors.slate,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.rule,
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.ink,
  },
  progressPctBox: {
    width: 80,
    alignItems: 'flex-end',
  },
  progressPctNumber: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  progressPctLabel: {
    fontFamily: fontFamily.uiLabelMedium,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.slate,
    marginTop: 2,
  },

  // SECTION HEADS
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  sectionLabel: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.slate,
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.rule,
  },

  // HERO CARD (dark, red left bar)
  cardHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.ink,
    padding: 28,
    paddingLeft: 32,
    marginBottom: 8,
    position: 'relative',
  },
  cardHeroBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.accent,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconText: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 16,
    color: colors.white,
  },
  heroTitle: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 26,
    color: colors.white,
    marginBottom: 4,
  },
  heroSub: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.45)',
  },
  heroArrow: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 20,
    color: 'rgba(255,255,255,0.4)',
  },

  // STANDARD CARDS
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.rule,
    borderLeftWidth: 3,
    borderLeftColor: colors.rule,
    padding: 18,
    paddingHorizontal: 24,
    marginBottom: 6,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: colors.rule,
    backgroundColor: colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 14,
    color: colors.slate,
  },
  cardTitle: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.ink,
    lineHeight: 20,
    marginBottom: 3,
  },
  cardSub: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.slate,
  },
  cardArrow: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    color: colors.rule2,
  },
});
