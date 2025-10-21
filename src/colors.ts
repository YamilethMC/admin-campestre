export const COLORS = {
  // Verdes
  primary: '#10B981',
  primaryDark: '#0D9C6E',
  primaryExtraDark: '#0c5426',
  primaryLight: '#34D399',
  
  // Escala de grises
  gray900: '#111827',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  gray50: '#F9FAFB',
  
  // Colores de estado
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Fijos
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Tipos para TypeScript
export type ColorType = keyof typeof COLORS;