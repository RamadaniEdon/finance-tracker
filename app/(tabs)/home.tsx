import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { TransactionList } from '@/modules/transactions/components/TransactionList';
import { useTranslations } from '@/hooks/useTranslations';

export default function Home() {
    const theme = useTheme();
    const { t } = useTranslations();

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
            <View className="flex-1">
                <View className="px-4 pt-4 pb-2">
                    <Text
                        className="text-3xl font-bold"
                        style={{ color: theme.colors.text }}
                    >
                        {t.home.title}
                    </Text>
                    <Text
                        className="text-base mt-1"
                        style={{ color: theme.colors.subtext }}
                    >
                        {t.home.subtitle}
                    </Text>
                </View>

                <TransactionList />
            </View>
        </SafeAreaView>
    );
}
