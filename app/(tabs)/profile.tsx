import { View, Text, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { seedDatabase } from '@/database/seed';
import { useTransactions } from '@/modules/transactions/hooks/useTransactions';

export default function Profile() {
    const theme = useTheme();
    const { refresh } = useTransactions();

    const handleSeed = async () => {
        Alert.alert(
            "Seed Database",
            "This will clear all existing transactions and generate 50 new ones. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Seed",
                    style: "destructive",
                    onPress: async () => {
                        const result = await seedDatabase();
                        if (result.success) {
                            refresh(); // Refresh the list if it's open
                            Alert.alert("Success", "Database seeded successfully!");
                        } else {
                            Alert.alert("Error", "Failed to seed database.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
            <View className="flex-1 justify-center items-center px-4">
                <Text
                    className="text-2xl font-bold mb-8"
                    style={{ color: theme.colors.text }}
                >
                    Profile & Settings
                </Text>

                <View className="w-full max-w-xs">
                    <Button
                        title="Seed Database (Dev)"
                        color={theme.colors.expense}
                        onPress={handleSeed}
                    />
                    <Text
                        className="text-xs text-center mt-2"
                        style={{ color: theme.colors.subtext }}
                    >
                        Warning: This will delete all existing data.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
