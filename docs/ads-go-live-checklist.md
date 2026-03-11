# Opt-in Ads - Go Live Checklist

Steps required before shipping the opt-in rewarded ads feature to production.

---

## 1. Create an AdMob Account

- Sign up at https://admob.google.com
- Register your app for both iOS and Android
- AdMob will assign you an **App ID** for each platform (format: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)

## 2. Create a Rewarded Ad Unit

- In the AdMob dashboard, go to **Apps > Ad units > Add ad unit**
- Select **Rewarded** as the ad format
- Create one ad unit for iOS and one for Android
- Each will give you an **Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`)

## 3. Replace Placeholder IDs

### app.json

Replace the placeholder App IDs in the `react-native-google-mobile-ads` plugin config:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-YOUR_REAL_ANDROID_APP_ID",
    "iosAppId": "ca-app-pub-YOUR_REAL_IOS_APP_ID"
  }
]
```

### src/utils/ads.ts

Replace the test Ad Unit IDs on lines 9-10 with your production ones:

```ts
const REWARDED_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-YOUR_REAL_IOS_AD_UNIT_ID',
  android: 'ca-app-pub-YOUR_REAL_ANDROID_AD_UNIT_ID',
  default: '',
});
```

The current values (`ca-app-pub-3940256099942544/...`) are Google's official test IDs. They work but only show test ads and generate no revenue.

## 4. Install Dependencies

```bash
npm install
```

This pulls in `react-native-google-mobile-ads` which was added to `package.json`.

## 5. Use EAS Development Build (Not Expo Go)

The Google Mobile Ads SDK requires native code, so it cannot run in Expo Go. You must use a custom development build:

```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Build a development client
eas build --profile development --platform ios
eas build --profile development --platform android
```

For local development, you can also use:

```bash
npx expo run:ios
npx expo run:android
```

## 6. Update Privacy Policy

Your privacy policy at https://flagthat.app/privacy should disclose:

- The app uses Google AdMob for optional rewarded video ads
- Ads are only shown when the user explicitly chooses to watch one
- Google may collect device identifiers and usage data during ad playback
- Link to Google's privacy policy: https://policies.google.com/privacy

## 7. App Store Compliance

### Apple App Store (iOS)

- The `NSUserTrackingUsageDescription` is already set in `app.json` - this triggers the App Tracking Transparency (ATT) prompt on iOS 14.5+
- In App Store Connect, update your app's privacy nutrition labels to declare **Advertising Data** collection (collected only when user opts in)
- If you want to skip the ATT prompt entirely (no personalized ads), add this to your app startup:

```ts
import mobileAds from 'react-native-google-mobile-ads';

mobileAds().setRequestConfiguration({
  tagForChildDirectedTreatment: false,
  maxAdContentRating: 'G',
});
```

### Google Play Store (Android)

- Update your Data Safety section to declare ad-related data collection
- Mark it as **optional** since ads are opt-in only
- If targeting children or families, ensure ad content rating is set appropriately

## 8. Test on Real Devices

Before submitting to app stores:

- [ ] Verify the SupportCard appears on the Home screen after playing at least one game
- [ ] Verify the Support section appears in Settings on iOS and Android
- [ ] Verify neither appears on web (ads are web-disabled)
- [ ] Tap "Watch a Short Video" and confirm a test ad plays
- [ ] Confirm the "Thank you" message appears after watching
- [ ] Confirm the watch count increments and persists across app restarts
- [ ] Confirm the ad fails gracefully when offline (shows "No video available" message)
- [ ] Verify the ad does not auto-play or appear without user action

## 9. Configure Ad Mediation (Optional)

To maximize fill rate and revenue, consider adding mediation partners in AdMob:

- Meta Audience Network
- Unity Ads
- AppLovin

This is done entirely in the AdMob dashboard - no code changes needed. The `react-native-google-mobile-ads` SDK handles mediation automatically.

## 10. Monitor Post-Launch

After shipping:

- Check AdMob dashboard for fill rate (aim for 80%+ for rewarded ads)
- Monitor eCPM (rewarded ads typically earn $10-30 eCPM)
- Track how many users engage with the support card via the `totalAdsWatched` counter in AsyncStorage
- If fill rate is low, enable ad mediation (step 9)

---

## File Reference

| File | What to change |
|------|---------------|
| `app.json` | Replace placeholder App IDs (lines 61-62) |
| `src/utils/ads.ts` | Replace test Ad Unit IDs (lines 9-10) |
| Privacy policy | Add AdMob disclosure |
| App Store / Play Store | Update privacy declarations |
