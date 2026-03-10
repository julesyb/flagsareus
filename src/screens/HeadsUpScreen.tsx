import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, typography } from '../utils/theme';
import { GameQuestion, GameResult } from '../types';
import { generateQuestions } from '../utils/gameEngine';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'HeadsUp'>;

const { width, height } = Dimensions.get('window');

type TiltState = 'neutral' | 'correct' | 'skip';

export default function HeadsUpScreen({ route, navigation }: Props) {
  const { config } = route.params;
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit || 60);
  const [tiltState, setTiltState] = useState<TiltState>('neutral');
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const questionStartTime = useRef(Date.now());
  const isProcessing = useRef(false);
  const tiltCooldown = useRef(false);

  // Generate questions
  useEffect(() => {
    const q = generateQuestions(config);
    setQuestions(q);
  }, []);

  // Countdown before start
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
      questionStartTime.current = Date.now();
    }
  }, [countdown]);

  // Game timer
  useEffect(() => {
    if (!isReady) return;
    if (timeLeft <= 0) {
      navigation.replace('Results', { results, config });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, timeLeft]);

  // Accelerometer for tilt detection
  useEffect(() => {
    if (!isReady) return;

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ z }) => {
      if (isProcessing.current || tiltCooldown.current) return;

      // Phone tilted forward (face down) = CORRECT
      if (z < -0.6) {
        handleTilt('correct');
      }
      // Phone tilted backward (face up) = SKIP
      else if (z > 0.6) {
        handleTilt('skip');
      }
    });

    return () => subscription.remove();
  }, [isReady, currentIndex, questions]);

  const handleTilt = useCallback(
    (action: 'correct' | 'skip') => {
      if (isProcessing.current || tiltCooldown.current) return;
      if (!questions[currentIndex]) return;

      isProcessing.current = true;
      tiltCooldown.current = true;

      const timeTaken = Date.now() - questionStartTime.current;
      const currentQ = questions[currentIndex];

      const result: GameResult = {
        question: currentQ,
        userAnswer: action === 'correct' ? currentQ.flag.name : 'SKIPPED',
        correct: action === 'correct',
        timeTaken,
      };

      setTiltState(action);
      setResults((prev) => [...prev, result]);

      setTimeout(() => {
        setTiltState('neutral');
        isProcessing.current = false;

        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
          questionStartTime.current = Date.now();
        } else {
          navigation.replace('Results', {
            results: [...results, result],
            config,
          });
          return;
        }

        // Cooldown to prevent double-triggers
        setTimeout(() => {
          tiltCooldown.current = false;
        }, 300);
      }, 800);
    },
    [currentIndex, questions, results, navigation, config],
  );

  // Countdown screen
  if (countdown > 0) {
    return (
      <SafeAreaView style={styles.countdownContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.countdownHint}>Hold phone on forehead</Text>
        <Text style={styles.countdownNumber}>{countdown}</Text>
        <Text style={styles.countdownSubtext}>
          Tilt DOWN = Correct{'\n'}Tilt UP = Skip
        </Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const correctCount = results.filter((r) => r.correct).length;

  // Determine background based on tilt state
  const bgColor =
    tiltState === 'correct'
      ? colors.success
      : tiltState === 'skip'
        ? colors.error
        : colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" />

      {/* Timer bar */}
      <View style={styles.timerBar}>
        <View
          style={[
            styles.timerFill,
            { width: `${(timeLeft / (config.timeLimit || 60)) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.gameContent}>
        {tiltState === 'correct' ? (
          <Text style={styles.feedbackText}>CORRECT!</Text>
        ) : tiltState === 'skip' ? (
          <Text style={styles.feedbackText}>SKIP</Text>
        ) : (
          <>
            <Text style={styles.flagDisplay}>{currentQuestion.flag.emoji}</Text>
            <Text style={styles.flagName}>{currentQuestion.flag.name}</Text>
            <Text style={styles.flagRegion}>{currentQuestion.flag.region}</Text>
          </>
        )}
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
        <Text style={styles.scoreText}>{correctCount} correct</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  countdownContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownHint: {
    ...typography.heading,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.xl,
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: '800',
    color: colors.white,
  },
  countdownSubtext: {
    ...typography.body,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 28,
  },
  loadingText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: height / 2 - 20,
  },
  timerBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 60,
  },
  timerFill: {
    height: '100%',
    backgroundColor: colors.white,
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  flagDisplay: {
    fontSize: 160,
    marginBottom: spacing.lg,
  },
  flagName: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  flagRegion: {
    ...typography.heading,
    color: 'rgba(255,255,255,0.5)',
    marginTop: spacing.sm,
  },
  feedbackText: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 50,
  },
  timerText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  scoreText: {
    ...typography.heading,
    color: 'rgba(255,255,255,0.7)',
  },
});
