import { DrizzleTransactionRepository } from '@/repositories/transactions/implementation';

export interface IncomeVsExpenses {
    income: number;
    expenses: number;
    savingsRate: number;
}

export async function getIncomeVsExpensesUseCase(startDate: Date, endDate: Date): Promise<IncomeVsExpenses> {
    const repository = new DrizzleTransactionRepository();

    const [income, expenses] = await Promise.all([
        repository.getIncome(startDate, endDate),
        repository.getExpenses(startDate, endDate),
    ]);

    const total = income;
    const savingsRate = total > 0 ? ((income - expenses) / total) * 100 : 0;

    return {
        income,
        expenses,
        savingsRate,
    };
}
