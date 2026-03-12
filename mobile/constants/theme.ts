// NextEvent Design System – Mobile
export const colors = {
  primary: '#059467',
  secondary: {
    blue: '#2563EB',
    purple: '#7C3AED',
    amber: '#D97706',
    red: '#DC2626',
  },
  light: {
    background: '#F4F5F8',
    surface: '#FFFFFF',
    text: '#050709',
    textSecondary: '#64748B',
  },
  dark: {
    background: '#050709',
    surface: '#08090E',
    text: '#F4F5F8',
    textSecondary: '#94A3B8',
  },
};

export const typography = {
  display: { fontSize: 42, fontWeight: '700' as const },
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '600' as const },
  h3: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const borderRadius = { sm: 8, md: 12, lg: 16 };
