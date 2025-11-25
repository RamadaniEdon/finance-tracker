import { CreateTransaction, Transaction } from '../../domains/transactions/types';
import { createTransaction } from '../../domains/transactions/factory';
import { DrizzleTransactionRepository } from '../../repositories/transactions/implementation';

export async function createTransactionUseCase(
    data: unknown
): Promise<Transaction> {
    const newTransactionData = createTransaction(data);
    const repository = new DrizzleTransactionRepository();

    // 1. Get unique tags from input
    const uniqueTags = [...new Set(newTransactionData.tags)];

    // 2. Check which tags exist
    const existingTags = await repository.getExistingTags(uniqueTags);

    // 3. Filter out existing tags to find new ones
    const newTags = uniqueTags.filter(tag => !existingTags.includes(tag));

    // 4. Create missing tags
    await repository.createTags(newTags);

    // 5. Create transaction record
    const transaction = await repository.createTransaction(newTransactionData);

    // 6. Create transaction-tag relations
    await repository.addTransactionTags(transaction.id, uniqueTags);

    return transaction;
}
