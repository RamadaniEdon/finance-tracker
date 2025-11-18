import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

export function useTheme() {
    const { colorScheme } = useColorScheme();
    return colorScheme === 'dark' ? DarkTheme : DefaultTheme;
}
