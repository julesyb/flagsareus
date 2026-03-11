import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fontFamily, fontSize, spacing, borderRadius } from '../utils/theme';
import { HeartIcon, PlayIcon } from './Icons';
import { showRewardedAd, isAdAvailable } from '../utils/ads';
import { getSupportData, recordAdWatched, SupportData } from '../utils/storage';
import { hapticTap, hapticCorrect } from '../utils/feedback';
import { t } from '../utils/i18n';

// Only show after the user has played enough to be genuinely engaged
const MIN_GAMES_BEFORE_SHOWING = 3;

interface SupportCardProps {
  gamesPlayed: number;
}

export default function SupportCard({ gamesPlayed }: SupportCardProps) {
  const [support, setSupport] = useState<SupportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [justThanked, setJustThanked] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getSupportData().then(setSupport);
      setJustThanked(false);
      setAdFailed(false);
    }, []),
  );

  // Don't show on web, before the user is engaged, or while loading data
  if (!isAdAvailable()) return null;
  if (gamesPlayed < MIN_GAMES_BEFORE_SHOWING) return null;

  const handleWatch = async () => {
    if (loading) return;
    hapticTap();
    setLoading(true);
    setAdFailed(false);

    const rewarded = await showRewardedAd();
    if (rewarded) {
      const updated = await recordAdWatched();
      setSupport(updated);
      setJustThanked(true);
      hapticCorrect();
      setTimeout(() => setJustThanked(false), 4000);
    } else {
      setAdFailed(true);
      setTimeout(() => setAdFailed(false), 4000);
    }
    setLoading(false);
  };

  const totalWatched = support?.totalAdsWatched ?? 0;
  const isSupporter = totalWatched > 0;

  return (
    <View style={s.card}>
      <View style={s.header}>
        <HeartIcon size={14} color={colors.accent} strokeWidth={2} filled />
        <Text style={s.title}>{t('support.title')}</Text>
      </View>

      <Text style={s.subtitle}>{t('support.subtitle')}</Text>

      {justThanked ? (
        <View style={s.thankYouWrap}>
          <Text style={s.thankYouText}>{t('support.thankYou')}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[s.watchBtn, loading && s.watchBtnDisabled]}
          onPress={handleWatch}
          activeOpacity={0.85}
          disabled={loading}
        >
          <PlayIcon size={10} color={colors.white} />
          <Text style={s.watchBtnText}>
            {loading ? '...' : t('support.watchButton')}
          </Text>
        </TouchableOpacity>
      )}

      {adFailed && (
        <Text style={s.metaText}>{t('support.adFailed')}</Text>
      )}

      {isSupporter && !justThanked && (
        <Text style={s.metaText}>
          {totalWatched === 1
            ? t('support.totalWatched', { count: totalWatched })
            : t('support.totalWatchedPlural', { count: totalWatched })}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.body,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.ink,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
  },
  watchBtnDisabled: {
    opacity: 0.5,
  },
  watchBtnText: {
    fontFamily: fontFamily.uiLabel,
    fontSize: fontSize.caption,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.white,
  },
  thankYouWrap: {
    backgroundColor: colors.successBg,
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  thankYouText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.body,
    color: colors.success,
  },
  metaText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
