import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { TagExpenseAnalytics } from '@/use-cases/analytics/getExpensesByTag';
import { useTheme } from '@/hooks/useTheme';
import { ClassValue } from 'clsx';
import { cn } from '@/utils/cn';

interface ExpensesByTagChartProps {
    data: TagExpenseAnalytics[];
    className?: ClassValue;
}

export function ExpensesByTagChart({ data, className }: ExpensesByTagChartProps) {
    const { colors } = useTheme();

    if (data.length === 0) {
        return (
            <View
                style={{
                    height: 256,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.card,
                    padding: 16,
                    borderRadius: 16,
                }}
            >
                <Text className="text-subtext">No expenses for this period</Text>
            </View>
        );
    }

    // Generate colors for tags
    const palette = [
        colors.primary,
        '#FF6B6B', // Red
        '#4ECDC4', // Teal
        '#45B7D1', // Blue
        '#96CEB4', // Green
        '#FFEEAD', // Yellow
        '#D4A5A5', // Pink
        '#9B59B6', // Purple
    ];

    const chartData = data.map((item, index) => ({
        value: item.total,
        color: palette[index % palette.length],
        text: `${item.percentage.toFixed(0)}%`,
        tagName: item.tagName,
    }));

    return (
        <View className={cn('rounded-3xl bg-card p-4', className)}>
            <Text className="mb-4 text-lg font-bold text-foreground">Expenses by Tag</Text>

            <View className="items-center py-4">
                <PieChart
                    data={chartData}
                    donut
                    showText
                    textColor={colors.text}
                    radius={120}
                    innerRadius={80}
                    textSize={12}
                    focusOnPress
                    centerLabelComponent={() => {
                        const total = data.reduce((sum, item) => sum + item.total, 0);
                        return (
                            <View className="items-center justify-center">
                                <Text className="text-xs text-subtext">Total</Text>
                                <Text className="text-xl font-bold text-text">${total.toFixed(0)}</Text>
                            </View>
                        );
                    }}
                />
            </View>

            <View className="mt-4 gap-3">
                {data.map((item, index) => (
                    <View
                        key={item.tagName}
                        className="flex-row items-center justify-between border-b border-border pb-2 last:border-0"
                    >
                        <View className="flex-row items-center gap-2">
                            <View
                                style={{ backgroundColor: palette[index % palette.length] }}
                                className="h-3 w-3 rounded-full"
                            />
                            <Text className="font-medium text-foreground">{item.tagName}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="font-bold text-foreground">${item.total.toFixed(2)}</Text>
                            <Text className="text-xs text-subtext">Avg: ${item.averagePerMonth.toFixed(2)}/mo</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
