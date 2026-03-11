import {
  MobileAds,
  TestIds,
  AdsConsent,
  AdsConsentStatus,
  useInterstitialAd as useInterstitialAdNative,
} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INTERSTITIAL_ID = TestIds.INTERSTITIAL;

const AD_IMPRESSIONS_KEY = '@flagthat_ad_impressions';
const GAMES_BETWEEN_ADS = 3;

let initialized = false;

export async function initializeAds(): Promise<void> {
  if (initialized) return;
  try {
    await MobileAds().initialize();
    initialized = true;
  } catch {
    // Ads init failed - app continues without ads
  }
}

export async function requestConsent(): Promise<void> {
  try {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdsConsentStatus.REQUIRED
    ) {
      await AdsConsent.showForm();
    }
  } catch {
    // Consent unavailable or dismissed - continue with non-personalized ads
  }
}

export function useInterstitialAdUnit() {
  return useInterstitialAdNative(INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: true,
  });
}

export async function shouldShowAd(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(AD_IMPRESSIONS_KEY);
    const count = raw ? parseInt(raw, 10) : 0;
    return count >= GAMES_BETWEEN_ADS;
  } catch {
    return false;
  }
}

export async function recordAdImpression(): Promise<void> {
  try {
    await AsyncStorage.setItem(AD_IMPRESSIONS_KEY, '0');
  } catch {
    // Storage write failed - non-critical
  }
}

// Call after each game completes (even if no ad shown) to track game count
export async function incrementGameCount(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(AD_IMPRESSIONS_KEY);
    const count = raw ? parseInt(raw, 10) : 0;
    await AsyncStorage.setItem(AD_IMPRESSIONS_KEY, String(count + 1));
  } catch {
    // Storage write failed - non-critical
  }
}
