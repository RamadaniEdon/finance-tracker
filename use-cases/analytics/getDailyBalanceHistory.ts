import { DrizzleTransactionRepository } from '@/repositories/transactions/implementation';

export interface DailyBalance {
    date: Date;
    value: number;
}

export async function getDailyBalanceHistoryUseCase(startDate: Date, endDate: Date): Promise<DailyBalance[]> {
    const repository = new DrizzleTransactionRepository();

    // Get balance before the start date to serve as the baseline
    const previousDay = new Date(startDate);
    previousDay.setDate(previousDay.getDate() - 1);

    // Set to end of day to ensure we get all transactions up to that point
    previousDay.setHours(23, 59, 59, 999);

    let currentBalance = await repository.getBalance(previousDay);

    const transactions = await repository.getTransactionsInRange(startDate, endDate);

    // Group transactions by date (YYYY-MM-DD)
    const transactionsByDate = new Map<string, number>();

    for (const t of transactions) {
        const dateKey = t.transactionDate.toISOString().split('T')[0]!;
        const amount = t.type === 'EXPENSE' ? -t.amount : t.amount;
        transactionsByDate.set(dateKey, (transactionsByDate.get(dateKey) || 0) + amount);
    }

    const result: DailyBalance[] = [];
    const currentDate = new Date(startDate);

    // Iterate through each day in the range
    while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0]!;
        const dayChange = transactionsByDate.get(dateKey) || 0;

        currentBalance += dayChange;

        result.push({
            date: new Date(currentDate),
            value: currentBalance,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
}
