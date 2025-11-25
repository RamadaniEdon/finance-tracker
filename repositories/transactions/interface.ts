import { Transaction, CreateTransaction } from '../../domains/transactions/types';

export interface PaginationParams {
    /** The current page number (1-indexed) */
    page: number;
    /** The number of items per page */
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface TransactionRepository {
    getExistingTags(names: string[]): Promise<string[]>;
    createTags(names: string[]): Promise<void>;
    createTransaction(transaction: CreateTransaction): Promise<Transaction>;
    addTransactionTags(transactionId: string, tagNames: string[]): Promise<void>;
    getTransactions(params: PaginationParams): Promise<PaginatedResult<Transaction>>;
    getTransactionById(id: string): Promise<Transaction | null>;
}
