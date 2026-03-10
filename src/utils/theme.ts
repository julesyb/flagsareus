// =====================
// BRAND GUIDELINES — Flags Are Us
// Voice: Intelligent. Editorial. Authoritative.
//
// Rules:
// — No rounded corners. Sharp geometry only.
// — No gradients. Flat color planes.
// — No drop shadows except offset hard shadows on hover.
// — Accent red appears sparingly.
// =====================

export const colors = {
  // Primary palette
  ink: '#111827',          // Primary text / dark surfaces
  red: '#E5271C',          // Single accent. Used sparingly.
  slate: '#4B5563',        // Supporting text, metadata
  rule: '#E5E7EB',         // Borders, dividers
  rule2: '#D1D5DB',        // Secondary borders
  paper: '#F9FAFB',        // Page background
  white: '#FFFFFF',        // Card surfaces

  // Semantic aliases (keep for backward compatibility across screens)
  primary: '#111827',
  primaryLight: '#1F2937',
  accent: '#E5271C',
  accentLight: '#EF4444',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',
  text: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(17, 24, 39, 0.06)',
  overlay: 'rgba(17, 24, 39, 0.5)',
  black: '#000000',

  // Semantic feedback
  gradeS: '#D97706',
  gradeA: '#16A34A',
  gradeB: '#2563EB',
  gradeC: '#D97706',
  gradeD: '#DC2626',
  gradeF: '#DC2626',

  // Translucent helpers (for dark backgrounds)
  whiteAlpha15: 'rgba(255,255,255,0.15)',
  whiteAlpha20: 'rgba(255,255,255,0.20)',
  whiteAlpha45: 'rgba(255,255,255,0.45)',
  whiteAlpha50: 'rgba(255,255,255,0.50)',
  whiteAlpha60: 'rgba(255,255,255,0.60)',
  whiteAlpha70: 'rgba(255,255,255,0.70)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Sharp geometry — no rounded corners per brand guidelines
export const borderRadius = {
  none: 0,
  sm: 0,
  md: 0,
  lg: 0,
  xl: 0,
  full: 0,
};

// Font family names — these must match the keys used when loading fonts
export const fontFamily = {
  display: 'LibreBaskerville_700Bold',
  displayItalic: 'LibreBaskerville_400Regular_Italic',
  uiLabel: 'BarlowCondensed_700Bold',
  uiLabelMedium: 'BarlowCondensed_600SemiBold',
  uiLabelLight: 'BarlowCondensed_500Medium',
  body: 'Barlow_400Regular',
  bodyLight: 'Barlow_300Light',
  bodyMedium: 'Barlow_500Medium',
  bodyBold: 'Barlow_600SemiBold',
};

export const typography = {
  hero: {
    fontSize: 52,
    fontFamily: fontFamily.display,
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontFamily: fontFamily.display,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 22,
    fontFamily: fontFamily.uiLabel,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontSize: 17,
    fontFamily: fontFamily.body,
  },
  bodyBold: {
    fontSize: 17,
    fontFamily: fontFamily.bodyBold,
  },
  caption: {
    fontSize: 13,
    fontFamily: fontFamily.body,
  },
  captionBold: {
    fontSize: 13,
    fontFamily: fontFamily.uiLabelMedium,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 15,
    fontFamily: fontFamily.bodyMedium,
  },
  // Editorial-specific styles from the template
  eyebrow: {
    fontSize: 10,
    fontFamily: fontFamily.uiLabel,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: fontFamily.uiLabel,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fontFamily.uiLabel,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  heroCardTitle: {
    fontSize: 26,
    fontFamily: fontFamily.uiLabel,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  countNumber: {
    fontSize: 52,
    fontFamily: fontFamily.display,
    letterSpacing: -1,
  },
};

// Hard offset shadows only (per brand guidelines)
export const shadows = {
  small: {
    shadowColor: colors.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  large: {
    shadowColor: colors.ink,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  // Red accent shadow for hero hover effect
  accentShadow: {
    shadowColor: colors.red,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
};
