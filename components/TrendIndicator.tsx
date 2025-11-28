import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface TrendIndicatorProps {
    change: number;
    diff: number;
    inverse?: boolean; // If true, positive change is bad (e.g. expenses)
}

export function TrendIndicator({ change, diff, inverse = false }: TrendIndicatorProps) {
    const theme = useTheme();

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
                {sign}${Math.abs(diff).toFixed(2)}
            </Text>
        </View>
    );
}
