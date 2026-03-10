export const colors = {
  primary: '#0F1923',
  primaryLight: '#1A2A3A',
  accent: '#E85D04',
  accentLight: '#F48C06',
  success: '#06D6A0',
  error: '#EF476F',
  warning: '#FFD166',
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F4F0',
  text: '#0F1923',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E8E6E1',
  borderLight: '#F0EFE9',
  shadow: 'rgba(15, 25, 35, 0.06)',
  overlay: 'rgba(15, 25, 35, 0.5)',
  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  hero: {
    fontSize: 36,
    fontWeight: '800' as const,
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
};

export const shadows = {
  small: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  large: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
};
