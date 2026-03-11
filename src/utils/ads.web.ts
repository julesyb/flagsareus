// Web stub - Google Mobile Ads is native-only

export async function initializeAds(): Promise<void> {}

export async function requestConsent(): Promise<void> {}

export function useInterstitialAdUnit(): {
  show: () => void;
  load: () => void;
  isLoaded: boolean;
  isClosed: boolean;
} {
  return { show: () => {}, load: () => {}, isLoaded: false, isClosed: false };
}

export async function shouldShowAd(): Promise<boolean> {
  return false;
}

export async function recordAdImpression(): Promise<void> {}
