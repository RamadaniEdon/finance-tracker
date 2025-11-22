import { z } from 'zod';
import { CreateTransaction } from './types';

export const transactionSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['EXPENSE', 'INCOME']),
    tags: z.array(z.string()),
    description: z.string(),
});

export function validateTransaction(data: unknown): CreateTransaction {
    return transactionSchema.parse(data) as CreateTransaction;
}

export function createTransaction(data: unknown): CreateTransaction {
    return validateTransaction(data);
}
