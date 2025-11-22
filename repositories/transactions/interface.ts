import { Transaction, CreateTransaction } from '../../domains/transactions/types';

export interface TransactionRepository {
    create(transaction: CreateTransaction): Promise<Transaction>;
}
