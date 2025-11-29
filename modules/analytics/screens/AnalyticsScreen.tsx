import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { BalanceHistoryChart } from '../components/BalanceHistoryChart';
import { AdvancedBalanceHistoryChart } from '../components/AdvancedBalanceHistoryChart';
import { ExpensesByTagChart } from '../components/ExpensesByTagChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

export default function AnalyticsScreen() {
    const {
        balanceHistory,
        monthlyBalanceHistory,
        expensesByTag,
        incomeVsExpenses,
        range,
        setRange,
        chartMode,
        setChartMode,
        includeCurrentMonth,
        setIncludeCurrentMonth,
    } = useAnalyticsData();

    const ranges = ['1M', '3M', '6M', '1Y'] as const;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-6 mt-4">
                    <Text className="text-3xl font-bold text-text">Analytics</Text>
                    <Text className="text-subtext">Financial insights & trends</Text>
                </View>

                {/* Range Selector */}
                <View className="mb-6 flex-row rounded-xl bg-card p-1">
                    {ranges.map((r) => (
                        <TouchableOpacity
                            key={r}
                            onPress={() => setRange(r)}
                            className={cn(
                                'flex-1 items-center justify-center rounded-lg py-2',
                                range === r ? 'bg-primary' : 'bg-transparent',
                            )}
                        >
                            <Text className={cn('font-medium', range === r ? 'text-white' : 'text-subtext')}>{r}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Income vs Expenses Summary */}
                {incomeVsExpenses && (
                    <View className="mb-6 flex-row gap-4">
                        <View className="flex-1 rounded-2xl bg-card p-4">
                            <Text className="text-sm text-subtext">Income</Text>
                            <Text className="text-xl font-bold text-income">${incomeVsExpenses.income.toFixed(0)}</Text>
                        </View>
                        <View className="flex-1 rounded-2xl bg-card p-4">
                            <Text className="text-sm text-subtext">Expenses</Text>
                            <Text className="text-xl font-bold text-expense">
                                ${incomeVsExpenses.expenses.toFixed(0)}
                            </Text>
                        </View>
                        <View className="flex-1 rounded-2xl bg-card p-4">
                            <Text className="text-sm text-subtext">Savings</Text>
                            <Text
                                className={cn(
                                    'text-xl font-bold',
                                    incomeVsExpenses.savingsRate >= 0 ? 'text-income' : 'text-expense',
                                )}
                            >
                                {incomeVsExpenses.savingsRate.toFixed(0)}%
                            </Text>
                        </View>
                    </View>
                )}

                <View className="gap-6">
                    {/* Advanced Balance History Chart */}
                    <View>
                        <View className="mb-4 flex-row items-center justify-between">
                            <Text className="text-lg font-bold text-foreground">Monthly Balance</Text>
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => setChartMode('end-of-month')}
                                    className={cn(
                                        'rounded-lg px-3 py-1',
                                        chartMode === 'end-of-month' ? 'bg-primary' : 'bg-card',
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            'text-xs',
                                            chartMode === 'end-of-month' ? 'text-white' : 'text-subtext',
                                        )}
                                    >
                                        End of Month
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setChartMode('specific-day')}
                                    className={cn(
                                        'rounded-lg px-3 py-1',
                                        chartMode === 'specific-day' ? 'bg-primary' : 'bg-card',
                                    )}
                                >
                                    <Text
                                        className={cn(
                                            'text-xs',
                                            chartMode === 'specific-day' ? 'text-white' : 'text-subtext',
                                        )}
                                    >
                                        Day {new Date().getDate()}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <AdvancedBalanceHistoryChart data={monthlyBalanceHistory} />

                        {chartMode === 'end-of-month' && (
                            <TouchableOpacity
                                onPress={() => setIncludeCurrentMonth(!includeCurrentMonth)}
                                className={cn('mt-2 flex-row items-center justify-end')}
                            >
                                <View
                                    className={cn(
                                        'mr-2 h-4 w-4 items-center justify-center rounded border',
                                        includeCurrentMonth ? 'bg-primary border-primary' : 'border-subtext',
                                    )}
                                >
                                    {includeCurrentMonth && <View className="h-2 w-2 rounded-sm bg-white" />}
                                </View>
                                <Text className="text-sm text-subtext">Include Current Month</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Original Charts */}
                    <BalanceHistoryChart data={balanceHistory} />
                    <ExpensesByTagChart data={expensesByTag} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
