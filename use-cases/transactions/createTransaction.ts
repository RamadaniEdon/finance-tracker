import { CreateTransaction, Transaction } from '../../domains/transactions/types';
import { createTransaction } from '../../domains/transactions/factory';

export async function createTransactionUseCase(
    data: unknown
): Promise<CreateTransaction> {
    const newTransaction = createTransaction(data);

    const transaction: Transaction = {
        id: 'abc' + Math.random() * 100,
        ...newTransaction
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    return transaction;
}
