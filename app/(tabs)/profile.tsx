import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { seedDatabase } from '@/database/seed';
import { useTransactions } from '@/modules/transactions/hooks/useTransactions';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/Button';

export default function Profile() {
    const theme = useTheme();
    const { refresh } = useTransactions();
    const { t, languageChoice, setLanguageChoice } = useTranslations();

    const handleSeed = async () => {
        Alert.alert(
            "Seed Database",
            "This will clear all existing transactions and generate 50 new ones. Are you sure?",
            [
                { text: t.common.cancel, style: "cancel" },
                {
                    text: "Seed",
                    style: "destructive",
                    onPress: async () => {
                        const result = await seedDatabase();
                        if (result.success) {
                            refresh(); // Refresh the list if it's open
                            Alert.alert(t.common.ok, "Database seeded successfully!");
                        } else {
                            Alert.alert(t.common.error, "Failed to seed database.");
                        }
                    }
                }
            ]
        );
    };

    const toggleLanguage = () => {
        const newLang = languageChoice === 'en' ? 'al' : 'en';
        setLanguageChoice(newLang);
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
            <View className="flex-1 justify-center items-center px-4">
                <Text
                    className="text-2xl font-bold mb-8"
                    style={{ color: theme.colors.text }}
                >
                    {t.profile.title}
                </Text>

                <View className="w-full max-w-xs mb-8">
                    <Button
                        title={t.profile.language_toggle}
                        onPress={toggleLanguage}
                        variant="primary"
                        size="lg"
                        className="mb-2"
                    />
                    <Text
                        className="text-sm text-center"
                        style={{ color: theme.colors.subtext }}
                    >
                        {t.profile.current_language}
                    </Text>
                </View>

                <View className="w-full max-w-xs">
                    <Button
                        title={t.profile.seed_db}
                        onPress={handleSeed}
                        variant="danger"
                        size="lg"
                    />
                    <Text
                        className="text-xs text-center mt-2"
                        style={{ color: theme.colors.subtext }}
                    >
                        {t.profile.seed_warning}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
