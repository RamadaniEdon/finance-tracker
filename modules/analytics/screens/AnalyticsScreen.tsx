import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { BalanceHistoryChart } from '../components/BalanceHistoryChart';
import { ExpensesByTagChart } from '../components/ExpensesByTagChart';
import { useTheme } from '@/hooks/useTheme';

export default function AnalyticsScreen() {
    const { loading, balanceHistory, expensesByTag, incomeVsExpenses, range, setRange } = useAnalyticsData();
    const { colors } = useTheme();

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
                            className={`flex-1 items-center justify-center rounded-lg py-2 ${range === r ? 'bg-primary' : 'bg-transparent'}`}
                        >
                            <Text className={`font-medium ${range === r ? 'text-white' : 'text-subtext'}`}>{r}</Text>
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
                                className={`text-xl font-bold ${incomeVsExpenses.savingsRate >= 0 ? 'text-income' : 'text-expense'}`}
                            >
                                {incomeVsExpenses.savingsRate.toFixed(0)}%
                            </Text>
                        </View>
                    </View>
                )}

                <View>
                    <BalanceHistoryChart data={balanceHistory} />
                    <ExpensesByTagChart data={expensesByTag} className="mt-4" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
