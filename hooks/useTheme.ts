import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useResolvedTheme } from '../store/useThemeStore';

export function useTheme() {
    const resolved = useResolvedTheme();
    return resolved === 'dark' ? DarkTheme : DefaultTheme;
}
