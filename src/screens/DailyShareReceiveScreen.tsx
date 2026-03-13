import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, ThemeColors } from '../utils/theme';
import { decodeDailyShare } from '../utils/challengeCode';
import { addDailyLeaderboardEntry } from '../utils/storage';
import { t } from '../utils/i18n';

type Props = NativeStackScreenProps<RootStackParamList, 'DailyShareReceive'>;

export default function DailyShareReceiveScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const code = route.params?.code;

  useEffect(() => {
    async function process() {
      if (code) {
        const result = decodeDailyShare(code);
        if (result.status === 'ok') {
          const { name, date, score, totalTimeMs } = result.data;
          await addDailyLeaderboardEntry(date, {
            name,
            score,
            totalTimeMs,
            isMe: false,
          });
        }
      }
      // Navigate to Home regardless (invalid codes just go home)
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
