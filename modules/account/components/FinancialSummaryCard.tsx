import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from '@/hooks/useTranslations';
import { useFinancials } from '../hooks/useFinancials';
import { Ionicons } from '@expo/vector-icons';

export const FinancialSummaryCard = () => {
    const theme = useTheme();
    const { t } = useTranslations();
    const { stats, loading } = useFinancials();

    if (loading && !stats) {
        return (
            <View
                className="h-48 justify-center items-center m-4 rounded-3xl"
                style={{ backgroundColor: theme.colors.card }}
            >
                <ActivityIndicator color={theme.colors.primary} />
            </View>
        );
    }

    if (!stats) return null;

    const renderTrend = (change: number, diff: number, inverse = false) => {
        const isPositive = change >= 0;
        const icon = isPositive ? 'trending-up' : 'trending-down';

        let color;
        if (inverse) {
            // For expenses: Increase (Positive) is Bad (Red), Decrease (Negative) is Good (Green)
            color = isPositive ? theme.colors.expense : theme.colors.income;
        } else {
            // For income/balance: Increase is Good (Green), Decrease is Bad (Red)
            color = isPositive ? theme.colors.income : theme.colors.expense;
        }

        const sign = diff >= 0 ? '+' : '-';

        return (
            <View className="items-end">
                <View className="flex-row items-center bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full mb-1">
                    <Ionicons name={icon} size={12} color={color} />
                    <Text className="text-xs ml-1 font-medium" style={{ color }}>
                        {Math.abs(change).toFixed(1)}%
                    </Text>
                </View>
                <Text className="text-[10px]" style={{ color: theme.colors.subtext }}>
                    {sign}${diff.toFixed(2)}
                </Text>
            </View>
        );
    };

    return (
        <View className="mx-4 mt-4 mb-2">
            {/* Balance Card */}
            <View
                className="p-6 rounded-3xl shadow-sm mb-4"
                style={{ backgroundColor: theme.colors.primary }}
            >
                <Text className="text-white/80 text-sm font-medium mb-1">{t.account.total_balance}</Text>
                <Text className="text-white text-3xl font-bold mb-4">
                    ${stats.balance.current.toFixed(2)}
                </Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-white/60 text-xs">
                        {t.account.vs_last_month} (${stats.balance.previous.toFixed(2)})
                    </Text>
                    {/* For balance, we use normal logic (Green is good) */}
                    {renderTrend(stats.balance.change, stats.balance.diff)}
                </View>
            </View>

            {/* Income & Expense Row */}
            <View className="flex-row gap-4">
                {/* Income */}
                <View
                    className="flex-1 p-4 rounded-2xl shadow-sm"
                    style={{ backgroundColor: theme.colors.card }}
                >
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Ionicons name="trending-up" size={16} color={theme.colors.income} />
                        </View>
                        {renderTrend(stats.income.change, stats.income.diff)}
                    </View>
                    <Text
                        className="text-xs mb-1"
                        style={{ color: theme.colors.subtext }}
                    >
                        {t.account.income}
                    </Text>
                    <Text
                        className="text-lg font-bold"
                        style={{ color: theme.colors.text }}
                    >
                        ${stats.income.current.toFixed(2)}
                    </Text>
                </View>

                {/* Expense */}
                <View
                    className="flex-1 p-4 rounded-2xl shadow-sm"
                    style={{ backgroundColor: theme.colors.card }}
                >
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                            <Ionicons name="trending-down" size={16} color={theme.colors.expense} />
                        </View>
                        {/* Inverse logic for expenses */}
                        {renderTrend(stats.expenses.change, stats.expenses.diff, true)}
                    </View>
                    <Text
                        className="text-xs mb-1"
                        style={{ color: theme.colors.subtext }}
                    >
                        {t.account.expenses}
                    </Text>
                    <Text
                        className="text-lg font-bold"
                        style={{ color: theme.colors.text }}
                    >
                        ${stats.expenses.current.toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};
