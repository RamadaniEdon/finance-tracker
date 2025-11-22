export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    tags: string[];
    description: string;
}

export type CreateTransaction = Omit<Transaction, 'id'>;
