import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fontFamily, fontSize, spacing, borderRadius } from '../utils/theme';
import { HeartIcon } from './Icons';
import { showRewardedAd, isAdAvailable } from '../utils/ads';
import { getSupportData, recordAdWatched, SupportData } from '../utils/storage';
import { hapticTap, hapticCorrect } from '../utils/feedback';
import { t } from '../utils/i18n';

export default function SupportCard() {
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

  if (!isAdAvailable()) return null;

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
      setTimeout(() => setJustThanked(false), 3000);
    } else {
      setAdFailed(true);
      setTimeout(() => setAdFailed(false), 4000);
    }
    setLoading(false);
  };

  const totalWatched = support?.totalAdsWatched ?? 0;

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.iconWrap}>
          <HeartIcon size={18} color={colors.accent} strokeWidth={2} filled />
        </View>
        <View style={s.textWrap}>
          <Text style={s.title}>{t('support.title')}</Text>
          <Text style={s.subtitle}>{t('support.subtitle')}</Text>
        </View>
      </View>

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
          <HeartIcon size={14} color={colors.white} filled />
          <Text style={s.watchBtnText}>
            {loading ? '...' : t('support.watchButton')}
          </Text>
        </TouchableOpacity>
      )}

      {adFailed && (
        <Text style={s.failedText}>{t('support.adFailed')}</Text>
      )}

      {totalWatched > 0 && !justThanked && (
        <Text style={s.countText}>
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
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    backgroundColor: colors.accentBg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSize.lg,
    color: colors.ink,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    color: colors.textTertiary,
    lineHeight: 18,
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
  failedText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  countText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
