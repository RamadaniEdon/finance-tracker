import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from '@/hooks/useTranslations';
import { useFinancials } from '../hooks/useFinancials';
import { Ionicons } from '@expo/vector-icons';
import { TrendIndicator } from '@/components/TrendIndicator';
import { Card } from '@/components/Card';

export const FinancialSummaryCard = () => {
    const theme = useTheme();
    const { t } = useTranslations();
    const { stats, loading } = useFinancials();

    if (loading && !stats) {
        return (
            <Card className="h-48 justify-center items-center m-4 rounded-3xl">
                <ActivityIndicator color={theme.colors.primary} />
            </Card>
        );
    }

    if (!stats) return null;

    return (
        <View className="mx-4 mt-4 mb-2">
            {/* Balance Card */}
            <Card variant="primary" className="p-6 rounded-3xl mb-4">
                <Text className="text-white/80 text-sm font-medium mb-1">{t.account.total_balance}</Text>
                <Text className="text-white text-3xl font-bold mb-4">${stats.balance.current.toFixed(2)}</Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-white/60 text-xs">
                        {t.account.vs_last_month} (${stats.balance.previous.toFixed(2)})
                    </Text>
                    {/* For balance, we use normal logic (Green is good) */}
                    <TrendIndicator change={stats.balance.change} diff={stats.balance.diff} />
                </View>
            </Card>

            {/* Income & Expense Row */}
            <View className="flex-row gap-4">
                {/* Income */}
                <Card className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Ionicons name="trending-up" size={16} color={theme.colors.income} />
                        </View>
                        <TrendIndicator change={stats.income.change} diff={stats.income.diff} />
                    </View>
                    <Text className="text-xs mb-1" style={{ color: theme.colors.subtext }}>
                        {t.account.income}
                    </Text>
                    <Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
                        ${stats.income.current.toFixed(2)}
                    </Text>
                </Card>

                {/* Expense */}
                <Card className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                            <Ionicons name="trending-down" size={16} color={theme.colors.expense} />
                        </View>
                        {/* Inverse logic for expenses */}
                        <TrendIndicator change={stats.expenses.change} diff={stats.expenses.diff} inverse />
                    </View>
                    <Text className="text-xs mb-1" style={{ color: theme.colors.subtext }}>
                        {t.account.expenses}
                    </Text>
                    <Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
                        ${stats.expenses.current.toFixed(2)}
                    </Text>
                </Card>
            </View>
        </View>
    );
};
