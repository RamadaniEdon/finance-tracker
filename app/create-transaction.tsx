import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CreateTransactionForm } from '@/modules/transactions/components/CreateTransactionForm';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslations } from '@/hooks/useTranslations';

export default function CreateTransactionScreen() {
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslations();

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-background">
                <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 bg-card rounded-full">
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text className="text-foreground text-xl font-bold">{t.transactions.create.title}</Text>
                    <View className="w-10" />
                </View>

                <CreateTransactionForm />
            </View>
        </SafeAreaView>
    );
}
