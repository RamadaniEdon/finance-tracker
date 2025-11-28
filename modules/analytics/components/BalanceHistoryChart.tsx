import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { DailyBalance } from '@/use-cases/analytics/getDailyBalanceHistory';
import { useTheme } from '@/hooks/useTheme';
import { ClassValue } from 'clsx';
import { cn } from '@/utils/cn';

interface BalanceHistoryChartProps {
    data: DailyBalance[];
    className?: ClassValue;
}

interface PointerItem {
    value: number;
    index: number;
}

export function BalanceHistoryChart({ data, className }: BalanceHistoryChartProps) {
    const { colors } = useTheme();
    const screenWidth = Dimensions.get('window').width;

    if (data.length === 0) {
        return (
            <View className={cn('h-64 items-center justify-center rounded-2xl bg-card p-4', className)}>
                <Text className="text-subtext">No data available for this period</Text>
            </View>
        );
    }

    const chartData = data.map((item) => ({
        value: item.value,
        label: item.date.getDate().toString(),
        dataPointText: item.value.toFixed(0),
    }));

    // Simplify labels to avoid overcrowding
    const step = Math.ceil(chartData.length / 6);
    const formattedData = chartData.map((item, index) => ({
        ...item,
        label: index % step === 0 ? item.label : '',
        hideDataPoint: true, // Hide points by default for cleaner look
    }));

    return (
        <View className="rounded-3xl bg-card p-4">
            <Text className="mb-4 text-lg font-bold text-foreground">Balance History</Text>
            <View className="-ml-4">
                <LineChart
                    data={formattedData}
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
                    height={200}
                    curved
                    hideDataPoints={false}
                    dataPointsColor={colors.primary}
                    dataPointsRadius={3}
                    pointerConfig={{
                        pointerStripHeight: 160,
                        pointerStripColor: colors.border,
                        pointerStripWidth: 2,
                        pointerColor: colors.border,
                        radius: 6,
                        pointerLabelWidth: 100,
                        pointerLabelHeight: 90,
                        activatePointersOnLongPress: true,
                        autoAdjustPointerLabelPosition: false,
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
