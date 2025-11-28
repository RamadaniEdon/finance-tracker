import { TransactionRepository, PaginationParams, PaginatedResult } from '@/repositories/transactions/interface';
import { Transaction } from '@/domains/transactions/types';

export const getTransactionsUseCase = async (
    repository: TransactionRepository,
    params: PaginationParams,
): Promise<PaginatedResult<Transaction>> => {
    return repository.getTransactions(params);
};

export const getTransactionByIdUseCase = async (
    repository: TransactionRepository,
    id: string,
): Promise<Transaction | null> => {
    return repository.getTransactionById(id);
};
