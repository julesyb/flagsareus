import { Platform } from 'react-native';

// ─── Rewarded Ad (Opt-in Support) ─────────────────────────
// Uses AppLovin MAX for ad mediation on native platforms.
// On web, ads are not available.
//
// Replace these with your real AppLovin ad unit IDs before production:
const REWARDED_AD_UNIT_ID = Platform.select({
  ios: 'YOUR_IOS_REWARDED_AD_UNIT_ID',
  android: 'YOUR_ANDROID_REWARDED_AD_UNIT_ID',
  default: '',
});

// Replace with your AppLovin SDK key (found in AppLovin dashboard > Account > General > Keys):
const SDK_KEY = 'YOUR_APPLOVIN_SDK_KEY';

let sdkInitialized = false;
let adLoaded = false;
let AppLovinMAX: {
  initialize: (sdkKey: string) => Promise<unknown>;
  isInitialized: () => boolean;
} | null = null;
let RewardedAd: {
  loadAd: (adUnitId: string) => void;
  isAdReady: (adUnitId: string) => Promise<boolean>;
  showAd: (adUnitId: string) => void;
  addAdLoadedEventListener: (callback: (adInfo: unknown) => void) => void;
  addAdLoadFailedEventListener: (callback: (errorInfo: unknown) => void) => void;
  addAdHiddenEventListener: (callback: (adInfo: unknown) => void) => void;
  addAdReceivedRewardEventListener: (callback: (adInfo: unknown) => void) => void;
  addAdFailedToDisplayEventListener: (callback: (adInfo: unknown) => void) => void;
} | null = null;

// Lazy-load the native module so it doesn't crash on web
async function loadAdModule(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (AppLovinMAX) return true;

  try {
    const mod = await import('react-native-applovin-max');
    AppLovinMAX = (mod as { default: typeof AppLovinMAX }).default;
    RewardedAd = (mod as { RewardedAd: typeof RewardedAd }).RewardedAd;
    return true;
  } catch {
    return false;
  }
}

async function ensureInitialized(): Promise<boolean> {
  const available = await loadAdModule();
  if (!available || !AppLovinMAX || !RewardedAd || !REWARDED_AD_UNIT_ID) return false;

  if (sdkInitialized) return true;

  try {
    await AppLovinMAX.initialize(SDK_KEY);
    sdkInitialized = true;

    // Set up persistent event listeners after init
    RewardedAd.addAdLoadedEventListener(() => {
      adLoaded = true;
    });

    RewardedAd.addAdLoadFailedEventListener(() => {
      adLoaded = false;
    });

    // Preload the first ad
    RewardedAd.loadAd(REWARDED_AD_UNIT_ID);
    return true;
  } catch {
    return false;
  }
}

export async function preloadRewardedAd(): Promise<void> {
  await ensureInitialized();
}

export async function showRewardedAd(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const ready = await ensureInitialized();
  if (!ready || !RewardedAd || !REWARDED_AD_UNIT_ID) return false;

  // If no ad is preloaded, try loading one now
  const isReady = await RewardedAd.isAdReady(REWARDED_AD_UNIT_ID);
  if (!isReady) {
    // Load and wait for it
    return new Promise<boolean>((resolve) => {
      let settled = false;
      const settle = (value: boolean) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

      const onLoaded = () => {
        RewardedAd!.showAd(REWARDED_AD_UNIT_ID!);
      };

      const onLoadFailed = () => {
        settle(false);
      };

      // These one-time listeners handle the show cycle
      const onRewarded = () => {
        settle(true);
        // Preload next ad
        RewardedAd!.loadAd(REWARDED_AD_UNIT_ID!);
      };

      const onHidden = () => {
        settle(false);
        // Preload next ad
        RewardedAd!.loadAd(REWARDED_AD_UNIT_ID!);
      };

      const onDisplayFailed = () => {
        settle(false);
        RewardedAd!.loadAd(REWARDED_AD_UNIT_ID!);
      };

      // AppLovin MAX uses persistent listeners, so we register them
      // and track state via the settled flag
      RewardedAd!.addAdLoadedEventListener(onLoaded);
      RewardedAd!.addAdLoadFailedEventListener(onLoadFailed);
      RewardedAd!.addAdReceivedRewardEventListener(onRewarded);
      RewardedAd!.addAdHiddenEventListener(onHidden);
      RewardedAd!.addAdFailedToDisplayEventListener(onDisplayFailed);

      RewardedAd!.loadAd(REWARDED_AD_UNIT_ID!);

      // Timeout after 15 seconds if ad never loads
      setTimeout(() => settle(false), 15000);
    });
  }

  // Ad is already loaded, show it
  return new Promise<boolean>((resolve) => {
    let rewarded = false;

    RewardedAd!.addAdReceivedRewardEventListener(() => {
      rewarded = true;
    });

    RewardedAd!.addAdHiddenEventListener(() => {
      resolve(rewarded);
      // Preload next ad
      RewardedAd!.loadAd(REWARDED_AD_UNIT_ID!);
    });

    RewardedAd!.addAdFailedToDisplayEventListener(() => {
      resolve(false);
      RewardedAd!.loadAd(REWARDED_AD_UNIT_ID!);
    });

    RewardedAd!.showAd(REWARDED_AD_UNIT_ID!);
  });
}

export function isAdAvailable(): boolean {
  return Platform.OS !== 'web';
}
