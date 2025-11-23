import { z } from 'zod';
import { CreateTransaction } from './types';

export const transactionSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['EXPENSE', 'INCOME']),
    tags: z.array(z.string()),
    description: z.string(),
    created_at: z.union([z.date(), z.string().datetime()]).transform((val) => new Date(val)).or(z.date()).default(() => new Date()),
});

export function validateTransaction(data: unknown): CreateTransaction {
    return transactionSchema.parse(data);
}

export function createTransaction(data: unknown): CreateTransaction {
    return validateTransaction(data);
}
