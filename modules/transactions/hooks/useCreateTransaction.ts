import { CreateTransaction, Transaction } from '@/domains/transactions/types';
import { createTransactionUseCase } from '@/use-cases/transactions/createTransaction';
import { useCallback, useEffect, useRef, useState } from 'react';

export type CreateTransactionOptions = {
    onCompleted?: (data: Transaction) => void;
    onError?: (error: unknown) => void;
};

export function useCreateTransaction(hookOptions?: CreateTransactionOptions) {
    const [data, setData] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown | undefined>(undefined);

    const hookOptionsRef = useRef(hookOptions);

    useEffect(() => {
        hookOptionsRef.current = hookOptions;
    }, [hookOptions]);

    const createTransaction = useCallback(
        async (data: CreateTransaction, options?: CreateTransactionOptions) => {
            if (loading) return;

            setLoading(true);

            try {
                const transaction = await createTransactionUseCase(data);
                setData(transaction);
                setLoading(false);
                setError(undefined);

                const onCompleted = options?.onCompleted || hookOptionsRef.current?.onCompleted;
                onCompleted?.(transaction);
            } catch (error) {
                setLoading(false);
                setError(error);

                const onError = options?.onError || hookOptionsRef.current?.onError;
                onError?.(error);
            }
        },
        [loading],
    );

    return [createTransaction, { data, loading, error }] as const;
}
