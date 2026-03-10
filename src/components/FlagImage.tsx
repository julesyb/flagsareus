import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../utils/theme';

interface FlagImageProps {
  countryCode: string;
  size?: 'small' | 'medium' | 'large' | 'hero';
  emoji?: string;
  style?: object;
}

const SIZE_MAP = {
  small: { width: 48, height: 32 },
  medium: { width: 80, height: 54 },
  large: { width: 160, height: 107 },
  hero: { width: 280, height: 187 },
};

// Use flagcdn.com for real flag images
function getFlagUrl(code: string, width: number): string {
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}

export default function FlagImage({ countryCode, size = 'large', emoji, style }: FlagImageProps) {
  const dimensions = SIZE_MAP[size];
  // Request 2x resolution for retina
  const requestWidth = Math.min(dimensions.width * 2, 640);

  return (
    <View style={[styles.container, dimensions, style]}>
      <Image
        source={{ uri: getFlagUrl(countryCode, requestWidth) }}
        style={[styles.image, dimensions]}
        contentFit="cover"
        transition={200}
        placeholder={emoji}
        placeholderContentFit="contain"
      />
    </View>
  );
}

// Smaller version for list items
export function FlagImageSmall({ countryCode, emoji }: { countryCode: string; emoji: string }) {
  return (
    <View style={styles.smallContainer}>
      <Image
        source={{ uri: getFlagUrl(countryCode, 80) }}
        style={styles.smallImage}
        contentFit="cover"
        transition={150}
        placeholder={emoji}
        placeholderContentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  image: {
    borderRadius: 6,
  },
  smallContainer: {
    width: 48,
    height: 32,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  smallImage: {
    width: 48,
    height: 32,
    borderRadius: 4,
  },
});
