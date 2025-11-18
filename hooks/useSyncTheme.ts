import { useThemeStore } from '@/store/useThemeStore';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

export function useSyncTheme() {
    const themeChoice = useThemeStore((store) => store.themeChoice);
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(themeChoice);
    }, [setColorScheme, themeChoice]);
}
