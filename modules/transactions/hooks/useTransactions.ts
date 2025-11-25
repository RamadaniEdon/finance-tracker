import { useEffect, useCallback } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';

export function useTransactions() {
    const {
        transactions,
        loading,
        error,
        hasMore,
        fetchTransactions,
        fetchTransactionDetails,
        page
    } = useTransactionStore();

    useEffect(() => {
        // Initial fetch if no transactions
        if (transactions.length === 0) {
            fetchTransactions(1);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchTransactions(page + 1);
        }
    }, [loading, hasMore, page, fetchTransactions]);

    const refresh = useCallback(() => {
        useTransactionStore.getState().reset();
        fetchTransactions(1);
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
        fetchTransactionDetails
    };
}
