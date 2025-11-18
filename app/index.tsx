import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function Index() {
    const theme = useTheme();
    const router = useRouter();
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-foreground">Welcome to Delivery App 06 Gjilan</Text>
            <Button color={theme.colors.text} title="Go to login page" onPress={() => console.log('/auth')} />
        </View>
    );
}
