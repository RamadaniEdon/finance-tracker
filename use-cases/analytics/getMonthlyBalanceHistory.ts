import { DrizzleTransactionRepository } from '@/repositories/transactions/implementation';

export interface MonthlyBalance {
    date: Date;
    value: number;
    label: string;
}

interface GetMonthlyBalanceHistoryParams {
    endDate?: Date;
    monthsCount?: number;
    dayOfMonth?: number | null; // null means "End of Month"
    includeCurrentMonth?: boolean;
}

export async function getMonthlyBalanceHistoryUseCase({
    endDate = new Date(),
    monthsCount = 12,
    dayOfMonth = null,
    includeCurrentMonth = false,
}: GetMonthlyBalanceHistoryParams): Promise<MonthlyBalance[]> {
    const repository = new DrizzleTransactionRepository();

    // 1. Calculate target snapshot dates
    const snapshotDates: Date[] = [];
    const currentYear = endDate.getFullYear();
    const currentMonth = endDate.getMonth();

    // Determine the starting offset based on whether we include the current month
    // If includeCurrentMonth is true, we go from 0 to monthsCount - 1
    // If false, we go from 1 to monthsCount
    const startOffset = includeCurrentMonth ? 0 : 1;

    for (let i = monthsCount - 1 + startOffset; i >= startOffset; i--) {
        // Calculate the target month and year
        let targetMonth = currentMonth - i;
        let targetYear = currentYear;

        while (targetMonth < 0) {
            targetMonth += 12;
            targetYear -= 1;
        }

        let snapshotDate: Date;

        if (dayOfMonth !== null) {
            // "Specific Day" mode
            // Handle cases where the day doesn't exist (e.g., Feb 30)
            // We'll use the minimum of dayOfMonth and the last day of that month
            const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
            const actualDay = Math.min(dayOfMonth, lastDayOfTargetMonth);
            snapshotDate = new Date(targetYear, targetMonth, actualDay);
        } else {
            // "End of Month" mode
            // Get the last day of the target month
            snapshotDate = new Date(targetYear, targetMonth + 1, 0);
        }

        // Set time to end of day to include all transactions for that day
        snapshotDate.setHours(23, 59, 59, 999);
        snapshotDates.push(snapshotDate);
    }

    if (snapshotDates.length === 0) {
        return [];
    }

    // Sort dates chronologically (should already be sorted, but good for safety)
    snapshotDates.sort((a, b) => a.getTime() - b.getTime());

    const firstSnapshotDate = snapshotDates[0]!;
    const lastSnapshotDate = snapshotDates[snapshotDates.length - 1]!;

    // 2. Fetch initial balance before the first snapshot date
    // We need the balance up to the start of the first snapshot date's day?
    // No, we need the running balance.
    // Let's get the balance *before* the first snapshot date.
    // Wait, the most efficient way is:
    // Get balance at (firstSnapshotDate - 1 day) -> Base Balance
    // Get all transactions from (firstSnapshotDate - 1 day) to lastSnapshotDate
    // Iterate and snapshot.

    // Actually, even better:
    // Get balance at (firstSnapshotDate) -> This is the balance for the first point.
    // Then get transactions between firstSnapshotDate and lastSnapshotDate.
    // But we need to be careful about the exact time boundaries.

    // Let's stick to the plan:
    // 1. Get balance BEFORE the first snapshot date.
    //    Since snapshotDate is at 23:59:59, we want balance up to that point.
    //    But we have multiple points.
    //    Let's get the total balance up to the very beginning of the period we care about.
    //    Actually, let's just get the balance for the first snapshot date directly from the DB.
    //    Then get transactions for the rest.
    //    BUT, `getBalance` might be slow if we call it many times.
    //    The requirement is "fixed number of queries".

    // Optimized Strategy:
    // 1. Get balance at `firstSnapshotDate`. This gives us the starting point value.
    // 2. Get all transactions from `firstSnapshotDate` (exclusive) to `lastSnapshotDate` (inclusive).
    // 3. Replay transactions to calculate subsequent balances.

    // Wait, if we get balance at `firstSnapshotDate`, that includes transactions on that day.
    // So for the next point, we need transactions AFTER `firstSnapshotDate`.

    const initialBalance = await repository.getBalance(firstSnapshotDate);

    const result: MonthlyBalance[] = [];

    // Add the first point
    result.push({
        date: firstSnapshotDate,
        value: initialBalance,
        label: getLabel(firstSnapshotDate),
    });

    if (snapshotDates.length === 1) {
        return result;
    }

    // Fetch transactions between first and last snapshot
    // We need transactions strictly AFTER firstSnapshotDate and <= lastSnapshotDate
    // The repository `getTransactionsInRange` is usually inclusive.
    // Let's check `getTransactionsInRange` implementation or assume inclusive.
    // If it's inclusive, we might double count if we are not careful.
    // Let's use a slightly modified start date: firstSnapshotDate + 1ms
    const transactionsStartDate = new Date(firstSnapshotDate.getTime() + 1);
    const transactions = await repository.getTransactionsInRange(transactionsStartDate, lastSnapshotDate);

    // Sort transactions by date ascending (oldest first) to replay them correctly
    transactions.sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime());

    // Group transactions by date for faster lookup or just iterate?
    // Since we have a list of snapshot dates, and transactions are usually sorted by date...
    // Let's just iterate through transactions and update balance.

    let currentBalance = initialBalance;
    let transactionIndex = 0;

    // We already added the first one
    for (let i = 1; i < snapshotDates.length; i++) {
        const targetDate = snapshotDates[i]!;

        // Process all transactions up to this targetDate
        while (transactionIndex < transactions.length) {
            const t = transactions[transactionIndex]!;
            const tDate = new Date(t.transactionDate); // Assuming string or Date, check type

            if (tDate.getTime() > targetDate.getTime()) {
                break;
            }

            const amount = t.type === 'EXPENSE' ? -t.amount : t.amount;
            currentBalance += amount;
            transactionIndex++;
        }

        result.push({
            date: targetDate,
            value: currentBalance,
            label: getLabel(targetDate),
        });
    }

    return result;
}

function getLabel(date: Date): string {
    return date.toLocaleString('default', { month: 'short' });
}
