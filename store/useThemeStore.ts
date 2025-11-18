import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeChoice = 'light' | 'dark' | 'system';

interface ThemeStore {
    themeChoice: ThemeChoice;
    setThemeChoice: (choice: ThemeChoice) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            themeChoice: 'system',
            setThemeChoice: (choice) => set({ themeChoice: choice }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);

export function useResolvedTheme() {
    const { themeChoice } = useThemeStore();
    const { colorScheme, setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(themeChoice);
    }, [setColorScheme, themeChoice]);

    return colorScheme;
}
