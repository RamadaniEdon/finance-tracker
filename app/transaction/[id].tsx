import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useTransactions } from '@/modules/transactions/hooks/useTransactions';
import { Transaction } from '@/domains/transactions/types';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const router = useRouter();
    const { fetchTransactionDetails } = useTransactions();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            if (id) {
                const data = await fetchTransactionDetails(id);
                setTransaction(data);
                setLoading(false);
            }
        };
        loadDetails();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    if (!transaction) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: theme.colors.background }}>
                <Text style={{ color: theme.colors.text }}>Transaction not found</Text>
                <Pressable onPress={() => router.back()} className="mt-4">
                    <Text style={{ color: theme.colors.primary }}>Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const isExpense = transaction.type === 'EXPENSE';
    const amountColor = isExpense ? theme.colors.expense : theme.colors.income;
    const sign = isExpense ? '-' : '+';

    const formattedDate = transaction.transactionDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = transaction.transactionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-4 py-2 flex-row items-center">
                <Pressable
                    onPress={() => router.back()}
                    className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text className="text-lg font-semibold ml-2" style={{ color: theme.colors.text }}>
                    Transaction Details
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-6">
                {/* Amount Card */}
                <View
                    className="items-center justify-center py-10 rounded-3xl mb-6 shadow-sm"
                    style={{ backgroundColor: theme.colors.card }}
                >
                    <View
                        className="w-16 h-16 rounded-full items-center justify-center mb-4"
                        style={{ backgroundColor: isExpense ? `${theme.colors.expense}20` : `${theme.colors.income}20` }}
                    >
                        <Ionicons
                            name={isExpense ? "arrow-down" : "arrow-up"}
                            size={32}
                            color={amountColor}
                        />
                    </View>
                    <Text
                        className="text-4xl font-bold mb-2"
                        style={{ color: amountColor }}
                    >
                        {sign}${transaction.amount.toFixed(2)}
                    </Text>
                    <Text
                        className="text-lg font-medium"
                        style={{ color: theme.colors.subtext }}
                    >
                        {transaction.description}
                    </Text>
                </View>

                {/* Details Section */}
                <View className="space-y-6">
                    {/* Date & Time */}
                    <View>
                        <Text className="text-sm font-medium mb-2" style={{ color: theme.colors.subtext }}>
                            DATE & TIME
                        </Text>
                        <View
                            className="p-4 rounded-2xl flex-row items-center justify-between"
                            style={{ backgroundColor: theme.colors.card }}
                        >
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={20} color={theme.colors.text} className="mr-3" />
                                <Text style={{ color: theme.colors.text }}>{formattedDate}</Text>
                            </View>
                            <Text style={{ color: theme.colors.subtext }}>{formattedTime}</Text>
                        </View>
                    </View>

                    {/* Type */}
                    <View>
                        <Text className="text-sm font-medium mb-2" style={{ color: theme.colors.subtext }}>
                            TYPE
                        </Text>
                        <View
                            className="p-4 rounded-2xl flex-row items-center"
                            style={{ backgroundColor: theme.colors.card }}
                        >
                            <Ionicons
                                name={isExpense ? "trending-down" : "trending-up"}
                                size={20}
                                color={amountColor}
                                className="mr-3"
                            />
                            <Text className="font-medium" style={{ color: amountColor }}>
                                {transaction.type}
                            </Text>
                        </View>
                    </View>

                    {/* Tags */}
                    <View>
                        <Text className="text-sm font-medium mb-2" style={{ color: theme.colors.subtext }}>
                            TAGS
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {transaction.tags.map((tag, index) => (
                                <View
                                    key={index}
                                    className="px-4 py-2 rounded-full"
                                    style={{ backgroundColor: theme.colors.card }}
                                >
                                    <Text style={{ color: theme.colors.text }}>#{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
