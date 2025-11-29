import { useEffect, useCallback, useState } from 'react';
import { useTransactionStore } from '../store/useTransactionStore';

export function useTransactions() {
    const { transactions, loading, error, hasMore, fetchTransactions, fetchTransactionDetails, page } =
        useTransactionStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Initial fetch if no transactions
        if (transactions.length === 0) {
            fetchTransactions(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchTransactions(page + 1);
        }
    }, [loading, hasMore, page, fetchTransactions]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchTransactions(1);
        } finally {
            // Add a small delay to ensure the native spinner has time to register the state change
            // and to prevent it from getting stuck if the fetch is too fast.
            setTimeout(() => {
                setRefreshing(false);
            }, 500);
        }
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
        refreshing,
        fetchTransactionDetails,
    };
}
