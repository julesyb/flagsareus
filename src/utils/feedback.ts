import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Pre-generated tone data URIs for sound effects (no external files needed)
// We use Audio.Sound with programmatic tones

let soundsEnabled = true;

export function setSoundsEnabled(enabled: boolean) {
  soundsEnabled = enabled;
}

// Simple haptic feedback
export async function hapticCorrect() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics not available (e.g., simulator)
  }
}

export async function hapticWrong() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {}
}

export async function hapticTap() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

export async function hapticHeavy() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {}
}

// Sound effects using short generated audio
const soundCache: Record<string, Audio.Sound> = {};

async function playTone(frequency: number, duration: number, volume: number = 1.0) {
  if (!soundsEnabled) return;

  try {
    // Generate a simple WAV tone
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Generate tone with fade in/out
    const fadeLength = Math.min(numSamples * 0.1, 500);
    for (let i = 0; i < numSamples; i++) {
      let amplitude = Math.sin(2 * Math.PI * frequency * i / sampleRate);
      // Apply envelope
      if (i < fadeLength) {
        amplitude *= i / fadeLength;
      } else if (i > numSamples - fadeLength) {
        amplitude *= (numSamples - i) / fadeLength;
      }
      const sample = Math.floor(amplitude * 32767 * volume * 0.3);
      view.setInt16(44 + i * 2, sample, true);
    }

    // Convert to base64
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const uri = `data:audio/wav;base64,${base64}`;

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, volume: volume * 0.5 },
    );

    // Clean up after playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch {
    // Sound not available
  }
}

export async function playCorrectSound() {
  await playTone(880, 0.15, 0.8); // A5, short happy beep
}

export async function playWrongSound() {
  await playTone(220, 0.3, 0.6); // A3, longer low buzz
}

export async function playCountdownBeep() {
  await playTone(660, 0.08, 0.5); // Short tick
}

export async function playGameStartSound() {
  await playTone(1047, 0.2, 0.7); // C6, start chime
}

export async function playCelebrationSound() {
  // Play ascending tones
  await playTone(523, 0.12, 0.6);
  setTimeout(() => playTone(659, 0.12, 0.6), 120);
  setTimeout(() => playTone(784, 0.12, 0.6), 240);
  setTimeout(() => playTone(1047, 0.25, 0.8), 360);
}

// Initialize audio mode
export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch {
    // Audio not available
  }
}
