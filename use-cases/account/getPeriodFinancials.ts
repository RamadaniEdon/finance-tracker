import { DrizzleTransactionRepository } from '@/repositories/transactions/implementation';

export interface PeriodFinancials {
    income: number;
    expenses: number;
    balanceAtEnd: number;
}

export async function getPeriodFinancialsUseCase(startDate: Date, endDate: Date): Promise<PeriodFinancials> {
    const repository = new DrizzleTransactionRepository();

    const [income, expenses, balanceAtEnd] = await Promise.all([
        repository.getIncome(startDate, endDate),
        repository.getExpenses(startDate, endDate),
        repository.getBalance(endDate)
    ]);

    return {
        income,
        expenses,
        balanceAtEnd
    };
}
