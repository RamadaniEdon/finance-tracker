import { z } from 'zod';
import { transactionSchema } from './factory';

export type CreateTransaction = z.infer<typeof transactionSchema>;

export type Transaction = CreateTransaction & { id: string };

export type TransactionType = Transaction['type'];
