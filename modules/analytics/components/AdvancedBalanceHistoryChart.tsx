import { useRef, useEffect, ComponentProps } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { MonthlyBalance } from '@/use-cases/analytics/getMonthlyBalanceHistory';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface AdvancedBalanceHistoryChartProps {
    data: MonthlyBalance[];
    className?: string;
}

interface PointerItem {
    value: number;
    index: number;
}

export function AdvancedBalanceHistoryChart({ data, className }: AdvancedBalanceHistoryChartProps) {
    const { colors } = useTheme();
    const screenWidth = Dimensions.get('window').width;
    const scrollRef = useRef<ComponentProps<typeof LineChart>['scrollRef']>(null);

    useEffect(() => {
        if (data.length > 0 && scrollRef.current) {
            // Small timeout to ensure chart is rendered before scrolling
            setTimeout(() => {
                scrollRef.current.scrollToEnd({ animated: false });
            }, 100);
        }
    }, [data]);

    if (data.length === 0) {
        return (
            <View className={cn('h-64 items-center justify-center rounded-2xl bg-card p-4', className)}>
                <Text className="text-subtext">No data available for this period</Text>
            </View>
        );
    }

    const chartData = data.map((item) => ({
        value: item.value,
        label: item.label,
        dataPointText: item.value.toFixed(0),
    }));

    // Calculate min and max for better y-axis scaling
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;

    // Add some padding to the range
    // If minValue is negative, we want to start lower than that.
    // If minValue is positive, we might want to start at 0 or slightly below minValue.
    // Let's try to make the chart look "centered" or well-distributed.

    // We set yAxisOffset to be slightly below the minimum value to ensure the point isn't on the very edge
    const padding = range * 0.1 || 100; // Default padding if range is 0
    const yAxisOffset = minValue - padding;

    return (
        <View className={cn('rounded-3xl bg-card p-4', className)}>
            <Text className="mb-4 text-lg font-bold text-foreground">Balance History</Text>
            <View className="-ml-4">
                <LineChart
                    scrollRef={scrollRef}
                    data={chartData}
                    color={colors.primary}
                    thickness={3}
                    startFillColor={colors.primary}
                    endFillColor={colors.primary}
                    startOpacity={0.2}
                    endOpacity={0.0}
                    areaChart
                    yAxisThickness={0}
                    xAxisThickness={0}
                    yAxisTextStyle={{ color: colors.subtext, fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: colors.subtext, fontSize: 10 }}
                    rulesColor={colors.border}
                    rulesType="solid"
                    width={screenWidth - 64} // Adjust for padding
                    spacing={60} // Fixed spacing for scrolling
                    initialSpacing={20}
                    height={200}
                    curved
                    hideDataPoints={false}
                    dataPointsColor={colors.primary}
                    dataPointsRadius={4}
                    dataPointsShape="circle"
                    isAnimated
                    animationDuration={1000}
                    // Adjust Y-axis to focus on the data range
                    yAxisOffset={yAxisOffset}
                    // Zero line configuration
                    showReferenceLine1={minValue < 0 && maxValue > 0}
                    referenceLine1Position={0}
                    referenceLine1Config={{
                        color: colors.text,
                        dashWidth: 4,
                        dashGap: 4,
                        thickness: 1,
                    }}
                    pointerConfig={{
                        pointerStripHeight: 160,
                        pointerStripColor: colors.border,
                        pointerStripWidth: 2,
                        pointerColor: colors.border,
                        radius: 6,
                        pointerLabelWidth: 100,
                        pointerLabelHeight: 90,
                        activatePointersOnLongPress: false, // Activate on tap
                        autoAdjustPointerLabelPosition: true,
                        pointerLabelComponent: (items: PointerItem[]) => {
                            const item = items[0];
                            if (!item) return null;

                            const dataItem = data[item.index];
                            if (!dataItem) return null;

                            return (
                                <View className="justify-center rounded-lg bg-card p-2 shadow-lg border border-border">
                                    <Text className="text-xs text-subtext">{dataItem.date.toLocaleDateString()}</Text>
                                    <Text className="font-bold text-text">${item.value.toFixed(2)}</Text>
                                </View>
                            );
                        },
                    }}
                />
            </View>
        </View>
    );
}
