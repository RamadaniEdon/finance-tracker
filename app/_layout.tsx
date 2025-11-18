import { useTheme } from '@/hooks/useTheme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
    const theme = useTheme();
    return (
        <ThemeProvider value={theme}>
            <Stack />
        </ThemeProvider>
    );
}
