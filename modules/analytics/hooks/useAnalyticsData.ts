import { useState, useCallback } from 'react';
import { getDailyBalanceHistoryUseCase, DailyBalance } from '@/use-cases/analytics/getDailyBalanceHistory';
import { getExpensesByTagUseCase, TagExpenseAnalytics } from '@/use-cases/analytics/getExpensesByTag';
import { getIncomeVsExpensesUseCase, IncomeVsExpenses } from '@/use-cases/analytics/getIncomeVsExpenses';
import { getMonthlyBalanceHistoryUseCase, MonthlyBalance } from '@/use-cases/analytics/getMonthlyBalanceHistory';
import { useFocusEffect } from '@react-navigation/native';

export type ChartMode = 'end-of-month' | 'specific-day';

export function useAnalyticsData() {
    const [loading, setLoading] = useState(true);
    const [balanceHistory, setBalanceHistory] = useState<DailyBalance[]>([]);
    const [monthlyBalanceHistory, setMonthlyBalanceHistory] = useState<MonthlyBalance[]>([]);
    const [expensesByTag, setExpensesByTag] = useState<TagExpenseAnalytics[]>([]);
    const [incomeVsExpenses, setIncomeVsExpenses] = useState<IncomeVsExpenses | null>(null);
    const [range, setRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');

    // New state for advanced chart
    const [chartMode, setChartMode] = useState<ChartMode>('end-of-month');
    const [includeCurrentMonth, setIncludeCurrentMonth] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const endDate = new Date();
            const startDate = new Date();

            switch (range) {
                case '1M':
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case '3M':
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case '6M':
                    startDate.setMonth(startDate.getMonth() - 6);
                    break;
                case '1Y':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
            }

            // Determine parameters for monthly history
            const dayOfMonth = chartMode === 'specific-day' ? new Date().getDate() : null;

            // For specific day mode, we always include current month as per requirements
            const shouldIncludeCurrentMonth = chartMode === 'specific-day' ? true : includeCurrentMonth;

            const [history, monthlyHistory, tags, comparison] = await Promise.all([
                getDailyBalanceHistoryUseCase(startDate, endDate),
                getMonthlyBalanceHistoryUseCase({
                    endDate,
                    monthsCount: 12, // Fixed to 1 year as requested
                    dayOfMonth,
                    includeCurrentMonth: shouldIncludeCurrentMonth,
                }),
                getExpensesByTagUseCase(startDate, endDate),
                getIncomeVsExpensesUseCase(startDate, endDate),
            ]);

            setBalanceHistory(history);
            setMonthlyBalanceHistory(monthlyHistory);
            setExpensesByTag(tags);
            setIncomeVsExpenses(comparison);
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        } finally {
            setLoading(false);
        }
    }, [range, chartMode, includeCurrentMonth]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData]),
    );

    return {
        loading,
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
        refetch: fetchData,
    };
}
