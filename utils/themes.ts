import { Platform } from 'react-native';

const WEB_FONT_STACK = `system-ui, "Segoe UI", Roboto, Helvetica, Arial,
sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

const SharedFonts = Platform.select({
    web: {
        regular: {
            fontFamily: WEB_FONT_STACK,
            fontWeight: '400' as const,
        },
        medium: {
            fontFamily: WEB_FONT_STACK,
            fontWeight: '500' as const,
        },
        bold: {
            fontFamily: WEB_FONT_STACK,
            fontWeight: '600' as const,
        },
        heavy: {
            fontFamily: WEB_FONT_STACK,
            fontWeight: '700' as const,
        },
    },
    ios: {
        regular: {
            fontFamily: 'System',
            fontWeight: '400' as const,
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500' as const,
        },
        bold: {
            fontFamily: 'System',
            fontWeight: '600' as const,
        },
        heavy: {
            fontFamily: 'System',
            fontWeight: '700' as const,
        },
    },
    default: {
        regular: {
            fontFamily: 'sans-serif',
            fontWeight: 'normal' as const,
        },
        medium: {
            fontFamily: 'sans-serif-medium',
            fontWeight: 'normal' as const,
        },
        bold: {
            fontFamily: 'sans-serif',
            fontWeight: '600' as const,
        },
        heavy: {
            fontFamily: 'sans-serif',
            fontWeight: '700' as const,
        },
    },
});

export const LightTheme = {
    dark: false,
    colors: {
        primary: '#5f0202',
        background: '#ffffff',
        foreground: '#000000',
        expense: '#ef4444', // Red-500
        income: '#22c55e', // Green-500
        card: '#f3f4f6', // Gray-100
        text: '#1f2937', // Gray-800
        subtext: '#6b7280', // Gray-500
        border: '#e5e7eb', // Gray-200
        notification: '#f59e0b', // Amber-500
    },
    fonts: SharedFonts,
};

export const DarkTheme = {
    dark: false,
    colors: {
        primary: '#0b89a9',
        background: '#000000',
        foreground: '#ffffff',
        expense: '#f87171', // Red-400
        income: '#4ade80', // Green-400
        card: '#1f2937', // Gray-800
        text: '#f9fafb', // Gray-50
        subtext: '#9ca3af', // Gray-400
        border: '#374151', // Gray-700
        notification: '#fbbf24', // Amber-400
    },
    fonts: SharedFonts,
};
