import { Platform } from 'react-native';

// Test ad unit IDs - replace with real IDs before production
const TEST_INTERSTITIAL_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
  default: '',
});

const TEST_BANNER_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
  default: '',
});

export const AD_UNIT_IDS = {
  interstitial: TEST_INTERSTITIAL_ID,
  banner: TEST_BANNER_ID,
};

// Only import the native ads module on iOS/Android
let MobileAds: { default: { initialize: () => Promise<unknown> } } | null = null;
let InterstitialAdModule: {
  InterstitialAd: {
    createForAdRequest: (
      adUnitId: string,
      opts?: { requestNonPersonalizedAdsOnly: boolean }
    ) => InterstitialAdInstance;
  };
  AdEventType: { LOADED: string; CLOSED: string };
} | null = null;

interface InterstitialAdInstance {
  load: () => void;
  show: () => void;
  addAdEventListener: (event: string, callback: () => void) => () => void;
}

if (Platform.OS !== 'web') {
  try {
    // Dynamic require to prevent web bundler from resolving the native module
    MobileAds = require('react-native-google-mobile-ads');
    InterstitialAdModule = require('react-native-google-mobile-ads');
  } catch {
    // Module not available (e.g., Expo Go without dev client)
  }
}

let initialized = false;

export async function initializeAds(): Promise<void> {
  if (Platform.OS === 'web' || initialized || !MobileAds) return;
  try {
    await MobileAds.default.initialize();
    initialized = true;
  } catch {
    // Ads initialization failed - continue without ads
  }
}

let currentInterstitial: InterstitialAdInstance | null = null;
let interstitialReady = false;

export function preloadInterstitial(): void {
  if (Platform.OS === 'web' || !InterstitialAdModule || !AD_UNIT_IDS.interstitial) return;

  try {
    const { InterstitialAd, AdEventType } = InterstitialAdModule;
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      interstitialReady = true;
      unsubLoaded();
    });

    currentInterstitial = ad;
    interstitialReady = false;
    ad.load();
  } catch {
    // Failed to preload - continue without ads
  }
}

export async function showInterstitial(): Promise<boolean> {
  if (Platform.OS === 'web' || !currentInterstitial || !interstitialReady || !InterstitialAdModule) {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    try {
      const { AdEventType } = InterstitialAdModule!;
      const unsubClosed = currentInterstitial!.addAdEventListener(AdEventType.CLOSED, () => {
        unsubClosed();
        interstitialReady = false;
        currentInterstitial = null;
        resolve(true);
      });

      currentInterstitial!.show();
    } catch {
      resolve(false);
    }
  });
}

export function isInterstitialReady(): boolean {
  return interstitialReady;
}
