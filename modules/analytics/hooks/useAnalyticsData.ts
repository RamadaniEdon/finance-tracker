import { useState, useEffect, useCallback } from 'react';
import { getDailyBalanceHistoryUseCase, DailyBalance } from '@/use-cases/analytics/getDailyBalanceHistory';
import { getExpensesByTagUseCase, TagExpenseAnalytics } from '@/use-cases/analytics/getExpensesByTag';
import { getIncomeVsExpensesUseCase, IncomeVsExpenses } from '@/use-cases/analytics/getIncomeVsExpenses';
import { useFocusEffect } from '@react-navigation/native';

export function useAnalyticsData() {
    const [loading, setLoading] = useState(true);
    const [balanceHistory, setBalanceHistory] = useState<DailyBalance[]>([]);
    const [expensesByTag, setExpensesByTag] = useState<TagExpenseAnalytics[]>([]);
    const [incomeVsExpenses, setIncomeVsExpenses] = useState<IncomeVsExpenses | null>(null);
    const [range, setRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');

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

            const [history, tags, comparison] = await Promise.all([
                getDailyBalanceHistoryUseCase(startDate, endDate),
                getExpensesByTagUseCase(startDate, endDate),
                getIncomeVsExpensesUseCase(startDate, endDate),
            ]);

            setBalanceHistory(history);
            setExpensesByTag(tags);
            setIncomeVsExpenses(comparison);
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        } finally {
            setLoading(false);
        }
    }, [range]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData]),
    );

    return {
        loading,
        balanceHistory,
        expensesByTag,
        incomeVsExpenses,
        range,
        setRange,
        refetch: fetchData,
    };
}
