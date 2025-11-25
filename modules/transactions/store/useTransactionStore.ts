import { create } from 'zustand';
import { Transaction } from '@/domains/transactions/types';
import { DrizzleTransactionRepository } from '@/repositories/transactions/implementation';
import { getTransactionsUseCase, getTransactionByIdUseCase } from '@/use-cases/transactions/getTransactions';

interface TransactionState {
    transactions: Transaction[];
    page: number;
    hasMore: boolean;
    loading: boolean;
    error: string | null;
    cache: Map<string, Transaction>;

    fetchTransactions: (page?: number) => Promise<void>;
    fetchTransactionDetails: (id: string) => Promise<Transaction | null>;
    reset: () => void;
}

const repository = new DrizzleTransactionRepository();
const LIMIT = 10;

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    page: 1,
    hasMore: true,
    loading: false,
    error: null,
    cache: new Map(),

    fetchTransactions: async (page = 1) => {
        const { loading, hasMore, transactions } = get();
        if (loading || (!hasMore && page !== 1)) return;

        set({ loading: true, error: null });

        try {
            const result = await getTransactionsUseCase(repository, { page, limit: LIMIT });

            set((state) => {
                const newTransactions = page === 1
                    ? result.data
                    : [...state.transactions, ...result.data];

                // Update cache with fetched transactions
                const newCache = new Map(state.cache);
                result.data.forEach(t => newCache.set(t.id, t));

                return {
                    transactions: newTransactions,
                    page: result.currentPage,
                    hasMore: result.currentPage < result.totalPages,
                    loading: false,
                    cache: newCache
                };
            });
        } catch (error) {
            set({ loading: false, error: 'Failed to fetch transactions' });
        }
    },

    fetchTransactionDetails: async (id: string) => {
        const { cache } = get();
        if (cache.has(id)) {
            return cache.get(id) || null;
        }

        set({ loading: true, error: null });
        try {
            const transaction = await getTransactionByIdUseCase(repository, id);
            if (transaction) {
                set((state) => {
                    const newCache = new Map(state.cache);
                    newCache.set(id, transaction);
                    return { cache: newCache, loading: false };
                });
            } else {
                set({ loading: false });
            }
            return transaction;
        } catch (error) {
            set({ loading: false, error: 'Failed to fetch transaction details' });
            return null;
        }
    },

    reset: () => set({
        transactions: [],
        page: 1,
        hasMore: true,
        loading: false,
        error: null
    })
}));
