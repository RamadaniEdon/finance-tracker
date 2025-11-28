import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Transaction } from '@/domains/transactions/types';
import { useTheme } from '@/hooks/useTheme';

interface TransactionItemProps {
    transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
    const theme = useTheme();
    const router = useRouter();
    const isExpense = transaction.type === 'EXPENSE';
    const amountColor = isExpense ? theme.colors.expense : theme.colors.income;
    const sign = isExpense ? '-' : '+';

    const formattedDate = transaction.transactionDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    return (
        <Pressable onPress={() => router.push(`/transaction/${transaction.id}`)} className="mb-3 mx-4">
            <View
                className="p-4 rounded-2xl flex-row items-center justify-between shadow-sm"
                style={{ backgroundColor: theme.colors.card }}
            >
                <View className="flex-row items-center flex-1">
                    <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{
                            backgroundColor: isExpense ? `${theme.colors.expense}20` : `${theme.colors.income}20`,
                        }}
                    >
                        <Text className="text-xl font-bold" style={{ color: amountColor }}>
                            {transaction.description.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    <View className="flex-1 mr-2">
                        <Text
                            className="text-base font-semibold mb-1"
                            style={{ color: theme.colors.text }}
                            numberOfLines={1}
                        >
                            {transaction.description}
                        </Text>
                        <View className="flex-row items-center flex-wrap">
                            <Text className="text-xs mr-2" style={{ color: theme.colors.subtext }}>
                                {formattedDate}
                            </Text>
                            {transaction.tags.slice(0, 2).map((tag, index) => (
                                <View key={index} className="px-2 py-0.5 rounded-full mr-1 bg-black/5 dark:bg-white/10">
                                    <Text className="text-[10px]" style={{ color: theme.colors.subtext }}>
                                        #{tag}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <Text className="text-lg font-bold" style={{ color: amountColor }}>
                    {sign}${transaction.amount.toFixed(2)}
                </Text>
            </View>
        </Pressable>
    );
};
