import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, ThemeColors } from '../utils/theme';
import { decodeDailyShare } from '../utils/challengeCode';
import { addDailyLeaderboardEntry } from '../utils/storage';
import { DAILY_QUESTION_COUNT, DAILY_LEADERBOARD_MAX_AGE_DAYS } from '../utils/config';
import { t } from '../utils/i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyShareReceive'>;

function isDateValid(dateStr: string): boolean {
  const today = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return false;
  // Not in the future
  if (date > today) return false;
  // Within the leaderboard retention window
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - DAILY_LEADERBOARD_MAX_AGE_DAYS);
  return date >= cutoff;
}

export default function DailyShareReceiveScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const code = route.params?.code;

  useEffect(() => {
    async function process() {
      let valid = false;
      if (code) {
        const result = decodeDailyShare(code);
        if (result.status === 'ok') {
          const { name, date, score, totalTimeMs } = result.data;
          if (isDateValid(date) && score >= 0 && score <= DAILY_QUESTION_COUNT) {
            await addDailyLeaderboardEntry(date, {
              name,
              score,
              totalTimeMs,
              isMe: false,
            });
            valid = true;
          }
        }
      }
      if (!valid && code) {
        Alert.alert(t('daily.invalidShareCode'), t('daily.invalidShareCodeDesc'));
      }
      navigation.replace('Home');
    }
    process();
  }, [code, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.goldBright} />
        <Text style={styles.text}>{t('common.loading')}</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  text: { ...typography.caption, color: colors.textSecondary },
});
