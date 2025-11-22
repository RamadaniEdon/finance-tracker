import { DarkTheme, LightTheme } from '@/utils/themes';
import { useColorScheme } from 'nativewind';

export function useTheme() {
    const { colorScheme } = useColorScheme();
    return colorScheme === 'dark' ? DarkTheme : LightTheme;
}
