import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors, spacing, typography, fontFamily, borderRadius } from '../utils/theme';
import { getSettings, saveSettings, AppSettings, resetStats } from '../utils/storage';
import {
  setSoundsEnabled,
  setHapticsEnabled,
} from '../utils/feedback';
import { toggleDailyReminder, getPermissionStatus } from '../utils/notifications';
import { BellIcon } from '../components/Icons';
import BottomNav from '../components/BottomNav';

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [settings, setSettings] = useState<AppSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
    dailyReminderEnabled: false,
    reminderHour: 9,
    reminderMinute: 0,
  });

  useFocusEffect(
    useCallback(() => {
      getSettings().then(setSettings);
    }, []),
  );

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveSettings(updated);

    if (key === 'soundEnabled') setSoundsEnabled(value as boolean);
    if (key === 'hapticsEnabled') setHapticsEnabled(value as boolean);
  };

  const handleToggleReminder = async (enabled: boolean) => {
    const result = await toggleDailyReminder(
      enabled,
      settings.reminderHour,
      settings.reminderMinute,
    );
    const updated = { ...settings, dailyReminderEnabled: result };
    setSettings(updated);
    await saveSettings(updated);

    if (enabled && !result && Platform.OS !== 'web') {
      Alert.alert(
        'Notifications Disabled',
        'Allow notifications in your device settings to enable daily reminders.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  const cycleReminderTime = async () => {
    // Cycle through common reminder times
    const times = [
      { h: 7, m: 0 },
      { h: 8, m: 0 },
      { h: 9, m: 0 },
      { h: 10, m: 0 },
      { h: 12, m: 0 },
      { h: 18, m: 0 },
      { h: 20, m: 0 },
      { h: 21, m: 0 },
    ];
    const currentIdx = times.findIndex(
      (t) => t.h === settings.reminderHour && t.m === settings.reminderMinute,
    );
    const next = times[(currentIdx + 1) % times.length];
    const updated = { ...settings, reminderHour: next.h, reminderMinute: next.m };
    setSettings(updated);
    await saveSettings(updated);

    if (settings.dailyReminderEnabled) {
      await toggleDailyReminder(true, next.h, next.m);
    }
  };

  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
  };

  const handleReset = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Reset all data?\n\nThis will clear all stats, streaks, and progress. This cannot be undone.');
      if (confirmed) {
        await resetStats();
      }
    } else {
      Alert.alert(
        'Reset All Data',
        'This will clear all stats, streaks, and progress. This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: () => resetStats(),
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Sound & Haptics */}
        <Text style={styles.sectionTitle}>Sound & Haptics</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDesc}>Correct, wrong, and celebration sounds</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => updateSetting('soundEnabled', v)}
              trackColor={{ false: colors.rule, true: colors.ink }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.settingDivider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptics</Text>
              <Text style={styles.settingDesc}>Vibration feedback on answers</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(v) => updateSetting('hapticsEnabled', v)}
              trackColor={{ false: colors.rule, true: colors.ink }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Daily Challenge Reminder</Text>
              <Text style={styles.settingDesc}>
                {Platform.OS === 'web'
                  ? 'Available on iOS and Android'
                  : 'Get reminded to play each day'}
              </Text>
            </View>
            <Switch
              value={settings.dailyReminderEnabled}
              onValueChange={handleToggleReminder}
              trackColor={{ false: colors.rule, true: colors.ink }}
              thumbColor={colors.white}
              disabled={Platform.OS === 'web'}
            />
          </View>
          {Platform.OS !== 'web' && (
            <>
              <View style={styles.settingDivider} />
              <TouchableOpacity
                style={styles.settingRow}
                onPress={cycleReminderTime}
                activeOpacity={0.7}
              >
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, !settings.dailyReminderEnabled && styles.settingDisabled]}>
                    Reminder Time
                  </Text>
                  <Text style={styles.settingDesc}>Tap to change</Text>
                </View>
                <Text style={[styles.settingTimeValue, !settings.dailyReminderEnabled && styles.settingDisabled]}>
                  {formatTime(settings.reminderHour, settings.reminderMinute)}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          <View style={styles.settingDivider} />
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Linking.openURL('https://flagthat.app/privacy')}
            activeOpacity={0.7}
          >
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingChevron}>&rsaquo;</Text>
          </TouchableOpacity>
        </View>

        {/* Danger zone */}
        <Text style={styles.sectionTitle}>Data</Text>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav activeTab="Stats" onNavigate={(tab) => {
        if (tab === 'Play') navigation.navigate('Home');
        else if (tab === 'Modes') navigation.navigate('GameSetup');
        else if (tab === 'Stats') navigation.navigate('Stats');
        else if (tab === 'Browse') navigation.navigate('Browse');
      }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: fontFamily.uiLabel,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  settingCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingVertical: 14,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  settingDesc: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  settingValue: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  settingChevron: {
    fontSize: 22,
    color: colors.textTertiary,
    lineHeight: 22,
  },
  settingDisabled: {
    opacity: 0.35,
  },
  settingTimeValue: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  resetButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  resetButtonText: {
    ...typography.label,
    color: colors.error,
  },
});
