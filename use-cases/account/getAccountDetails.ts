import { Account } from '@/domains/account/types';
import { DrizzleTransactionRepository } from '@/repositories/transactions/implementation';

export async function getAccountDetailsUseCase(): Promise<Account> {
    const repository = new DrizzleTransactionRepository();

    const balance = await repository.getBalance();

    return {
        balance,
    };
}