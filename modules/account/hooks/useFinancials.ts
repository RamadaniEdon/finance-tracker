import { useEffect, useCallback, useMemo } from 'react';
import { useFinancialsStore } from '../store/useFinancialsStore';
import { useTransactions } from '@/modules/transactions/hooks/useTransactions';

export function useFinancials() {
    const {
        currentPeriod,
        previousPeriod,
        loading,
        error,
        fetchFinancials
    } = useFinancialsStore();

    // We watch transactions to auto-refresh financials when transactions change
    const { transactions } = useTransactions();

    const refresh = useCallback(() => {
        const now = new Date();

        // Current Period: Start of this month to Today
        const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentEnd = now;

        // Previous Period: Start of last month to Same day last month
        const previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousEnd = new Date(now);
        previousEnd.setMonth(previousEnd.getMonth() - 1);

        // Handle month rollover (e.g. Mar 31 -> Feb 28)
        if (now.getDate() !== previousEnd.getDate()) {
            previousEnd.setDate(0);
        }

        fetchFinancials(currentStart, currentEnd, previousStart, previousEnd);
    }, [fetchFinancials]);

    useEffect(() => {
        refresh();
    }, [refresh, transactions]); // Re-fetch when transactions list changes

    const stats = useMemo(() => {
        if (!currentPeriod || !previousPeriod) return null;

        const calculateChange = (current: number, previous: number) => {
            if (previous === 0) return current === 0 ? 0 : 100;
            return ((current - previous) / previous) * 100;
        };

        return {
            balance: {
                current: currentPeriod.balanceAtEnd,
                previous: previousPeriod.balanceAtEnd,
                change: calculateChange(currentPeriod.balanceAtEnd, previousPeriod.balanceAtEnd),
                diff: currentPeriod.balanceAtEnd - previousPeriod.balanceAtEnd
            },
            income: {
                current: currentPeriod.income,
                previous: previousPeriod.income,
                change: calculateChange(currentPeriod.income, previousPeriod.income),
                diff: currentPeriod.income - previousPeriod.income
            },
            expenses: {
                current: currentPeriod.expenses,
                previous: previousPeriod.expenses,
                change: calculateChange(currentPeriod.expenses, previousPeriod.expenses),
                diff: currentPeriod.expenses - previousPeriod.expenses
            }
        };
    }, [currentPeriod, previousPeriod]);

    return {
        stats,
        loading,
        error,
        refresh
    };
}
