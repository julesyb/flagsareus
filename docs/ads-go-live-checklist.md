# Opt-in Ads - Go Live Checklist

Steps required before shipping the opt-in rewarded ads feature to production.
Uses **AppLovin MAX** for ad mediation.

---

## 1. Create an AppLovin Account

- Sign up at https://dash.applovin.com/signup
- In the dashboard, go to **Account > General > Keys**
- Note your **SDK Key** (long alphanumeric string, used at runtime)
- Note your **Ad Review Key** (used in the Expo plugin config for build-time setup)

## 2. Create a Rewarded Ad Unit

- In the AppLovin dashboard, go to **MAX > Ad Units > Create Ad Unit**
- Platform: create one for **iOS** and one for **Android**
- Ad format: **Rewarded**
- Each will give you an **Ad Unit ID**

## 3. Enable Mediation Networks

In the AppLovin dashboard under **MAX > Mediation > Manage Networks**, enable the networks you want to mediate through. Popular choices:

- **Google AdMob / Google Bidding** (requires AdMob account + app IDs)
- **Meta Audience Network**
- **Unity Ads**
- **ironSource**
- **Mintegral**

Each network requires its own account and credentials. AppLovin provides setup guides for each.

## 4. Replace Placeholder IDs

### app.json

Replace the Ad Review Key in the `expo-applovin-ads` plugin config:

```json
[
  "expo-applovin-ads/expo",
  {
    "apiKey": "YOUR_REAL_AD_REVIEW_KEY"
  }
]
```

### src/utils/ads.ts

Replace the SDK Key (line 15):

```ts
const SDK_KEY = 'YOUR_REAL_APPLOVIN_SDK_KEY';
```

Replace the Ad Unit IDs (lines 9-10):

```ts
const REWARDED_AD_UNIT_ID = Platform.select({
  ios: 'YOUR_REAL_IOS_REWARDED_AD_UNIT_ID',
  android: 'YOUR_REAL_ANDROID_REWARDED_AD_UNIT_ID',
  default: '',
});
```

## 5. Install Dependencies

```bash
npm install
```

This pulls in `react-native-applovin-max` and `expo-applovin-ads` (the Expo config plugin).

## 6. Use EAS Development Build (Not Expo Go)

AppLovin MAX requires native code, so it cannot run in Expo Go. You must use a custom development build:

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

The `eas-build-post-install` script in `package.json` handles the AppLovin Quality Service setup automatically during EAS builds.

## 7. Update Privacy Policy

Your privacy policy at https://flagthat.app/privacy should disclose:

- The app uses AppLovin MAX for optional rewarded video ads
- Ads are only shown when the user explicitly chooses to watch one
- Ad mediation partners may collect device identifiers and usage data during ad playback
- Link to AppLovin's privacy policy: https://www.applovin.com/privacy/
- Link to each enabled mediation partner's privacy policy

## 8. App Store Compliance

### Apple App Store (iOS)

- The `NSUserTrackingUsageDescription` is already set in `app.json` for the App Tracking Transparency (ATT) prompt
- In App Store Connect, update your app's privacy nutrition labels to declare **Advertising Data** collection (collected only when user opts in)
- AppLovin MAX automatically handles the ATT prompt flow. To configure it, you can add before SDK init:

```ts
import { Privacy } from 'react-native-applovin-max';
Privacy.setTermsAndPrivacyPolicyFlowEnabled(true);
Privacy.setPrivacyPolicyUrl('https://flagthat.app/privacy');
```

### Google Play Store (Android)

- Update your Data Safety section to declare ad-related data collection
- Mark it as **optional** since ads are opt-in only
- AppLovin is a Google-certified CMP (Consent Management Platform) and handles GDPR/consent automatically

## 9. Test on Real Devices

Before submitting to app stores:

- [ ] Verify the SupportCard appears on the Home screen after playing at least one game
- [ ] Verify the Support section appears in Settings on iOS and Android
- [ ] Verify neither appears on web (ads are web-disabled)
- [ ] Tap "Watch a Short Video" and confirm an ad plays
- [ ] Confirm the "Thank you" message appears after watching
- [ ] Confirm the watch count increments and persists across app restarts
- [ ] Confirm the ad fails gracefully when offline (shows "No video available" message)
- [ ] Verify the ad does not auto-play or appear without user action
- [ ] Test with AppLovin's test mode enabled in the dashboard during development

## 10. Monitor Post-Launch

After shipping:

- Check AppLovin MAX dashboard for fill rate (aim for 80%+ for rewarded ads)
- Monitor eCPM across networks (rewarded ads typically earn $10-30 eCPM)
- Use AppLovin's **Ad Review** tool to block inappropriate ad creatives
- Track how many users engage with the support card via the `totalAdsWatched` counter in AsyncStorage
- If fill rate is low, enable additional mediation networks (step 3)
- Use the AppLovin MAX **A/B Testing** feature to optimize waterfall vs. bidding

---

## File Reference

| File | What to change |
|------|---------------|
| `app.json` | Replace Ad Review Key (line 62) |
| `src/utils/ads.ts` | Replace SDK Key (line 15) and Ad Unit IDs (lines 9-10) |
| `package.json` | Dependencies already configured |
| Privacy policy | Add AppLovin and mediation partner disclosures |
| App Store / Play Store | Update privacy declarations |
