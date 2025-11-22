import { Transaction } from '../../domains/transactions/types';
import { createTransaction } from '../../domains/transactions/factory';
import { TransactionRepository } from '../../repositories/transactions/interface';

export async function createTransactionUseCase(
    data: unknown,
    repository: TransactionRepository
): Promise<Transaction> {
    const newTransaction = createTransaction(data);

    return repository.create(newTransaction);
}
